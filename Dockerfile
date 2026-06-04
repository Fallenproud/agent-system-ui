# ═══════════════════════════════════════════════════════════
#  Build Stage — Frontend React App
# ═══════════════════════════════════════════════════════════
FROM node:20-alpine AS builder

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy source and build
COPY . .
RUN npm run build

# ═══════════════════════════════════════════════════════════
#  Production Stage — Node.js Backend + Static Frontend
# ═══════════════════════════════════════════════════════════
FROM node:20-alpine

WORKDIR /app

# Install server dependencies
COPY server/package*.json ./server/
RUN cd server && npm install --production

# Copy server code
COPY server/ ./server/

# Copy built frontend from builder stage
COPY --from=builder /app/dist ./dist

EXPOSE 3001

ENV NODE_ENV=production

CMD ["node", "server/server.js"]
