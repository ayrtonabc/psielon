import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useParams, Navigate } from 'react-router-dom';
import { PawPrint as Paw } from 'lucide-react';
import { PetProfile } from './components/PetProfile';
import { EditProfile } from './components/EditProfile';
import { AdminDashboard } from './components/AdminDashboard';
import { HeroSection } from './components/HeroSection'; // Import HeroSection
import { usePetStore } from './store';

// Componente para manejar perfiles de mascotas por ID
const PetProfileWrapper: React.FC = () => {
  const { petId } = useParams<{ petId: string }>();
  const { fetchProfileById } = usePetStore();

  useEffect(() => {
    if (petId) {
      fetchProfileById(petId);
    }
  }, [petId, fetchProfileById]);

  // Render PetProfile directly, it will use the store's profile
  return <PetProfile />;
};

function App() {
  const setProfile = usePetStore((state) => state.setProfile);

  useEffect(() => {
    if ('NDEFReader' in window) {
      const reader = new (window as any).NDEFReader();

      reader.scan().then(() => {
        reader.onreading = ({ message }: any) => {
          const decoder = new TextDecoder();
          for (const record of message.records) {
            if (record.recordType === "text") {
              const profileId = decoder.decode(record.data);
              // Navigate to the pet's profile page
              // Note: Direct navigation might be better handled differently
              // depending on how you want the UX flow after scanning.
              // For now, we just set the profile ID in the store.
              // Consider using navigate hook from react-router-dom if needed.
              console.log("NFC Tag Scanned, Profile ID:", profileId);
              // Fetch profile data based on scanned ID
              usePetStore.getState().fetchProfileById(profileId);
              // Potentially navigate: navigate(`/pet/${profileId}`);
            }
          }
        };
      }).catch(err => {
        // Inform the user about the need for interaction or potential errors
        console.log('NFC Scan Error or Aborted: ', err);
        // Example: Display a message like "Tap the NFC tag again" or "NFC not supported/enabled".
      });

      // Cleanup function to potentially abort scan if component unmounts
      return () => {
        // NDEFReader doesn't have an explicit abort/stop method in the standard.
        // Cleanup might involve removing event listeners if added differently.
        console.log("NFC Reader cleanup (if applicable)");
      };
    } else {
      console.log("Web NFC is not supported on this device.");
      // Inform the user that NFC scanning is not available.
    }
  }, [setProfile]); // setProfile dependency might not be needed if only fetching

  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        {/* Navbar is now part of the HeroSection or rendered conditionally */}
        <Routes>
          <Route path="/" element={
            <>
              <nav className="absolute top-0 left-0 w-full z-10 bg-transparent py-4">
                <div className="max-w-7xl mx-auto px-4">
                  <div className="flex items-center justify-between">
                    <Link to="/" className="flex items-center space-x-3">
                      <img src="/logo.png" alt="Logo Mascota" className="h-10" /> {/* Use image logo */}
                    </Link>
                    {/* Admin link removed */}
                  </div>
                </div>
              </nav>
              <HeroSection />
            </>
          } />
          <Route path="/pet/:petId" element={
             <>
              <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <PetProfileWrapper />
              </main>
            </>
          } />
          <Route path="/edit" element={
            <>
             {/* Navbar removed from here */}
              <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <EditProfile />
              </main>
            </>
          } />
          <Route path="/admin" element={
            <>
             {/* Optional: Add a simple navbar for admin page */}
             <nav className="bg-white shadow-md">
                <div className="max-w-7xl mx-auto px-4 py-4">
                  <div className="flex items-center justify-between">
                    <Link to="/" className="flex items-center space-x-3">
                      <Paw className="w-8 h-8 text-blue-600" />
                      <span className="text-xl font-bold text-gray-900">Panel Admin</span>
                    </Link>
                  </div>
                </div>
              </nav>
              <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <AdminDashboard />
              </main>
            </>
          } />
          {/* Redirect incorrect paths to the home page */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
