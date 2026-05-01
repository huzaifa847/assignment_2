FROM node:18-alpine

WORKDIR /app

# Install dependencies first (including devDependencies needed for building)
COPY package*.json ./
RUN npm install

# Copy the rest of the source code
COPY . .

# Set connection strings needed during the build phase
ENV MONGODB_URI=mongodb://amirzari53143_db_user:amir@ac-odolqzq-shard-00-00.cdh5paf.mongodb.net:27017,ac-odolqzq-shard-00-01.cdh5paf.mongodb.net:27017,ac-odolqzq-shard-00-02.cdh5paf.mongodb.net:27017/?ssl=true&replicaSet=atlas-i4bd2v-shard-0&authSource=admin&retryWrites=true&w=majority&appName=Huzaifadevops
ENV JWT_SECRET=supersecretjwtkey_123456789
ENV PORT=3000

# BUILD: Use the direct path to the next binary to ensure it is found
RUN ./node_modules/.bin/next build

# Set to production ONLY after the build is successful
ENV NODE_ENV=production

EXPOSE 3000

CMD ["npm", "start"]
