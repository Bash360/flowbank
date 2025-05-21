FROM node:20-alpine

WORKDIR /app


COPY package*.json ./

RUN npm install --production

COPY dist ./dist


RUN npm run build

EXPOSE 3000


CMD [ "npm", "run","start"]
