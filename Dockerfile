FROM node:14-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install
# Bundle app source
COPY . .

EXPOSE 5000
CMD [ "npm", "run","start" ]