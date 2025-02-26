# Use an official Node.js runtime as a parent image
FROM node:18-alpine AS builder

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code to the working directory
COPY . .

# Build the application
RUN npm run build

# ------------------------------------------
# Use a lightweight Node.js image to serve the built app
FROM node:18-alpine

WORKDIR /app

# Install serve (lightweight static file server)
RUN npm install -g serve

# Copy the built frontend from the previous stage
COPY --from=builder /app/dist /app/dist

# Expose the port for static file serving
EXPOSE 3000

# Use `serve` to host the static files
CMD ["serve", "-s", "dist", "-l", "3000"]
