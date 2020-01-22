#FROM python:3.7-alpine
FROM ubuntu:19.04

RUN apt-get update -y
RUN apt-get upgrade -y
RUN apt-get  install  -y build-essential checkinstall libssl-dev

RUN apt-get  install  -y python3-dev python3-pip

WORKDIR /code
ENV FLASK_APP app.py
ENV FLASK_RUN_HOST 0.0.0.0
#RUN apk add --no-cache gcc musl-dev linux-headers
COPY requirements.txt requirements.txt
RUN pip3 install flask
COPY . .

RUN pip3 install -U virtualenv  # system-wide install

RUN pip3 install --user --upgrade tensorflow  # install in $HOME
RUN pip3 install matplotlib 

RUN apt-get  update
RUN apt-get  install  -y libxext6
RUN pip3 install opencv-python
RUN pip3 install Pillow
RUN pip3 install keras
RUN apt-get  install  -y joe
RUN apt-get  install  -y libsm6 libxext6 libxrender-dev

#RUN apt-get  install  libsm6 libxrender1 libfontconfig1
RUN pip3 install sklearn

CMD ["python3", "app.py"]
