FROM node:20-alpine

WORKDIR /app

# 1. Install dependencies
COPY package*.json ./
RUN npm install

# 2. Copy source code
COPY . .

# 3. Set build-time variables (Keep NODE_ENV out for now)
ENV MONGODB_URI=mongodb://amirzari53143_db_user:amir@ac-odolqzq-shard-00-00.cdh5paf.mongodb.net:27017,ac-odolqzq-shard-00-01.cdh5paf.mongodb.net:27017,ac-odolqzq-shard-00-02.cdh5paf.mongodb.net:27017/?ssl=true&replicaSet=atlas-i4bd2v-shard-0&authSource=admin&retryWrites=true&w=majority&appName=Huzaifadevops
ENV JWT_SECRET=supersecretjwtkey_123456789
ENV PORT=3000

# 4. BUILD using npx (This is the most reliable way to find the command)
RUN npx next build

# 5. NOW set to production for the actual runtime
ENV NODE_ENV=production

EXPOSE 3000
CMD ["npm", "start"]
