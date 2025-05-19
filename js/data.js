// Define regions with their emojis and names
const regions = [
  { id: 'asia', name: 'Asia', emoji: '🌏' },
  { id: 'europe', name: 'Europe', emoji: '🏰' },
  { id: 'africa', name: 'Africa', emoji: '🦁' },
  { id: 'north-america', name: 'North America', emoji: '🗽' },
  { id: 'south-america', name: 'South America', emoji: '🏝️' },
  { id: 'oceania', name: 'Oceania', emoji: '🏄' }
];

// Mock destinations data for the Travel Idea Wall application
const destinations = [
  {
        id: "dest-001",
        name: "Paris, France",
        shortDescription: "Iconic art, fashion, and architecture in the City of Lights",
        description: "Experience the romance and elegance of Paris, from the iconic Eiffel Tower to the charming cafés of Montmartre. Explore world-class museums, stroll along the Seine, and indulge in exquisite French cuisine.",
        image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=600&h=400&fit=crop",
        rating: 4.8,
        categories: ["cities", "cultural", "romantic"],
        region: "europe",
        country: "France",
        bestSeason: "Spring, Fall",
        budget: "High",
        coordinates: {
            lat: 48.8566,
            lng: 2.3522
        },
        featured: true,
        trending: false,
        isNew: false,
        tags: ["Eiffel Tower", "Louvre", "Seine River", "Notre Dame", "Fashion"]
    },
    {
        id: "dest-002",
        name: "Bali, Indonesia",
        shortDescription: "Tropical paradise with stunning beaches and spiritual retreats",
        description: "Discover the perfect balance of natural beauty, spiritual depth, and vibrant culture in Bali. From terraced rice fields to volcanic mountains and pristine beaches, Bali offers diverse landscapes alongside warm hospitality.",
        image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=600&h=400&fit=crop",
        rating: 4.7,
        categories: ["beach", "adventure", "cultural"],
        region: "asia",
        country: "Indonesia",
        bestSeason: "April-October",
        budget: "Medium",
        coordinates: {
            lat: -8.4095,
            lng: 115.1889
        },
        featured: false,
        trending: true,
        isNew: false,
        tags: ["Beaches", "Rice Terraces", "Temples", "Surfing", "Yoga"]
    },
    {
        id: "dest-003",
        name: "Tokyo, Japan",
        shortDescription: "Ultramodern cityscape blended with ancient traditions",
        description: "Experience the captivating contrast of ultramodern and traditional in Tokyo. From neon-lit skyscrapers to historic temples, Tokyo offers cutting-edge technology, world-class dining, and deep cultural experiences.",
        image: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=600&h=400&fit=crop",
        rating: 4.9,
        categories: ["cities", "cultural", "food"],
        region: "asia",
        country: "Japan",
        bestSeason: "Spring, Fall",
        budget: "High",
        coordinates: {
            lat: 35.6762,
            lng: 139.6503
        },
        featured: true,
        trending: true,
        isNew: false,
        tags: ["Shibuya", "Cherry Blossoms", "Sushi", "Technology", "Shopping"]
    },
    {
        id: "dest-004",
        name: "Santorini, Greece",
        shortDescription: "Stunning white-washed buildings with breathtaking sea views",
        description: "Marvel at the iconic white-washed buildings with blue domes perched on cliffs overlooking the Aegean Sea. Santorini offers spectacular sunsets, volcanic beaches, ancient ruins, and world-class wineries.",
        image: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=600&h=400&fit=crop",
        rating: 4.8,
        categories: ["beach", "romantic", "cultural"],
        region: "europe",
        country: "Greece",
        bestSeason: "Late Spring, Summer, Early Fall",
        budget: "High",
        coordinates: {
            lat: 36.3932,
            lng: 25.4615
        },
        featured: true,
        trending: false,
        isNew: false,
        tags: ["Caldera", "Sunsets", "Blue Domes", "Wine", "Mediterranean"]
    },
    {
        id: "dest-005",
        name: "New York City, USA",
        shortDescription: "The city that never sleeps with iconic landmarks and vibrant culture",
        description: "Experience the energy of the most iconic metropolis in the world. From the Statue of Liberty to Central Park, Broadway shows to world-class museums, New York offers endless exploration and cultural experiences.",
        image: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=600&h=400&fit=crop",
        rating: 4.7,
        categories: ["cities", "food", "cultural"],
        region: "north-america",
        country: "United States",
        bestSeason: "Spring, Fall",
        budget: "High",
        coordinates: {
            lat: 40.7128,
            lng: -74.0060
        },
        featured: false,
        trending: false,
        isNew: false,
        tags: ["Manhattan", "Central Park", "Broadway", "Statue of Liberty", "Brooklyn"]
    },
    {
        id: "dest-006",
        name: "Machu Picchu, Peru",
        shortDescription: "Ancient Incan citadel set against breathtaking mountain landscapes",
        description: "Discover the mystical ancient city perched high in the Andes mountains. This UNESCO World Heritage site offers awe-inspiring architecture and engineering, surrounded by dramatic mountain vistas and rich biodiversity.",
        image: "https://images.unsplash.com/photo-1587595431973-160d0d94add1?w=600&h=400&fit=crop",
        rating: 4.9,
        categories: ["adventure", "cultural", "nature"],
        region: "south-america",
        country: "Peru",
        bestSeason: "May-September",
        budget: "Medium",
        coordinates: {
            lat: -13.1631,
            lng: -72.5450
        },
        featured: false,
        trending: false,
        isNew: false,
        tags: ["Inca Trail", "Andes", "Archaeology", "Hiking", "UNESCO"]
    },
    {
        id: "dest-007",
        name: "Sydney, Australia",
        shortDescription: "Stunning harbor city with iconic landmarks and beautiful beaches",
        description: "Experience Sydney's perfect blend of urban sophistication and natural beauty. From the iconic Opera House and Harbour Bridge to the golden beaches and national parks, Sydney offers something for every traveler.",
        image: "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=600&h=400&fit=crop",
        rating: 4.7,
        categories: ["cities", "beach", "adventure"],
        region: "oceania",
        country: "Australia",
        bestSeason: "Spring, Fall",
        budget: "High",
        coordinates: {
            lat: -33.8688,
            lng: 151.2093
        },
        featured: false,
        trending: false,
        isNew: false,
        tags: ["Opera House", "Bondi Beach", "Harbour Bridge", "Darling Harbour", "Blue Mountains"]
    },
    {
        id: "dest-008",
        name: "Serengeti National Park, Tanzania",
        shortDescription: "Witness the great migration in one of Africa's most iconic safari destinations",
        description: "Experience the ultimate wildlife adventure in the vast plains of the Serengeti. Home to the annual great migration of wildebeest and zebra, this park offers unparalleled opportunities to observe lions, elephants, giraffes, and countless other species in their natural habitat.",
        image: "https://images.unsplash.com/photo-1516426122078-c23e76319801?w=600&h=400&fit=crop",
        rating: 4.9,
        categories: ["adventure", "nature", "wildlife"],
        region: "africa",
        country: "Tanzania",
        bestSeason: "June-September",
        budget: "High",
        coordinates: {
            lat: -2.3333,
            lng: 34.8333
        },
        featured: false,
        trending: false,
        isNew: true,
        tags: ["Safari", "Great Migration", "Wildlife", "Big Five", "Savanna"]
    },
    {
        id: "dest-009",
        name: "Rio de Janeiro, Brazil",
        shortDescription: "Vibrant city known for beaches, mountains, and cultural festivities",
        description: "Discover the marvelous city where mountains meet the sea. Rio offers iconic beaches like Copacabana and Ipanema, the famous Christ the Redeemer statue, and vibrant culture including samba, bossa nova, and carnival celebrations.",
        image: "https://images.unsplash.com/photo-1483729558449-99ef09a8c325?w=600&h=400&fit=crop",
        rating: 4.6,
        categories: ["beach", "cities", "cultural"],
        region: "south-america",
        country: "Brazil",
        bestSeason: "December-March",
        budget: "Medium",
        coordinates: {
            lat: -22.9068,
            lng: -43.1729
        },
        featured: true,
        trending: false,
        isNew: false,
        tags: ["Christ the Redeemer", "Copacabana", "Carnival", "Sugarloaf Mountain", "Samba"]
    },
    {
        id: "dest-010",
        name: "Kyoto, Japan",
        shortDescription: "Ancient capital preserving Japan's rich cultural heritage",
        description: "Step back in time in Japan's ancient imperial capital. With over 1,600 Buddhist temples, 400 Shinto shrines, and 17 UNESCO World Heritage sites, Kyoto offers traditional gardens, geisha districts, and seasonal natural beauty.",
        image: "https://images.unsplash.com/photo-1504196606672-aef5c9cefc92?w=600&h=400&fit=crop",
        rating: 4.8,
        categories: ["cultural", "nature", "spiritual"],
        region: "asia",
        country: "Japan",
        bestSeason: "Spring, Fall",
        budget: "Medium",
        coordinates: {
            lat: 35.0116,
            lng: 135.7681
        },
        featured: false,
        trending: true,
        isNew: false,
        tags: ["Temples", "Geisha", "Cherry Blossoms", "Gardens", "Traditional Japan"]
    },
    {
        id: "dest-011",
        name: "Barcelona, Spain",
        shortDescription: "Vibrant city famous for Gaudí architecture and Mediterranean beaches",
        description: "Experience the unique blend of architectural wonders, Mediterranean beaches, and Catalan culture. Barcelona offers Gaudí masterpieces like Sagrada Família, a vibrant food scene, and a perfect balance between urban exploration and seaside relaxation.",
        image: "https://images.unsplash.com/photo-1583422409516-2895a77efded?w=600&h=400&fit=crop",
        rating: 4.7,
        categories: ["cities", "beach", "cultural"],
        region: "europe",
        country: "Spain",
        bestSeason: "Spring, Fall",
        budget: "Medium",
        coordinates: {
            lat: 41.3851,
            lng: 2.1734
        },
        featured: false,
        trending: true,
        isNew: false,
        tags: ["Sagrada Família", "La Rambla", "Gothic Quarter", "Tapas", "Mediterranean"]
    },
    {
        id: "dest-012",
        name: "Maldives",
        shortDescription: "Paradise of overwater bungalows and crystal-clear turquoise waters",
        description: "Escape to the ultimate tropical paradise featuring pristine white-sand beaches, crystal-clear waters, and vibrant coral reefs. The Maldives offers luxurious overwater bungalows, world-class diving, and unparalleled relaxation in a stunning island setting.",
        image: "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=600&h=400&fit=crop",
        rating: 4.9,
        categories: ["beach", "romantic", "luxury"],
        region: "asia",
        country: "Maldives",
        bestSeason: "November-April",
        budget: "Very High",
        coordinates: {
            lat: 3.2028,
            lng: 73.2207
        },
        featured: true,
        trending: true,
        isNew: false,
        tags: ["Overwater Bungalows", "Snorkeling", "Coral Reefs", "Island Hopping", "Luxury Resorts"]
    }
];

