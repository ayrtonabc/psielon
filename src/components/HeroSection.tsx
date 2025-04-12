import React from 'react';
import { Link } from 'react-router-dom';

// Placeholder background image URL (replace with your desired image)
const backgroundImageUrl = 'https://images.unsplash.com/photo-1517849845537-4d257902454a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80';

export const HeroSection: React.FC = () => {
  return (
    <div
      className="relative flex items-center justify-center h-screen bg-cover bg-center"
      style={{ backgroundImage: `url(${backgroundImageUrl})` }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black opacity-50"></div>

      {/* Content */}
      <div className="relative z-10 text-center text-white p-8 max-w-2xl mx-auto">
        <h1 className="text-4xl md:text-6xl font-bold mb-4 drop-shadow-lg">
          Zapewnij swojemu Zwierzakowi Bezpieczeństwo, na które Zasługuje
        </h1>
        <p className="text-lg md:text-xl mb-8 drop-shadow-md">
          Dzięki naszemu inteligentnemu identyfikatorowi, Twój towarzysz zawsze będzie z Tobą połączony. Stwórz jego cyfrowy profil teraz.
        </p>
        <Link
          to="/edit" // Link to the profile creation/editing page
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full text-lg transition duration-300 ease-in-out shadow-lg hover:shadow-xl"
        >
          Stwórz Profil Teraz
        </Link>
      </div>
    </div>
  );
};
