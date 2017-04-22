from subprocess import Popen, PIPE, CalledProcessError
import os
import asyncio
import websockets

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
LOGS_DIR = os.path.join(BASE_DIR, 'spark-simulation/logs')

async def proxy(websocket, path):
    # name = await websocket.recv()
    # await websocket.send(greeting)
    try:
        file = os.path.join(LOGS_DIR, "default.log")
        with Popen(("tail", "-F", "-n 1000", file), stdout=PIPE, bufsize=1, universal_newlines=True) as log:
            for line in log.stdout:
                await websocket.send(line)

            if log.returncode != 0:
                raise CalledProcessError(log.returncode, log.args)
    except websockets.exceptions.ConnectionClosed:
        print('Connection Closed')
    finally:
        pass

start_server = websockets.serve(proxy, '', 8888)

if __name__ == '__main__':
    print('-- Start WebSocket Server --')
    try:
        asyncio.get_event_loop().run_until_complete(start_server)
        asyncio.get_event_loop().run_forever()
    except KeyboardInterrupt:
        asyncio.get_event_loop().close()
