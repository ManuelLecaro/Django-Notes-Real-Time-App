from .models import Note
from rest_framework import serializers

class NotesSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Note
        fields = ['text', 'created']

