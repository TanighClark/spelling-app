FROM node:18

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy entire project to the container
COPY . .

# Verify the server path (for debugging)
RUN ls -al /app/server

EXPOSE 3000

# Start the server
CMD ["node", "server/server.js"]
