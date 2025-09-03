# 1️⃣ Base image (Debian slim variant with more libraries)
FROM node:20-bullseye

# 2️⃣ Environment variables
ENV DEBIAN_FRONTEND=noninteractive
ENV HOME=/tmp
ENV PORT=5001

# 3️⃣ Install LibreOffice + fonts + utilities
RUN apt-get update && \
    apt-get install -y \
        libreoffice \
        libreoffice-writer \
        libreoffice-calc \
        libreoffice-impress \
        libreoffice-common \
        libreoffice-java-common \
        fonts-dejavu-core \
        fonts-dejavu-extra \
        xfonts-utils \
        wget \
        unzip \
        gnupg2 \
        libcups2 \
        libxext6 \
        libxinerama1 \
        libxrandr2 \
        libxt6 \
        libfreetype6 \
        libglib2.0-0 \
        libxrender1 && \
    ln -s /usr/lib/libreoffice/program/soffice /usr/bin/soffice && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

# 4️⃣ Writable config for LibreOffice
RUN mkdir -p /tmp/.config && chmod -R 777 /tmp/.config

# 5️⃣ Set working directory
WORKDIR /app

# 6️⃣ Copy package.json & install deps
COPY package*.json ./
RUN npm install

# 7️⃣ Copy rest of the app
COPY . .

# 8️⃣ Expose port
EXPOSE 5001

# 9️⃣ Start server
CMD ["node", "server.js"]
