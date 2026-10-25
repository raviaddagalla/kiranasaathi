// ==========================================
// Seed Data for KiranaSaathi Demo
// ==========================================
import type { Product, Store, InventoryEntry, DemandEvent } from '../types';

// ==========================================
// PRODUCT CATALOGUE
// ==========================================
export const SEED_PRODUCTS: Product[] = [
  {
    id: 'prod-001',
    name: 'Heritage Toned Milk',
    brand: 'Heritage',
    variant: 'Toned',
    packageSize: '500 ml',
    category: 'Milk & Dairy',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDpqPwaW4hYXjzfBZ1vX2H1YZhP44ZOUY7S4rmCdiWEsDRGD65dp3ggAZsWAJ-NOZQyID7OXB9jjvpWpvq4R2L1kCtN0xQfyhbjhSek6MJ7M82H_y0fEaSMFIWIiyqfD1Hrp-qMv395U5dujA88As8aQilgN1w-Z7aCMmpe9yRoPYnYcEwh16qLCH5ACy9kz8t_Uvp8BJJf6EoSz73fTTiA80j4LFP2hv19UX2kKsHH',
    description: 'Fresh pasteurized toned milk pouch',
    mrp: 27,
    aliases: ['heritage milk', 'toned milk', 'heritage toned', 'heritage doodh'],
  },
  {
    id: 'prod-002',
    name: 'Amul Taaza Homogenised Milk',
    brand: 'Amul',
    variant: 'Taaza Homogenised',
    packageSize: '500 ml',
    category: 'Milk & Dairy',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDU2wYCbGzocJ86RCeVSWGKnAarf5XVQyW38bmEe8AtzE8YHogVFJKWhVOG7l9XJfbbMWCL0O-6t-Il66tjMYtgm3sMtbG3HySDwdO84s0GNxwUIx9Yf_sBXBfQKDXNZzj0MnFWUIl9D0A1jaZbXrUJoCOg84xaz2W8iaRHoSbLGib83lq7W8J_VybwjDdCPNfO4x7oTycy0b0IcG5XxcQJKNXg9Q2W4RZ0R_tt040W',
    description: 'Fresh cow & buffalo pasteurized milk',
    mrp: 28,
    aliases: ['amul milk', 'amul taaza', 'taaza milk', 'amul doodh'],
  },
  {
    id: 'prod-003',
    name: 'Britannia White Bread',
    brand: 'Britannia',
    variant: 'White',
    packageSize: '400 g',
    category: 'Bread & Bakery',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBe4xNfZgVvRNaB4gL7BH0o1kDwlEiCPa3ihAuehdPEz5SqHfM-B8pltLWmAM780v7ekN5WRgu-aT5YDN6dOJhSTpYHC-c3KSMtewdaCvzjxOOOVbDmqTXKlA73KxZXoOk6vCUPR9iLFpuf-N0Vn9qdP8g7cbnBj1LSMnq5yiDf8YrBSKkK_Gyoatc2PokVl4U2rug_C8JhMjkJPAPPPvLKSmjCQDq6YPMW4moPl2l3',
    description: 'Soft white sandwich bread loaf',
    mrp: 40,
    aliases: ['britannia bread', 'white bread', 'britannia white'],
  },
  {
    id: 'prod-004',
    name: 'Britannia 100% Whole Wheat Bread',
    brand: 'Britannia',
    variant: 'Whole Wheat',
    packageSize: '400 g',
    category: 'Bread & Bakery',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDcXR8vv13kFmmFq4HCeYMwhIbrcFDvaoGdSup5xQJz4eG8lsSdR9Yno-hwNDcW7R3xj6_qEAtNRZ4_i-0n6uZcrfz2BycucK1XzPMEP2KpkBmGomr_yfu4fCZkpLWneltzxtcLlFnykviER2OYB9VmThQ73iJuAfDGGfuRZQ2EBz4atAp7jaJOY02XnenYCHCnDV3SW4E75oV_RW58r0y4QqkaSBF8CXKo7PjUndON',
    description: 'Zero maida, soft fiber sandwich loaf',
    mrp: 45,
    aliases: ['wheat bread', 'whole wheat bread', 'britannia wheat', 'brown bread', 'atta bread'],
  },
  {
    id: 'prod-005',
    name: 'Modern White Bread',
    brand: 'Modern',
    variant: 'White',
    packageSize: '400 g',
    category: 'Bread & Bakery',
    image: '',
    description: 'Classic soft white bread',
    mrp: 38,
    aliases: ['modern bread', 'modern white'],
  },
  {
    id: 'prod-006',
    name: 'Aashirvaad Shudh Chakki Atta',
    brand: 'Aashirvaad',
    variant: 'Shudh Chakki',
    packageSize: '5 kg',
    category: 'Rice & Flour',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBBpS93dw_FSFfn3BrTbXftG13IF8BoVKBGOnt04TFiva4BheaBhg4I0-wZpNQSRcGXO2gK9Yte1VH8Qey6bP5ScCNCA4duHv9jHM4N2t4qSgohhKj5IP1SlVGV36l4G53YTG11fqKqcn2kX7Rzzfgh9HecHnUqTsUlOhIfvNxoNqgwNjn_mYNuMnq1CIsSWJDub7KGct-Sg76fls1PJgtLXd3Xqatg7eqQG4wNUcm_',
    description: 'Premium quality whole wheat flour',
    mrp: 295,
    aliases: ['aashirvaad atta', 'chakki atta', 'atta 5kg', 'wheat flour'],
  },
  {
    id: 'prod-007',
    name: 'Parle-G Biscuits',
    brand: 'Parle',
    variant: 'G Original',
    packageSize: '250 g',
    category: 'Snacks & Biscuits',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAlJ391aLMhK0iSOeiFMaW2Q29BLlqK-7Q96eL_0mGe9olVjvRexy2Gzc8ePlMGeHR-wQjvcBnVrNtpWAW8oiRrZw27mKABBngoIuGzOefx_uFxGxp5XXAcq3BvhbXWFoaKdhRDd0vtCHKazwaJhzm7Glq541Co7oYmSmvOc-nH1-KOwqBsXeKcZZGfwDFrbY383_OqROvO_gy9VQ2ebAfV3S_N_9ftlcnLu8TSIPml',
    description: 'Original glucose biscuits',
    mrp: 20,
    aliases: ['parle g', 'parle biscuit', 'glucose biscuit', 'parle-g'],
  },
  {
    id: 'prod-008',
    name: 'Tata Salt',
    brand: 'Tata',
    variant: 'Vacuum Evaporated Iodised',
    packageSize: '1 kg',
    category: 'Cooking Essentials',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDM8kh_0GERntntiRNF6jwiubSAKptZCqp-uFPFuwiXU1eE-TjGjqYok8jRxdNkweMHT_v1OjHLMXJAe8ev5aoLkqRblkWPbLKRcXbIYylgLnBXkKgWIrIAb0WdFBAnXFlf8mSRsxd4_-7ls16TpAfR4wk-GaE50mSvX4xlbRjM14OYMMpvmGh12RVEtOrvb7_UwfCpidgQwOwf_cJ-j72EYDLqpABoL3KwoSX3W5yu',
    description: 'Desh ka Namak, vacuum iodised purity',
    mrp: 28,
    aliases: ['tata salt', 'tata namak', 'iodised salt', 'namak'],
  },
  {
    id: 'prod-009',
    name: 'Amul Butter',
    brand: 'Amul',
    variant: 'Pasteurised',
    packageSize: '100 g',
    category: 'Milk & Dairy',
    image: '',
    description: 'Delicious table butter',
    mrp: 56,
    aliases: ['amul butter', 'butter', 'amul makkhan'],
  },
  {
    id: 'prod-010',
    name: 'Tata Tea Gold',
    brand: 'Tata',
    variant: 'Gold',
    packageSize: '250 g',
    category: 'Beverages',
    image: '',
    description: 'Premium leaf tea with 15% long leaves',
    mrp: 125,
    aliases: ['tata tea', 'tata gold', 'tata tea gold', 'chai patti'],
  },
  {
    id: 'prod-011',
    name: 'Amul Lactose-Free Fresh Milk',
    brand: 'Amul',
    variant: 'Lactose-Free',
    packageSize: '1 L',
    category: 'Milk & Dairy',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBLWEDydzdcmdH4n1fSIQuIONxylux9acoxFnu2ds0u-BkFim__iYBI7KBcqIHMtqieCfHlKoczdviuM8IZEVf0jSItPsvclIwNtsxFIZhBsq8fG3bQmNsai5oS_qyti3vy8EAlJhwv1Oegdk9P3Q8-1N7Hzf4Cd3HBK5mMTPHFCaJBfDy_SLMDGQ2tzEgsWMUZgukGLP4CKNcgA9vRCUPMVAf2X3GM_wPytAkahPyA',
    description: 'Lactose free milk in Tetra Pak',
    mrp: 65,
    aliases: ['lactose free milk', 'amul lactose free'],
  },
  {
    id: 'prod-012',
    name: 'India Gate Basmati Rice',
    brand: 'India Gate',
    variant: 'Classic',
    packageSize: '5 kg',
    category: 'Rice & Flour',
    image: '',
    description: 'Premium basmati rice',
    mrp: 450,
    aliases: ['basmati rice', 'india gate rice', 'chawal'],
  },
];

