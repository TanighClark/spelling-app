FROM node:18

WORKDIR /app

# Copy only the package.json and package-lock.json to the container
COPY package*.json ./

# Install dependencies inside the container
RUN npm install

# Copy the rest of the application files
COPY . .

EXPOSE 3000

FROM node:18

WORKDIR /app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy all files to the container
COPY . .

EXPOSE 3000

# Run the server from the /server directory
CMD ["node", "server/server.js"]

# Debian-based node:18 image
RUN apt-get update && \
    apt-get install -y python3 make g++ && \
    npm rebuild bcrypt --build-from-source && \
    apt-get purge -y python3 make g++ && \
    rm -rf /var/lib/apt/lists/*

