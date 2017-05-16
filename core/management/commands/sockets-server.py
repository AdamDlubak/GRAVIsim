import os
import asyncio
import websockets
from datetime import datetime
from django.core.management.base import BaseCommand

THIS_DIR = os.path.dirname(os.path.abspath(__file__))
BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(THIS_DIR)))
LOGS_DIR = os.path.join(BASE_DIR, 'spark-simulation/logs')


class Command(BaseCommand):
    help = 'WebSockets Server'

    def log(self, msg):
        now = datetime.now().strftime("%d/%b/%Y %H:%M:%S")
        print("[{}] {}".format(self.style.HTTP_INFO(now), msg))

    async def proxy(self, websocket, path):
        try:
            filepath = "{}{}.log".format(LOGS_DIR, path)
            self.log("Access file: " + self.style.WARNING(filepath))
            offset = 0

            while True:
                with open(filepath, 'r') as f:
                    f.seek(offset)
                    for line in f:
                        offset += len(line)
                        await websocket.send(line)
                await asyncio.sleep(0.1)

        except websockets.exceptions.ConnectionClosed:
            self.log("Connection Closed")
        finally:
            websocket.close()

    def handle(self, *args, **options):
        self.log(self.style.SUCCESS('-- Start WebSocket Server --'))

        start_server = websockets.serve(self.proxy, '', 8888)
        try:
            asyncio.get_event_loop().run_until_complete(start_server)
            asyncio.get_event_loop().run_forever()
        except KeyboardInterrupt:
            asyncio.get_event_loop().close()
