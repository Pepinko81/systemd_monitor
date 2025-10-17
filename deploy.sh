#!/bin/bash

# SystemD Services Monitor Deployment Script
# Run this script as root or with sudo privileges

set -e  # Exit on any error

echo "🚀 Starting SystemD Services Monitor deployment..."

# Configuration variables
APP_NAME="systemd-monitor"
APP_DIR="/var/www/$APP_NAME"
NGINX_CONFIG="/etc/nginx/sites-available/$APP_NAME"
SERVICE_FILE="/etc/systemd/system/$APP_NAME.service"
USER="www-data"
GROUP="www-data"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

print_status() {
    echo -e "${GREEN}✓${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

# Check if running as root
if [[ $EUID -ne 0 ]]; then
   print_error "This script must be run as root (use sudo)"
   exit 1
fi

# Update system packages
print_status "Updating system packages..."
apt update && apt upgrade -y

# Install required packages
print_status "Installing required packages..."
apt install -y python3 python3-pip python3-venv nginx systemd

# Create application directory
print_status "Creating application directory..."
mkdir -p $APP_DIR
chown $USER:$GROUP $APP_DIR

# Copy application files
print_status "Copying application files..."
cp -r . $APP_DIR/
chown -R $USER:$GROUP $APP_DIR

# Create Python virtual environment
print_status "Setting up Python virtual environment..."
cd $APP_DIR
sudo -u $USER python3 -m venv venv
sudo -u $USER $APP_DIR/venv/bin/pip install --upgrade pip
sudo -u $USER $APP_DIR/venv/bin/pip install -r requirements.txt

# Configure sudo permissions for www-data user
print_status "Configuring sudo permissions for systemctl..."
echo "www-data ALL=(ALL) NOPASSWD: /bin/systemctl" > /etc/sudoers.d/systemd-monitor
chmod 440 /etc/sudoers.d/systemd-monitor

# Install systemd service
print_status "Installing systemd service..."
cp systemd-monitor.service $SERVICE_FILE
systemctl daemon-reload
systemctl enable $APP_NAME
systemctl start $APP_NAME

# Configure Nginx
print_status "Configuring Nginx..."
cp systemd-monitor.nginx $NGINX_CONFIG

# Create symbolic link to enable site
ln -sf $NGINX_CONFIG /etc/nginx/sites-enabled/

# Test Nginx configuration
nginx -t

# Restart services
print_status "Restarting services..."
systemctl restart nginx
systemctl restart $APP_NAME

# Check service status
print_status "Checking service status..."
if systemctl is-active --quiet $APP_NAME; then
    print_status "SystemD Monitor service is running"
else
    print_error "SystemD Monitor service failed to start"
    systemctl status $APP_NAME
    exit 1
fi

if systemctl is-active --quiet nginx; then
    print_status "Nginx service is running"
else
    print_error "Nginx service failed to start"
    systemctl status nginx
    exit 1
fi

# Setup log rotation
print_status "Setting up log rotation..."
cat > /etc/logrotate.d/$APP_NAME << EOF
/var/log/$APP_NAME/*.log {
    daily
    missingok
    rotate 52
    compress
    delaycompress
    notifempty
    create 644 $USER $GROUP
    postrotate
        systemctl reload $APP_NAME
    endscript
}
EOF

# Create log directory
mkdir -p /var/log/$APP_NAME
chown $USER:$GROUP /var/log/$APP_NAME

print_status "Deployment completed successfully!"
echo ""
echo "📋 Deployment Summary:"
echo "   • Application directory: $APP_DIR"
echo "   • Service name: $APP_NAME"
echo "   • Nginx configuration: $NGINX_CONFIG"
echo "   • Service file: $SERVICE_FILE"
echo ""
echo "🌐 Access your application:"
echo "   • HTTP: http://your-server-ip:8080"
echo "   • HTTPS: https://your-domain.com (after SSL setup)"
echo ""
echo "🔧 Useful commands:"
echo "   • Check service status: systemctl status $APP_NAME"
echo "   • View logs: journalctl -u $APP_NAME -f"
echo "   • Restart service: systemctl restart $APP_NAME"
echo "   • Reload Nginx: systemctl reload nginx"
echo ""
print_warning "Don't forget to:"
echo "   1. Update server_name in Nginx config with your domain"
echo "   2. Configure SSL certificates for HTTPS"
echo "   3. Configure firewall rules (ufw allow 80,443/tcp)"