// Mock checklist items data
const checklistItems = [
    {
        id: "item-001",
        name: "Passport",
        category: "essential",
        checked: true
    },
    {
        id: "item-002",
        name: "Travel Insurance",
        category: "essential",
        checked: true
    },
    {
        id: "item-003",
        name: "Flight Tickets",
        category: "essential",
        checked: true
    },
    {
        id: "item-004",
        name: "Hotel Reservations",
        category: "essential",
        checked: true
    },
    {
        id: "item-005",
        name: "Credit/Debit Cards",
        category: "essential",
        checked: false
    },
    {
        id: "item-006",
        name: "Local Currency",
        category: "essential",
        checked: false
    },
    {
        id: "item-007",
        name: "Phone & Charger",
        category: "electronics",
        checked: false
    },
    {
        id: "item-008",
        name: "Camera",
        category: "electronics",
        checked: false
    },
    {
        id: "item-009",
        name: "Power Adapter",
        category: "electronics",
        checked: false
    },
    {
        id: "item-010",
        name: "Headphones",
        category: "electronics",
        checked: false
    },
    {
        id: "item-011",
        name: "T-shirts",
        category: "clothing",
        checked: false
    },
    {
        id: "item-012",
        name: "Pants/Shorts",
        category: "clothing",
        checked: false
    },
    {
        id: "item-013",
        name: "Underwear",
        category: "clothing",
        checked: false
    },
    {
        id: "item-014",
        name: "Socks",
        category: "clothing",
        checked: false
    },
    {
        id: "item-015",
        name: "Jacket/Sweater",
        category: "clothing",
        checked: false
    },
    {
        id: "item-016",
        name: "Swimwear",
        category: "clothing",
        checked: false
    },
    {
        id: "item-017",
        name: "Comfortable Shoes",
        category: "clothing",
        checked: false
    },
    {
        id: "item-018",
        name: "Formal Outfit",
        category: "clothing",
        checked: false
    },
    {
        id: "item-019",
        name: "Toothbrush & Toothpaste",
        category: "toiletries",
        checked: false
    },
    {
        id: "item-020",
        name: "Shampoo & Conditioner",
        category: "toiletries",
        checked: false
    },
    {
        id: "item-021",
        name: "Soap/Body Wash",
        category: "toiletries",
        checked: false
    },
    {
        id: "item-022",
        name: "Deodorant",
        category: "toiletries",
        checked: false
    },
    {
        id: "item-023",
        name: "Sunscreen",
        category: "toiletries",
        checked: false
    },
    {
        id: "item-024",
        name: "First Aid Kit",
        category: "toiletries",
        checked: false
    },
    {
        id: "item-025",
        name: "Prescription Medications",
        category: "toiletries",
        checked: false
    },
    {
        id: "item-026",
        name: "Driver's License",
        category: "documents",
        checked: false
    },
    {
        id: "item-027",
        name: "Travel Visas",
        category: "documents",
        checked: false
    },
    {
        id: "item-028",
        name: "Vaccination Records",
        category: "documents",
        checked: false
    },
    {
        id: "item-029",
        name: "Travel Itinerary",
        category: "documents",
        checked: false
    },
    {
        id: "item-030",
        name: "Emergency Contacts",
        category: "documents",
        checked: false
    }
];

