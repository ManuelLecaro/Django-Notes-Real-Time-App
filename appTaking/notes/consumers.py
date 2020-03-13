import json

from channels.generic.websocket import AsyncJsonWebsocketConsumer
from channels.db import database_sync_to_async

from django.forms.models import model_to_dict

from .serializers import NotesSerializer
from .models import Note

class NoteConsumer(AsyncJsonWebsocketConsumer):

    async def connect(self):
        self.group_name = 'notes'
        await self.channel_layer.group_add(self.group_name, self.channel_name)
        await self.accept()
        content = {'type': 'get.note', 'content': {}}
        await self.get_note(content)

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(self.group_name, self.channel_name)
        pass

    async def receive_json(self, content, **kwargs):
        message_type = content.get('type')
        if message_type == 'create.note':
            await self.create_note(content)
        elif message_type == 'update.note':
            await self.update_note(content)
        if message_type == 'delete.note':
            await self.delete_note(content)
        elif message_type == 'get.note':
            await self.get_note(content)
    
    async def get_note(self, event):
        notes = await self._get_notes()
        await self.channel_layer.group_send(group="notes", message={
            'type': 'send.message',
            'data': notes 
        })
        
    async def create_note(self, event):
        note = await self._create_note(event.get('content'))
        note_data = NotesSerializer(note).data
        await self.send_json({
            'type': 'create.note',
            'data': note_data
        })

    async def update_note(self, event):
        note = await self._update_note(event.get('content'))
        note_id = f'{note.id}'
        note_data = NotesSerializer(note).data

        # Send updates to users that are looking on the board.
        await self.channel_layer.group_send(group="notes", message={
            'type': 'update.message',
            'data': note_data
        })

        await self.send_json({
            'type': 'MESSAGE',
            'data': note_data
        })
    
    async def send_message(self, event):
        await self.send(text_data=json.dumps(event["data"]))

    async def update_message(self, event):
        await self.send(text_data=json.dumps(event["data"]))
    
    async def delete_note(self, event):
        note = await self._delete_notes(event.get('content'))

        await self.send_json({
            'type': 'MESSAGE',
            'data': 'message_deleted'
        })

    @database_sync_to_async
    def _get_notes(self):
        notes = Note.objects.all()
        notes_list = [model_to_dict(note) for note in notes]
        notes_json = json.dumps(notes_list)[1:-1]
        return notes_json
    
    @database_sync_to_async
    def _create_note(self, content):
        serializer = NotesSerializer(data=content)
        serializer.is_valid(raise_exception=True)
        note = serializer.create(serializer.validated_data)
        return note

    @database_sync_to_async
    def _update_note(self, content):
        instance = Note.objects.get(id=content.get('id'))
        serializer = NotesSerializer(data=content)
        serializer.is_valid(raise_exception=True)
        note = serializer.update(instance, serializer.validated_data)
        return note

    @database_sync_to_async
    def _delete_notes(self, content):

        instance = Note.objects.get(id=content.get('id'))
        note = instance.delete()
        return note