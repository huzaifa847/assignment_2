# Change from 18 to 20
FROM node:20-alpine

WORKDIR /app

# 1. Install dependencies
COPY package*.json ./
RUN npm install

# 2. Copy source
COPY . .

# 3. Environment Variables
ENV MONGODB_URI=mongodb://amirzari53143_db_user:amir@ac-odolqzq-shard-00-00.cdh5paf.mongodb.net:27017,ac-odolqzq-shard-00-01.cdh5paf.mongodb.net:27017,ac-odolqzq-shard-00-02.cdh5paf.mongodb.net:27017/?ssl=true&replicaSet=atlas-i4bd2v-shard-0&authSource=admin&retryWrites=true&w=majority&appName=Huzaifadevops
ENV JWT_SECRET=supersecretjwtkey_123456789
ENV PORT=3000
# IMPORTANT: Keep NODE_ENV as development during build if you face issues, 
# but production is usually fine here.
ENV NODE_ENV=production

# 4. BUILD - Use npx to find the 'next' command
RUN npx next build

EXPOSE 3000

CMD ["npm", "start"]
