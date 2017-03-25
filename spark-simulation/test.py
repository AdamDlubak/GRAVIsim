import os
from pyspark import SparkContext

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
logFile = os.path.join(BASE_DIR, 'test.txt')
sc = SparkContext('local', "Test App")
logData = sc.textFile(logFile).cache()

splitFile = logData.flatMap(lambda line: line.split(' ')).map(lambda word: word.lower())

numLorem = splitFile.filter(lambda s: 'lorem' in s).count()
numIpsum = splitFile.filter(lambda s: 'ipsum' in s).count()

print("Occurrences of \'lorem\': %i, Occurrences of \'ipsum\': %i" % (numLorem, numIpsum))

sc.stop()
