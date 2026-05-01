FROM node:18-alpine

WORKDIR /app

# 1. Install dependencies
COPY package*.json ./
# Clean install to ensure no corruption
RUN npm install

# 2. Copy source
COPY . .

# 3. Environment Variables (Required for Next.js build)
ENV MONGODB_URI=mongodb://amirzari53143_db_user:amir@ac-odolqzq-shard-00-00.cdh5paf.mongodb.net:27017,ac-odolqzq-shard-00-01.cdh5paf.mongodb.net:27017,ac-odolqzq-shard-00-02.cdh5paf.mongodb.net:27017/?ssl=true&replicaSet=atlas-i4bd2v-shard-0&authSource=admin&retryWrites=true&w=majority&appName=Huzaifadevops
ENV JWT_SECRET=supersecretjwtkey_123456789
ENV PORT=3000
ENV NODE_ENV=production

# 4. BUILD - Use npx to find the 'next' command automatically
RUN npx next build

EXPOSE 3000

CMD ["npm", "start"]
