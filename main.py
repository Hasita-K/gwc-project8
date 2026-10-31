"""A small, offline gas-stop planner for an Orlando-to-Miami trip."""

# Fictional example stations; mile markers are measured from Orlando.
# Prices are made up and are only here for practicing the calculator.
stations = [
    {"name": "Orlando Fuel Stop", "mile_marker": 0, "price": 3.29},
    {"name": "Kissimmee Roadside Fuel", "mile_marker": 22, "price": 3.19},
    {"name": "Yeehaw Junction Gas", "mile_marker": 55, "price": 3.35},
    {"name": "Fort Drum Travel Stop", "mile_marker": 89, "price": 3.09},
    {"name": "Okeechobee Turnpike Fuel", "mile_marker": 120, "price": 3.25},
    {"name": "Port St. Lucie Fuel Plaza", "mile_marker": 151, "price": 3.39},
    {"name": "West Palm Roadside Gas", "mile_marker": 181, "price": 3.15},
    {"name": "Boca Crossing Fuel", "mile_marker": 207, "price": 3.45},
    {"name": "Fort Lauderdale Travel Fuel", "mile_marker": 226, "price": 3.29},
    {"name": "Miami Arrival Gas", "mile_marker": 236, "price": 3.59},
]


def plan_stops(stations, total_miles, mpg, tank_gallons, fuel_now):
    """Plan fuel stops; fill in the five steps from the project's "How it works"."""
    quarter_tank = tank_gallons * 0.25
    fuel_at_destination = fuel_now - total_miles / mpg
    if fuel_at_destination >= quarter_tank:
        return None, fuel_at_destination

    usable_fuel = fuel_now - quarter_tank
    miles_before_reserve = usable_fuel * mpg
    reachable_stations = []
    for station in stations:
        if station["mile_marker"] <= miles_before_reserve:
            reachable_stations.append(station)
    if not reachable_stations:
        return None
    cheapest_station = min(reachable_stations, key=lambda station: station["price"])
    miles_to_destination = total_miles - cheapest_station["mile_marker"]
    miles_after_fill = (tank_gallons - quarter_tank) * mpg
    gallons_used = cheapest_station["mile_marker"] / mpg
    fuel_on_arrival = fuel_now - gallons_used
    if quarter_tank > fuel_on_arrival:
        return None
    if miles_to_destination <= miles_after_fill:
        return cheapest_station, fuel_on_arrival
    return None


# TODO: Work through these scenarios after implementing plan_stops.
# The quarter-tank reserve for each case is tank_gallons * 0.25.
test_cases = [
    {"label": "full tank", "fuel_now": 12},
    {"label": "half tank", "fuel_now": 6},
    {"label": "nearly empty", "fuel_now": 3},
    {"label": "below reserve", "fuel_now": 2},
]

# Shared example trip inputs for the three scenarios above.
trip = {
    "total_miles": 236,
    "mpg": 30,
    "tank_gallons": 12,
}

# TODO: For each test case, call plan_stops(...) with stations and trip inputs.
for case in test_cases:
    result = plan_stops(
        stations,
        trip["total_miles"],
        trip["mpg"],
        trip["tank_gallons"],
        case["fuel_now"],
    )
    if result is None:
        print(case["label"], "-> no safe one-stop route found")
        continue

    station, fuel_remaining = result
    if station is None:
        print(case["label"], "-> no stop needed; fuel at destination:", fuel_remaining)
        assert fuel_remaining >= trip["tank_gallons"] * 0.25
        continue

    print(case["label"], "->", station, fuel_remaining)
    assert fuel_remaining >= trip["tank_gallons"] * 0.25
