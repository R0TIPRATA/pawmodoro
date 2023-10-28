# from django.shortcuts import render

# # Create your views here.
# from rest_framework.views import APIView
# from rest_framework.response import Response
# from rest_framework.permissions import IsAuthenticated
# from django.http import HttpResponse
# import os

# class LoginView(APIView):
#     permission_classes = (IsAuthenticated,)

#     def get(self, request):
#         response = HttpResponse()
#         frontendUrl = os.environ.get("FRONTEND_APP")
#         print(frontendUrl)
#         response['Access-Control-Allow-Origin'] = frontendUrl
#         content = {
#             "message": "Welcome to the JWT Authentication page using React Js and Django!"
#         }
#         return Response(content)


# class LogoutView(APIView):
#     permission_classes = (IsAuthenticated,)

#     def post(self, request):
#         try:
#             refresh_token = request.data["refresh_token"]
#             token = RefreshToken(refresh_token)
#             token.blacklist()
#             return Response(status=status.HTTP_205_RESET_CONTENT)
#         except Exception as e:
#             return Response(status=status.HTTP_400_BAD_REQUEST)
        

from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.authentication import SessionAuthentication, TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status

from django.shortcuts import get_object_or_404
from django.contrib.auth.models import User
from rest_framework.authtoken.models import Token

from .serializers import UserSerializer

@api_view(['POST'])
def register(request):
    serializer = UserSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        user = User.objects.get(username=request.data['username'])
        user.set_password(request.data['password'])
        user.save()
        token = Token.objects.create(user=user)
        return Response({'token': token.key, 'user': serializer.data})
    return Response(serializer.errors, status=status.HTTP_200_OK)

@api_view(['POST'])
def login(request):
    user = get_object_or_404(User, username=request.data['username'])
    if not user.check_password(request.data['password']):
        return Response("missing user", status=status.HTTP_404_NOT_FOUND)
    token, created = Token.objects.get_or_create(user=user)
    serializer = UserSerializer(user)
    return Response({'token': token.key, 'user': serializer.data})

# async function login(req, res) {
#   const { username, password } = req.body;
#   try {
#     const user = await User.findOne({ where: { username } });
#     if (!user) {
#       return res.json({ message: "Incorrect username/password!" });
#     }
#     const validPassword = await user.validPassword(password);
#     if (!validPassword) {
#       return res.json({ message: "Incorrect username/password!" });
#     }
#     const token = createSecretToken(user.uuid);

#     res.cookie('access_token', token, { httpOnly:false, path: "/", secure: true, sameSite: 'None' }).cookie('username', username, { httpOnly:false, path: "/", secure: true, sameSite: 'None' })
#     res.json({
#       // message: "User logged in successfully!",
#       success: true,
#     });
#   } catch (err) {
#     console.log(err);
#   }
# }

@api_view(['GET'])
@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsAuthenticated])
def test_token(request):
    return Response("passed!")