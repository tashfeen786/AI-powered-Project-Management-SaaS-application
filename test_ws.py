import asyncio
import websockets
import json

async def test_ws():
    # Attempting to connect without a token to see if it responds with 403
    uri = "ws://localhost:8000/api/v1/ws/organization?token=dummy"
    try:
        async with websockets.connect(uri) as websocket:
            print("Connected!")
            await websocket.send(json.dumps({"event": "ping"}))
            response = await websocket.recv()
            print(f"Received: {response}")
    except Exception as e:
        print(f"Connection failed: {e}")

asyncio.run(test_ws())
