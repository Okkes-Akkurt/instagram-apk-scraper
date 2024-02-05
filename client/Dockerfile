
# Node client
FROM node:latest
WORKDIR /src/app
COPY package.json .
RUN npm install
COPY . .
RUN npm start
EXPOSE 3000