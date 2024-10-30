#!/bin/bash

# Get the directory where the script is located
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
PROJECT_DIR="$( cd "$SCRIPT_DIR/.." && pwd )"

# Build the application
echo "Building the application..."
cd "$PROJECT_DIR"
npm install
npm run build

# Create desktop entry
echo "Creating desktop shortcut..."
cat > ~/.local/share/applications/ai-framework.desktop << EOL
[Desktop Entry]
Version=1.0
Type=Application
Name=AI Framework
Comment=Local AI Framework
Exec=bash -c "cd ${PROJECT_DIR} && npm start"
Icon=${PROJECT_DIR}/public/vite.svg
Terminal=false
Categories=Development;
EOL

# Make the desktop entry executable
chmod +x ~/.local/share/applications/ai-framework.desktop

# Create symbolic link on desktop
ln -sf ~/.local/share/applications/ai-framework.desktop ~/Desktop/AI-Framework.desktop

echo "Installation complete! You can now launch AI Framework from your desktop."