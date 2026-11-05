from fastapi import FastAPI, HTTPException
from main import plan_stops, stations

app = FastAPI()


@app.get("/plan")
def get_plan(
    total_miles: float,
    mpg: float,
    tank_gallons: float,
    fuel_now: float,
):
    result = plan_stops(stations, total_miles, mpg, tank_gallons, fuel_now)
    if result is None:
        raise HTTPException(status_code=422, detail="No safe route found")
    return result
