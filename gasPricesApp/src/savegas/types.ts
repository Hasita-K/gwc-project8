export type ScreenName = "home" | "trip" | "results";

export type TripData = {
  start: string;
  destination: string;
  mpg: number;
  tankSize: number;
  fuelLevel: number;
  fuelType: "Regular" | "Premium";
};

export type FuelStop = {
  id: number;
  station: string;
  location: string;
  price: string;
  gallons: string;
  cost: string;
  detour: string;
  tag?: string;
};
