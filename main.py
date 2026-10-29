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
    # TODO 1: Translate the first "How it works" step into a small calculation.
    # TODO 2: Translate the second step.
    # TODO 3: Translate the third step.
    # TODO 4: Translate the fourth step.
    # TODO 5: Translate the fifth step.
    # TODO: Decide together what the function should return.
    pass


# TODO: Work through these scenarios after implementing plan_stops.
# The quarter-tank reserve for each case is tank_gallons * 0.25.
test_cases = [
    {"label": "full tank", "fuel_now": 12},
    {"label": "half tank", "fuel_now": 6},
    {"label": "nearly empty", "fuel_now": 3},
]

# Shared example trip inputs for the three scenarios above.
trip = {
    "total_miles": 236,
    "mpg": 30,
    "tank_gallons": 12,
}

# TODO: For each test case, call plan_stops(...) with stations and trip inputs.
# TODO: Check the planned fuel level never drops below trip["tank_gallons"] * 0.25.
