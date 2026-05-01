FROM node:20-alpine

WORKDIR /app

# Copy and install dependencies
COPY package*.json ./
RUN npm install

# Copy all files
COPY . .

# Environment variables
ENV MONGODB_URI=mongodb://amirzari53143_db_user:amir@ac-odolqzq-shard-00-00.cdh5paf.mongodb.net:27017,ac-odolqzq-shard-00-01.cdh5paf.mongodb.net:27017,ac-odolqzq-shard-00-02.cdh5paf.mongodb.net:27017/?ssl=true&replicaSet=atlas-i4bd2v-shard-0&authSource=admin&retryWrites=true&w=majority&appName=Huzaifadevops
ENV JWT_SECRET=supersecretjwtkey_123456789
ENV PORT=3000

# BUILD: Standard build command
RUN npm run build

# Set to production after build
ENV NODE_ENV=production

EXPOSE 3000
CMD ["npm", "start"]
