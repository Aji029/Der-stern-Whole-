export const vatRates = [
  { value: 'A', label: 'A (7%)', rate: 7 },
  { value: 'B', label: 'B (19%)', rate: 19 },
];

export const countries = [
  'Germany',
  'France',
  'Italy',
  'Spain',
  'Netherlands',
  'Belgium',
  'Austria',
  'Switzerland',
];

export const productGroups = [
  { id: '101', name: 'Backwaren' },
  { id: '102', name: 'Getränke' },
  { id: '103', name: 'Konserven' },
  { id: '104', name: 'Süßwaren' },
  { id: '105', name: 'Tiefkühlkost' },
];

export const INITIAL_PRODUCT_DATA = {
  artikelNr: '',
  name: '',
  vkPrice: '',
  ekPrice: '',
  mwst: 'A',
  packungArt: 'Gebinde',
  packungInhalt: '',
  herkunftsland: 'Germany',
  produktgruppe: '101',
  supplierId: '',
  image: null as File | null,
  imagePreview: '',
};