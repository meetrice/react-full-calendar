import { AuthModel, UserModel } from '@/auth/lib/models';
import { getAuth, setAuth, removeAuth } from '@/auth/lib/helpers';

// Demo users storage key
const DEMO_USERS_KEY = 'demo-users';

// Get demo users from localStorage
const getDemoUsers = (): UserModel[] => {
  try {
    const users = localStorage.getItem(DEMO_USERS_KEY);
    return users ? JSON.parse(users) : [];
  } catch {
    return [];
  }
};

// Save demo users to localStorage
const saveDemoUsers = (users: UserModel[]) => {
  try {
    localStorage.setItem(DEMO_USERS_KEY, JSON.stringify(users));
  } catch (error) {
    console.error('Error saving demo users:', error);
  }
};

// Initialize demo users if not exists
const initializeDemoUsers = () => {
  const users = getDemoUsers();
  if (users.length === 0) {
    const demoUsers: UserModel[] = [
      {
        id: '1',
        username: 'demo',
        email: 'demo@kt.com',
        password: 'demo123', // In production, this should be hashed
        first_name: 'Demo',
        last_name: 'User',
        fullname: 'Demo User',
        email_verified: true,
        is_admin: true,
      },
    ];
    saveDemoUsers(demoUsers);
  }
};

// Ensure demo users exist
initializeDemoUsers();

/**
 * Local Auth Adapter for demo purposes.
 * In production, replace this with a real backend API call.
 */
export const AuthAdapter = {
  /**
   * Login with email and password
   */
  async login(email: string, password: string): Promise<AuthModel> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    const users = getDemoUsers();
    const user = users.find(
      (u) => u.email === email && u.password === password,
    );

    if (!user) {
      throw new Error('Invalid email or password');
    }

    // Generate a fake token
    const token = btoa(`${user.email}:${Date.now()}`);

    const authModel: AuthModel = {
      access_token: token,
      refresh_token: token, // Using same token for demo
    };

    // Store auth
    setAuth(authModel);

    // Store user data
    localStorage.setItem('current-user', JSON.stringify(user));

    return authModel;
  },

  /**
   * Register a new user
   */
  async register(
    email: string,
    password: string,
    password_confirmation: string,
    firstName?: string,
    lastName?: string,
  ): Promise<AuthModel> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    if (password !== password_confirmation) {
      throw new Error('Passwords do not match');
    }

    const users = getDemoUsers();
    const existingUser = users.find((u) => u.email === email);

    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    const newUser: UserModel = {
      id: String(Date.now()),
      username: email.split('@')[0],
      email,
      password, // In production, this should be hashed
      first_name: firstName || '',
      last_name: lastName || '',
      fullname: firstName && lastName ? `${firstName} ${lastName}`.trim() : '',
      email_verified: true,
      is_admin: false,
    };

    users.push(newUser);
    saveDemoUsers(users);

    // Auto login after registration
    return this.login(email, password);
  },

  /**
   * Request password reset (demo - just shows a message)
   */
  async requestPasswordReset(email: string): Promise<void> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));
    // In production, this would send an email
    console.log('Password reset requested for:', email);
  },

  /**
   * Reset password with token (demo)
   */
  async resetPassword(
    password: string,
    password_confirmation: string,
  ): Promise<void> {
    if (password !== password_confirmation) {
      throw new Error('Passwords do not match');
    }
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));
  },

  /**
   * Resend verification email (demo)
   */
  async resendVerificationEmail(email: string): Promise<void> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));
    console.log('Verification email resent to:', email);
  },

  /**
   * Get current user from storage
   */
  async getCurrentUser(): Promise<UserModel | null> {
    try {
      const userStr = localStorage.getItem('current-user');
      if (userStr) {
        return JSON.parse(userStr) as UserModel;
      }
    } catch (error) {
      console.error('Error getting current user:', error);
    }
    return null;
  },

  /**
   * Update user profile
   */
  async updateUserProfile(userData: Partial<UserModel>): Promise<UserModel> {
    const currentUser = await this.getCurrentUser();
    if (!currentUser) {
      throw new Error('No user logged in');
    }

    const updatedUser = { ...currentUser, ...userData };
    localStorage.setItem('current-user', JSON.stringify(updatedUser));

    // Also update in users array
    const users = getDemoUsers();
    const index = users.findIndex((u) => u.id === currentUser.id);
    if (index !== -1) {
      users[index] = updatedUser;
      saveDemoUsers(users);
    }

    return updatedUser;
  },

  /**
   * Logout the current user
   */
  async logout(): Promise<void> {
    removeAuth();
    localStorage.removeItem('current-user');
  },

  /**
   * Verify the current session
   */
  async verify(): Promise<UserModel | null> {
    const auth = getAuth();
    if (!auth?.access_token) {
      return null;
    }

    // Check if token is still valid (in demo, we just check if it exists)
    const userStr = localStorage.getItem('current-user');
    if (userStr) {
      return JSON.parse(userStr) as UserModel;
    }

    return null;
  },
};
