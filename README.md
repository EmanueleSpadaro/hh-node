This repository contains a Dockerfile that builds a minimal Docker image to run a local Ethereum node using Hardhat.

## Build the image

```bash
docker build -t hh-node .
```

## Run the container


```bash
docker run -p 8545:8545 hh-node
```
The container starts a Hardhat local node listening on port 8545.

## Use the prebuilt image
To save time, you can pull the prebuilt image from Docker Hub:
```bash
docker pull tabasco7050/hh-node
docker run -p 8545:8545 tabasco7050/hh-node
```

I know right, the Docker Hub username was randomly generated at times.
