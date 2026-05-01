# Use Node 20 to support modern syntax
FROM node:20-alpine

WORKDIR /app

# Copy the json files from the student-attendance-system folder
COPY package*.json ./
RUN npm install

COPY . .

# Environment variables
ENV MONGODB_URI=mongodb://amirzari53143_db_user:amir@ac-odolqzq-shard-00-00.cdh5paf.mongodb.net:27017,ac-odolqzq-shard-00-01.cdh5paf.mongodb.net:27017,ac-odolqzq-shard-00-02.cdh5paf.mongodb.net:27017/?ssl=true&replicaSet=atlas-i4bd2v-shard-0&authSource=admin&retryWrites=true&w=majority&appName=Huzaifadevops
ENV JWT_SECRET=supersecretjwtkey_123456789
ENV PORT=3000

# Build the app
RUN npm run build

ENV NODE_ENV=production
EXPOSE 3000
CMD ["npm", "start"]
