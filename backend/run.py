"""Start the API with reload. Excludes seed_data.py so editing it doesn't restart the server."""
import uvicorn

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        reload_excludes=["seed_data.py"],
    )
