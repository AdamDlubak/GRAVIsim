import os
import json
from pyspark.sql import SparkSession
from pyspark.conf import SparkConf
from pyspark.sql.functions import lit

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


def prepare_result(data):
    particles_mass = data.select('mass').rdd.flatMap(lambda x: x).collect()
    result = {
        'particles': map(lambda m: {'mass': m}, particles_mass),
        'timeline': []
    }
    return result


def save_result(result):
    path = os.path.join(BASE_DIR, 'static/media/output-data.json')
    with open(path, 'w') as file:
        json.dump(result, file)


def load_data():
    path = os.path.join(BASE_DIR, 'static/media/input-data.json')
    data = spark.read.json(path)

    data = data.withColumn('vx', lit(long(0))) \
        .withColumn('vy', lit(long(0))) \
        .withColumn('ax', lit(long(0))) \
        .withColumn('ay', lit(long(0)))

    # data.show()
    return data


if __name__ == '__main__':
    spark = SparkSession \
        .builder \
        .appName("Simulation") \
        .config(conf=SparkConf()) \
        .getOrCreate()
    sc = spark.sparkContext

    data = load_data()
    result = prepare_result(data)

    # TODO: Implement

    save_result(result)
