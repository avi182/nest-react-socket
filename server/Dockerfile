FROM node:18

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

COPY package.json ./

RUN npm i -g @nestjs/cli
RUN npm install bcrypt

RUN npm install

COPY . .

RUN npm run build

EXPOSE 8080

CMD ["node", "dist/main"]
