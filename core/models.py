from django.db import models
from django.contrib.auth.models import User
from datetime import datetime

SparkJobStates = {
    'WAITING': '0',
    'RUNNING': '1',
    'FINISHED': '2',
}

class SparkJob(models.Model):
    STATE_TYPES = tuple([(i, x) for x, i in SparkJobStates.items()])

    name = models.TextField(max_length=100)
    description = models.TextField(max_length=255, blank=True, null=True)
    author = models.ForeignKey(User)
    state = models.CharField(max_length=1, choices=STATE_TYPES)
    priority = models.SmallIntegerField(default=5)
    created = models.DateTimeField(default=datetime.now)
    started = models.DateTimeField(blank=True, null=True)
    finished = models.DateTimeField(blank=True, null=True)

    def get_state_name(self, index):
        return list(SparkJobStates.keys())[list(SparkJobStates.values()).index(index)]

    def __str__(self):
        return "SparkJob #{} (Priority: {}) : {} : {}".format(
            self.id,
            self.priority,
            self.get_state_name(self.state),
            self.name
        )
