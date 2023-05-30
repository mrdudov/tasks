from django.urls import path, include
from main import views

urlpatterns = [
    
    path('login/', views.login, name='login'),
    path('logout/', views.logout, name='logout'),

    path('clients/create/', views.UserCreate.as_view()),
    path('list/', views.UserList.as_view()),
    path('clients/<int:pk>/match/', views.MatchingUser.as_view()),

]
