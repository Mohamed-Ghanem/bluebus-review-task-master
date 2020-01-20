# base image
FROM node:10.16.0-alpine

# install some libraries has required with alpine.
RUN apk add automake build-base file nasm autoconf zlib-dev

# set working directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# add `/usr/src/app/node_modules/.bin` to $PATH
ENV PATH /usr/src/app/node_modules/.bin:$PATH
ENV NPM_CONFIG_PREFIX=/home/node/.npm-global
ENV PATH=$PATH:/home/node/.npm-global/bin

# install and cache app dependencies
COPY package.json /usr/src/app/package.json
# COPY package-lock.json /usr/src/app/package-lock.json

# https://stackoverflow.com/a/52196681 Temporary solution til we use node instead of node-alpine
RUN npm config set unsafe-perm true
RUN npm install -g serve
RUN npm install

EXPOSE 3000

# start app
# CMD ["npm", "start"]

CMD ["npm", "run", "deploy"]

# build and serve app
# CMD ["serve", "-l", "3000", "-s", "build"]
# CMD ["npm", "run", "build", "&&", "serve", "-l", "3000", "-s", "build"]
