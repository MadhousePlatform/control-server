FROM node:20

WORKDIR /usr/src/app
COPY package.json .
COPY package-lock.json .
RUN npm ci

COPY . .
RUN npm test

CMD ["npm", "start"]