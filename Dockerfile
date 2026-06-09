FROM node:22-slim

WORKDIR /app

# Install pnpm globally
RUN npm install -g pnpm

# Set CI environment to avoid interactive prompts
ENV CI=true
ENV PNPM_CONFIRM_MODULES_PURGE=false
# Disable Datadog auto-instrumentation
ENV NODE_OPTIONS=""

# Copy dependency files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

# Install dependencies
RUN pnpm install

# Copy the rest of the application
COPY . .

# Expose Next.js dev server port
EXPOSE 3000

# Start Next.js in dev mode
CMD ["npx", "next", "dev"]
