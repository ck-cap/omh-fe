FROM node:18-alpine AS build
# Install pnpm
RUN npm install -g pnpm

WORKDIR /app
COPY package.json pnpm-lock.yaml* ./
# pnpm-lock.yaml might not exist if it's a fresh project or using npm/yarn primarily,
# so we use pnpm-lock.yaml* to make it optional if it's not present.
# If pnpm-lock.yaml is present, it will be used.

RUN pnpm install --frozen-lockfile
COPY . .
RUN pnpm run build

# Production stage
FROM node:18-alpine
WORKDIR /app

# Copy built assets
COPY --from=build /app/.output ./.output
COPY --from=build /app/package.json ./package.json
# If you have a public directory with static assets, uncomment and adjust the line below
# COPY --from=build /app/public ./public

# Set environment variables for Nuxt
ENV HOST=0.0.0.0
ENV PORT=3000
# For Nuxt 3, NITRO_PORT is also an option if PORT doesn't work directly
# ENV NITRO_PORT=3000

EXPOSE 3000

CMD ["node", ".output/server/index.mjs"] 