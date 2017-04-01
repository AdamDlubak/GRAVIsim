import os
import json
from math import sqrt, pow
from pyspark.sql import SparkSession
from pyspark.conf import SparkConf
from pyspark.sql.functions import lit

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

FORCE_FACTOR = 1
FORCE_OFFSET = 0
G = 6.674 * 10**(-11)
G_FACTOR = 2  # 1.3

def prepare_result(data):
    return {
        'particles': map(lambda p: {'mass': p['mass']}, data),
        'timeline': [map(lambda p: [p['x'], p['y']], data)],
    }


def save_result(result):
    path = os.path.join(BASE_DIR, 'static/media/output-data.json')
    with open(path, 'w') as file:
        json.dump(result, file)


def load_data():
    path = os.path.join(BASE_DIR, 'static/media/input-data.json')
    data = spark.read.json(path)
    data = data.withColumn('vx', lit(long(0))).withColumn('vy', lit(long(0)))
    data = data.rdd.map(lambda row: row.asDict(True)).collect()
    return data


def reset_acc(rdd):
    def reset(row):
        row['ax'] = 0
        row['ay'] = 0
        return row

    rdd = rdd.map(reset)
    rdd.cache()
    return rdd


def get_mass(mass):
    return mass * 10**30

def get_distance(distance):
    return distance * 3.086 * 10**16

def get_time_factor():
    return 10**16


def calculate_forces(rdd):
    particles = rdd.map(lambda p: {
        'mass': get_mass(p['mass']),
        'x': p['x'],
        'y': p['y'],
    }).collect()

    def calculate(source, destiny):
        if source['x'] == destiny['x'] and source['y'] == destiny['y']:
            return 0, 0

        dx = get_distance(destiny['x'] - source['x'])
        dy = get_distance(destiny['y'] - source['y'])
        r = sqrt(pow(dx, 2) + pow(dy, 2)) * FORCE_FACTOR
        force = ((G * source['mass'] * destiny['mass']) / pow(r, G_FACTOR)) * get_time_factor()
        return (force * dx) / r, (force * dy) / r

    def update_particle(row):
        source = {
            'mass': get_mass(row['mass']),
            'x': row['x'],
            'y': row['y'],
        }

        acc = map(lambda destiny: calculate(source, destiny), particles)
        acc_x, acc_y = reduce(lambda x, y: (x[0] + y[0], x[1] + y[1]), acc)

        row['ax'] += (acc_x / source['mass'])
        row['ay'] += (acc_y / source['mass'])
        return row

    rdd = rdd.map(update_particle)
    rdd.cache()
    return rdd


def update_position(rdd):
    def update(row):
        row['x'] += row['vx']
        row['y'] += row['vy']
        return row

    rdd = rdd.map(update)
    rdd.cache()
    return rdd


def update_velocity(rdd):
    def update(row):
        row['vx'] += row['ax']
        row['vy'] += row['ay']
        return row

    rdd = rdd.map(update)
    rdd.cache()
    return rdd


def write_step(rdd, result):
    frame_rdd = rdd.map(lambda row: [row['x'], row['y']])
    frame = frame_rdd.collect()
    result['timeline'].append(frame)
    return rdd.collect()


if __name__ == '__main__':
    spark = SparkSession \
        .builder \
        .appName("Simulation") \
        .config(conf=SparkConf()) \
        .getOrCreate()
    sc = spark.sparkContext

    data = load_data()
    result = prepare_result(data)

    for i in range(1, 300):
        rdd = sc.parallelize(data)
        rdd = reset_acc(rdd)
        rdd = calculate_forces(rdd)
        rdd = update_velocity(rdd)
        rdd = update_position(rdd)
        data = write_step(rdd, result)

    save_result(result)
    spark.stop()
