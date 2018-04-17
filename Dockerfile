FROM node:carbon

WORKDIR /usr/src/app

# Install app dependencies
# where available (npm@5+)
COPY package*.json ./

RUN npm Install

# RUN npm install --only=production

COPY . .

EXPOSE 8080
CMD [ "npm", "start" ]