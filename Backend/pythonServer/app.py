from fastapi import FastAPI

app = FastAPI()

@app.get("/")
def demo():
    # print("Hello python server")
    return "Hello python server"