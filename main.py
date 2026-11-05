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
    current_mile = 0
    stops = []
    quarter_tank = tank_gallons * 0.25

    while current_mile < total_miles:
        distance_to_destination = total_miles - current_mile
        fuel_at_destination = fuel_now - distance_to_destination / mpg
        if fuel_at_destination >= quarter_tank:
            return stops, fuel_at_destination

        miles_before_reserve = (fuel_now - quarter_tank) * mpg
        reachable_stations = []
        for station in stations:
            distance_to_station = station["mile_marker"] - current_mile
            if 0 < distance_to_station <= miles_before_reserve:
                if station["mile_marker"] <= total_miles:
                    reachable_stations.append(station)
        if not reachable_stations:
            return None

        cheapest_station = min(reachable_stations, key=lambda station: station["price"])
        gallons_used = (cheapest_station["mile_marker"] - current_mile) / mpg
        fuel_on_arrival = fuel_now - gallons_used
        if fuel_on_arrival < quarter_tank:
            return None

        stops.append(cheapest_station)
        current_mile = cheapest_station["mile_marker"]
        fuel_now = tank_gallons

    return stops, fuel_now

if __name__ == "__main__":
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
            print(case["label"], "-> no safe route found")
            continue

        planned_stops, fuel_remaining = result
        print(case["label"], "-> stops:", planned_stops, "fuel at destination:", fuel_remaining)
        assert fuel_remaining >= trip["tank_gallons"] * 0.25

    multi_stop_test = plan_stops(
        stations,
        total_miles=236,
        mpg=20,
        tank_gallons=6,
        fuel_now=6,
    )
    print("multi-stop test ->", multi_stop_test)
    assert multi_stop_test is not None
    multi_stop_stops, multi_stop_fuel = multi_stop_test
    assert multi_stop_fuel >= 6 * 0.25

    max_leg_miles = (6 - 6 * 0.25) * 20
    route_markers = [0]
    for stop in multi_stop_stops:
        route_markers.append(stop["mile_marker"])
    route_markers.append(236)

    for index in range(len(route_markers) - 1):
        leg_miles = route_markers[index + 1] - route_markers[index]
        assert 0 < leg_miles <= max_leg_miles
