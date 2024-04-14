FROM node:18-bullseye

WORKDIR /backend

RUN npm cache clean --force

COPY package*.json ./

RUN npm install

COPY . .

Expose 4451

ENV NODE_ENV=development

CMD ["node", "server.js"]