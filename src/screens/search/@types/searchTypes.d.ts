//This code defines the types that are being used inside the search screen.
interface perInfo {
  address: {
    city: string;
    country: string;
    line1: string;
    postal_code: string;
  }
}
interface TSearchCard {
  displayName: string;
  photoURL: string;
  frontImage: string;
  likes: number;
  caption: string;
  numberOfComments: number;
  proPersonalInfo: perInfo;
  days: number;
  isLiked: boolean;
  rating: number;
  price: number;
  location: { city?: string | undefined };
  uid: string;
  profession?: string;
}
interface TSearchCardProps {
  searchedCardObject: TSearchCard;
}

interface AlgoliaResult {
  objectID: string; // Unique identifier for the record
  displayName: string; // Display name of the user or entity
  email: string; // Email address
  first_name: string; // First name of the user
  last_name: string; // Last name of the user
  phone: string; // Phone number
  serverType: string; // Server type (e.g., 'DEVELOPMENT', 'LIVE')
  uid: string; // User ID
  dob?: {
    day: number; // Day of birth
    month: number; // Month of birth
    year: number; // Year of birth
  };
  address?: {
    city: string; // City name
    country: string; // Country code (e.g., 'FR')
    line1: string; // Address line 1
    postal_code: string; // Postal code
  };
  _highlightResult?: {
    displayName?: HighlightResult; // Highlighted match for displayName
    first_name?: HighlightResult; // Highlighted match for first_name
    last_name?: HighlightResult; // Highlighted match for last_name
    email?: HighlightResult; // Highlighted match for email
    phone?: HighlightResult; // Highlighted match for phone
    address?: {
      city?: HighlightResult; // Highlighted match for city
      country?: HighlightResult; // Highlighted match for country
      line1?: HighlightResult; // Highlighted match for line1
      postal_code?: HighlightResult; // Highlighted match for postal_code
    };
  };
}

interface HighlightResult {
  value: string; // Highlighted value with <em> tags
  matchLevel: string; // Level of match (e.g., 'none', 'partial', 'full')
  matchedWords: string[]; // Array of matched words
}
