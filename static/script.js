class SystemdMonitor {
    constructor() {
        this.refreshInterval = null;
        this.lastUpdateTime = null;
        this.allServices = [];
        this.filteredServices = [];
        this.init();
    }

    init() {
        this.bindEvents();
        this.loadServices();
        this.startAutoRefresh();
    }

    bindEvents() {
        const refreshBtn = document.getElementById('refreshBtn');
        refreshBtn.addEventListener('click', () => this.loadServices());
        
        const searchInput = document.getElementById('searchInput');
        searchInput.addEventListener('input', (e) => this.filterServices(e.target.value));
    }

    async loadServices() {
        const loadingEl = document.getElementById('loading');
        const tableEl = document.getElementById('servicesTable');
        const errorEl = document.getElementById('error');

        // Store current scroll position
        const scrollPosition = window.pageYOffset || document.documentElement.scrollTop;
        
        // Only show loading on first load
        const isFirstLoad = this.allServices.length === 0;
        
        if (isFirstLoad) {
            loadingEl.style.display = 'block';
            tableEl.style.display = 'none';
            errorEl.style.display = 'none';
        }

        try {
            const response = await fetch('/services');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const services = await response.json();
            this.allServices = services;
            this.applyCurrentFilter();
            this.updateLastUpdateTime();

            // Show table only if it was hidden
            if (isFirstLoad) {
                loadingEl.style.display = 'none';
                tableEl.style.display = 'table';
            }
            
            // Restore scroll position
            window.scrollTo(0, scrollPosition);
            
        } catch (error) {
            console.error('Error loading services:', error);
            this.showError(`Failed to load services: ${error.message}`);
            
            if (isFirstLoad) {
                loadingEl.style.display = 'none';
            }
            
            // Restore scroll position even on error
            window.scrollTo(0, scrollPosition);
        }
    }

    filterServices(searchTerm) {
        if (!searchTerm.trim()) {
            this.filteredServices = this.allServices;
        } else {
            const term = searchTerm.toLowerCase();
            this.filteredServices = this.allServices.filter(service => 
                service.name.toLowerCase().includes(term) ||
                service.description.toLowerCase().includes(term)
            );
        }
        this.renderServices(this.filteredServices);
        this.updateStats(this.allServices); // Stats should show all services, not filtered
    }

    applyCurrentFilter() {
        const searchInput = document.getElementById('searchInput');
        this.filterServices(searchInput.value);
    }
    renderServices(services) {
        const tbody = document.getElementById('servicesBody');
        tbody.innerHTML = '';

        if (services.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="5" style="text-align: center; padding: 40px; color: #666;">
                        No services found
                    </td>
                </tr>
            `;
            return;
        }

        services.forEach(service => {
            const row = document.createElement('tr');
            row.className = service.status;
            
            row.innerHTML = `
                <td data-label="Service Name">
                    <div class="service-name">${this.escapeHtml(service.name)}</div>
                </td>
                <td data-label="Description">
                    <div class="service-description">${this.escapeHtml(service.description)}</div>
                </td>
                <td data-label="Status">
                    <span class="status-badge ${service.status}">
                        ${this.getStatusIcon(service.status)} ${service.status.toUpperCase()}
                    </span>
                </td>
                <td data-label="State">
                    <div class="state-info">${this.escapeHtml(service.active_state)} / ${this.escapeHtml(service.sub_state)}</div>
                </td>
                <td data-label="Actions">
                    <div class="action-buttons">
                        ${this.getActionButtons(service)}
                    </div>
                </td>
            `;
            
            tbody.appendChild(row);
        });
        
        // Bind action button events
        this.bindActionButtons();
    }

    getActionButtons(service) {
        const serviceName = service.name;
        let buttons = '';
        
        if (service.status === 'active') {
            buttons += `<button class="btn btn-small btn-warning" data-action="stop" data-service="${serviceName}">⏹️ Stop</button>`;
            buttons += `<button class="btn btn-small btn-warning" data-action="restart" data-service="${serviceName}">🔄 Restart</button>`;
        } else {
            buttons += `<button class="btn btn-small btn-success" data-action="start" data-service="${serviceName}">▶️ Start</button>`;
            if (service.status !== 'failed') {
                buttons += `<button class="btn btn-small btn-warning" data-action="restart" data-service="${serviceName}">🔄 Restart</button>`;
            }
        }
        
        return buttons;
    }

    bindActionButtons() {
        const actionButtons = document.querySelectorAll('[data-action]');
        actionButtons.forEach(button => {
            button.addEventListener('click', async (e) => {
                e.preventDefault();
                const action = button.getAttribute('data-action');
                const serviceName = button.getAttribute('data-service');
                await this.controlService(serviceName, action, button);
            });
        });
    }

    async controlService(serviceName, action, button) {
        // Disable button during operation
        const originalText = button.innerHTML;
        button.disabled = true;
        button.innerHTML = '⏳ Working...';
        
        try {
            const response = await fetch(`/control/${encodeURIComponent(serviceName)}/${action}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            
            const result = await response.json();
            
            if (result.success) {
                this.showNotification(result.message, 'success');
                // Refresh services after successful action
                setTimeout(() => this.loadServices(), 1000);
            } else {
                this.showNotification(result.message, 'error');
            }
            
        } catch (error) {
            console.error('Error controlling service:', error);
            this.showNotification(`Failed to ${action} ${serviceName}: ${error.message}`, 'error');
        } finally {
            // Re-enable button
            button.disabled = false;
            button.innerHTML = originalText;
        }
    }

    showNotification(message, type) {
        const notification = document.getElementById('notification');
        notification.textContent = message;
        notification.className = `notification ${type}`;
        notification.style.display = 'block';
        
        // Auto-hide after 5 seconds
        setTimeout(() => {
            notification.style.display = 'none';
        }, 5000);
    }

    updateStats(services) {
        const total = services.length;
        const active = services.filter(s => s.status === 'active').length;
        const inactive = services.filter(s => s.status === 'inactive').length;
        const failed = services.filter(s => s.status === 'failed').length;

        document.getElementById('serviceCount').textContent = total;
        document.getElementById('activeCount').textContent = active;
        document.getElementById('inactiveCount').textContent = inactive;
        document.getElementById('failedCount').textContent = failed;
    }

    updateLastUpdateTime() {
        const now = new Date();
        const timeString = now.toLocaleTimeString('en-US', {
            hour12: false,
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
        
        document.getElementById('lastUpdate').textContent = timeString;
        this.lastUpdateTime = now;
    }

    showError(message) {
        const errorEl = document.getElementById('error');
        errorEl.textContent = message;
        errorEl.style.display = 'block';
    }

    getStatusIcon(status) {
        switch (status) {
            case 'active':
                return '✅';
            case 'failed':
                return '❌';
            case 'inactive':
                return '⚠️';
            default:
                return '❓';
        }
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    startAutoRefresh() {
        // Refresh every 5 seconds
        this.refreshInterval = setInterval(() => {
            this.loadServices();
        }, 5000);
    }

    stopAutoRefresh() {
        if (this.refreshInterval) {
            clearInterval(this.refreshInterval);
            this.refreshInterval = null;
        }
    }
}

// Initialize the monitor when the page loads
document.addEventListener('DOMContentLoaded', () => {
    window.monitor = new SystemdMonitor();
});

// Clean up when the page is unloaded
window.addEventListener('beforeunload', () => {
    if (window.monitor) {
        window.monitor.stopAutoRefresh();
    }
});