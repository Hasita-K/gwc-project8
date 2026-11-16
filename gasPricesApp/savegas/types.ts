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
  brand: string;
  address: string;
  price: string;
  detour: string;
};
