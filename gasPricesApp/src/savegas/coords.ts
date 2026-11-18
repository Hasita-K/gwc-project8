// Approximate map coordinates for the demo route (Orlando to Miami).
// Keys are the station mile markers from calc.ts (Orlando = 0, Miami = 236).
export type Point = { latitude: number; longitude: number };

export const START: Point = { latitude: 28.5383, longitude: -81.3792 }; // Orlando
export const END: Point = { latitude: 25.7617, longitude: -80.1918 }; // Miami

export const STATION_COORDS: Record<number, Point> = {
  0: { latitude: 28.48, longitude: -81.46 }, // Orlando Fuel Stop
  22: { latitude: 28.3, longitude: -81.43 }, // Kissimmee Roadside Fuel
  55: { latitude: 27.71, longitude: -80.91 }, // Yeehaw Junction Gas
  89: { latitude: 27.55, longitude: -80.8 }, // Fort Drum Travel Stop
  120: { latitude: 27.47, longitude: -80.6 }, // Okeechobee Turnpike Fuel
  151: { latitude: 27.3, longitude: -80.4 }, // Port St. Lucie Fuel Plaza
  181: { latitude: 26.71, longitude: -80.12 }, // West Palm Roadside Gas
  207: { latitude: 26.37, longitude: -80.17 }, // Boca Crossing Fuel
  226: { latitude: 26.16, longitude: -80.2 }, // Fort Lauderdale Travel Fuel
  236: { latitude: 25.85, longitude: -80.31 }, // Miami Arrival Gas
};
