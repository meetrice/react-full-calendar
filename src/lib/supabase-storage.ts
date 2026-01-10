import { supabase } from './supabase'

const BUCKET_NAME = 'meetsupas'
const AVATARS_FOLDER = 'avatars'

export interface UploadResult {
  path: string
  url: string
  error?: string
}

/**
 * Upload a file to Supabase Storage
 * @param file The file to upload
 * @param folder The folder path within the bucket (default: 'avatars')
 * @returns UploadResult with path and public URL
 */
export async function uploadFile(
  file: File,
  folder: string = AVATARS_FOLDER
): Promise<UploadResult> {
  try {
    // Generate a unique file name
    const fileExt = file.name.split('.').pop() || 'jpg'
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`
    const filePath = `${folder}/${fileName}`

    // Upload file to Supabase Storage
    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true,
      })

    if (error) {
      console.error('Upload error:', error)
      return {
        path: '',
        url: '',
        error: error.message,
      }
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(filePath)

    return {
      path: data.path,
      url: urlData.publicUrl,
    }
  } catch (error) {
    console.error('Upload exception:', error)
    return {
      path: '',
      url: '',
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

/**
 * Upload an avatar image for a user
 * Always creates a new file with timestamp to avoid RLS upsert issues
 * @param file The image file to upload
 * @param userId The user ID (for naming the file)
 * @returns UploadResult with path and public URL
 */
export async function uploadAvatar(
  file: File,
  userId: string
): Promise<UploadResult> {
  try {
    // Validate file type
    if (!file.type.startsWith('image/')) {
      return {
        path: '',
        url: '',
        error: 'File must be an image',
      }
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024 // 5MB
    if (file.size > maxSize) {
      return {
        path: '',
        url: '',
        error: 'File size must be less than 5MB',
      }
    }

    // Use user ID + timestamp as filename to always create a new file
    // This avoids RLS issues with upsert/overwrite
    const fileExt = file.name.split('.').pop() || 'jpg'
    const timestamp = Date.now()
    const fileName = `${userId}-${timestamp}.${fileExt}`
    const filePath = `${AVATARS_FOLDER}/${fileName}`

    // Upload file to Supabase Storage (no upsert, always new file)
    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
      })

    if (error) {
      console.error('Avatar upload error:', error)
      return {
        path: '',
        url: '',
        error: error.message,
      }
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(filePath)

    return {
      path: data.path,
      url: urlData.publicUrl,
    }
  } catch (error) {
    console.error('Avatar upload exception:', error)
    return {
      path: '',
      url: '',
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

/**
 * Delete a file from Supabase Storage
 * @param path The path of the file to delete
 * @returns true if successful, false otherwise
 */
export async function deleteFile(path: string): Promise<boolean> {
  try {
    const { error } = await supabase.storage
      .from(BUCKET_NAME)
      .remove([path])

    if (error) {
      console.error('Delete error:', error)
      return false
    }

    return true
  } catch (error) {
    console.error('Delete exception:', error)
    return false
  }
}

/**
 * Get the public URL for a file path
 * @param path The path of the file
 * @returns The public URL
 */
export function getPublicUrl(path: string): string {
  const { data } = supabase.storage
    .from(BUCKET_NAME)
      .getPublicUrl(path)

  return data.publicUrl
}
