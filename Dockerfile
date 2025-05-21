FROM node:20-alpine

WORKDIR /app


COPY package*.json ./

COPY tsconfig.json ./

COPY src ./src

RUN npm install && npm run build && rm -rf ./src && npm prune --production && npm cache clean --force 

EXPOSE 3000


CMD [ "npm", "run","start"]
