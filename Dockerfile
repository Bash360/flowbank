FROM node:20-alpine

WORKDIR /app


COPY package*.json ./

RUN npm install --production && npm run build

COPY dist ./dist


EXPOSE 3000


CMD [ "npm", "run","start"]
