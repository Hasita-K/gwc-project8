import { useState } from "react"
import HomeScreen from "./screens/HomeScreen"
import ResultsScreen from "./screens/ResultsScreen"
import TripFormScreen from "./screens/TripFormScreen"

export type ScreenName = "home" | "trip" | "results"

export type TripData = {
  start: string
  destination: string
  mpg: number
  tankSize: number
  fuelLevel: number
  fuelType: "Regular" | "Premium"
}

const screenOrder: ScreenName[] = ["home", "trip", "results"]

export default function App() {
  const [screen, setScreen] = useState<ScreenName>("home")
  const [trip, setTrip] = useState<TripData>({
    start: "Orlando, FL",
    destination: "Miami, FL",
    mpg: 28,
    tankSize: 14,
    fuelLevel: 50,
    fuelType: "Regular",
  })

  const activeIndex = screenOrder.indexOf(screen)
  const screenClass = (name: ScreenName) => {
    const position = screenOrder.indexOf(name) - activeIndex
    if (position < 0) return "app-screen screen-left"
    if (position > 0) return "app-screen screen-right"
    return "app-screen screen-active"
  }

  return (
    <main className="app-stage">
      <div className="phone-shell">
        <div className={screenClass("home")} aria-hidden={screen !== "home"}>
          <HomeScreen onNext={() => setScreen("trip")} />
        </div>
        <div className={screenClass("trip")} aria-hidden={screen !== "trip"}>
          <TripFormScreen
            trip={trip}
            onChange={setTrip}
            onBack={() => setScreen("home")}
            onNext={() => setScreen("results")}
          />
        </div>
        <div
          className={screenClass("results")}
          aria-hidden={screen !== "results"}
        >
          <ResultsScreen trip={trip} onBack={() => setScreen("trip")} />
        </div>
      </div>
    </main>
  )
}
