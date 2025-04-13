import React, { useState, useEffect } from 'react';
import { usePetStore } from '../store';
import { PetProfile } from '../types';
import { v4 as uuidv4 } from 'uuid'; // Import uuid

export const AdminDashboard: React.FC = () => {
  const { allProfiles, fetchAllProfiles, fetchAdminStats, adminStats } = usePetStore();
  const [newProfileLink, setNewProfileLink] = useState<string | null>(null); // State for the new link

  useEffect(() => {
    fetchAllProfiles();
    fetchAdminStats();
  }, [fetchAllProfiles, fetchAdminStats]);

  // Function to generate a new profile link
  const handleCreateNewProfile = () => {
    const newId = uuidv4(); // Generate a unique ID
    const link = `${window.location.origin}/pet/${newId}`;
    setNewProfileLink(link);
    // Optionally: You could pre-create an empty record in Supabase here,
    // but the current plan is to create it on first edit/save.
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      alert('Link skopiowany do schowka!'); // Alert in Polish
    }, (err) => {
      console.error('Could not copy text: ', err);
      alert('Nie udało się skopiować linku.'); // Alert in Polish
    });
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Panel Administracyjny</h1>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-lg font-semibold text-gray-600 mb-2">Całkowita liczba profili</h2>
          <p className="text-4xl font-bold text-blue-600">{adminStats.totalProfiles}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-lg font-semibold text-gray-600 mb-2">Profile w tym miesiącu</h2>
          <p className="text-4xl font-bold text-green-600">{adminStats.profilesThisMonth}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-lg font-semibold text-gray-600 mb-2">Aktywne profile</h2>
          <p className="text-4xl font-bold text-yellow-600">{adminStats.activeProfiles}</p>
        </div>
      </div>

      {/* Create New Profile Section */}
      <div className="bg-white p-6 rounded-xl shadow-md mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">Utwórz Nowy Profil</h2>
        <button
          onClick={handleCreateNewProfile}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition duration-200"
        >
          Generuj Link dla Nowego Profilu
        </button>
        {newProfileLink && (
          <div className="mt-4 p-4 bg-gray-100 rounded-lg flex items-center justify-between">
            <p className="text-sm text-gray-700 break-all">
              Nowy link: <code className="font-mono bg-gray-200 px-1 rounded">{newProfileLink}</code>
            </p>
            <button
              onClick={() => copyToClipboard(newProfileLink)}
              className="ml-4 bg-gray-300 text-gray-800 px-3 py-1 rounded hover:bg-gray-400 transition duration-200 text-sm"
            >
              Kopiuj
            </button>
          </div>
        )}
      </div>

      {/* Profiles List Section */}
      <div className="bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">Wszystkie Profile</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Imię</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rasa</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Właściciel</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Utworzono</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID Profilu</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {allProfiles.length > 0 ? (
                allProfiles.map((profile: PetProfile) => (
                  <tr key={profile.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{profile.name || 'Brak imienia'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{profile.breed || 'Brak rasy'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{profile.owner_name || 'Brak właściciela'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(profile.created_at).toLocaleDateString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">{profile.id}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">Nie znaleziono profili.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
