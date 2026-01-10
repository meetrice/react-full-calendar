import { supabase } from './supabase'
import type { UserModel, LanguageCode, WeekStartDay, NotificationMethod } from '@/auth/lib/models'

// Database type matching the user_profiles view
export interface UserProfileDB {
  id: string
  email: string
  username: string
  first_name: string | null
  last_name: string | null
  fullname: string | null
  occupation: string | null
  company_name: string | null
  phone: string | null
  pic: string | null
  language: string | null
  is_admin: boolean | null
  roles: unknown
  created_at: string
  updated_at: string
}

// Convert DB format to UserModel
export function fromDBToUser(dbUser: UserProfileDB): UserModel {
  return {
    id: dbUser.id,
    email: dbUser.email,
    username: dbUser.username || '',
    first_name: dbUser.first_name || '',
    last_name: dbUser.last_name || '',
    fullname: dbUser.fullname || undefined,
    occupation: dbUser.occupation || undefined,
    company_name: dbUser.company_name || undefined,
    phone: dbUser.phone || undefined,
    pic: dbUser.pic || undefined,
    language: (dbUser.language as LanguageCode) || 'en',
    is_admin: dbUser.is_admin || undefined,
  }
}

// Convert UserModel to metadata format for Supabase Auth
export function fromUserToMetadata(user: Partial<UserModel>): Record<string, unknown> {
  const metadata: Record<string, unknown> = {}

  if (user.username !== undefined) metadata.username = user.username
  if (user.first_name !== undefined) metadata.first_name = user.first_name
  if (user.last_name !== undefined) metadata.last_name = user.last_name
  if (user.fullname !== undefined) metadata.fullname = user.fullname
  if (user.email !== undefined) metadata.email = user.email
  if (user.phone !== undefined) metadata.phone = user.phone
  if (user.occupation !== undefined) metadata.occupation = user.occupation
  if (user.company_name !== undefined) metadata.company_name = user.company_name
  if (user.pic !== undefined) metadata.pic = user.pic
  if (user.language !== undefined) metadata.language = user.language
  if (user.week_start !== undefined) metadata.week_start = user.week_start
  if (user.notification_method !== undefined) metadata.notification_method = user.notification_method
  if (user.is_admin !== undefined) metadata.is_admin = user.is_admin
  if (user.roles !== undefined) metadata.roles = user.roles

  return metadata
}

// Fetch current user profile using the service role (bypasses RLS)
export async function getCurrentUserProfile(userId: string): Promise<UserModel | null> {
  // Use service role client to bypass RLS on the view
  const { data, error } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('id', userId)
    .single()

  if (error) {
    console.error('Error fetching user profile:', error)
    return null
  }

  return fromDBToUser(data)
}

// Update user profile in Supabase Auth (via admin API)
// This requires the service role key since we're updating auth.users directly
export async function updateUserProfile(
  userId: string,
  userData: Partial<UserModel>
): Promise<UserModel> {
  // Get credentials from env
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string
  const serviceRoleKey = import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY as string

  if (!serviceRoleKey) {
    throw new Error('Service role key not available')
  }

  const metadata = fromUserToMetadata(userData)

  // Build request body
  const body: Record<string, unknown> = {
    user_metadata: metadata,
  }

  // Include email if it's being changed
  if (userData.email) {
    body.email = userData.email
  }

  // Use fetch to call Supabase Auth Admin API directly
  // Note: Supabase uses PUT method for updating user metadata
  const response = await fetch(`${supabaseUrl}/auth/v1/admin/users/${userId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      apikey: serviceRoleKey,
      Authorization: `Bearer ${serviceRoleKey}`,
    },
    body: JSON.stringify(body),
  })

  if (!response.ok) {
    const errorText = await response.text()
    console.error('Error updating user via auth admin:', response.status, errorText)
    throw new Error(`Failed to update user: ${response.status} ${errorText}`)
  }

  const authData = await response.json()

  if (!authData) {
    throw new Error('Failed to update user: no data returned')
  }

  // Convert auth user metadata back to UserModel
  const userMetadata = authData.user_metadata || metadata
  const updatedUser: UserModel = {
    id: authData.id || userId,
    email: authData.email || userData.email || '',
    username: (userMetadata.username as string) || '',
    first_name: (userMetadata.first_name as string) || '',
    last_name: (userMetadata.last_name as string) || '',
    fullname: (userMetadata.fullname as string) || undefined,
    phone: (userMetadata.phone as string) || undefined,
    occupation: (userMetadata.occupation as string) || undefined,
    company_name: (userMetadata.company_name as string) || undefined,
    pic: (userMetadata.pic as string) || undefined,
    language: (userMetadata.language as LanguageCode) || 'en',
    week_start: (userMetadata.week_start as WeekStartDay) || undefined,
    notification_method: (userMetadata.notification_method as NotificationMethod) || undefined,
    is_admin: (userMetadata.is_admin as boolean) || undefined,
    email_verified: authData.email_confirmed_at !== null || userData.email_verified,
  }

  return updatedUser
}

// Get user by email (for login)
export async function getUserByEmail(email: string): Promise<UserModel | null> {
  const { data, error } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('email', email)
    .single()

  if (error) {
    console.error('Error fetching user by email:', error)
    return null
  }

  return fromDBToUser(data)
}

// List all users
export async function listUsers(): Promise<UserModel[]> {
  const { data, error } = await supabase
    .from('user_profiles')
    .select('*')

  if (error) {
    console.error('Error listing users:', error)
    return []
  }

  return data?.map(fromDBToUser) || []
}
