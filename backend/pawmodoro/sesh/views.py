from rest_framework.response import Response

# import view sets from the REST framework
from rest_framework import viewsets

# import serializer from the serializer file
from .serializers import *

# import the Sesh model from the models file
from .models import Sesh, Task

from rest_framework import status
from rest_framework.decorators import action
from django.db.models import Max

class SeshView(viewsets.ModelViewSet):
	serializer_class = SeshSerializer
	queryset = Sesh.objects.all()

# class TaskView(viewsets.ModelViewSet):
# 	serializer_class = TaskSerializer
# 	def get_queryset(self):
# 		created_at = self.request.query_params.get('created_at')
# 		return Task.objects.filter(created_at=created_at)
	
class TaskView(viewsets.ModelViewSet):
	serializer_class = TaskSerializer	
	queryset = Task.objects.all()
	
	def create(self, request, *args, **kwargs):
		created_tasks = []
		sesh_id = request.data.get('sesh_id')
		print("sesh_id",sesh_id)
		serializer = TaskCreateSerializer(data=request.data)
		if serializer.is_valid():
			sesh_id = serializer.validated_data['sesh_id']
			tasks = serializer.validated_data['tasks']
			print(tasks)
		
		try:
			sesh = Sesh.objects.get(pk=sesh_id)
		except Sesh.DoesNotExist:
			return Response({'error': f'Session with ID {sesh_id} not found.'}, status=status.HTTP_404_NOT_FOUND)

		for task_data in tasks:
			put_in_data = {}
			put_in_data['sesh'] = sesh.id
			put_in_data['sesh_id'] = sesh.id
			put_in_data['task'] = task_data.get("task")

			task_serializer = TaskSerializer(data=put_in_data)
			if task_serializer.is_valid():
				task_serializer.save()
				created_tasks.append(task_serializer.data)
			else:
				return Response(task_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
		return Response(created_tasks, status=status.HTTP_201_CREATED)
	
	@action(detail=False, methods=['GET'])
	def latest_sesh(self, request):
		latest_sesh = Sesh.objects.aggregate(Max('id'))
		latest_sesh_id = latest_sesh.get('id__max')

		try:
			sesh = Sesh.objects.get(id=latest_sesh_id)
			serializer = SeshSerializer(sesh)
			return Response(serializer.data)
		except Sesh.DoesNotExist:
			return Response({'error': 'No tasks found.'}, status=404)
        
	
	#http://localhost:8000/api/by_sesh/24/
	@action(detail=True, methods=['GET']) 
	def by_sesh(self, request, pk=None):
		if pk is not None:
			#print("123")
			try:
				pk = int(pk)  # Ensure sesh_id is an integer
				tasks = Task.objects.filter(sesh=pk)
				serializer = TaskSerializer(tasks, many=True)
				return Response(serializer.data, status=status.HTTP_200_OK)
			except ValueError:
				return Response({'error': 'Invalid sesh_id format.'}, status=status.HTTP_400_BAD_REQUEST)
		return Response({'error': 'Sesh id is not a number'}, status=status.HTTP_400_BAD_REQUEST)
	
	@action(detail=False, methods=['PATCH'])
	def bulk_update(self, request):
        # Implement the bulk update logic here
        # Example: Loop through tasks and update them
		for task_data in request.data:
			task_id = task_data.get('id')
			#new_task_data = task_data.get('new_data')
			try:
				task = Task.objects.get(id=task_id)
				#task.task = new_task_data.get('task')
				task.completed = True
				task.save()
			except Task.DoesNotExist:
				return Response({'error': 'Task does not exist.'}, status=status.HTTP_400_BAD_REQUEST)

		return Response({'message': 'Bulk update successful'})