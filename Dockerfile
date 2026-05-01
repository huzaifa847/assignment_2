FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
# Using --frozen-lockfile or just npm install is faster
RUN npm install

COPY . .

ENV MONGODB_URI=...
ENV JWT_SECRET=...
ENV PORT=3000
ENV NODE_ENV=production

# Now that we use Node 20, this should work without the syntax error
RUN npm run build

EXPOSE 3000
CMD ["npm", "start"]
