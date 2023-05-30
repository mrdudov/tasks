from rest_framework import serializers
from .models import CustomUser, UserMatching




class CustomUserSerializer(serializers.ModelSerializer):

    def create(self, validated_data):
        user = CustomUser.objects.create_user(**validated_data)
        return user
    
    class Meta:
        model = CustomUser
        fields = [
            'id', 
            'username', 
            'last_name', 
            'avatar', 
            'gender', 
            'email', 
            'password',
            'latitude',
            'longitude',
        ]
        extra_kwargs = {'password': {'write_only': True}}


class UserMatchingSerializer(serializers.ModelSerializer):

    class Meta:
        model = UserMatching
        fields = ['id', 'user_to']
