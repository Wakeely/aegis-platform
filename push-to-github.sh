#!/bin/bash
cd /workspace/aegis-platform

# Configure git to not prompt for credentials
export GIT_TERMINAL_PROMPT=0
export GIT_ASKPASS=echo

# Add origin remote if it doesn't exist
if ! git remote get-url origin &>/dev/null; then
    echo "Adding origin remote..."
    git remote add origin https://github.com/Wakeely/aegis-platform.git
fi

# Set up credential helper to avoid prompts
git config credential.helper store

echo "=== Pushing to GitHub ==="
git push origin main --force 2>&1

echo ""
echo "=== Push Complete ==="
