FROM node:18-alpine AS build
WORKDIR /app
COPY package.json package-lock.json* ./
COPY ./client ./client
COPY ./server ./server
COPY ./script ./script
COPY tsconfig.json vite.config.ts postcss.config.js ./
RUN npm ci --silent
RUN npm run build

FROM node:18-alpine
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /app/dist ./dist
COPY package.json ./
RUN npm ci --production --silent
EXPOSE 5000
CMD ["node", "dist/index.js"]
