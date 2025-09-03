# 1️⃣ Base image
FROM node:20-slim

# 2️⃣ Environment for non-interactive installs + LibreOffice config
ENV DEBIAN_FRONTEND=noninteractive
ENV HOME=/tmp
ENV PORT=5001

# 3️⃣ Install LibreOffice (headless) + fonts + utilities + clean up
RUN apt-get update && \
    apt-get install -y \
        libreoffice \
        libreoffice-writer \
        libreoffice-common \
        fonts-dejavu-core \
        fonts-dejavu-extra \
        xfonts-utils \
        wget \
        unzip && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

# 4️⃣ Create writable config directory for LibreOffice
RUN mkdir -p /tmp/.config && chmod -R 777 /tmp/.config

# 5️⃣ Set working directory
WORKDIR /app

# 6️⃣ Copy package.json and install dependencies
COPY package*.json ./
RUN npm install --production

# 7️⃣ Copy rest of the app
COPY . .

# 8️⃣ Expose port
EXPOSE 5001

# 9️⃣ Optional health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:5001/healthz || exit 1

# 🔟 Start server
CMD ["node", "server.js"]
