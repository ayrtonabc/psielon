import React, { useState, useEffect } from 'react';
import { Phone, Mail, Download, Edit, Heart, PawPrint as Paw, MapPin, Calendar, Home, Share2, Check, MessageSquare } from 'lucide-react';
import { Link, useParams, useLocation } from 'react-router-dom';
import { usePetStore } from '../store';
import { generatePDF } from '../utils/pdf';

export const PetProfile: React.FC = () => {
  const [copied, setCopied] = useState(false);
  
  // Perfil estático de mascota
  const profile = {
    id: 'default',
    name: 'Azor',
    breed: 'Owczarek Niemiecki',
    age: 3,
    gender: 'male',
    address: 'ul. Kwiatowa 15, Warszawa',
    description: 'Azor to energiczny i przyjazny pies, który uwielbia długie spacery i zabawę piłką. Jest bardzo inteligentny i szybko się uczy. Lubi towarzystwo innych psów i jest bardzo opiekuńczy wobec dzieci. Jego ulubione przysmaki to kawałki kurczaka i marchewki.',
    image_url: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1',
    cover_image_url: 'https://images.unsplash.com/photo-1444212477490-ca407925329e',
    owner_name: 'Marek Kowalski',
    owner_phone: '+48 123 456 789',
    owner_email: 'marek.kowalski@example.com',
    created_at: new Date().toISOString(),
    last_updated: new Date().toISOString()
  };
  
  const shareProfile = () => {
    const url = window.location.origin + '/pet/default';
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const genderColors = profile.gender === 'female' 
    ? 'from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600'
    : 'from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600';

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="relative h-80">
          <img
            src={profile.cover_image_url}
            alt="Zdjęcie okładkowe"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
          <div className="absolute top-4 right-4 flex space-x-2">
            <button
              onClick={shareProfile}
              className="p-3 bg-white rounded-full shadow-lg hover:bg-gray-100 transition duration-200"
              title="Udostępnij profil"
            >
              {copied ? (
                <Check className="w-5 h-5 text-green-600" />
              ) : (
                <Share2 className="w-5 h-5 text-gray-600" />
              )}
            </button>
            <Link
              to="/edit"
              className="p-3 bg-white rounded-full shadow-lg hover:bg-gray-100 transition duration-200"
            >
              <Edit className="w-5 h-5 text-gray-600" />
            </Link>
          </div>
        </div>
        
        <div className="relative px-8 pb-8">
          <div className="flex flex-col md:flex-row md:items-end md:space-x-6 -mt-20">
            <div className="relative w-40 h-40 rounded-xl overflow-hidden border-4 border-white shadow-lg">
              <img
                src={profile.image_url}
                alt={profile.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="mt-4 md:mt-0">
              <h1 className="text-4xl font-bold text-gray-900">{profile.name}</h1>
              <div className="flex items-center space-x-4 mt-2 text-gray-600">
                <span className="flex items-center">
                  <MapPin className="w-4 h-4 mr-1" />
                  {profile.breed}
                </span>
                <span className="flex items-center">
                  <Calendar className="w-4 h-4 mr-1" />
                  {profile.age} lat
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
            <div className={`rounded-xl p-6 bg-gradient-to-r ${genderColors} text-white`}>
              <div className="flex items-center mb-4">
                <Paw className="w-6 h-6 mr-2" />
                <h2 className="text-2xl font-semibold">O Mnie</h2>
              </div>
              <p className="text-white/90 leading-relaxed">{profile.description}</p>
              {profile.address && (
                <div className="mt-4 pt-4 border-t border-white/20">
                  <div className="flex items-center">
                    <Home className="w-5 h-5 mr-2" />
                    <span className="text-white/90">Adres: {profile.address}</span>
                  </div>
                </div>
              )}
            </div>

            <div className="bg-gray-50 rounded-xl p-6">
              <div className="flex items-center mb-4">
                <Heart className="w-6 h-6 text-red-500 mr-2" />
                <h2 className="text-2xl font-semibold text-gray-800">Mój Człowiek</h2>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                      <Heart className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{profile.owner_name}</p>
                      <p className="text-sm text-gray-500">Właściciel</p>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <a
                    href={`tel:${profile.owner_phone}`}
                    className="flex items-center space-x-3 p-4 bg-white rounded-lg shadow-sm hover:bg-gray-50 transition duration-200"
                  >
                    <Phone className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="text-sm text-gray-500">Telefon</p>
                      <p className="font-medium text-gray-900">{profile.owner_phone}</p>
                    </div>
                  </a>
                  <a
                    href={`sms:${profile.owner_phone}`}
                    className="flex items-center space-x-3 p-4 bg-white rounded-lg shadow-sm hover:bg-gray-50 transition duration-200"
                  >
                    <MessageSquare className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="text-sm text-gray-500">SMS</p>
                      <p className="font-medium text-gray-900">{profile.owner_phone}</p>
                    </div>
                  </a>
                </div>
                
                <a
                  href={`mailto:${profile.owner_email}`}
                  className="flex items-center space-x-3 p-4 bg-white rounded-lg shadow-sm hover:bg-gray-50 transition duration-200"
                >
                  <Mail className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-medium text-gray-900">{profile.owner_email}</p>
                  </div>
                </a>
              </div>
            </div>
          </div>

          <button
            onClick={() => generatePDF(profile)}
            className="mt-8 flex items-center justify-center w-full bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white px-6 py-4 rounded-xl transition duration-200 space-x-2 text-lg font-semibold"
          >
            <Download className="w-6 h-6" />
            <span>Pobierz Informacje</span>
          </button>
        </div>
      </div>
      
      {/* Footer con texto y logo en polaco */}
      <div className="mt-8 py-4 text-center text-gray-600 flex flex-col items-center justify-center">
        <div className="flex items-center justify-center space-x-2">
          <span>Wykonane z miłością</span>
          <img src="/logo.png" alt="Logo" className="h-6" />
        </div>
      </div>
    </div>
  );
};