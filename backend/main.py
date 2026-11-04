from fastapi import FastAPI

app = FastAPI()


@app.get("/plan")
def get_plan():
    # TODO: Accept the trip inputs.
    # TODO: Call the gas-stop planner.
    # TODO: Return the plan as JSON.
    pass
