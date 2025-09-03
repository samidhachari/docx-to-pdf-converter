# 1️⃣ Base image
FROM node:20-slim

# 2️⃣ Environment variables
ENV DEBIAN_FRONTEND=noninteractive
ENV HOME=/tmp
ENV PORT=5001

# 3️⃣ Install LibreOffice + fonts + utilities + create symlink
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
    ln -s /usr/lib/libreoffice/program/soffice /usr/bin/soffice && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

# 4️⃣ Create writable config directory for LibreOffice
RUN mkdir -p /tmp/.config && chmod -R 777 /tmp/.config

# 5️⃣ Set working directory
WORKDIR /app

# 6️⃣ Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# 7️⃣ Copy the rest of the project
COPY . .

# 8️⃣ Expose port
EXPOSE 5001

# 9️⃣ Start server
CMD ["node", "server.js"]