// ==========================================
// STORE CATALOGUE
// ==========================================
export const SEED_STORES: Store[] = [
  {
    id: 'store-001',
    name: 'Sri Lakshmi Kirana & General Stores',
    address: 'Shop No. 4, Road No. 10, Banjara Hills',
    locality: 'Banjara Hills',
    latitude: 17.4156,
    longitude: 78.4347,
    operatingHours: '7:00 AM - 10:00 PM',
    phone: '+91 98765 43210',
    ownerName: 'Ramesh Kumar',
    verified: true,
  },
  {
    id: 'store-002',
    name: 'Sai General Stores',
    address: 'Plot 12, Anand Nagar Colony',
    locality: 'Banjara Hills',
    latitude: 17.4180,
    longitude: 78.4390,
    operatingHours: '6:30 AM - 9:30 PM',
    phone: '+91 98765 43211',
    ownerName: 'Suresh Reddy',
    verified: true,
  },
  {
    id: 'store-003',
    name: 'Venkateshwara Stores',
    address: '15/A, Mithila Nagar',
    locality: 'Banjara Hills',
    latitude: 17.4200,
    longitude: 78.4420,
    operatingHours: '7:00 AM - 10:30 PM',
    phone: '+91 98765 43212',
    ownerName: 'Venkat Rao',
    verified: true,
  },
  {
    id: 'store-004',
    name: 'Lakshmi Narasimha General Store',
    address: '22, Road No. 5, Jubilee Hills',
    locality: 'Jubilee Hills',
    latitude: 17.4240,
    longitude: 78.4100,
    operatingHours: '6:00 AM - 10:00 PM',
    phone: '+91 98765 43213',
    ownerName: 'Narasimha Murthy',
    verified: false,
  },
  {
    id: 'store-005',
    name: 'Balaji Kirana & General Stores',
    address: '8, Hilltop Colony, Road No. 14',
    locality: 'Banjara Hills',
    latitude: 17.4110,
    longitude: 78.4500,
    operatingHours: '7:30 AM - 9:00 PM',
    phone: '+91 98765 43214',
    ownerName: 'Balaji Prasad',
    verified: true,
  },
];

