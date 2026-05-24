// Priamo menu data
export const PRIAMO = {
  name: 'Priamo',
  tagline: 'Pizzería · Hamburguesería · San Jacinto',
  phone: '987 654 321',
  yape: '987 654 321',
  address: 'Jr. Bolognesi 245',
  rating: 4.8,
  reviews: 312,
  eta: '25–35 min',
  fee: 2.0,
  hours: '12:00 PM – 11:00 PM',
  openTime: 12,
  lastOrderTime: 22.75,
  closeTime: 23,
};

export const SUPPORT_PHONE = '51999999999';

// Haversine distance in km between two lat/lng points
function haversineKm(lat1, lng1, lat2, lng2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// San Jacinto center and coverage radius
export const COVERAGE_CENTER = { lat: -9.1547, lng: -78.5042 };
export const COVERAGE_RADIUS_KM = 3;

// Convert pixel position (in MapView 400x220 space) to approximate lat/lng
export function pixelToLatLng(pinPos) {
  const { lat, lng } = COVERAGE_CENTER;
  const pxPerDegree = 400 / 0.04;
  const dLng = (pinPos.x - 200) / pxPerDegree;
  const dLat = -(pinPos.y - 110) / pxPerDegree;
  return { lat: lat + dLat, lng: lng + dLng };
}

// Check if a pin position is within coverage zone
export function isWithinCoverage(pinPos) {
  const point = pixelToLatLng(pinPos);
  const dist = haversineKm(COVERAGE_CENTER.lat, COVERAGE_CENTER.lng, point.lat, point.lng);
  return { within: dist <= COVERAGE_RADIUS_KM, distanceKm: dist };
}

export function isRestaurantOpen(restaurant) {
  const now = new Date();
  const hours = now.getHours();
  const minutes = now.getMinutes();
  const currentTime = hours + minutes / 60;

  if (currentTime < restaurant.openTime) {
    return { isOpen: false, message: `${restaurant.name} abre hoy a las 12:00 PM` };
  }
  if (currentTime >= restaurant.lastOrderTime) {
    return { isOpen: false, message: `Ya no aceptamos pedidos por hoy. Volvemos mañana a las 12:00 PM` };
  }
  return { isOpen: true, message: '' };
}

export const TINDIVO = {
  city: 'San Jacinto, Áncash',
  zone: 'Centro · Cerca al parque · Calles principales',
};

export const RESTAURANTS = [
  {
    id: 'priamo',
    name: 'Priamo',
    tagline: 'Pizzas & hamburguesas',
    rating: 4.8,
    reviews: 312,
    eta: '~23 min',
    fee: 2.0,
    hue: 22,
    status: 'open',
    badge: 'Más pedido',
    blurb: 'Masa madre 24h · carne madurada',
    photo: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=500&q=80&auto=format&fit=crop',
  },
  {
    id: 'la-nonna',
    name: 'La Nonna',
    tagline: 'Pastas frescas italianas',
    rating: 4.6,
    reviews: 128,
    eta: '~30 min',
    fee: 2.0,
    hue: 8,
    status: 'soon',
    blurb: 'Próximamente en Tindivo',
    photo: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=500&q=80&auto=format&fit=crop',
  },
  {
    id: 'la-florencia',
    name: 'La Florencia',
    tagline: 'Comida criolla & menú del día',
    rating: 4.4,
    reviews: 64,
    eta: '~25 min',
    fee: 2.0,
    hue: 45,
    status: 'soon',
    blurb: 'Próximamente en Tindivo',
    photo: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=500&q=80&auto=format&fit=crop',
  },
];

export const SEED_ADDRESSES = [
  {
    id: 'addr-1',
    label: 'Casa',
    line: 'Jr. Sucre 412',
    reference: 'Casa color blanco con reja negra, 2do piso. Tocar timbre 2 veces.',
    pinPos: { x: 170, y: 90 },
    isDefault: true,
  },
  {
    id: 'addr-2',
    label: 'Trabajo',
    line: 'Av. Industrial 88',
    reference: 'Almacén con portón azul, preguntar por Lucía en recepción.',
    pinPos: { x: 240, y: 130 },
    isDefault: false,
  },
];

export const SEED_USER = {
  signedIn: false,
  name: '',
  email: '',
  phone: '',
  addresses: [],
};

export const PAST_ORDERS = [
  { id: 'TND-48201', date: 'Hace 3 días', items: 'Pizza Margarita + Inca Kola', total: 46, status: 'Entregado',
    repeatItems: [
      { productId: 'pz-margarita', name: 'Margarita', qty: 1, unitPrice: 36, hue: 8, modifiers: [{ group: 'Tamaño', name: 'Familiar', price: 8 }, { group: 'Tipo de masa', name: 'Tradicional', price: 0 }], note: null },
      { productId: 'dr-inca', name: 'Inca Kola 500ml', qty: 2, unitPrice: 5, hue: 55, modifiers: [], note: null },
    ],
  },
  { id: 'TND-47102', date: 'La semana pasada', items: 'BBQ Bacon + Papas', total: 33, status: 'Entregado',
    repeatItems: [
      { productId: 'bg-bbq', name: 'BBQ Bacon', qty: 1, unitPrice: 29, hue: 18, modifiers: [{ group: 'Acompañamiento', name: 'Papas rústicas', price: 0 }], note: null },
      { productId: 'dr-coca', name: 'Coca-Cola 500ml', qty: 1, unitPrice: 5, hue: 12, modifiers: [], note: null },
    ],
  },
  { id: 'TND-45990', date: 'Hace 2 semanas', items: 'Priamo Especial Familiar', total: 49, status: 'Entregado',
    repeatItems: [
      { productId: 'pz-priamo', name: 'Priamo Especial', qty: 1, unitPrice: 39, hue: 32, modifiers: [{ group: 'Tamaño', name: 'Familiar', price: 8 }], note: null },
      { productId: 'dr-chicha', name: 'Chicha Morada 1L', qty: 1, unitPrice: 9, hue: 290, modifiers: [], note: null },
    ],
  },
];

export const MENU = [
  {
    id: 'pizzas',
    name: 'Pizzas',
    blurb: 'Masa madre, 24h de fermentación',
    items: [
      {
        id: 'pz-margarita',
        name: 'Margarita',
        desc: 'Salsa de tomate San Marzano, mozzarella fior di latte, albahaca, aceite de oliva.',
        price: 28,
        tag: 'Más pedida',
        hue: 8,
      },
      {
        id: 'pz-pepperoni',
        name: 'Pepperoni',
        desc: 'Pepperoni picante, mozzarella, salsa de tomate, orégano peruano.',
        price: 34,
        hue: 14,
      },
      {
        id: 'pz-priamo',
        name: 'Priamo Especial',
        desc: 'Lomo saltado, cebolla morada, ají amarillo, queso de paria.',
        price: 39,
        tag: 'Edición Perú',
        hue: 32,
      },
      {
        id: 'pz-cuatro',
        name: 'Cuatro Quesos',
        desc: 'Mozzarella, paria, parmesano, gorgonzola, miel de abeja.',
        price: 36,
        hue: 48,
      },
    ],
  },
  {
    id: 'burgers',
    name: 'Hamburguesas',
    blurb: 'Carne madurada 21 días, pan brioche',
    items: [
      {
        id: 'bg-clasica',
        name: 'Clásica Priamo',
        desc: 'Smashed beef 180g, cheddar fundido, lechuga, tomate, salsa de la casa.',
        price: 24,
        hue: 22,
      },
      {
        id: 'bg-bbq',
        name: 'BBQ Bacon',
        desc: 'Doble carne, tocino crocante, aros de cebolla, salsa BBQ de chicha.',
        price: 29,
        tag: 'Nueva',
        hue: 18,
      },
      {
        id: 'bg-pollo',
        name: 'Pollo Crocante',
        desc: 'Pechuga crocante, ají amarillo, lechuga romana, mayonesa de huacatay.',
        price: 22,
        hue: 38,
      },
    ],
  },
  {
    id: 'drinks',
    name: 'Bebidas',
    blurb: 'Bien frías, listas en 5 min',
    items: [
      {
        id: 'dr-inca',
        name: 'Inca Kola 500ml',
        desc: 'El sabor del Perú, bien helada.',
        price: 5,
        hue: 55,
        compact: true,
      },
      {
        id: 'dr-chicha',
        name: 'Chicha Morada 1L',
        desc: 'Hecha en casa, sin azúcar añadida.',
        price: 9,
        hue: 290,
        compact: true,
      },
      {
        id: 'dr-coca',
        name: 'Coca-Cola 500ml',
        desc: 'Clásica, bien fría.',
        price: 5,
        hue: 12,
        compact: true,
      },
      {
        id: 'dr-agua',
        name: 'Agua San Mateo',
        desc: 'Sin gas, 625ml.',
        price: 4,
        hue: 200,
        compact: true,
      },
    ],
  },
];

// Modifier groups per category
export const MODIFIERS = {
  pizzas: [
    {
      id: 'size',
      name: 'Tamaño',
      sub: 'Elige una opción',
      type: 'single',
      required: true,
      options: [
        { id: 'personal', name: 'Personal', desc: '6 porciones · 25cm', price: 0 },
        { id: 'familiar', name: 'Familiar', desc: '8 porciones · 33cm', price: 8 },
        { id: 'jumbo', name: 'Jumbo', desc: '12 porciones · 40cm', price: 16 },
      ],
    },
    {
      id: 'masa',
      name: 'Tipo de masa',
      sub: 'Elige una opción',
      type: 'single',
      required: true,
      options: [
        { id: 'tradicional', name: 'Tradicional', price: 0 },
        { id: 'delgada', name: 'Masa delgada', price: 0 },
        { id: 'integral', name: 'Integral', price: 3 },
      ],
    },
    {
      id: 'extras',
      name: 'Extras',
      sub: 'Hasta 3 toppings',
      type: 'multi',
      max: 3,
      options: [
        { id: 'queso-extra', name: 'Doble mozzarella', price: 4 },
        { id: 'champinones', name: 'Champiñones', price: 3 },
        { id: 'aceitunas', name: 'Aceitunas negras', price: 2 },
        { id: 'cebolla', name: 'Cebolla morada', price: 2 },
        { id: 'aji', name: 'Ají amarillo', price: 2 },
        { id: 'rucula', name: 'Rúcula fresca', price: 3 },
      ],
    },
  ],
  burgers: [
    {
      id: 'cocido',
      name: 'Término de cocción',
      sub: 'Elige una opción',
      type: 'single',
      required: true,
      options: [
        { id: 'medio', name: 'Medio', desc: 'Rosado al centro', price: 0 },
        { id: 'tres-cuartos', name: 'Tres cuartos', desc: 'Ligeramente rosado', price: 0 },
        { id: 'bien', name: 'Bien cocido', price: 0 },
      ],
    },
    {
      id: 'acompanamiento',
      name: 'Acompañamiento',
      sub: 'Elige una opción',
      type: 'single',
      required: true,
      options: [
        { id: 'papas', name: 'Papas rústicas', price: 0 },
        { id: 'papas-camote', name: 'Papas de camote', price: 3 },
        { id: 'ensalada', name: 'Ensalada verde', price: 0 },
        { id: 'aros', name: 'Aros de cebolla', price: 4 },
      ],
    },
    {
      id: 'extras-bg',
      name: 'Extras',
      sub: 'Hasta 3 adicionales',
      type: 'multi',
      max: 3,
      options: [
        { id: 'tocino', name: 'Tocino extra', price: 4 },
        { id: 'queso', name: 'Queso cheddar', price: 3 },
        { id: 'huevo', name: 'Huevo frito', price: 3 },
        { id: 'palta', name: 'Palta', price: 4 },
        { id: 'jalapenos', name: 'Jalapeños', price: 2 },
      ],
    },
    {
      id: 'salsa',
      name: 'Salsa adicional',
      sub: 'Opcional',
      type: 'multi',
      max: 2,
      options: [
        { id: 'huacatay', name: 'Mayo de huacatay', price: 0 },
        { id: 'aji-amarillo', name: 'Crema de ají', price: 0 },
        { id: 'bbq', name: 'BBQ casera', price: 0 },
        { id: 'rocoto', name: 'Rocoto picante', price: 0 },
      ],
    },
  ],
  drinks: [],
};
