// TypeScript port of the team's Python gas-stop planner (plan_stops).
// Same logic, same fictional Orlando -> Miami stations and prices.
// Mile markers are measured from Orlando.

export type Station = {
  name: string;
  mileMarker: number;
  price: number;
};

export const ROUTE_MILES = 236;

export const stations: Station[] = [
  { name: "Orlando Fuel Stop", mileMarker: 0, price: 3.29 },
  { name: "Kissimmee Roadside Fuel", mileMarker: 22, price: 3.19 },
  { name: "Yeehaw Junction Gas", mileMarker: 55, price: 3.35 },
  { name: "Fort Drum Travel Stop", mileMarker: 89, price: 3.09 },
  { name: "Okeechobee Turnpike Fuel", mileMarker: 120, price: 3.25 },
  { name: "Port St. Lucie Fuel Plaza", mileMarker: 151, price: 3.39 },
  { name: "West Palm Roadside Gas", mileMarker: 181, price: 3.15 },
  { name: "Boca Crossing Fuel", mileMarker: 207, price: 3.45 },
  { name: "Fort Lauderdale Travel Fuel", mileMarker: 226, price: 3.29 },
  { name: "Miami Arrival Gas", mileMarker: 236, price: 3.59 },
];

export type PlannedStop = {
  name: string;
  mileMarker: number;
  price: number;
  fuelOnArrival: number;
  fuelOnDeparture: number;
  gallonsBought: number;
  fuelCost: number;
};

export type Plan = {
  stops: PlannedStop[];
  fuelAtDestination: number;
  totalCost: number;
};

// Returns null when there is no safe plan (can't reach a station
// without dipping below the quarter-tank reserve).
export function planStops(
  totalMiles: number,
  mpg: number,
  tankGallons: number,
  fuelNow: number,
  stationList: Station[] = stations
): Plan | null {
  if (!(mpg > 0) || !(tankGallons > 0)) return null;

  let currentMile = 0;
  let fuel = fuelNow;
  const stops: PlannedStop[] = [];
  let totalCost = 0;
  const quarterTank = tankGallons * 0.25;

  while (currentMile < totalMiles) {
    const distanceToDestination = totalMiles - currentMile;
    const fuelAtDestination = fuel - distanceToDestination / mpg;
    if (fuelAtDestination >= quarterTank) {
      return { stops, fuelAtDestination, totalCost };
    }

    const milesBeforeReserve = (fuel - quarterTank) * mpg;
    const reachable = stationList.filter((s) => {
      const d = s.mileMarker - currentMile;
      return d > 0 && d <= milesBeforeReserve && s.mileMarker <= totalMiles;
    });
    if (reachable.length === 0) return null;

    const cheapest = reachable.reduce((a, b) => (b.price < a.price ? b : a));
    const gallonsUsed = (cheapest.mileMarker - currentMile) / mpg;
    const fuelOnArrival = fuel - gallonsUsed;
    if (fuelOnArrival < quarterTank) return null;

    const gallonsBought = tankGallons - fuelOnArrival;
    const fuelCost = gallonsBought * cheapest.price;
    stops.push({
      name: cheapest.name,
      mileMarker: cheapest.mileMarker,
      price: cheapest.price,
      fuelOnArrival,
      fuelOnDeparture: tankGallons,
      gallonsBought,
      fuelCost,
    });
    totalCost += fuelCost;
    currentMile = cheapest.mileMarker;
    fuel = tankGallons;
  }

  return { stops, fuelAtDestination: fuel, totalCost };
}
