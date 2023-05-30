from rest_framework import generics
from django_filters import rest_framework as filters
from rest_framework.views import APIView
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from django.http import Http404, JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth import authenticate, login as user_login, logout as user_logout

from main.models import CustomUser, UserMatching
from main.serializers import CustomUserSerializer
from main.tasks import email



class UserCreate(generics.CreateAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = CustomUserSerializer


class UserList(generics.ListAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = CustomUserSerializer
    filter_backends = (filters.DjangoFilterBackend,)
    filterset_fields = ('gender', 'username', 'last_name')


@csrf_exempt
def login(request):
    if request.method != 'POST':
        return JsonResponse({'message': 'POST only'})
    
    username = request.POST.get('username')
    password = request.POST.get('password')
    
    user = authenticate(request, username=username, password=password)
    
    if user is not None:
        user_login(request, user)
        return JsonResponse({'message': 'login successfully'})
    else:  
        return JsonResponse({'message': 'login error'}) 


@csrf_exempt
def logout(request):
    if request.method != 'POST':
        return JsonResponse({'message': 'POST only'})
    user_logout(request)
    return JsonResponse({'message': 'logout successfully'})


class MatchingUser(APIView):

    def get(self, request, pk, format=None):
        
        user_to = get_object_or_404(CustomUser, pk=pk)

        if not request.user.is_authenticated:
            raise Http404('No auth')
        
        if user_to == request.user:
            return Response({'error': 'user_to == user_from'})

        match_to, _ = UserMatching.objects.get_or_create(
            user = request.user,
            user_to=user_to,
            match=True
        )

        try:
            match_from = UserMatching.objects.get(
                user = user_to,
                user_to=request.user,
            )

            if match_to.match == True and match_from.match == True:
                
                email.delay(
                    subject='Dating site report', 
                    message=f'Вы понравились {request.user.username}! Почта участника: {request.user.email}', 
                    email=user_to.email
                )
                return Response(user_to.email)
        except UserMatching.DoesNotExist:
            pass

        return Response()