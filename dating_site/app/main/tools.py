from PIL import Image


def watermark(image_path, watermark_image_path):
    position = (0, 0)
    base_image = Image.open(image_path)
    watermark = Image.open(watermark_image_path)

    base_image.paste(watermark, position, mask=watermark)
    base_image.show()
    base_image.save(image_path)


def get_path_upload_avatar(instance, file):
    """ Построение пути к файлу, format: (media)/members_avatar/user_id/photo.jpg
    """
    return f'members_avatar/{file}'
