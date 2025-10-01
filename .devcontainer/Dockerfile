# Use the official dev container base image which includes Python, Git, and essential tools
FROM mcr.microsoft.com/devcontainers/base:ubuntu-24.04

# Install Node.js, npm and system dependencies for pyusb and Electron
RUN apt-get update && apt-get install -y \
    nodejs \
    npm \
    libusb-1.0-0 \
    libgtk-3-0 \
    libnss3 \
    libasound2t64 \
    libxtst-dev \
    libatk1.0-0 \
    libx11-xcb1 \
    libxcomposite1 \
    libxcursor1 \
    libxdamage1 \
    libxi6 \
    libxrandr2 \
    libgbm1 \
    libpango-1.0-0 \
    libcairo2 \
    libdrm2 \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# Install global npm packages as root
RUN npm install -g @google/gemini-cli @github/copilot

# Create a directory for global npm packages for the vscode user and set permissions
RUN mkdir -p /home/vscode/.npm-global && \
    chown -R vscode:vscode /home/vscode/.npm-global

# Ensure vscode user has proper permissions
USER vscode
WORKDIR /workspaces