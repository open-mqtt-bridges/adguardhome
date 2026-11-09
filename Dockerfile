### ####################
### BUILDER
### ####################
FROM node:lts-alpine AS build

# Install build tools (needed for some deps)
RUN apk add --no-cache python3 make g++ openssl

# Current Node LTS images do not bundle Yarn Classic.
RUN npm install --global yarn@1.22.22

WORKDIR /app

# Install dependencies
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

# Copy source
COPY . .

# Build TypeScript -> JS
# Verify transport security with temporary certificates before bundling.
RUN yarn test

# Bundle into single JS file
RUN yarn bundle


### ####################
### RUNNER
### ####################
FROM node:lts-alpine AS runtime

WORKDIR /app

# Copy only bundled output (no node_modules needed)
COPY --from=build /app/dist ./dist

CMD ["node", "dist/index.js"]