// ==========================================
// SEED INVENTORY (store-001: Sri Lakshmi)
// ==========================================
function hoursAgo(h: number): string {
  return new Date(Date.now() - h * 60 * 60 * 1000).toISOString();
}
function minutesAgo(m: number): string {
  return new Date(Date.now() - m * 60 * 1000).toISOString();
}

export const SEED_INVENTORY: InventoryEntry[] = [
  // Store 1: Sri Lakshmi Kirana
  { id: 'inv-001', storeId: 'store-001', productId: 'prod-002', quantity: 25, unit: 'pouch', minimumStock: 10, listedPrice: 27, availabilityStatus: 'in_stock', updatedAt: minutesAgo(8) },
  { id: 'inv-002', storeId: 'store-001', productId: 'prod-004', quantity: 8, unit: 'pack', minimumStock: 5, listedPrice: 45, availabilityStatus: 'in_stock', updatedAt: minutesAgo(12) },
  { id: 'inv-003', storeId: 'store-001', productId: 'prod-007', quantity: 30, unit: 'pack', minimumStock: 10, listedPrice: 20, availabilityStatus: 'in_stock', updatedAt: minutesAgo(15) },
  { id: 'inv-004', storeId: 'store-001', productId: 'prod-008', quantity: 15, unit: 'pack', minimumStock: 10, listedPrice: 28, availabilityStatus: 'in_stock', updatedAt: minutesAgo(2) },
  { id: 'inv-005', storeId: 'store-001', productId: 'prod-006', quantity: 4, unit: 'pack', minimumStock: 3, listedPrice: 290, availabilityStatus: 'in_stock', updatedAt: minutesAgo(30) },
  { id: 'inv-006', storeId: 'store-001', productId: 'prod-003', quantity: 3, unit: 'pack', minimumStock: 8, listedPrice: 40, availabilityStatus: 'low_stock', updatedAt: minutesAgo(22) },
  { id: 'inv-007', storeId: 'store-001', productId: 'prod-010', quantity: 7, unit: 'pack', minimumStock: 5, listedPrice: 122, availabilityStatus: 'in_stock', updatedAt: hoursAgo(1) },
  { id: 'inv-008', storeId: 'store-001', productId: 'prod-009', quantity: 2, unit: 'pack', minimumStock: 5, listedPrice: 56, availabilityStatus: 'low_stock', updatedAt: hoursAgo(2) },

  // Store 2: Sai General
  { id: 'inv-020', storeId: 'store-002', productId: 'prod-002', quantity: 15, unit: 'pouch', minimumStock: 8, listedPrice: 28, availabilityStatus: 'in_stock', updatedAt: minutesAgo(35) },
  { id: 'inv-021', storeId: 'store-002', productId: 'prod-004', quantity: 2, unit: 'pack', minimumStock: 5, listedPrice: 45, availabilityStatus: 'low_stock', updatedAt: minutesAgo(35) },
  { id: 'inv-022', storeId: 'store-002', productId: 'prod-008', quantity: 20, unit: 'pack', minimumStock: 10, listedPrice: 28, availabilityStatus: 'in_stock', updatedAt: minutesAgo(20) },
  { id: 'inv-023', storeId: 'store-002', productId: 'prod-006', quantity: 6, unit: 'pack', minimumStock: 3, listedPrice: 295, availabilityStatus: 'in_stock', updatedAt: hoursAgo(1) },
  { id: 'inv-024', storeId: 'store-002', productId: 'prod-001', quantity: 10, unit: 'pouch', minimumStock: 5, listedPrice: 27, availabilityStatus: 'in_stock', updatedAt: minutesAgo(10) },

  // Store 3: Venkateshwara
  { id: 'inv-030', storeId: 'store-003', productId: 'prod-004', quantity: 0, unit: 'pack', minimumStock: 5, listedPrice: 44, availabilityStatus: 'out_of_stock', updatedAt: hoursAgo(18) },
  { id: 'inv-031', storeId: 'store-003', productId: 'prod-007', quantity: 50, unit: 'pack', minimumStock: 15, listedPrice: 20, availabilityStatus: 'in_stock', updatedAt: minutesAgo(45) },
  { id: 'inv-032', storeId: 'store-003', productId: 'prod-008', quantity: 10, unit: 'pack', minimumStock: 5, listedPrice: 28, availabilityStatus: 'in_stock', updatedAt: hoursAgo(3) },
  { id: 'inv-033', storeId: 'store-003', productId: 'prod-003', quantity: 12, unit: 'pack', minimumStock: 5, listedPrice: 40, availabilityStatus: 'in_stock', updatedAt: minutesAgo(50) },

  // Store 4: Lakshmi Narasimha
  { id: 'inv-040', storeId: 'store-004', productId: 'prod-001', quantity: 5, unit: 'pouch', minimumStock: 8, listedPrice: 27, availabilityStatus: 'low_stock', updatedAt: hoursAgo(4) },
  { id: 'inv-041', storeId: 'store-004', productId: 'prod-002', quantity: 20, unit: 'pouch', minimumStock: 10, listedPrice: 28, availabilityStatus: 'in_stock', updatedAt: hoursAgo(2) },
  { id: 'inv-042', storeId: 'store-004', productId: 'prod-006', quantity: 0, unit: 'pack', minimumStock: 3, listedPrice: 295, availabilityStatus: 'out_of_stock', updatedAt: hoursAgo(24) },
  { id: 'inv-043', storeId: 'store-004', productId: 'prod-012', quantity: 3, unit: 'pack', minimumStock: 2, listedPrice: 445, availabilityStatus: 'in_stock', updatedAt: hoursAgo(6) },

  // Store 5: Balaji Kirana
  { id: 'inv-050', storeId: 'store-005', productId: 'prod-003', quantity: 0, unit: 'pack', minimumStock: 5, listedPrice: 40, availabilityStatus: 'out_of_stock', updatedAt: hoursAgo(2) },
  { id: 'inv-051', storeId: 'store-005', productId: 'prod-008', quantity: 4, unit: 'pack', minimumStock: 10, listedPrice: 28, availabilityStatus: 'low_stock', updatedAt: minutesAgo(15) },
  { id: 'inv-052', storeId: 'store-005', productId: 'prod-010', quantity: 12, unit: 'pack', minimumStock: 5, listedPrice: 125, availabilityStatus: 'in_stock', updatedAt: hoursAgo(1) },
  { id: 'inv-053', storeId: 'store-005', productId: 'prod-007', quantity: 18, unit: 'pack', minimumStock: 8, listedPrice: 20, availabilityStatus: 'in_stock', updatedAt: minutesAgo(40) },
];

