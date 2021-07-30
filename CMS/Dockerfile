# Set the base image
FROM node:12

# Define working directory
RUN mkdir -p /home/web
WORKDIR /home/web
COPY ./website /home/web

#apt-get update

EXPOSE 80
EXPOSE 443
EXPOSE 8080
CMD ["node", "server.js"]





