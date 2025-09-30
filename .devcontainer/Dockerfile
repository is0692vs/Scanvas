# Use the official dev container base image which includes Python, Git, and essential tools
FROM mcr.microsoft.com/devcontainers/base:ubuntu-24.04

# Install Node.js, npm and system dependencies for pyusb
RUN apt-get update && apt-get install -y \
    nodejs \
    npm \
    libusb-1.0-0 \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# Install global npm packages as root
RUN npm install -g @google/gemini-cli @github/copilot

# Create a directory for global npm packages for the vscode user and set permissions
RUN mkdir -p /home/vscode/.npm-global && \
    chown -R vscode:vscode /home/vscode/.npm-global

# Ensure vscode user has proper permissions
USER vscode
WORKDIR /workspaces