from .models import Note
from rest_framework import viewsets
from rest_framework import permissions
from .serializers import NotesSerializer

class NoteViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows notes to be viewed or edited.
    """
    queryset = Note.objects.all().order_by('created')
    serializer_class = NotesSerializer