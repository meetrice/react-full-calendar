import { AuthModel, UserModel } from '@/auth/lib/models';
import { getAuth, setAuth, removeAuth } from '@/auth/lib/helpers';
import { supabase } from '@/lib/supabase';
import { updateUserProfile as updateProfileInSupabase } from '@/lib/user-repository';

// Storage key for current user
const CURRENT_USER_KEY = 'current-user';

/**
 * Supabase Auth Adapter
 * Uses Supabase Auth for authentication and stores user data in auth.users metadata
 */
export const AuthAdapter = {
  /**
   * Login with email and password using Supabase Auth
   */
  async login(email: string, password: string): Promise<AuthModel> {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error || !data.session) {
      throw new Error(error?.message || 'Login failed');
    }

    // Store auth tokens
    const authModel: AuthModel = {
      access_token: data.session.access_token,
      refresh_token: data.session.refresh_token,
    };
    setAuth(authModel);

    // Store user data from metadata
    if (data.user) {
      const userData = this.convertAuthUserToModel(data.user);
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(userData));
    }

    return authModel;
  },

  /**
   * Register a new user using Supabase Auth
   */
  async register(
    email: string,
    password: string,
    password_confirmation: string,
    firstName?: string,
    lastName?: string,
  ): Promise<AuthModel> {
    if (password !== password_confirmation) {
      throw new Error('Passwords do not match');
    }

    const metadata: Record<string, unknown> = {
      username: email.split('@')[0],
      first_name: firstName || '',
      last_name: lastName || '',
      fullname: firstName && lastName ? `${firstName} ${lastName}`.trim() : '',
    };

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata,
      },
    });

    if (error) {
      throw new Error(error.message);
    }

    // Auto login after registration
    return this.login(email, password);
  },

  /**
   * Request password reset
   */
  async requestPasswordReset(email: string): Promise<void> {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    });

    if (error) {
      throw new Error(error.message);
    }
  },

  /**
   * Reset password with new password
   */
  async resetPassword(
    password: string,
    password_confirmation: string,
  ): Promise<void> {
    if (password !== password_confirmation) {
      throw new Error('Passwords do not match');
    }

    const { error } = await supabase.auth.updateUser({
      password,
    });

    if (error) {
      throw new Error(error.message);
    }
  },

  /**
   * Resend verification email
   */
  async resendVerificationEmail(email: string): Promise<void> {
    // Supabase handles email verification automatically
    // This is a placeholder for any custom verification logic
    console.log('Verification email resent to:', email);
  },

  /**
   * Get current user from storage or Supabase
   * @param forceRefresh - Force refresh from Supabase instead of using localStorage
   */
  async getCurrentUser(forceRefresh: boolean = false): Promise<UserModel | null> {
    try {
      // If force refresh, always get from Supabase
      if (forceRefresh) {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          const userData = this.convertAuthUserToModel(session.user);
          localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(userData));
          return userData;
        }
        return null;
      }

      // Try to get from localStorage first
      const userStr = localStorage.getItem(CURRENT_USER_KEY);
      if (userStr) {
        return JSON.parse(userStr) as UserModel;
      }

      // If not in storage, try to get from Supabase session
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const userData = this.convertAuthUserToModel(session.user);
        localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(userData));
        return userData;
      }

      return null;
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  },

  /**
   * Update user profile - saves to Supabase Auth metadata
   */
  async updateUserProfile(userData: Partial<UserModel>): Promise<UserModel> {
    const currentUser = await this.getCurrentUser();
    if (!currentUser?.id) {
      throw new Error('No user logged in');
    }

    // Update using Supabase Auth Admin API (via user-repository)
    const updatedUser = await updateProfileInSupabase(currentUser.id, userData);

    // Update localStorage
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(updatedUser));

    // Refresh the Supabase session to get updated metadata
    await supabase.auth.refreshSession();

    return updatedUser;
  },

  /**
   * Logout the current user
   */
  async logout(): Promise<void> {
    await supabase.auth.signOut();
    removeAuth();
    localStorage.removeItem(CURRENT_USER_KEY);
  },

  /**
   * Verify the current session
   */
  async verify(): Promise<UserModel | null> {
    const auth = getAuth();
    if (!auth?.access_token) {
      return null;
    }

    // Check Supabase session
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
      const userData = this.convertAuthUserToModel(session.user);
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(userData));
      return userData;
    }

    return null;
  },

  /**
   * Convert Supabase Auth user to UserModel
   */
  convertAuthUserToModel(authUser: { id: string; email?: string | null; user_metadata?: Record<string, unknown>; email_confirmed_at?: string | null }): UserModel {
    const metadata = authUser.user_metadata || {};

    return {
      id: authUser.id,
      email: authUser.email || '',
      username: (metadata.username as string) || '',
      first_name: (metadata.first_name as string) || '',
      last_name: (metadata.last_name as string) || '',
      fullname: (metadata.fullname as string) || undefined,
      phone: (metadata.phone as string) || undefined,
      occupation: (metadata.occupation as string) || undefined,
      company_name: (metadata.company_name as string) || undefined,
      pic: (metadata.pic as string) || undefined,
      language: (metadata.language as 'en' | 'zh' | 'de' | 'es' | 'fr' | 'ja') || 'en',
      week_start: (metadata.week_start as 'sunday' | 'monday') || undefined,
      notification_method: (metadata.notification_method as 'browser' | 'api' | 'none') || undefined,
      email_verified: authUser.email_confirmed_at !== null,
      is_admin: (metadata.is_admin as boolean) || false,
    };
  },
};
