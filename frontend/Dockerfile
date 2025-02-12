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
# Use a lightweight image to serve the built app
FROM node:18-alpine

WORKDIR /app

# Copy the built frontend from the previous stage
COPY --from=builder /app/dist /app/dist

# Expose the port for Vite preview
EXPOSE 5173

# Start the preview server, ensuring it points to the correct directory
CMD ["npx", "vite", "preview", "--port", "5173", "--host"]
