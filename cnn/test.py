#https://jovianlin.io/saving-loading-keras-models/
import cv2
import numpy as np
from keras.models import load_model
from imagenet_utils import decode_predictions
from keras.preprocessing import image

custom_resnet_model = load_model('custom_resnet_model.h5')
print('######################################## Model is loaded ########################################')

custom_resnet_model.compile(loss='categorical_crossentropy', optimizer='adam', metrics=['accuracy'])
print('######################################## Model is compiled ########################################')

img = cv2.imread('./index2.jpeg')
img = cv2.resize(img,(224,224))
img = np.reshape(img,[1,224,224,3])

#classes = custom_resnet_model.predict_classes(img)

preds = custom_resnet_model.predict(img)
print('Predicted:', decode_predictions(preds))
"""
The CIFAR-10 dataset consists of 60000 32x32 colour images in 10 classes, with 6000 images per class. There are 50000 training images and 10000 test images.

The dataset is divided into five training batches and one test batch, each with 10000 images. The test batch contains exactly 1000 randomly-selected images from each class. The training batches contain the remaining images in random order, but some training batches may contain more images from one class than another. Between them, the training batches contain exactly 5000 images from each class.

Here are the classes in the dataset, as well as 10 random images from each:
airplane 										
automobile 										
bird 										
cat 										
deer 										
dog 										
frog 										
horse 										
ship 										
truck 										

"""
#one_d_array = preds.ravel()
#print(one_d_array)
#index = np.argmax(one_d_array)
#classes = ["airplane", "automobile","bird","cat","deer","dog","frog","horse","ship","truck"]
#print('Predicted class :', classes[index])

#print(classes)

