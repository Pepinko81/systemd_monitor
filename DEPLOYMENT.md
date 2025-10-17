# SystemD Services Monitor - Deployment Guide

This guide provides complete instructions for deploying the SystemD Services Monitor on Ubuntu Linux with Nginx as a reverse proxy.

## 📋 Prerequisites

- Ubuntu 18.04+ or Debian 10+
- Root or sudo access
- Python 3.6+
- Domain name (optional, for SSL)

## 🚀 Quick Deployment

### Option 1: Automated Deployment (Recommended)

1. **Download and prepare files:**
   ```bash
   # Clone or download all project files to a directory
   cd /tmp/systemd-monitor
   chmod +x deploy.sh
   ```

2. **Run deployment script:**
   ```bash
   sudo ./deploy.sh
   ```

3. **Access the application:**
   - HTTP: `http://your-server-ip:8080`
   - HTTPS: `https://your-domain.com` (after SSL setup)

### Option 2: Manual Deployment

#### Step 1: System Preparation

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install required packages
sudo apt install -y python3 python3-pip python3-venv nginx systemd
```

#### Step 2: Application Setup

```bash
# Create application directory
sudo mkdir -p /var/www/systemd-monitor
sudo chown www-data:www-data /var/www/systemd-monitor

# Copy application files
sudo cp -r . /var/www/systemd-monitor/
sudo chown -R www-data:www-data /var/www/systemd-monitor

# Create virtual environment
cd /var/www/systemd-monitor
sudo -u www-data python3 -m venv venv
sudo -u www-data ./venv/bin/pip install --upgrade pip
sudo -u www-data ./venv/bin/pip install -r requirements.txt
```

#### Step 3: Configure Sudo Permissions

```bash
# Allow www-data to run systemctl without password
echo "www-data ALL=(ALL) NOPASSWD: /bin/systemctl" | sudo tee /etc/sudoers.d/systemd-monitor
sudo chmod 440 /etc/sudoers.d/systemd-monitor
```

#### Step 4: SystemD Service Setup

```bash
# Install service file
sudo cp systemd-monitor.service /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable systemd-monitor
sudo systemctl start systemd-monitor

# Check service status
sudo systemctl status systemd-monitor
```

#### Step 5: Nginx Configuration

```bash
# Install Nginx configuration
sudo cp systemd-monitor.nginx /etc/nginx/sites-available/systemd-monitor
sudo ln -s /etc/nginx/sites-available/systemd-monitor /etc/nginx/sites-enabled/

# Test configuration
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx
```

## 🔧 Configuration

### Domain and SSL Setup

1. **Update Nginx configuration:**
   ```bash
   sudo nano /etc/nginx/sites-available/systemd-monitor
   ```
   
   Replace `your-domain.com` with your actual domain name.

2. **Install SSL certificate (Let's Encrypt):**
   ```bash
   sudo apt install certbot python3-certbot-nginx
   sudo certbot --nginx -d your-domain.com -d www.your-domain.com
   ```

3. **Test SSL renewal:**
   ```bash
   sudo certbot renew --dry-run
   ```

### Firewall Configuration

```bash
# Enable UFW firewall
sudo ufw enable

# Allow SSH, HTTP, and HTTPS
sudo ufw allow ssh
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw allow 8080/tcp  # For HTTP-only access

# Check firewall status
sudo ufw status
```

## 📊 Monitoring and Maintenance

### Service Management

```bash
# Check service status
sudo systemctl status systemd-monitor

# View real-time logs
sudo journalctl -u systemd-monitor -f

# Restart service
sudo systemctl restart systemd-monitor

# Stop service
sudo systemctl stop systemd-monitor

# Start service
sudo systemctl start systemd-monitor
```

### Nginx Management

```bash
# Check Nginx status
sudo systemctl status nginx

# Test configuration
sudo nginx -t

# Reload configuration
sudo systemctl reload nginx

# Restart Nginx
sudo systemctl restart nginx

# View Nginx logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

### Application Updates

```bash
# Navigate to application directory
cd /var/www/systemd-monitor

# Backup current version
sudo cp -r . ../systemd-monitor-backup-$(date +%Y%m%d)

# Update application files
sudo cp -r /path/to/new/files/* .
sudo chown -R www-data:www-data .

# Update Python dependencies
sudo -u www-data ./venv/bin/pip install -r requirements.txt

# Restart service
sudo systemctl restart systemd-monitor
```

## 🔍 Troubleshooting

### Common Issues

1. **Service won't start:**
   ```bash
   # Check detailed logs
   sudo journalctl -u systemd-monitor -n 50
   
   # Check Python environment
   sudo -u www-data /var/www/systemd-monitor/venv/bin/python -c "import flask; print('Flask OK')"
   ```

2. **Permission denied for systemctl:**
   ```bash
   # Verify sudo configuration
   sudo visudo -f /etc/sudoers.d/systemd-monitor
   
   # Test sudo access
   sudo -u www-data sudo systemctl status nginx
   ```

3. **Nginx 502 Bad Gateway:**
   ```bash
   # Check if application is running
   sudo systemctl status systemd-monitor
   
   # Check if port 5000 is listening
   sudo netstat -tlnp | grep :5000
   
   # Check Nginx error logs
   sudo tail -f /var/log/nginx/error.log
   ```

4. **Static files not loading:**
   ```bash
   # Check file permissions
   ls -la /var/www/systemd-monitor/static/
   
   # Ensure Nginx can read files
   sudo chown -R www-data:www-data /var/www/systemd-monitor/static/
   ```

### Log Locations

- **Application logs:** `sudo journalctl -u systemd-monitor`
- **Nginx access logs:** `/var/log/nginx/access.log`
- **Nginx error logs:** `/var/log/nginx/error.log`
- **System logs:** `/var/log/syslog`

### Performance Tuning

1. **Increase worker processes (for high traffic):**
   ```bash
   # Edit app.py
   sudo nano /var/www/systemd-monitor/app.py
   
   # Add at the end before app.run():
   # if __name__ == '__main__':
   #     app.run(host='0.0.0.0', port=5000, threaded=True)
   ```

2. **Configure Nginx worker processes:**
   ```bash
   sudo nano /etc/nginx/nginx.conf
   
   # Set worker_processes to number of CPU cores
   worker_processes auto;
   ```

## 🔒 Security Considerations

1. **Limit systemctl access:**
   - The current configuration allows www-data to run any systemctl command
   - For production, consider limiting to specific services only

2. **Network security:**
   - Use HTTPS in production
   - Configure proper firewall rules
   - Consider VPN access for sensitive environments

3. **Regular updates:**
   - Keep system packages updated
   - Monitor security advisories
   - Update SSL certificates before expiration

## 📈 Scaling

For high-traffic environments, consider:

1. **Using Gunicorn:**
   ```bash
   sudo -u www-data ./venv/bin/pip install gunicorn
   
   # Update systemd service to use Gunicorn
   ExecStart=/var/www/systemd-monitor/venv/bin/gunicorn -w 4 -b 127.0.0.1:5000 app:app
   ```

2. **Load balancing:**
   - Configure multiple application instances
   - Use Nginx upstream configuration

3. **Caching:**
   - Implement Redis for service data caching
   - Configure Nginx caching for static content

## 📞 Support

If you encounter issues:

1. Check the troubleshooting section above
2. Review application and system logs
3. Verify all configuration files
4. Test individual components (Python app, Nginx, systemctl access)

---

**Note:** This deployment guide assumes a standard Ubuntu/Debian environment. Adjust paths and commands as needed for other distributions.