// ==========================================
// SEED DEMAND EVENTS (for demo)
// ==========================================
function daysAgo(d: number, hourOffset = 8): string {
  const date = new Date();
  date.setDate(date.getDate() - d);
  date.setHours(hourOffset, Math.floor(Math.random() * 60), 0, 0);
  return date.toISOString();
}

export const SEED_DEMAND_EVENTS: DemandEvent[] = [
  // Heritage Toned Milk - Recurring demand across 3 days
  { id: 'dem-001', productId: 'prod-001', localityId: 'banjara-hills', eventType: 'not_listed', occurredAt: daysAgo(0, 7), deduplicationKey: 'anon-user-1-prod-001-day0' },
  { id: 'dem-002', productId: 'prod-001', localityId: 'banjara-hills', eventType: 'not_listed', occurredAt: daysAgo(0, 8), deduplicationKey: 'anon-user-2-prod-001-day0' },
  { id: 'dem-003', productId: 'prod-001', localityId: 'banjara-hills', eventType: 'not_listed', occurredAt: daysAgo(0, 9), deduplicationKey: 'anon-user-3-prod-001-day0' },
  { id: 'dem-004', productId: 'prod-001', localityId: 'banjara-hills', eventType: 'not_listed', occurredAt: daysAgo(0, 10), deduplicationKey: 'anon-user-4-prod-001-day0' },
  { id: 'dem-005', productId: 'prod-001', localityId: 'banjara-hills', eventType: 'not_listed', occurredAt: daysAgo(0, 18), deduplicationKey: 'anon-user-5-prod-001-day0' },
  { id: 'dem-006', productId: 'prod-001', localityId: 'banjara-hills', eventType: 'not_listed', occurredAt: daysAgo(0, 19), deduplicationKey: 'anon-user-6-prod-001-day0' },
  { id: 'dem-007', productId: 'prod-001', localityId: 'banjara-hills', eventType: 'not_listed', occurredAt: daysAgo(0, 20), deduplicationKey: 'anon-user-7-prod-001-day0' },
  { id: 'dem-008', productId: 'prod-001', localityId: 'banjara-hills', eventType: 'not_listed', occurredAt: daysAgo(1, 7), deduplicationKey: 'anon-user-1-prod-001-day1' },
  { id: 'dem-009', productId: 'prod-001', localityId: 'banjara-hills', eventType: 'not_listed', occurredAt: daysAgo(1, 8), deduplicationKey: 'anon-user-2-prod-001-day1' },
  { id: 'dem-010', productId: 'prod-001', localityId: 'banjara-hills', eventType: 'not_listed', occurredAt: daysAgo(1, 9), deduplicationKey: 'anon-user-3-prod-001-day1' },
  { id: 'dem-011', productId: 'prod-001', localityId: 'banjara-hills', eventType: 'not_listed', occurredAt: daysAgo(1, 18), deduplicationKey: 'anon-user-4-prod-001-day1' },
  { id: 'dem-012', productId: 'prod-001', localityId: 'banjara-hills', eventType: 'not_listed', occurredAt: daysAgo(1, 19), deduplicationKey: 'anon-user-5-prod-001-day1' },
  { id: 'dem-013', productId: 'prod-001', localityId: 'banjara-hills', eventType: 'not_listed', occurredAt: daysAgo(1, 20), deduplicationKey: 'anon-user-6-prod-001-day1' },
  { id: 'dem-014', productId: 'prod-001', localityId: 'banjara-hills', eventType: 'not_listed', occurredAt: daysAgo(2, 7), deduplicationKey: 'anon-user-1-prod-001-day2' },
  { id: 'dem-015', productId: 'prod-001', localityId: 'banjara-hills', eventType: 'not_listed', occurredAt: daysAgo(2, 8), deduplicationKey: 'anon-user-2-prod-001-day2' },
  { id: 'dem-016', productId: 'prod-001', localityId: 'banjara-hills', eventType: 'not_listed', occurredAt: daysAgo(2, 9), deduplicationKey: 'anon-user-3-prod-001-day2' },
  { id: 'dem-017', productId: 'prod-001', localityId: 'banjara-hills', eventType: 'not_listed', occurredAt: daysAgo(2, 18), deduplicationKey: 'anon-user-4-prod-001-day2' },
  { id: 'dem-018', productId: 'prod-001', localityId: 'banjara-hills', eventType: 'not_listed', occurredAt: daysAgo(2, 19), deduplicationKey: 'anon-user-5-prod-001-day2' },
  { id: 'dem-019', productId: 'prod-001', localityId: 'banjara-hills', eventType: 'not_listed', occurredAt: daysAgo(2, 20), deduplicationKey: 'anon-user-6-prod-001-day2' },

  // Amul Lactose-Free - Emerging demand
  { id: 'dem-030', productId: 'prod-011', localityId: 'banjara-hills', eventType: 'not_listed', occurredAt: daysAgo(0, 8), deduplicationKey: 'anon-user-1-prod-011-day0' },
  { id: 'dem-031', productId: 'prod-011', localityId: 'banjara-hills', eventType: 'not_listed', occurredAt: daysAgo(0, 10), deduplicationKey: 'anon-user-2-prod-011-day0' },
  { id: 'dem-032', productId: 'prod-011', localityId: 'banjara-hills', eventType: 'not_listed', occurredAt: daysAgo(0, 14), deduplicationKey: 'anon-user-3-prod-011-day0' },
  { id: 'dem-033', productId: 'prod-011', localityId: 'banjara-hills', eventType: 'not_listed', occurredAt: daysAgo(1, 9), deduplicationKey: 'anon-user-1-prod-011-day1' },
  { id: 'dem-034', productId: 'prod-011', localityId: 'banjara-hills', eventType: 'not_listed', occurredAt: daysAgo(1, 16), deduplicationKey: 'anon-user-2-prod-011-day1' },

  // Britannia Whole Wheat Bread - Stocked but ran out (out_of_stock type)
  { id: 'dem-040', productId: 'prod-004', localityId: 'banjara-hills', eventType: 'out_of_stock', occurredAt: daysAgo(0, 17), deduplicationKey: 'anon-user-1-prod-004-day0' },
  { id: 'dem-041', productId: 'prod-004', localityId: 'banjara-hills', eventType: 'out_of_stock', occurredAt: daysAgo(0, 18), deduplicationKey: 'anon-user-2-prod-004-day0' },
  { id: 'dem-042', productId: 'prod-004', localityId: 'banjara-hills', eventType: 'out_of_stock', occurredAt: daysAgo(0, 19), deduplicationKey: 'anon-user-3-prod-004-day0' },
  { id: 'dem-043', productId: 'prod-004', localityId: 'banjara-hills', eventType: 'out_of_stock', occurredAt: daysAgo(0, 20), deduplicationKey: 'anon-user-4-prod-004-day0' },
  { id: 'dem-044', productId: 'prod-004', localityId: 'banjara-hills', eventType: 'out_of_stock', occurredAt: daysAgo(1, 18), deduplicationKey: 'anon-user-1-prod-004-day1' },
  { id: 'dem-045', productId: 'prod-004', localityId: 'banjara-hills', eventType: 'out_of_stock', occurredAt: daysAgo(1, 19), deduplicationKey: 'anon-user-2-prod-004-day1' },
  { id: 'dem-046', productId: 'prod-004', localityId: 'banjara-hills', eventType: 'out_of_stock', occurredAt: daysAgo(1, 20), deduplicationKey: 'anon-user-3-prod-004-day1' },

  // India Gate Rice - insufficient demand
  { id: 'dem-050', productId: 'prod-012', localityId: 'banjara-hills', eventType: 'not_listed', occurredAt: daysAgo(0, 15), deduplicationKey: 'anon-user-1-prod-012-day0' },
  { id: 'dem-051', productId: 'prod-012', localityId: 'banjara-hills', eventType: 'not_listed', occurredAt: daysAgo(2, 12), deduplicationKey: 'anon-user-1-prod-012-day2' },
];

// Categories for the grid
export const CATEGORIES = [
  { name: 'Milk & Dairy', icon: 'local_drink', color: 'primary-fixed', textColor: 'on-primary-fixed' },
  { name: 'Bread & Bakery', icon: 'bakery_dining', color: 'tertiary-fixed', textColor: 'on-tertiary-fixed' },
  { name: 'Snacks & Biscuits', icon: 'cookie', color: 'secondary-fixed', textColor: 'on-secondary-fixed' },
  { name: 'Rice & Flour', icon: 'grain', color: 'surface-container-high', textColor: 'on-surface' },
  { name: 'Cooking Essentials', icon: 'cooking', color: 'secondary-container', textColor: 'on-secondary-container' },
  { name: 'Spices & Masala', icon: 'spa', color: 'tertiary-fixed-dim', textColor: 'on-tertiary-fixed' },
  { name: 'Beverages', icon: 'emoji_food_beverage', color: 'primary-fixed-dim', textColor: 'on-primary-fixed' },
  { name: 'Personal Care', icon: 'soap', color: 'surface-container-high', textColor: 'on-surface' },
  { name: 'Household', icon: 'clean_hands', color: 'secondary-fixed', textColor: 'on-secondary-fixed' },
];
