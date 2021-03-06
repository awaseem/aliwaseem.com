FROM node:5.3-slim

RUN mkdir /src

COPY . /src

RUN cd /src; npm install

ENV NODE_ENV production

EXPOSE 3000
CMD ["node", "/src/app.js"]
