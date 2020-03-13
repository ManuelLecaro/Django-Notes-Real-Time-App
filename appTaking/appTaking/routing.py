from django.urls import path

from channels.routing import ProtocolTypeRouter, URLRouter

from notes.consumers import NoteConsumer


application = URLRouter([
        path('note', NoteConsumer),
    ])