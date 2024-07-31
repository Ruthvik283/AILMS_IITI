FROM node:14-alpine

WORKDIR /app

COPY package.json /app/
RUN npm install --force

COPY . /app/

RUN npm run build

CMD ["npm", "start"]
