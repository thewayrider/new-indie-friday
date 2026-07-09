import React from 'react';
import Header from './Header';
import Footer from './Footer';

export default function Layout({ children, spotlightArtist, weeklyPick }) {
  return (
    <div className="min-h-screen bg-[#e8e2d9] text-black flex flex-col">
      <Header />

      <main className="flex-1">
        {children}
      </main>

      <Footer weeklyPick={weeklyPick} />
    </div>
  );
}