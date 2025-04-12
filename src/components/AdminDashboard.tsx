import React, { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { pl } from 'date-fns/locale';
import { Users, PlusCircle, BarChart as ChartBar, Copy, Check, ExternalLink, Smartphone, QrCode } from 'lucide-react';
import { usePetStore } from '../store';
import { PetProfile, AdminStats } from '../types';
import { Link } from 'react-router-dom';

export const AdminDashboard: React.FC = () => {
  const { allProfiles, adminStats, fetchAllProfiles, fetchAdminStats, createNewProfile } = usePetStore();
  const [newProfileId, setNewProfileId] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showDemoData, setShowDemoData] = useState(true);
  const [createdProfileId, setCreatedProfileId] = useState<string | null>(null);
  const [createdProfileUrl, setCreatedProfileUrl] = useState<string | null>(null);
  const [copiedNfcLink, setCopiedNfcLink] = useState(false);

  useEffect(() => {
    fetchAllProfiles();
    fetchAdminStats();
  }, [fetchAllProfiles, fetchAdminStats]);

  const handleCreateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (newProfileId.trim()) {
      createNewProfile(newProfileId.trim());
      const profileId = newProfileId.trim();
      setCreatedProfileId(profileId);
      setCreatedProfileUrl(`${window.location.origin}/pet/${profileId}`);
      setNewProfileId('');
    }
  };

  const copyNfcLink = () => {
    if (createdProfileUrl) {
      navigator.clipboard.writeText(createdProfileUrl);
      setCopiedNfcLink(true);
      setTimeout(() => setCopiedNfcLink(false), 2000);
    }
  };

  // Datos de ejemplo para perfiles de mascotas (estáticos)
  const demoProfiles: PetProfile[] = [
    {
      id: 'demo001',
      name: 'Luna',
      breed: 'Labrador Retriever',
      age: 3,
      gender: 'female',
      address: 'ul. Warszawska 15, Kraków',
      description: 'Luna es una perra muy amigable y juguetona. Le encanta nadar y jugar a buscar la pelota.',
      image_url: 'https://images.unsplash.com/photo-1529429617124-95b109e86bb8',
      cover_image_url: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b',
      owner_name: 'Marta Kowalska',
      owner_phone: '+48 123 456 789',
      owner_email: 'marta.k@example.com',
      created_at: '2023-11-15T10:30:00Z',
      last_updated: '2024-04-01T14:20:00Z'
    },
    {
      id: 'demo002',
      name: 'Max',
      breed: 'Pastor Alemán',
      age: 5,
      gender: 'male',
      address: 'ul. Długa 42, Warszawa',
      description: 'Max es un perro muy inteligente y leal. Ha sido entrenado para obedecer comandos básicos.',
      image_url: 'https://images.unsplash.com/photo-1589941013453-ec89f33b5e95',
      cover_image_url: 'https://images.unsplash.com/photo-1555661059-7e755c1c3c1d',
      owner_name: 'Jan Nowak',
      owner_phone: '+48 987 654 321',
      owner_email: 'jan.nowak@example.com',
      created_at: '2023-09-20T08:15:00Z',
      last_updated: '2024-03-15T11:45:00Z'
    },
    {
      id: 'demo003',
      name: 'Bella',
      breed: 'Bulldog Francés',
      age: 2,
      gender: 'female',
      address: 'ul. Morska 7, Gdańsk',
      description: 'Bella es una perra pequeña pero con mucha energía. Le encanta dormir y jugar con sus juguetes.',
      image_url: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e',
      cover_image_url: 'https://images.unsplash.com/photo-1560743641-3914f2c45636',
      owner_name: 'Agnieszka Wiśniewska',
      owner_phone: '+48 555 123 456',
      owner_email: 'agnieszka.w@example.com',
      created_at: '2024-01-10T15:45:00Z',
      last_updated: '2024-04-05T09:30:00Z'
    },
    {
      id: 'demo004',
      name: 'Charlie',
      breed: 'Golden Retriever',
      age: 4,
      gender: 'male',
      address: 'ul. Słoneczna 22, Wrocław',
      description: 'Charlie es un perro muy cariñoso y paciente. Es excelente con los niños y otros animales.',
      image_url: 'https://images.unsplash.com/photo-1552053831-71594a27632d',
      cover_image_url: 'https://images.unsplash.com/photo-1568572933382-74d440642117',
      owner_name: 'Piotr Zieliński',
      owner_phone: '+48 333 444 555',
      owner_email: 'piotr.z@example.com',
      created_at: '2023-08-05T12:20:00Z',
      last_updated: '2024-02-20T16:10:00Z'
    },
    {
      id: 'demo005',
      name: 'Daisy',
      breed: 'Beagle',
      age: 1,
      gender: 'female',
      address: 'ul. Kwiatowa 9, Poznań',
      description: 'Daisy es una cachorra muy curiosa y juguetona. Está aprendiendo comandos básicos.',
      image_url: 'https://images.unsplash.com/photo-1591769225440-811ad7d6eab2',
      cover_image_url: 'https://images.unsplash.com/photo-1544568100-847a948585b9',
      owner_name: 'Katarzyna Lewandowska',
      owner_phone: '+48 777 888 999',
      owner_email: 'kasia.l@example.com',
      created_at: '2024-02-28T09:00:00Z',
      last_updated: '2024-04-10T13:25:00Z'
    }
  ];

  // Estadísticas de demostración
  const demoStats: AdminStats = {
    totalProfiles: 42,
    profilesThisMonth: 8,
    activeProfiles: 35
  };

  const copyToClipboard = (id: string) => {
    const url = `${window.location.origin}/pet/${id}`;
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };
  
  // Usar datos de demostración o datos reales
  const displayProfiles = showDemoData && allProfiles.length === 0 ? demoProfiles : allProfiles;
  const displayStats = showDemoData && adminStats.totalProfiles === 0 ? demoStats : adminStats;

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Wszystkie Profile</h3>
            <Users className="w-8 h-8 text-blue-600" />
          </div>
          <p className="text-3xl font-bold text-gray-900">{displayStats.totalProfiles}</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Nowe Profile (30 dni)</h3>
            <PlusCircle className="w-8 h-8 text-green-600" />
          </div>
          <p className="text-3xl font-bold text-gray-900">{displayStats.profilesThisMonth}</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Aktywne Profile</h3>
            <ChartBar className="w-8 h-8 text-purple-600" />
          </div>
          <p className="text-3xl font-bold text-gray-900">{displayStats.activeProfiles}</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Utwórz Nowy Profil</h2>
          <div className="flex items-center">
            <span className="mr-2 text-sm text-gray-600">Pokaż dane demonstracyjne:</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                checked={showDemoData} 
                onChange={() => setShowDemoData(!showDemoData)} 
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>
        <form onSubmit={handleCreateProfile} className="flex gap-4 mb-6">
          <input
            type="text"
            value={newProfileId}
            onChange={(e) => setNewProfileId(e.target.value)}
            placeholder="Wprowadź ID profilu (np.: 001, 002...)"
            className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button
            type="submit"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200"
          >
            Utwórz Profil
          </button>
        </form>

        {createdProfileId && createdProfileUrl && (
          <div className="mt-6 p-4 border border-green-200 bg-green-50 rounded-lg">
            <div className="flex items-center mb-2">
              <Smartphone className="w-5 h-5 text-green-600 mr-2" />
              <h3 className="text-lg font-semibold text-green-800">Link do zapisania w chipie NFC</h3>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Ten link może zostać zapisany w chipie NFC, aby szybko uzyskać dostęp do profilu zwierzaka.
              Użyj tego linku do zaprogramowania tagu NFC, który zostanie umieszczony na obroży lub identyfikatorze zwierzaka.
            </p>
            <div className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg">
              <div className="flex items-center">
                <QrCode className="w-5 h-5 text-gray-500 mr-2" />
                <span className="text-sm font-medium text-gray-700 truncate max-w-xs">{createdProfileUrl}</span>
              </div>
              <button
                onClick={copyNfcLink}
                className="p-2 bg-blue-100 rounded-lg hover:bg-blue-200 transition-colors flex items-center"
                title="Kopiuj link do NFC"
              >
                {copiedNfcLink ? (
                  <>
                    <Check className="w-4 h-4 text-green-600 mr-1" />
                    <span className="text-xs font-medium text-green-600">Skopiowano</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 text-blue-600 mr-1" />
                    <span className="text-xs font-medium text-blue-600">Kopiuj</span>
                  </>
                )}
              </button>
            </div>
            <div className="mt-3 text-xs text-gray-500">
              <p>ID utworzonego profilu: <span className="font-semibold">{createdProfileId}</span></p>
            </div>
          </div>
        )}
      </div>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800">Wszystkie Profile</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Imię</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Właściciel</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kontakt</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data Utworzenia</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ostatnia Aktualizacja</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Akcje</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {displayProfiles.map((profile: PetProfile) => (
                <tr key={profile.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{profile.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <img
                        className="h-10 w-10 rounded-full object-cover"
                        src={profile.image_url}
                        alt={profile.name || 'Sin nombre'}
                      />
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{profile.name || 'Bez imienia'}</div>
                        <div className="text-sm text-gray-500">{profile.breed || 'Bez rasy'}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{profile.owner_name || 'Nie zarejestrowano'}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{profile.owner_phone || 'Nie zarejestrowano'}</div>
                    <div className="text-sm text-gray-500">{profile.owner_email || 'Nie zarejestrowano'}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {format(new Date(profile.created_at), 'PP', { locale: pl })}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {format(new Date(profile.last_updated), 'PP', { locale: pl })}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => copyToClipboard(profile.id)}
                        className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                        title="Kopiuj link do profilu"
                      >
                        {copiedId === profile.id ? (
                          <Check className="w-5 h-5 text-green-600" />
                        ) : (
                          <Copy className="w-5 h-5 text-gray-600" />
                        )}
                      </button>
                      <Link
                        to={`/pet/${profile.id}`}
                        className="p-2 bg-blue-100 rounded-lg hover:bg-blue-200 transition-colors"
                        title="Zobacz profil"
                      >
                        <ExternalLink className="w-5 h-5 text-blue-600" />
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
