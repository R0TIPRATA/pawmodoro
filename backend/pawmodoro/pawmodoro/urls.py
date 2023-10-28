from django.contrib import admin

# add include to the path
from django.urls import path, include

# import views from sesh
from sesh import views as seshViews
from auth import views as authViews

# import routers from the REST framework
# it is necessary for routing
from rest_framework import routers

# create a router object
router = routers.DefaultRouter()

from rest_framework_simplejwt import views as jwtViews

# register the router
router.register(r'sesh',seshViews.SeshView, 'sesh')
router.register(r'task',seshViews.TaskView, 'task')

urlpatterns = [
	path('admin/', admin.site.urls),
    # path('api/login/', authViews.LoginView.as_view(), name ='login'),
    # path('api/logout/', authViews.LogoutView.as_view(), name ='logout'),
    path('api/auth/', include('auth.urls')),
    # path('api/token/', jwtViews.TokenObtainPairView.as_view(), name ='token_obtain_pair'),
    # path('api/token/refresh/', jwtViews.TokenRefreshView.as_view(), name ='token_refresh'),
    path('api/sesh/latest_sesh/', seshViews.TaskView.as_view({'get': 'latest_sesh'}), name='latest-sesh'),
	path('api/', include(router.urls)),
   # path('api/task/addTasks', views.CreateTaskView.as_view(), name="addTasks"),
	# add another path to the url patterns
	# when you visit the localhost:8000/api
	# you should be routed to the django Rest framework
]
