# Use node:18-alpine as the base image
FROM node:18-alpine AS build

WORKDIR /app

# Enable Corepack
RUN corepack enable

# Install dependencies needed for node-gyp builds
RUN apk add --no-cache python3 make g++ libc6-compat

# Copy package.json and yarn.lock first (to leverage Docker cache)
COPY package.json yarn.lock ./

# Remove node_modules, clean cache, and install dependencies
RUN rm -rf node_modules && yarn cache clean --all && yarn install --immutable

# Copy the rest of the application
COPY . .

# Ensure Rollup is installed globally (if needed)
RUN yarn add rollup --dev

# Build the application
RUN yarn build
EXPOSE 3000