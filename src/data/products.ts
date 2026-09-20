import type { Product } from '../types';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    name: 'Quantum ANC Studio Headphones',
    price: 299,
    description: 'Spatial audio with active hybrid noise cancellation and 40-hour ultra-low latency playback.',
    category: 'Audio',
    imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80',
    rating: 4.9,
    stock: 12,
  },
  {
    id: 'prod-2',
    name: 'Mechanical Cyberdeck Keyboard',
    price: 185,
    description: 'Custom gasket-mounted hot-swappable switches with south-facing RGB and rotary encoder knob.',
    category: 'Peripherals',
    imageUrl: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&auto=format&fit=crop&q=80',
    rating: 4.8,
    stock: 8,
  },
  {
    id: 'prod-3',
    name: 'Ergonomic Precision Mouse',
    price: 89,
    description: 'Flawless 26K DPI optical sensor, ultra-lightweight magnesium alloy shell with wireless charging.',
    category: 'Peripherals',
    imageUrl: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=600&auto=format&fit=crop&q=80',
    rating: 4.7,
    stock: 25,
  },
  {
    id: 'prod-4',
    name: '4K OLED Ultrawide Monitor 34"',
    price: 849,
    description: '0.03ms response time, 175Hz refresh rate with 99.3% DCI-P3 cinematic color accuracy.',
    category: 'Displays',
    imageUrl: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=600&auto=format&fit=crop&q=80',
    rating: 4.9,
    stock: 4,
  },
  {
    id: 'prod-5',
    name: 'MagCharge 3-in-1 Wireless Dock',
    price: 120,
    description: 'Solid aluminum charging stand for phone, earbuds, and smartwatch with intelligent thermals.',
    category: 'Accessories',
    imageUrl: 'https://images.unsplash.com/photo-1622445262464-84b1456045b6?w=600&auto=format&fit=crop&q=80',
    rating: 4.6,
    stock: 30,
  },
  {
    id: 'prod-6',
    name: 'Hi-Fi Desktop DAC & Amplifier',
    price: 340,
    description: 'Dual ESS Sabre DAC chips with balanced 4.4mm output and crystal-clear acoustic resolution.',
    category: 'Audio',
    imageUrl: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=600&auto=format&fit=crop&q=80',
    rating: 4.8,
    stock: 7,
  }
];

export const MOCK_USERS = [
  { id: 'usr-1', name: 'Sophia Chen', email: 'sophia.chen@techpreneur.io', role: 'Staff Engineer' },
  { id: 'usr-2', name: 'Marcus Vance', email: 'marcus.v@devops.org', role: 'Solutions Architect' },
  { id: 'usr-3', name: 'Elena Rostova', email: 'elena.r@designsystem.co', role: 'Lead UI/UX' },
  { id: 'usr-4', name: 'Jordan Rivera', email: 'jordan@cloudnative.dev', role: 'Fullstack Dev' },
];
