from __future__ import print_function
from os import path
import json
from math import sqrt, pow
from pyspark.sql import SparkSession
from pyspark.conf import SparkConf

BASE_DIR = path.dirname(path.dirname(path.abspath(__file__)))

class Parameters:
    FORCE_FACTOR = 10 ** 2
    G = 6.674 * 10 ** (-11)
    G_FACTOR = 1.4
    MIN_DISTANCE_LIMIT = 1


class ParticlesOperations:
    @staticmethod
    def updateVelocity(rdd, acc):
        def operation(pair):
            particle, particleAcc = pair
            return {
                'mass': particle['mass'],
                'x': particle['x'],
                'y': particle['y'],
                'vx': particle['vx'] + particleAcc[0],
                'vy': particle['vy'] + particleAcc[1],
            }

        rdd = rdd\
            .join(acc)\
            .values()\
            .map(operation)
        return rdd

    @staticmethod
    def updatePosition(rdd):
        def operation(particle):
            particle['x'] += particle['vx']
            particle['y'] += particle['vy']
            return particle
        return rdd.map(operation).cache()

    @staticmethod
    def getAccelerations(rdd):
        def calculate(pair):
            def getMass(mass):
                return mass * 10 ** 30

            def get_distance(distance):
                return distance * 3.086 * 10 ** 16

            (sourceId, source), (destinyId, destiny) = pair
            dx = get_distance(destiny[1] - source[1])
            dy = get_distance(destiny[2] - source[2])


            r = sqrt(pow(dx, 2) + pow(dy, 2))
            if r < get_distance(Parameters.MIN_DISTANCE_LIMIT):
                return sourceId, (0, 0)

            mass1 = getMass(source[0])
            mass2 = getMass(destiny[0])
            force = ((Parameters.G * mass1 * mass2) / pow(r, Parameters.G_FACTOR)) * Parameters.FORCE_FACTOR
            force = force / mass1
            return sourceId, ((force * dx) / r, (force * dy) / r)

        def reduceAcceleration(a, b):
            return a[0] + b[0], a[1] + b[1]

        # in rdd: Particle(mass, x, y)
        rdd = rdd.mapValues(lambda p: (p['mass'], p['x'], p['y']))
        rdd = rdd.cartesian(rdd)

        # in acc: Particle(ax, ay)
        acc = rdd.map(calculate)
        acc = acc.foldByKey((0, 0), reduceAcceleration)
        return acc


class BarnesHut:
    def __init__(self, iterations):
        self.iterations = iterations

    def run(self):
        data = self.loadData()
        result = self.prepareResult(data)

        for frame in range(1, self.iterations):
            out = path.join(BASE_DIR, 'static/media/')
            rdd = context.parallelize(data)
            rdd = self.normalize(rdd)
            # rdd.saveAsTextFile(path.join(out, 'out2'))
            acc = ParticlesOperations.getAccelerations(rdd)
            # acc.saveAsTextFile(path.join(out, 'out3'))
            rdd = ParticlesOperations.updateVelocity(rdd, acc)
            # rdd.saveAsTextFile(path.join(out, 'out4'))
            rdd = ParticlesOperations.updatePosition(rdd)
            # rdd.saveAsTextFile(path.join(out, 'out5'))
            frame, data = self.saveStep(rdd)
            result['timeline'].append(frame)

        self.saveData(result)

    def normalize(self, rdd):
        return rdd.map(lambda p: {
            'mass': p.get('mass', 1),
            'x': p.get('x', 0),
            'y': p.get('y', 0),
            'vx': p.get('vx', 0),
            'vy': p.get('vy', 0),
        }).zipWithIndex()\
            .map(lambda (key, index): (index, key))

    def loadData(self):
        data = spark.read.json(inputFile)
        data = data.rdd.map(lambda row: row.asDict(True))
        return data.collect()

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
    spark = SparkSession \
        .builder \
        .appName("Simulation") \
        .config(conf=SparkConf()) \
        .getOrCreate()
    context = spark.sparkContext

    inputFile = path.join(BASE_DIR, 'static/media/input-data.json')
    outputFile = path.join(BASE_DIR, 'static/media/output.json')

    simulation = BarnesHut(100)
    simulation.run()

    spark.stop()
