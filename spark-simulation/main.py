from __future__ import print_function
from os import path
import json
from math import sqrt, pow
from pyspark.sql import SparkSession
from pyspark.conf import SparkConf

BASE_DIR = path.dirname(path.dirname(path.abspath(__file__)))

class ProgressBar:
    def __init__(self, prefix='', suffix='', decimals=1, length=100, fill='#'):
        """
        Create terminal progress bar
        @params:
            :param prefix: Optional - prefix string (Str)
            :param suffix: Optional - suffix string (Str)
            :param decimals: Optional - positive number of decimals in percent complete (Int)
            :param length: Optional - character length of bar (Int)
            :param fill: Optional - bar fill character (Str)
        """
        self.prefix = prefix
        self.suffix = suffix
        self.decimals = decimals
        self.length = length
        self.fill = fill

    def print(self, step, total):
        """
        Call in a loop to print terminal progress bar
        @params:
            :param iteration: Required - current iteration (Int)
            :param total: Required - total iterations (Int)
        """
        percent = ("{0:." + str(self.decimals) + "f}").format(100 * (step / float(total)))
        filled_length = int(self.length * step // total)
        bar = self.fill * filled_length + '-' * (self.length - filled_length)
        print('\r%s |%s| %s%% %s' % (self.prefix, bar, percent, self.suffix), end='\r')
        if step == total:
            print()


class Parameters:
    FORCE_FACTOR = 10 ** 2
    G = 6.674 * 10 ** (-11)
    G_FACTOR = 1.4
    MIN_DISTANCE_LIMIT = 1

    @staticmethod
    def getMass(mass):
        return mass * 10 ** 30

    @staticmethod
    def getDistance(distance):
        return distance * 3.086 * 10 ** 16


class ParticlesOperations:
    @staticmethod
    def updateVelocity(rdd):
        def operation(particle):
            particle['vx'] += particle['ax']
            particle['vy'] += particle['ay']
            return particle
        return rdd.map(operation).cache()

    @staticmethod
    def updatePosition(rdd):
        def operation(particle):
            particle['x'] += particle['vx']
            particle['y'] += particle['vy']
            return particle
        return rdd.map(operation).cache()

    @staticmethod
    def updateAccelerations(rdd):
        particles = rdd.map(lambda p: {
            'mass': Parameters.getMass(p['mass']),
            'x': p['x'],
            'y': p['y'],
        }).collect()

        def calculate(source, destiny):
            dx = Parameters.getDistance(destiny['x'] - source['x'])
            dy = Parameters.getDistance(destiny['y'] - source['y'])

            r = sqrt(pow(dx, 2) + pow(dy, 2))
            if r < Parameters.getDistance(Parameters.MIN_DISTANCE_LIMIT):
                return 0, 0

            force = ((Parameters.G * source['mass'] * destiny['mass']) /
                     pow(r, Parameters.G_FACTOR)) * Parameters.FORCE_FACTOR
            return (force * dx) / r, (force * dy) / r

        def updateParticle(p):
            source = {
                'mass': Parameters.getMass(p['mass']),
                'x': p['x'],
                'y': p['y'],
            }

            acc = map(lambda destiny: calculate(source, destiny), particles)
            acc_x, acc_y = reduce(lambda x, y: (x[0] + y[0], x[1] + y[1]), acc)

            p['ax'] += (acc_x / source['mass'])
            p['ay'] += (acc_y / source['mass'])
            return p

        return rdd.map(updateParticle).cache()


class Simulation:
    def __init__(self, iterations):
        self.iterations = iterations
        print("Application ID: {}".format(context.applicationId))
        print("Method: Exact Algorithm")
        print("Animation duration: {} frames.".format(iterations))
        print("---------------------------------")

    def run(self):
        data = self.loadData()
        result = self.prepareResult(data)

        progressBar = ProgressBar(prefix='Progress:', suffix='Complete', length=50)

        for frame in range(1, self.iterations):
            progressBar.print(frame, self.iterations)
            rdd = context.parallelize(data)
            rdd = self.normalize(rdd)
            rdd = ParticlesOperations.updateAccelerations(rdd)
            rdd = ParticlesOperations.updateVelocity(rdd)
            rdd = ParticlesOperations.updatePosition(rdd)
            frame, data = self.saveStep(rdd)
            result['timeline'].append(frame)

        self.saveData(result)
        print("Simulation Completed Successfully")

    def normalize(self, rdd):
        return rdd.map(lambda p: {
            'mass': p.get('mass', 1),
            'x': p.get('x', 0),
            'y': p.get('y', 0),
            'vx': p.get('vx', 0),
            'vy': p.get('vy', 0),
            'ax': 0,
            'ay': 0,
        })

    def loadData(self):
        data = spark.read.json(inputFile)
        rdd = data.rdd.map(lambda row: row.asDict(True))
        return rdd.collect()

    def prepareResult(self, data):
        return {
            'particles': map(lambda p: {'mass': p['mass']}, data),
            'timeline': [map(lambda p: [p['x'], p['y']], data)],
        }

    def saveData(self, result):
        with open(outputFile, 'w') as file:
            json.dump(result, file)

    def saveStep(self, rdd):
        frame = rdd.map(lambda row: [row['x'], row['y']])
        return frame.collect(), rdd.collect()


if __name__ == '__main__':
    conf = SparkConf()
    conf.set("spark.executor.heartbeatInterval", "3600s")

    spark = SparkSession.builder.appName("Simulation").config(conf=conf).getOrCreate()
    context = spark.sparkContext

    inputFile = path.join(BASE_DIR, 'static/media/input.json')
    outputFile = path.join(BASE_DIR, 'static/media/output.json')

    simulation = Simulation(2000)
    simulation.run()

    spark.stop()
