// You can include shared interfaces/types in a separate file
// and then use them in any component by importing them. For
// example, to import the interface below do:
//
// import { User } from 'path/to/interfaces';

export type Data = {
  services: Array<Service>
}

export type Service = {
  enabled: boolean
  name: string
  maxSlots: number
  imagePath: string
  tiers: Tiers
}

export type Tiers = {
  "1mo"?: Tier
  "2mo"?: Tier
  "4mo"?: Tier
  "6mo"?: Tier
  "12mo"?: Tier
}
export type Tier = {
  "priceId": string
  "price": number
}