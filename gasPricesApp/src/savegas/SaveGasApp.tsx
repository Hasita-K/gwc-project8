import { useState } from "react";
import { View } from "react-native";
import { StatusBar } from "expo-status-bar";
import HomeScreen from "./screens/HomeScreen";
import TripFormScreen from "./screens/TripFormScreen";
import ResultsScreen from "./screens/ResultsScreen";
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

  return (
    <View style={{ flex: 1, backgroundColor: colors.cream }}>
      <StatusBar style="dark" />
      {screen === "home" && <HomeScreen onNext={() => setScreen("trip")} />}
      {screen === "trip" && (
        <TripFormScreen
          trip={trip}
          onChange={setTrip}
          onBack={() => setScreen("home")}
          onNext={() => setScreen("results")}
        />
      )}
      {screen === "results" && (
        <ResultsScreen trip={trip} onBack={() => setScreen("trip")} />
      )}
    </View>
  );
}
