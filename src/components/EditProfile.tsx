import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import { Camera, Upload } from 'lucide-react';
import { usePetStore } from '../store';
import { PetProfile } from '../types';

export const EditProfile: React.FC = () => {
  const navigate = useNavigate();
  const [pin, setPin] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false); // Estado para el popup
  const { profile, updateProfile, verifyPin } = usePetStore();
  const [formData, setFormData] = useState<PetProfile>(profile || {});
  const [previewUrl, setPreviewUrl] = useState(profile?.image_url || '');

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const dataUrl = reader.result as string;
        setPreviewUrl(dataUrl);
        setFormData(prev => ({ ...prev, image_url: dataUrl }));
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif']
    },
    maxFiles: 1
  });

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (verifyPin(pin)) {
      setIsEditing(true);
    } else {
      alert('Nieprawidłowy PIN');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile(formData);
    setShowSuccessPopup(true); // Mostrar el popup
    setTimeout(() => {
      setShowSuccessPopup(false);
      navigate('/pet/default'); // Redirigir a PetProfile en lugar de la página principal
    }, 2000); // Cierra el popup después de 2 segundos y redirige
  };

  if (!isEditing && profile?.pin) {
    return (
      <div className="max-w-md mx-auto mt-10 p-8 bg-white rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Wprowadź PIN, aby edytować</h2>
        <form onSubmit={handlePinSubmit} className="space-y-4">
          <input
            type="password"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Wprowadź PIN"
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition duration-200"
          >
            Potwierdź
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg p-8 space-y-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            {profile?.pin ? 'Edytuj Profil' : 'Utwórz Profil'}
          </h2>
          <p className="text-gray-600">Stwórzmy unikalny profil dla Twojego zwierzaka! 🐾</p>
        </div>

        <div className="space-y-6">
          <div className="flex justify-center">
            <div
              {...getRootProps()}
              className={`relative w-48 h-48 rounded-full overflow-hidden cursor-pointer border-4 ${
                isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-200 bg-gray-50'
              } transition-all duration-200 hover:border-blue-400`}
            >
              <input {...getInputProps()} />
              {previewUrl ? (
                <img
                  src={previewUrl}
                  alt="Podgląd zwierzaka"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex flex-col items-center justify-center h-full p-4">
                  <Camera className="w-12 h-12 text-gray-400 mb-2" />
                  <p className="text-sm text-gray-500 text-center">
                    Przeciągnij obraz lub kliknij, aby wybrać
                  </p>
                </div>
              )}
              <div className="absolute bottom-0 right-0 p-2 bg-blue-600 rounded-full shadow-lg">
                <Upload className="w-5 h-5 text-white" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Imię zwierzaka</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Wprowadź imię zwierzaka"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Rasa</label>
              <input
                type="text"
                value={formData.breed}
                onChange={(e) => setFormData({ ...formData, breed: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Wprowadź rasę"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Wiek</label>
              <input
                type="number"
                value={formData.age}
                onChange={(e) => setFormData({ ...formData, age: parseInt(e.target.value) })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Wprowadź wiek"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Płeć</label>
              <select
                value={formData.gender}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value as 'male' | 'female' })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="male">Samiec</option>
                <option value="female">Samica</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Adres</label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Wprowadź adres, gdzie mieszka zwierzak"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Opis</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={4}
              placeholder="Opowiedz nam o swoim futrzanym przyjacielu..."
            />
          </div>

          <div className="bg-blue-50 rounded-xl p-6 space-y-6">
            <h3 className="text-xl font-semibold text-blue-900">Informacje o właścicielu</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Imię właściciela</label>
                <input
                  type="text"
                  value={formData.owner_name}
                  onChange={(e) => setFormData({ ...formData, owner_name: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Wprowadź imię właściciela"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Numer telefonu</label>
                <input
                  type="tel"
                  value={formData.owner_phone}
                  onChange={(e) => setFormData({ ...formData, owner_phone: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Wprowadź numer telefonu"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={formData.owner_email}
                  onChange={(e) => setFormData({ ...formData, owner_email: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Wprowadź adres email"
                />
              </div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-xl p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Bezpieczeństwo</h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">PIN (do przyszłej edycji)</label>
              <input
                type="password"
                value={formData.pin}
                onChange={(e) => setFormData({ ...formData, pin: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Wprowadź PIN"
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-4 rounded-lg hover:bg-blue-700 transition duration-200 mt-8 text-lg font-semibold"
        >
          {profile?.pin ? '🐾 Zapisz zmiany' : '🐾 Utwórz profil'}
        </button>
      </form>

      {/* Popup de éxito */}
      {showSuccessPopup && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-xl p-6 max-w-sm w-full text-center shadow-lg transform transition-all animate-bounce-in">
            <h3 className="text-xl font-bold text-blue-600 mb-2">Świetna robota! 🐾</h3>
            <p className="text-gray-600">Profil Twojego zwierzaka został pomyślnie zapisany!</p>
          </div>
        </div>
      )}
    </div>
  );
};
