import { useState } from "react";
import { View } from "react-native";
import { StatusBar } from "expo-status-bar";
import HomeScreen from "./screens/HomeScreen";
import TripFormScreen from "./screens/TripFormScreen";
import ResultsScreen from "./screens/ResultsScreen";
import { TOTAL_MILES, plan_stops, stations, type Plan } from "./planner";
import { colors } from "./theme";
import type { ScreenName, TripData } from "./types";

export default function SaveGasApp() {
  const [screen, setScreen] = useState<ScreenName>("home");
  const [trip, setTrip] = useState<TripData>({
    start: "Orlando, FL",
    destination: "Miami, FL",
    mpg: 28,
    tankSize: 14,
    fuelLevel: 50,
    fuelType: "Regular",
  });
  const [plan, setPlan] = useState<Plan | null>(null);

  // runs when the user submits the Trip form
  const submitTrip = () => {
    // fuelLevel is a percentage, so convert it to gallons for the planner
    const fuel_now = (trip.tankSize * trip.fuelLevel) / 100;
    setPlan(plan_stops(stations, TOTAL_MILES, trip.mpg, trip.tankSize, fuel_now));
    setScreen("results");
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.cream }}>
      <StatusBar style="dark" />
      {screen === "home" && <HomeScreen onNext={() => setScreen("trip")} />}
      {screen === "trip" && (
        <TripFormScreen
          trip={trip}
          onChange={setTrip}
          onBack={() => setScreen("home")}
          onNext={submitTrip}
        />
      )}
      {screen === "results" && (
        <ResultsScreen
          trip={trip}
          plan={plan}
          onBack={() => setScreen("trip")}
        />
      )}
    </View>
  );
}
