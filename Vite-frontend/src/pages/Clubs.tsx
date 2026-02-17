import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import { ROUTES } from '../routes/paths';

interface Club {
  id: number;
  name: string;
  category: string;
  members: number;
  location: string;
  description: string;
}

const MOCK_CLUBS: Club[] = [
  {
    id: 1,
    name: 'Runners Chișinău',
    category: 'Alergare',
    members: 124,
    location: 'Chișinău',
    description: 'Comunitate de alergători din Chișinău. Antrenamente comune în fiecare weekend în Parcul Valea Morilor.',
  },
  {
    id: 2,
    name: 'CycleMD',
    category: 'Ciclism',
    members: 89,
    location: 'Chișinău',
    description: 'Club de ciclism pentru trasee urbane și rurale. Organizăm ture de grup în fiecare duminică.',
  },
  {
    id: 3,
    name: 'FitGym Bălți',
    category: 'Sală',
    members: 56,
    location: 'Bălți',
    description: 'Grup de pasionați de fitness din Bălți. Împărtășim rutine, sfaturi și motivație.',
  },
  {
    id: 4,
    name: 'Trail Moldova',
    category: 'Alergare',
    members: 73,
    location: 'Moldova',
    description: 'Club dedicat alergării pe trasee montane și off-road din toată Moldova.',
  },
  {
    id: 5,
    name: 'Yoga & Wellness MD',
    category: 'Wellness',
    members: 98,
    location: 'Chișinău',
    description: 'Sesiuni de yoga, meditație și wellness. Bine veniți începători și avansați.',
  },
  {
    id: 6,
    name: 'CrossFit Cahul',
    category: 'Sală',
    members: 42,
    location: 'Cahul',
    description: 'Comunitate CrossFit din Cahul. WOD-uri zilnice și competiții locale.',
  },
];

const CATEGORIES = ['Toate', 'Alergare', 'Ciclism', 'Sală', 'Wellness'];

const Clubs: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('Toate');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredClubs = MOCK_CLUBS.filter((club) => {
    const matchesCategory = selectedCategory === 'Toate' || club.category === selectedCategory;
    const matchesSearch =
      club.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      club.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="clubs-page">
      <Navbar />

      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '100px 20px 40px' }}>
        <div style={{ marginBottom: '32px' }}>
          <Link to={ROUTES.HOME} style={{ color: '#6c63ff', textDecoration: 'none' }}>
            &larr; Înapoi la pagina principală
          </Link>
        </div>

        <h1 style={{ fontSize: '2rem', marginBottom: '8px' }}>Cluburi Locale</h1>
        <p style={{ color: '#aaa', marginBottom: '32px' }}>
          Descoperă și alătură-te cluburilor sportive din comunitatea ta
        </p>

        <div style={{ display: 'flex', gap: '16px', marginBottom: '24px', flexWrap: 'wrap' }}>
          <input
            type="text"
            placeholder="Caută cluburi după nume sau locație..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              flex: 1,
              minWidth: '200px',
              padding: '10px 16px',
              borderRadius: '8px',
              border: '1px solid #333',
              background: '#1a1a2e',
              color: '#fff',
              fontSize: '14px',
            }}
          />
        </div>

        <div style={{ display: 'flex', gap: '8px', marginBottom: '32px', flexWrap: 'wrap' }}>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              style={{
                padding: '8px 16px',
                borderRadius: '20px',
                border: selectedCategory === cat ? '1px solid #6c63ff' : '1px solid #333',
                background: selectedCategory === cat ? '#6c63ff' : 'transparent',
                color: '#fff',
                cursor: 'pointer',
                fontSize: '14px',
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {filteredClubs.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: '#888' }}>
            <p style={{ fontSize: '18px' }}>Nu s-au găsit cluburi pentru filtrele selectate.</p>
          </div>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
              gap: '24px',
            }}
          >
            {filteredClubs.map((club) => (
              <div
                key={club.id}
                style={{
                  background: '#16213e',
                  borderRadius: '12px',
                  padding: '24px',
                  border: '1px solid #1a1a3e',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '12px' }}>
                  <h3 style={{ fontSize: '18px', margin: 0 }}>{club.name}</h3>
                  <span
                    style={{
                      padding: '4px 10px',
                      borderRadius: '12px',
                      background: '#6c63ff22',
                      color: '#6c63ff',
                      fontSize: '12px',
                    }}
                  >
                    {club.category}
                  </span>
                </div>

                <p style={{ color: '#aaa', fontSize: '14px', marginBottom: '16px', lineHeight: 1.5 }}>
                  {club.description}
                </p>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', gap: '16px', color: '#888', fontSize: '13px' }}>
                    <span>{club.members} membri</span>
                    <span>{club.location}</span>
                  </div>
                  <button
                    style={{
                      padding: '8px 16px',
                      borderRadius: '8px',
                      border: '1px solid #6c63ff',
                      background: 'transparent',
                      color: '#6c63ff',
                      cursor: 'pointer',
                      fontSize: '13px',
                    }}
                  >
                    Alătură-te
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Clubs;
