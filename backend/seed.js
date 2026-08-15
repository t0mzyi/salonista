import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

async function seed() {
  console.log('Seeding salons...');
  const { data, error } = await supabase.from('salons').insert([
    {
      name: 'Urban Cuts & Grooming Studio',
      location: 'Kunnamkulam, Thrissur',
      map_url: 'https://maps.app.goo.gl/VBeR5vhhNc48J7py6',
      rating: 4.9,
      price: '$$',
      avail: 'Available now',
      description: 'Premium styling & grooming lounge with expert stylists and master craft cuts.',
      services: [
        { id: 's1', name: 'Signature Haircut', price: 350, durationMinutes: 30 },
        { id: 's2', name: 'Beard Trim & Shape', price: 180, durationMinutes: 15 },
        { id: 's3', name: 'Deep Cleanse Hair Wash', price: 120, durationMinutes: 15 },
        { id: 's4', name: 'Organic Hair Spa', price: 750, durationMinutes: 45 }
      ]
    },
    {
      name: 'Fade & Shave Studio',
      location: 'Thrissur City, Thrissur',
      map_url: 'https://maps.google.com/?q=Thrissur,Kerala',
      rating: 4.9,
      price: '$$',
      avail: 'Available now',
      description: 'Specializing in modern fades, beard styling, and hot towel shaves.',
      services: [
        { id: 's1', name: 'Premium Fade Haircut', price: 400, durationMinutes: 30 },
        { id: 's2', name: 'Hot Towel Shave', price: 250, durationMinutes: 20 },
        { id: 's3', name: 'Beard Grooming', price: 200, durationMinutes: 15 }
      ]
    },
    {
      name: 'The Grooming Lounge',
      location: 'Guruvayur, Thrissur',
      map_url: 'https://maps.google.com/?q=Guruvayur,Kerala',
      rating: 4.7,
      price: '$$$',
      avail: '15 min wait',
      description: 'Luxury hair and spa care for the contemporary look.',
      services: [
        { id: 's1', name: 'Classic Styling', price: 450, durationMinutes: 35 }
      ]
    },
    {
      name: 'Classic Cuts',
      location: 'Kochi City, Ernakulam',
      map_url: 'https://maps.google.com/?q=Kochi,Kerala',
      rating: 4.8,
      price: '$',
      avail: 'Available now',
      description: 'Quick and reliable haircut and grooming services.',
      services: [
        { id: 's1', name: 'Regular Cut', price: 200, durationMinutes: 20 }
      ]
    }
  ]).select();

  if (error) {
    console.error('❌ Failed to seed:', error.message);
  } else {
    console.log('✅ Successfully added salons to database:', data);
  }
}

seed();


