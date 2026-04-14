FROM node:current-slim

# Install Java (required for openapi-generator-cli)
# RUN mkdir -p /usr/share/man/man1 && \
#     apt-get update && \
#     apt-get install -y default-jre && \
#     apt-get clean;

WORKDIR /usr/src/app

# Copy manifests
COPY package*.json ./

# Install local dependencies
RUN npm install

# Install OpenAPI Generator globally
RUN npm install -g @openapitools/openapi-generator-cli

COPY . .

EXPOSE 3000

CMD [ "node", "index.js" ]
# Stage 1: Development/Build
# FROM node:20-slim AS base

# WORKDIR /usr/src/app

# # Copy package files first for better layer caching
# COPY package*.json ./

# # Install dependencies
# RUN npm install

# # Copy the rest of the source code
# COPY . .

# # Stage 2: Production (Optional, for smaller images)
# # For now, we'll just run the app from the base
# EXPOSE 3000

# CMD [ "node", "index.js" ]