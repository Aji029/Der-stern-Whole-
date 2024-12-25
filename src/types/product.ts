export interface Product {
  artikelNr: string;
  name: string;
  vkPrice: number;
  ekPrice: number;
  mwst: 'A' | 'B';
  packungArt: string;
  packungInhalt: string;
  herkunftsland: string;
  produktgruppe: string;
  supplierId?: string;
  image?: string | null;
}