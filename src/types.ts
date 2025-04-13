export interface PetProfile {
  id: string;
  name: string;
  breed: string;
  age: number;
  gender: 'male' | 'female';
  address: string;
  description: string;
  image_url: string;
  cover_image_url: string;
  owner_name: string;
  owner_phone: string;
  owner_email: string;
  pin?: string;
  created_at: string;
  last_updated: string;
  is_complete: boolean;
}

export interface AdminStats {
  totalProfiles: number;
  profilesThisMonth: number;
  activeProfiles: number;
}