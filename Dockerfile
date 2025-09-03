FROM node:20-bullseye

ENV DEBIAN_FRONTEND=noninteractive
ENV HOME=/tmp

# Install LibreOffice + all dependencies
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
        libcups2 \
        libxext6 \
        libxinerama1 \
        libxrandr2 \
        libxt6 \
        libfreetype6 \
        libglib2.0-0 \
        libxrender1 \
        default-jre \
        gnupg && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

# Create writable config folder for LibreOffice
RUN mkdir -p /tmp/.config && chmod -R 777 /tmp/.config

# App setup
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

EXPOSE 5001

CMD ["node", "server.js"]
