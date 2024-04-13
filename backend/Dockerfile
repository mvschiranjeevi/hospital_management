FROM node:18-bullseye

WORKDIR /backend

COPY package*.json ./

RUN npm install

COPY . .

Expose 4451

ENV NODE_ENV=development

CMD ["node", "server.js"]