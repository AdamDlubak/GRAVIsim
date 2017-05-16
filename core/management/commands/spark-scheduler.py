import os
from subprocess import Popen
from time import sleep
from datetime import datetime
from django.core.management.base import BaseCommand
from core.models import SparkJobStates, SparkJob

SLEEP_DELAY = 5
THIS_DIR = os.path.dirname(os.path.abspath(__file__))
BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(THIS_DIR)))
LOGS_DIR = os.path.join(BASE_DIR, 'spark-simulation', 'logs')
SIMULATION_FILE = os.path.join(BASE_DIR, 'spark-simulation', 'main.py')
CMD = "spark-submit --verbose --master {} {}"


class Command(BaseCommand):
    help = 'Apache Spark Job Scheduler'

    def add_arguments(self, parser):
        parser.add_argument('master', type=str)

    def log(self, msg):
        now = datetime.now().strftime("%d/%b/%Y %H:%M:%S")
        print("[{}] {}".format(self.style.HTTP_INFO(now), msg))

    def job(self, *args, **options):
        jobs = SparkJob.objects\
            .filter(state=SparkJobStates['WAITING'])\
            .order_by('-priority')\
            .order_by('id')
        if jobs.count() == 0:
            self.log("No jobs in queue: waiting...")

        while(jobs.count() == 0):
            sleep(SLEEP_DELAY)

        instance = jobs.first()
        instance.state = SparkJobStates['RUNNING']
        instance.started = datetime.now()
        instance.save()

        self.log(self.style.WARNING("Starting job: #{}".format(instance.id)))
        self.process_job(instance, *args, **options)

    def process_job(self, instance, *args, **options):
        simulation = ' '.join([
            SIMULATION_FILE,
            str(instance.id),
            str(instance.iterations),
            instance.inputFile
        ])
        command = CMD.format(options['master'], simulation)
        path =  os.path.join(LOGS_DIR, "{}.log".format(instance.id))
        with open(path, 'wb') as log:
            p = Popen(command, stdout=log, stderr=log, shell=True)
            p.wait()

        self.log(self.style.SUCCESS('Proceed #{}'.format(instance.id)))
        instance.state = SparkJobStates['FINISHED']
        instance.finished = datetime.now()
        instance.save()

    def clean_up(self):
        SparkJob.objects \
            .filter(state=SparkJobStates['RUNNING']) \
            .update(state=SparkJobStates['FINISHED'])

    def handle(self, *args, **options):
        self.log(self.style.SUCCESS('-- Start Spark Job Scheduler --'))
        try:
            while(True):
                self.job(*args, **options)
        except KeyboardInterrupt:
            self.clean_up()
            self.log(self.style.SUCCESS('-- Closing Spark Job Scheduler --'))
        except Exception as e:
            self.clean_up()
            self.log(self.style.ERROR('UNEXPECTED ERROR OCCURRED: {}'.format(e)))