// Mock currency exchange rates (against USD)
const currencyRates = {
    USD: 1,
    EUR: 0.92,
    GBP: 0.78,
    JPY: 149.50,
    AUD: 1.51,
    CAD: 1.36,
    CHF: 0.89,
    CNY: 7.24,
    HKD: 7.82,
    NZD: 1.63,
    SEK: 10.47,
    NOK: 10.54,
    DKK: 6.87,
    SGD: 1.34,
    THB: 35.65,
    MXN: 17.05,
    BRL: 5.08,
    INR: 83.12
};

// Mock trip plans
const tripPlans = {
    departureDate: "2025-06-01T08:00:00",
    returnDate: "2025-06-14T18:00:00",
    destination: "dest-003", // Tokyo
    days: [
        {
            day: 1,
            date: "2025-06-01",
            events: [
                {
                    id: "event-001",
                    time: "10:00",
                    title: "Arrival at Narita Airport",
                    description: "Flight JL123 arrives at Terminal 2",
                    location: "Narita International Airport",
                    duration: 60
                },
                {
                    id: "event-002",
                    time: "13:00",
                    title: "Hotel Check-in",
                    description: "Check in at Hotel Gracery Shinjuku",
                    location: "Shinjuku, Tokyo",
                    duration: 60
                },
                {
                    id: "event-003",
                    time: "15:00",
                    title: "Explore Shinjuku",
                    description: "Walk around Shinjuku area, visit Shinjuku Gyoen if time permits",
                    location: "Shinjuku, Tokyo",
                    duration: 180
                },
                {
                    id: "event-004",
                    time: "19:00",
                    title: "Dinner at Ichiran Ramen",
                    description: "Experience the famous tonkotsu ramen",
                    location: "Shinjuku, Tokyo",
                    duration: 90
                }
            ]
        },
        {
            day: 2,
            date: "2025-06-02",
            events: [
                {
                    id: "event-005",
                    time: "09:00",
                    title: "Visit Meiji Shrine",
                    description: "Experience traditional Tokyo at this beautiful Shinto shrine",
                    location: "Shibuya, Tokyo",
                    duration: 120
                },
                {
                    id: "event-006",
                    time: "12:00",
                    title: "Lunch at Harajuku",
                    description: "Try some trendy food at Takeshita Street",
                    location: "Harajuku, Tokyo",
                    duration: 90
                },
                {
                    id: "event-007",
                    time: "14:00",
                    title: "Shopping at Omotesando",
                    description: "Explore the high-end shops and unique architecture",
                    location: "Omotesando, Tokyo",
                    duration: 180
                },
                {
                    id: "event-008",
                    time: "18:00",
                    title: "Shibuya Crossing & Dinner",
                    description: "Experience the famous crossing and find dinner in the area",
                    location: "Shibuya, Tokyo",
                    duration: 180
                }
            ]
        },
        {
            day: 3,
            date: "2025-06-03",
            events: [
                {
                    id: "event-009",
                    time: "08:00",
                    title: "Tsukiji Outer Market",
                    description: "Explore the food stalls and have a sushi breakfast",
                    location: "Tsukiji, Tokyo",
                    duration: 150
                },
                {
                    id: "event-010",
                    time: "11:00",
                    title: "Tokyo Imperial Palace",
                    description: "Walk around the palace gardens",
                    location: "Chiyoda, Tokyo",
                    duration: 120
                },
                {
                    id: "event-011",
                    time: "14:00",
                    title: "Asakusa & Senso-ji Temple",
                    description: "Visit Tokyo's oldest temple and shop on Nakamise Street",
                    location: "Asakusa, Tokyo",
                    duration: 180
                },
                {
                    id: "event-012",
                    time: "17:30",
                    title: "Tokyo Skytree",
                    description: "Sunset views from Japan's tallest structure",
                    location: "Sumida, Tokyo",
                    duration: 120
                },
                {
                    id: "event-013",
                    time: "20:00",
                    title: "Dinner in Asakusa",
                    description: "Traditional Japanese cuisine",
                    location: "Asakusa, Tokyo",
                    duration: 90
                }
            ]
        },
        {
            day: 4,
            date: "2025-06-04",
            events: []
        }
    ]
};

