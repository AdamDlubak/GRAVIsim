from subprocess import Popen, PIPE, CalledProcessError
import os
import asyncio
import websockets

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

async def proxy(websocket, path):
    # name = await websocket.recv()
    # await websocket.send(greeting)
    try:
        file = os.path.join(BASE_DIR, "logfile.log")
        with Popen(("tail", "-f", file), stdout=PIPE, bufsize=1, universal_newlines=True) as log:
            for line in log.stdout:
                await websocket.send(line)

        if p.returncode != 0:
            raise CalledProcessError(p.returncode, p.args)
    except websockets.exceptions.ConnectionClosed:
        print('Connection Closed')
    finally:
        pass

start_server = websockets.serve(proxy, '', 8888)

if __name__ == '__main__':
    print('-- Start WebScoket Server --')
    try:
        asyncio.get_event_loop().run_until_complete(start_server)
        asyncio.get_event_loop().run_forever()
    except KeyboardInterrupt:
        asyncio.get_event_loop().close()
