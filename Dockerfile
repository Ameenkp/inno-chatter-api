# Use an official Node.js runtime as a parent image
FROM node:20.10.0-alpine
LABEL authors="ameenkp"
# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install app dependencies
RUN npm install

# Bundle your app source
COPY . .

# Compile TypeScript
RUN npm run build

# Expose the port your app runs on
EXPOSE 3000

# Command to run your application
CMD ["npm", "run", "start-dev-server"]
