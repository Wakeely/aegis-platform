#!/bin/bash
# Push GitHub commit
# Run this command with your token:
# git push https://ghp_YOUR_TOKEN_HERE@github.com/Wakeely/aegis-platform.git main

cd /workspace/aegis-platform
echo "To push your changes, run:"
echo "git push https://ghp_YOUR_PERSONAL_ACCESS_TOKEN@github.com/Wakeely/aegis-platform.git main"
echo ""
echo "Or if you have GitHub CLI installed:"
echo "gh auth login"
echo "git push origin main"
