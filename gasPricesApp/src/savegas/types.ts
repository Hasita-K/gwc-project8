export type ScreenName = "home" | "trip" | "results";

export type TripData = {
  start: string;
  destination: string;
  mpg: number;
  tankSize: number;
  fuelLevel: number;
  fuelType: "Regular" | "Premium";
};

export type PlanStop = {
  id: number;
  name: string;
  mile_marker: number;
  price: number;
  gallons: number;
  cost: number;
  arrive_fuel_pct: number;
  leave_fuel_pct: number;
  reason: string;
};

export type Plan = {
  total_miles: number;
  drive_minutes: number;
  start_fuel_pct: number;
  arrive_fuel_pct: number;
  total_cost: number;
  normal_cost: number;
  saved: number;
  stops: PlanStop[];
};
