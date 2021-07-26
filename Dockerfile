FROM node:16-slim

ARG USERNAME
ARG SORT=star
ARG ORDER=desc

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install --production

COPY . .

RUN  node bin/gitfolio.js build $USERNAME --sort=$SORT --order=$ORDER

EXPOSE 3000

CMD [ "node", "bin/gitfolio.js", "run"]
