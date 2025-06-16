FROM node:lts-alpine

WORKDIR /app

RUN ["touch", "hardhat.config.js"]

RUN ["npm", "i", "hardhat"]

EXPOSE 8545

CMD ["npx", "hardhat", "node"]
