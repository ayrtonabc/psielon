import { create } from 'zustand';
import { createClient } from '@supabase/supabase-js';
import { PetProfile, AdminStats } from './types';

// Define loading states
type LoadingState = 'idle' | 'loading' | 'success' | 'error';

interface PetStore {
  profile: PetProfile | null; // Can be null if not found or not loaded yet
  profileExists: boolean; // Explicitly track if the profile exists in the DB
  loadingState: LoadingState; // Track loading status
  allProfiles: PetProfile[];
  adminStats: AdminStats;
  setProfile: (profile: PetProfile | null) => void; // Allow setting null
  updateProfile: (profileData: Partial<PetProfile>, id: string) => Promise<boolean>; // Pass ID explicitly, return success status
  verifyPin: (pin: string) => boolean;
  fetchAllProfiles: () => Promise<void>;
  fetchProfileById: (id: string) => Promise<void>;
  fetchAdminStats: () => Promise<void>;
  // createNewProfile removed as upsert handles creation
}

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Supabase URL or Anon Key is missing. Check your .env file.");
  // Potentially throw an error or handle this case appropriately
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Default structure for a *new* profile before saving
const createNewProfileDefaults = (id: string): PetProfile => ({
  id: id,
  name: '',
  breed: '',
  age: 0,
  gender: 'male',
  address: '',
  description: '',
  // Provide default images or leave empty? Using existing defaults for now.
  image_url: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1',
  cover_image_url: 'https://images.unsplash.com/photo-1444212477490-ca407925329e',
  owner_name: '',
  owner_phone: '',
  owner_email: '',
  pin: '', // PIN should be set by the user
  created_at: new Date().toISOString(),
  last_updated: new Date().toISOString()
});


export const usePetStore = create<PetStore>((set, get) => ({
  profile: null, // Start with null
  profileExists: false, // Assume not found initially
  loadingState: 'idle', // Initial state
  allProfiles: [],
  adminStats: {
    totalProfiles: 0,
    profilesThisMonth: 0,
    activeProfiles: 0
  },
  setProfile: (profile) => set({ profile }), // Simple setter

  updateProfile: async (profileData, id) => {
    set({ loadingState: 'loading' });
    // Ensure the id is included in the data being upserted
    const dataToSave = {
      ...profileData,
      id: id, // Make sure the ID is part of the object
      last_updated: new Date().toISOString(),
    };

    // If it's a new profile, ensure created_at is set
    if (!get().profileExists) {
      dataToSave.created_at = dataToSave.created_at || new Date().toISOString();
    }

    const { data, error } = await supabase
      .from('pet_profiles')
      .upsert(dataToSave, { onConflict: 'id' }) // Specify conflict target if needed, 'id' is default PK
      .select()
      .single();

    if (error) {
      console.error('Error updating/creating profile:', error);
      set({ loadingState: 'error' });
      return false; // Indicate failure
    }

    set({ profile: data, profileExists: true, loadingState: 'success' });
    return true; // Indicate success
  },

  verifyPin: (pin) => {
    const profile = get().profile;
    // Allow access if no profile is loaded yet (e.g., creating new)
    // or if the profile has no PIN set, or if the PIN matches.
    return !profile || !profile.pin || profile.pin === pin;
  },

  fetchProfileById: async (id) => {
    set({ loadingState: 'loading', profile: null, profileExists: false }); // Reset state before fetching
    const { data, error, status } = await supabase
      .from('pet_profiles')
      .select('*')
      .eq('id', id)
      .maybeSingle(); // Use maybeSingle to return null instead of error if not found

    if (error && status !== 406) { // 406 is expected if maybeSingle returns null
      console.error('Error fetching profile by ID:', error);
      set({ loadingState: 'error', profile: null, profileExists: false });
      return;
    }

    if (data) {
      set({ profile: data, profileExists: true, loadingState: 'success' });
    } else {
      // Profile not found in DB
      set({ profile: null, profileExists: false, loadingState: 'success' });
    }
  },

  fetchAllProfiles: async () => {
    // No loading state change needed for background fetch for admin
    const { data, error } = await supabase
      .from('pet_profiles')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching profiles:', error);
      return;
    }

    set({ allProfiles: data || [] }); // Ensure it's an array
  },

  fetchAdminStats: async () => {
    // Fetch total count
    const { count: totalCount, error: totalError } = await supabase
      .from('pet_profiles')
      .select('*', { count: 'exact', head: true }); // Use head:true for count only

    // Fetch count for profiles created in the last month
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
    const { count: monthCount, error: monthError } = await supabase
      .from('pet_profiles')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', oneMonthAgo.toISOString());

    // Fetch count for profiles updated (active) in the last month
    const { count: activeCount, error: activeError } = await supabase
      .from('pet_profiles')
      .select('*', { count: 'exact', head: true })
      .gte('last_updated', oneMonthAgo.toISOString());

    if (totalError || monthError || activeError) {
        console.error("Error fetching admin stats:", { totalError, monthError, activeError });
    }

    set({
      adminStats: {
        totalProfiles: totalCount ?? 0,
        profilesThisMonth: monthCount ?? 0,
        activeProfiles: activeCount ?? 0,
      }
    });
  },
}));

// Export the function separately if needed elsewhere
export { createNewProfileDefaults };
