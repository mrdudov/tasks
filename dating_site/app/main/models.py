from django.db import models
from django.contrib.auth.models import AbstractUser
from django.conf import settings
from main import tools

GENDER = [
    ('m', 'male'),
    ('f', 'female'),
]


class CustomUser(AbstractUser):

    email = models.EmailField()
    last_name = models.CharField(max_length=150)

    avatar = models.ImageField(upload_to=tools.get_path_upload_avatar)
    gender = models.CharField(max_length=1, choices=GENDER)
    
    latitude = models.FloatField(null=False, blank=False)
    longitude = models.FloatField(null=False, blank=False)



    def save(self, *args, **kwargs):
        """
        watermark avatar
        """

        super().save(*args, **kwargs)
        tools.watermark(self.avatar.path, settings.WATERMARK_IMG_PATH)

    def __str__(self):
        return self.username


class UserMatching(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='user_math')
    user_to = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='user_math_to')
    match = models.BooleanField(default=False)

    class Meta:
        unique_together = [['user', 'user_to']]
    
    def __str__(self):
        return f"matching from {self.user.username} to {self.user_to.username}"
