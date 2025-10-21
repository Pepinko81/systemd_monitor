#!/bin/bash

# SystemD Services Monitor - Sudo Setup Script
# This script configures sudo permissions for systemctl commands

set -e

echo "=========================================="
echo "SystemD Services Monitor - Sudo Setup"
echo "=========================================="
echo ""

# Check if running as root
if [ "$EUID" -eq 0 ]; then
    echo "ERROR: Please do NOT run this script as root or with sudo."
    echo "Run it as your normal user: ./setup-sudo.sh"
    exit 1
fi

# Get the current username
CURRENT_USER=$(whoami)

echo "Setting up sudo permissions for user: $CURRENT_USER"
echo ""

# Create sudoers file content
SUDOERS_CONTENT="# SystemD Services Monitor - Allow $CURRENT_USER to control systemd services
$CURRENT_USER ALL=(ALL) NOPASSWD: /usr/bin/systemctl start *
$CURRENT_USER ALL=(ALL) NOPASSWD: /usr/bin/systemctl stop *
$CURRENT_USER ALL=(ALL) NOPASSWD: /usr/bin/systemctl restart *
$CURRENT_USER ALL=(ALL) NOPASSWD: /usr/bin/systemctl status *"

# Create temporary file
TEMP_FILE=$(mktemp)
echo "$SUDOERS_CONTENT" > "$TEMP_FILE"

echo "Sudoers configuration created:"
echo "-----------------------------------"
cat "$TEMP_FILE"
echo "-----------------------------------"
echo ""

# Validate sudoers file syntax
if sudo visudo -c -f "$TEMP_FILE" > /dev/null 2>&1; then
    echo "✓ Sudoers syntax is valid"
    echo ""

    # Copy to sudoers.d directory
    SUDOERS_FILE="/etc/sudoers.d/systemd-monitor"

    echo "Installing sudoers configuration..."
    sudo cp "$TEMP_FILE" "$SUDOERS_FILE"
    sudo chmod 0440 "$SUDOERS_FILE"
    sudo chown root:root "$SUDOERS_FILE"

    echo "✓ Sudoers configuration installed to: $SUDOERS_FILE"
    echo ""

    # Test sudo access
    echo "Testing sudo access..."
    if sudo -n systemctl status ssh.service > /dev/null 2>&1 || sudo -n systemctl status sshd.service > /dev/null 2>&1; then
        echo "✓ Sudo access working correctly!"
        echo ""
        echo "=========================================="
        echo "Setup completed successfully!"
        echo "=========================================="
        echo ""
        echo "You can now start the SystemD Services Monitor:"
        echo "  python3 app.py"
        echo ""
    else
        echo "⚠ Could not verify sudo access. You may need to log out and log back in."
        echo ""
    fi
else
    echo "✗ ERROR: Sudoers syntax validation failed!"
    echo "Please check the configuration."
    exit 1
fi

# Cleanup
rm -f "$TEMP_FILE"

echo "Note: If you still get permission errors, try logging out and logging back in."
echo ""
