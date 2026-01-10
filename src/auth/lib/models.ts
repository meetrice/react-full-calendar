// Define UUID type for consistent usage
export type UUID = string;

// Language code type for user preferences
export type LanguageCode = 'en' | 'de' | 'es' | 'fr' | 'ja' | 'zh';

// Auth model representing the authentication session
export interface AuthModel {
  access_token: string;
  refresh_token?: string;
}

// User model representing the user profile
export interface UserModel {
  id?: UUID;
  username: string;
  password?: string; // Optional as we don't always retrieve passwords
  email: string;
  first_name: string;
  last_name: string;
  fullname?: string; // May be stored directly in metadata
  email_verified?: boolean;
  occupation?: string;
  company_name?: string;
  companyName?: string; // For backward compatibility
  phone?: string;
  roles?: number[]; // Array of role IDs
  pic?: string;
  language?: LanguageCode;
  is_admin?: boolean; // Added admin flag
}
