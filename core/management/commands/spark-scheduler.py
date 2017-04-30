import os
from subprocess import Popen
from django.core.management.base import BaseCommand

THIS_DIR = os.path.dirname(os.path.abspath(__file__))
BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(THIS_DIR)))
LOGS_DIR = os.path.join(BASE_DIR, 'spark-simulation/logs')
SIMULATION_FILE = os.path.join(BASE_DIR, 'spark-simulation/main.py')
CMD = "spark-submit --master '{}' {}"


class Command(BaseCommand):
    help = 'Apache Spark Job Scheduler'

    def add_arguments(self, parser):
        parser.add_argument('master', type=str)

    def handle(self, *args, **options):
        command = CMD.format(options['master'], SIMULATION_FILE)

        filepath = "{}{}.log".format(LOGS_DIR, '/default')
        self.stdout.write(self.style.WARNING(filepath))

        with open(filepath, 'wb') as log:
            p = Popen(command, stdout=log, stderr=log, shell=True)
            p.wait()
        self.stdout.write(self.style.SUCCESS('Finished'))
