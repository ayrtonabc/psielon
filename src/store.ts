import { create } from 'zustand';
import { createClient } from '@supabase/supabase-js';
import { PetProfile, AdminStats } from './types';

interface PetStore {
  profile: PetProfile | null;
  allProfiles: PetProfile[];
  adminStats: AdminStats;
  setProfile: (profile: PetProfile) => void;
  updateProfile: (profile: PetProfile) => void;
  verifyPin: (pin: string) => boolean;
  fetchAllProfiles: () => Promise<void>;
  fetchProfileById: (id: string) => Promise<void>;
  fetchAdminStats: () => Promise<void>;
  createNewProfile: (id: string) => Promise<void>;
}

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

const defaultProfile: PetProfile = {
  id: 'default',
  name: '',
  breed: '',
  age: 0,
  gender: 'male',
  address: '',
  description: '',
  image_url: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1',
  cover_image_url: 'https://images.unsplash.com/photo-1444212477490-ca407925329e',
  owner_name: '',
  owner_phone: '',
  owner_email: '',
  pin: '',
  created_at: new Date().toISOString(),
  last_updated: new Date().toISOString()
};

export const usePetStore = create<PetStore>((set, get) => ({
  profile: defaultProfile,
  allProfiles: [],
  adminStats: {
    totalProfiles: 0,
    profilesThisMonth: 0,
    activeProfiles: 0
  },
  setProfile: (profile) => set({ profile }),
  updateProfile: async (profile) => {
    // Asegurarse de que el perfil tenga todos los campos necesarios
    const updatedProfile = {
      ...profile,
      last_updated: new Date().toISOString(),
      // Asegurar que estos campos existan
      pin: profile.pin || '',
      name: profile.name || '',
      breed: profile.breed || '',
      age: profile.age || 0,
      gender: profile.gender || 'male',
      description: profile.description || '',
      address: profile.address || '',
      owner_name: profile.owner_name || '',
      owner_phone: profile.owner_phone || '',
      owner_email: profile.owner_email || ''
    };

    const { data, error } = await supabase
      .from('pet_profiles')
      .upsert(updatedProfile)
      .select()
      .single();

    if (error) {
      console.error('Error updating profile:', error);
      return;
    }

    set({ profile: data });
  },
  verifyPin: (pin) => {
    const profile = get().profile;
    return !profile?.pin || profile.pin === pin;
  },
  fetchProfileById: async (id) => {
    const { data, error } = await supabase
      .from('pet_profiles')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching profile by ID:', error);
      // Si no se encuentra el perfil, establecemos un perfil vacío con el ID proporcionado
      if (error.code === 'PGRST116') {
        set({ 
          profile: {
            ...defaultProfile,
            id: id,
            created_at: new Date().toISOString(),
            last_updated: new Date().toISOString()
          } 
        });
      }
      return;
    }

    set({ profile: data });
  },
  fetchAllProfiles: async () => {
    const { data, error } = await supabase
      .from('pet_profiles')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching profiles:', error);
      return;
    }

    set({ allProfiles: data });
  },
  fetchAdminStats: async () => {
    const { data: totalProfiles } = await supabase
      .from('pet_profiles')
      .select('count', { count: 'exact' });

    const { data: profilesThisMonth } = await supabase
      .from('pet_profiles')
      .select('count', { count: 'exact' })
      .gte('created_at', new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString());

    const { data: activeProfiles } = await supabase
      .from('pet_profiles')
      .select('count', { count: 'exact' })
      .gte('last_updated', new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString());

    set({
      adminStats: {
        totalProfiles: totalProfiles?.[0]?.count || 0,
        profilesThisMonth: profilesThisMonth?.[0]?.count || 0,
        activeProfiles: activeProfiles?.[0]?.count || 0
      }
    });
  },
  createNewProfile: async (id: string) => {
    const newProfile = {
      ...defaultProfile,
      id,
      created_at: new Date().toISOString(),
      last_updated: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('pet_profiles')
      .insert(newProfile)
      .select()
      .single();

    if (error) {
      console.error('Error creating profile:', error);
      return;
    }

    set({ profile: data });
  }
}));
