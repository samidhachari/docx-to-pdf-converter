# 1️⃣ Use full Node image (not slim)
FROM node:20

# 2️⃣ Set environment variables
ENV DEBIAN_FRONTEND=noninteractive
ENV HOME=/tmp

# 3️⃣ Install LibreOffice + dependencies + fonts
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
        libxrender1 && \
    # Ensure soffice binary is accessible
    ln -sf /usr/lib/libreoffice/program/soffice /usr/bin/soffice && \
    # Clean up apt caches to reduce image size
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# 4️⃣ Set working directory
WORKDIR /app

# 5️⃣ Copy Node project files
COPY package*.json ./

# 6️⃣ Install dependencies
RUN npm install --production

# 7️⃣ Copy the rest of the project
COPY . .

# 8️⃣ Expose port
EXPOSE 5001

# 9️⃣ Start the server
CMD ["node", "server.js"]
