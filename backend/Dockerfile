FROM node:15

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm ci --only=production

COPY . .

RUN chmod +x bin/server

EXPOSE 3000
CMD [ "./bin/server" ]

