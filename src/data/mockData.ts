export interface Service {
  id: string;
  name: string;
  price: number;
  durationMinutes: number;
}

export interface Stylist {
  id: string;
  name: string;
  isAvailable: boolean;
}

export type BookingStatus = 'booked' | 'in_progress' | 'completed' | 'cancelled' | 'no_show';

export interface Booking {
  id: string;
  customerName: string;
  customerPhone: string;
  serviceIds: string[];
  stylistId: string;
  startTime: string; 
  endTime: string;
  status: BookingStatus;
  isAppBooking: boolean;
}

export interface Salon {
  id: string;
  name: string;
  address: string;
  status: 'active' | 'trial' | 'expired';
  subscriptionEnd: string;
}

export const MOCK_SERVICES: Service[] = [
  { id: 's1', name: 'Premium Haircut', price: 400, durationMinutes: 30 },
  { id: 's2', name: 'Beard Trim & Styling', price: 200, durationMinutes: 15 },
  { id: 's3', name: 'Hair Wash', price: 150, durationMinutes: 15 },
  { id: 's4', name: 'Hair Color', price: 800, durationMinutes: 45 },
];

export const MOCK_STYLISTS: Stylist[] = [
  { id: 'chair1', name: 'Rahul (Chair 1)', isAvailable: true },
  { id: 'chair2', name: 'Amit (Chair 2)', isAvailable: false },
  { id: 'chair3', name: 'Vikram (Chair 3)', isAvailable: true },
];

// Helper to get relative times
const now = new Date();
const addMinutes = (date: Date, mins: number) => new Date(date.getTime() + mins * 60000).toISOString();

export const MOCK_BOOKINGS: Booking[] = [
  {
    id: 'b1',
    customerName: 'Aman Singh',
    customerPhone: '9876543210',
    serviceIds: ['s1'],
    stylistId: 'chair2',
    startTime: addMinutes(now, -10),
    endTime: addMinutes(now, 20),
    status: 'in_progress',
    isAppBooking: true,
  },
  {
    id: 'b2',
    customerName: 'Karan Mehra',
    customerPhone: '8765432109',
    serviceIds: ['s1', 's2'],
    stylistId: 'chair1',
    startTime: addMinutes(now, 15),
    endTime: addMinutes(now, 60),
    status: 'booked',
    isAppBooking: true,
  },
  {
    id: 'b3',
    customerName: 'Walk-in Customer',
    customerPhone: '',
    serviceIds: ['s2'],
    stylistId: 'chair1',
    startTime: addMinutes(now, 60),
    endTime: addMinutes(now, 75),
    status: 'booked',
    isAppBooking: false,
  },
  {
    id: 'b4',
    customerName: 'Rohan Desai',
    customerPhone: '7654321098',
    serviceIds: ['s1'],
    stylistId: 'chair2',
    startTime: addMinutes(now, -40),
    endTime: addMinutes(now, -10),
    status: 'completed',
    isAppBooking: true,
  }
];

export const MOCK_SALONS: Salon[] = [
  {
    id: 'salon1',
    name: 'Fade & Shave Studio',
    address: 'Koramangala, Bangalore',
    status: 'active',
    subscriptionEnd: addMinutes(now, 60 * 24 * 30), // 30 days
  },
  {
    id: 'salon2',
    name: 'The Grooming Lounge',
    address: 'Indiranagar, Bangalore',
    status: 'trial',
    subscriptionEnd: addMinutes(now, 60 * 24 * 5), // 5 days
  },
  {
    id: 'salon3',
    name: 'Classic Cuts',
    address: 'HSR Layout, Bangalore',
    status: 'expired',
    subscriptionEnd: addMinutes(now, -60 * 24 * 2), // 2 days ago
  }
];
