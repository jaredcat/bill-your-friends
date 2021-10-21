// You can include shared interfaces/types in a separate file
// and then use them in any component by importing them. For
// example, to import the interface below do:
//
// import { User } from 'path/to/interfaces';

export type Theme = {
  backgroundColor?: string;
  fontColor?: string;
};

export type Data = {
  services: Array<Service>;
};

export type Service = {
  enabled: boolean;
  name: string;
  slug: string;
  color?: string;
  maxSlots: number;
  imagePath: string;
  tiers: Tiers;
  updateTheme?: Function;
};

export type Tiers = {
  [key: string]: Tier;
};

export type Tier = {
  priceId: string;
  price: number;
};
