FROM node:lts-alpine

WORKDIR /app

COPY "./hardhat.config.js" "."
COPY "./package.json" "."

COPY "./express.js" "."
COPY "./start.js" "."

RUN ["npm", "i"]

EXPOSE 8545

CMD ["node", "start.js"]
