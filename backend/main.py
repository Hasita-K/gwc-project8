from fastapi import FastAPI, HTTPException, Query
from main import plan_stops, stations

app = FastAPI()

STATIC_ROUTE = {
    "distance_miles": 236,
    "duration_seconds": 14400,
    "polyline": "k{dmD~juoNjbo@npDfwsBgwzAj}vA_bTowH{s|Af_pBs~x@vwbAzvMz_o@ns@jmeArsI",
    "source": "static_fallback",
    "approximate": True,
}


@app.get("/plan")
def get_plan(
    mpg: float = Query(gt=0),
    tank_gallons: float = Query(gt=0),
    fuel_now: float = Query(ge=0),
):
    if fuel_now > tank_gallons:
        raise HTTPException(
            status_code=422,
            detail="fuel_now cannot exceed tank_gallons",
        )

    route = STATIC_ROUTE
    total_miles = route["distance_miles"]
    result = plan_stops(stations, total_miles, mpg, tank_gallons, fuel_now)
    if result is None:
        raise HTTPException(status_code=422, detail="No safe route found")
    planned_stops, fuel_at_destination, total_trip_cost = result

    return {
        "total_miles": total_miles,
        "mpg": mpg,
        "tank_gallons": tank_gallons,
        "fuel_now": fuel_now,
        "route": route,
        "stops": planned_stops,
        "fuel_at_destination": fuel_at_destination,
        "total_trip_cost": total_trip_cost,
    }