// Mock gallery items (sample photos)
const galleryItems = [
    {
        id: "photo-001",
        destination: "dest-001", // Paris
        title: "Eiffel Tower at Sunset",
        description: "The iconic Eiffel Tower glowing with golden light at sunset",
        image: "https://images.unsplash.com/photo-1543349689-9a4d426bee8e?w=600&h=400&fit=crop",
        date: "2024-03-15",
        isFavorite: true
    },
    {
        id: "photo-002",
        destination: "dest-002", // Bali
        title: "Rice Terraces in Tegallalang",
        description: "Beautiful green rice paddies in Ubud",
        image: "https://images.unsplash.com/photo-1604999333679-b86d54738315?w=600&h=400&fit=crop",
        date: "2024-02-22",
        isFavorite: false
    },
    {
        id: "photo-003",
        destination: "dest-003", // Tokyo
        title: "Shibuya Crossing",
        description: "The famous pedestrian crossing in Tokyo",
        image: "https://images.unsplash.com/photo-1542051841857-5f90071e7989?w=600&h=400&fit=crop",
        date: "2024-01-10",
        isFavorite: true
    },
    {
        id: "photo-004",
        destination: "dest-004", // Santorini
        title: "Santorini Caldera View",
        description: "Stunning white buildings against the blue Aegean Sea",
        image: "https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?w=600&h=400&fit=crop",
        date: "2023-08-05",
        isFavorite: true
    },
    {
        id: "photo-005",
        destination: "dest-005", // New York
        title: "Central Park in Fall",
        description: "Beautiful autumn colors in the heart of Manhattan",
        image: "https://images.unsplash.com/photo-1571160258893-fd5a1f2c29e8?w=600&h=400&fit=crop",
        date: "2023-10-18",
        isFavorite: false
    },
    {
        id: "photo-006",
        destination: "dest-006", // Machu Picchu
        title: "Machu Picchu at Dawn",
        description: "The ancient Incan citadel emerging from morning mist",
        image: "https://images.unsplash.com/photo-1526392060635-9d6019884377?w=600&h=400&fit=crop",
        date: "2023-07-22",
        isFavorite: true
    },
    {
        id: "photo-007",
        destination: "dest-007", // Sydney
        title: "Sydney Opera House",
        description: "Iconic view of the Sydney Opera House and Harbour Bridge",
        image: "https://images.unsplash.com/photo-1528072164453-f4e8ef0d475a?w=600&h=400&fit=crop",
        date: "2023-04-11",
        isFavorite: false
    },
    {
        id: "photo-008",
        destination: "dest-008", // Serengeti
        title: "Serengeti Sunset with Acacia",
        description: "Classic African landscape with a lone acacia tree",
        image: "https://images.unsplash.com/photo-1547970827-8ec97c46a66f?w=600&h=400&fit=crop",
        date: "2023-06-08",
        isFavorite: true
    }
];

// Export the data for use in other modules
export { 
  destinations, 
  regions, 
  checklistItems, 
  tripPlans, 
  currencyRates, 
  galleryItems 
};