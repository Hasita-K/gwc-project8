// TypeScript translation of the team's Python gas-stop planner (plan_stops).
// Field names match the Python (snake_case) so the output has the same format.
// Fictional example stations; mile markers are measured from Orlando.

export type Station = {
  name: string;
  mile_marker: number;
  price: number;
};

export type Stop = {
  name: string;
  explanation: string;
  mile_marker: number;
  price: number;
  fuel_on_arrival: number;
  fuel_on_departure: number;
  gallons_bought: number;
  fuel_cost: number;
};

export type Plan = {
  stops: Stop[];
  fuel_at_destination: number;
  total_trip_cost: number;
  // TODO (Solar's savings code): fill these in once it is translated
  normal_cost?: number;
  saved?: number;
};

export const TOTAL_MILES = 236;

export const stations: Station[] = [
  { name: "Orlando Fuel Stop", mile_marker: 0, price: 3.29 },
  { name: "Kissimmee Roadside Fuel", mile_marker: 22, price: 3.19 },
  { name: "Yeehaw Junction Gas", mile_marker: 55, price: 3.35 },
  { name: "Fort Drum Travel Stop", mile_marker: 89, price: 3.09 },
  { name: "Okeechobee Turnpike Fuel", mile_marker: 120, price: 3.25 },
  { name: "Port St. Lucie Fuel Plaza", mile_marker: 151, price: 3.39 },
  { name: "West Palm Roadside Gas", mile_marker: 181, price: 3.15 },
  { name: "Boca Crossing Fuel", mile_marker: 207, price: 3.45 },
  { name: "Fort Lauderdale Travel Fuel", mile_marker: 226, price: 3.29 },
  { name: "Miami Arrival Gas", mile_marker: 236, price: 3.59 },
];

// Returns null when there is no safe plan.
export function plan_stops(
  stations: Station[],
  total_miles: number,
  mpg: number,
  tank_gallons: number,
  fuel_now: number
): Plan | null {
  if (!(mpg > 0) || !(tank_gallons > 0)) return null;

  let current_mile = 0;
  const stops: Stop[] = [];
  let total_trip_cost = 0;
  const quarter_tank = tank_gallons * 0.25;

  while (current_mile < total_miles) {
    const distance_to_destination = total_miles - current_mile;
    const fuel_at_destination = fuel_now - distance_to_destination / mpg;
    if (fuel_at_destination >= quarter_tank) {
      return { stops, fuel_at_destination, total_trip_cost };
    }

    const miles_before_reserve = (fuel_now - quarter_tank) * mpg;
    const reachable_stations: Station[] = [];
    for (const station of stations) {
      const distance_to_station = station.mile_marker - current_mile;
      // Mile 0 bug fix: a station right where you are (distance 0) is allowed
      // only for the FIRST stop. After that it must be ahead of you
      // (distance > 0), otherwise it could pick the same station forever.
      const is_first_stop = stops.length === 0;
      const ahead = is_first_stop
        ? distance_to_station >= 0
        : distance_to_station > 0;
      if (ahead && distance_to_station <= miles_before_reserve) {
        if (station.mile_marker <= total_miles) {
          reachable_stations.push(station);
        }
      }
    }
    if (reachable_stations.length === 0) return null;

    // cheapest reachable station (first one wins ties, like Python's min)
    const cheapest_station = reachable_stations.reduce((a, b) =>
      b.price < a.price ? b : a
    );
    const gallons_used = (cheapest_station.mile_marker - current_mile) / mpg;
    const fuel_on_arrival = fuel_now - gallons_used;
    if (fuel_on_arrival < quarter_tank) return null;

    const gallons_bought = tank_gallons - fuel_on_arrival;
    const fuel_cost = gallons_bought * cheapest_station.price;
    const fuel_on_departure = fuel_on_arrival + gallons_bought;
    stops.push({
      name: cheapest_station.name,
      explanation:
        "Cheapest reachable station while keeping the quarter-tank reserve.",
      mile_marker: cheapest_station.mile_marker,
      price: cheapest_station.price,
      fuel_on_arrival,
      fuel_on_departure,
      gallons_bought,
      fuel_cost,
    });
    total_trip_cost += fuel_cost;
    current_mile = cheapest_station.mile_marker;
    fuel_now = tank_gallons;
  }

  return { stops, fuel_at_destination: fuel_now, total_trip_cost };
}
