type PredictionType = {
  description: string;
  place_id: string;
  reference: string;
  matched_substrings: any[];
  structured_formatting: {main_text: string};
  terms: Object[];
  types: string[];
};

interface AddressInfo {
  zip: string | null;
  stateInShort: string | null;
  countryInShort: string | null;
  country: string | null;
  state: string | null;
  city: string | null;
  unit: string | null;
  formattedAddress: string | null;
  longitude: number;
  latitude: number;
  completeAddress: string | null;
  placeTitle: string | null;
}
