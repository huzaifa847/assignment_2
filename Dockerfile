FROM node:20-alpine

WORKDIR /app
RUN apk add --no-cache libc6-compat

COPY package*.json ./


RUN npm ci

COPY . .
RUN npm run build

ENV NODE_ENV=production
ENV PORT=5000

EXPOSE 5000
CMD ["npm","run","start","--","-p","5000","-H","0.0.0.0"]
