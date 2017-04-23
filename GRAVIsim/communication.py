import os
import asyncio
import websockets
from datetime import datetime

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
LOGS_DIR = os.path.join(BASE_DIR, 'spark-simulation/logs')

def log(msg):
    now = datetime.now()
    print("[{}] {}".format(now, msg))

async def proxy(websocket, path):
    try:
        filepath = "{}{}.log".format(LOGS_DIR, path)
        log("Access file: " + filepath)
        offset = 0

        while True:
            with open(filepath, 'r') as f:
                f.seek(offset)
                for line in f:
                    offset += len(line)
                    await websocket.send(line)
            await asyncio.sleep(0.1)

    except websockets.exceptions.ConnectionClosed:
        log("Connection Closed")
    finally:
        websocket.close()

start_server = websockets.serve(proxy, '', 8888)


if __name__ == '__main__':
    log('-- Start WebSocket Server --')
    try:
        asyncio.get_event_loop().run_until_complete(start_server)
        asyncio.get_event_loop().run_forever()
    except KeyboardInterrupt:
        asyncio.get_event_loop().close()
