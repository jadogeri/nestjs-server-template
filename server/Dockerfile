FROM node:18-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

#RUN npm run build # Uncomment this line if you want to run the production build

EXPOSE 3000

CMD ["npm", "run", "start:dev"]

