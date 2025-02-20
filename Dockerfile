FROM node:23.4.0

LABEL mantainer="Gareth"
LABEL description="This is a simple Node.js app that serves a server on port 8080"
LABEL cohort="19"
LABEL animal="I honestly have no idea"

WORKDIR /app
COPY server.js /app
COPY package.json /app
EXPOSE 8080
RUN npm install
CMD [ "npm", "start" ]
