from rest_framework import serializers

from .models import Sesh, Task

class SeshSerializer(serializers.ModelSerializer):
	class Meta:
		model = Sesh
		fields = '__all__'


class TaskSerializer(serializers.ModelSerializer):
	class Meta:
		model = Task
		fields = '__all__'

	sesh_id = serializers.IntegerField(write_only=True) 

class TaskCreateSerializer(serializers.Serializer):
    sesh_id = serializers.IntegerField()
    tasks = serializers.ListField(child=serializers.DictField())