#!/usr/bin/env python3
from flask import Flask, render_template, jsonify
import subprocess
import re
import json

app = Flask(__name__)

def get_systemd_services():
    """Execute systemctl command and parse the output"""
    try:
        # Run systemctl to get all services
        result = subprocess.run(
            ['systemctl', 'list-units', '--type=service', '--no-pager', '--all'],
            capture_output=True,
            text=True,
            check=True
        )
        
        services = []
        lines = result.stdout.strip().split('\n')
        
        # Skip header lines and footer lines
        service_lines = []
        for line in lines:
            # Look for lines that start with service names (contain .service)
            if '.service' in line and not line.strip().startswith('●'):
                service_lines.append(line)
        
        for line in service_lines:
            # Parse each line using regex to extract components
            # Format: UNIT LOAD ACTIVE SUB DESCRIPTION
            parts = line.strip().split()
            if len(parts) >= 4:
                service_name = parts[0]
                load_state = parts[1]
                active_state = parts[2]
                sub_state = parts[3]
                
                # Description is everything after the first 4 parts
                description = ' '.join(parts[4:]) if len(parts) > 4 else 'No description'
                
                # Determine overall status
                if active_state == 'active' and sub_state == 'running':
                    status = 'active'
                elif active_state == 'active':
                    status = 'active'
                elif active_state == 'failed':
                    status = 'failed'
                else:
                    status = 'inactive'
                
                services.append({
                    'name': service_name,
                    'description': description,
                    'status': status,
                    'active_state': active_state,
                    'sub_state': sub_state
                })
    
    except subprocess.CalledProcessError as e:
        print(f"Error running systemctl: {e}")
        services = []
    except Exception as e:
        print(f"Error parsing systemctl output: {e}")
        services = []
    
    # Sort services by status: active first, then inactive, then failed
    status_order = {'active': 0, 'inactive': 1, 'failed': 2}
    services.sort(key=lambda x: (status_order.get(x['status'], 3), x['name'].lower()))
    
    return services

def control_service(service_name, action):
    """Control a systemd service (start, stop, restart)"""
    try:
        # Remove .service suffix if present for the command
        clean_name = service_name.replace('.service', '')
        
        # Execute systemctl command
        result = subprocess.run(
            ['sudo', 'systemctl', action, clean_name],
            capture_output=True,
            text=True,
            check=True
        )
        
        return {
            'success': True,
            'message': f'Successfully {action}ed {service_name}',
            'output': result.stdout
        }
    except subprocess.CalledProcessError as e:
        return {
            'success': False,
            'message': f'Failed to {action} {service_name}: {e.stderr}',
            'error': str(e)
        }
    except Exception as e:
        return {
            'success': False,
            'message': f'Error controlling {service_name}: {str(e)}',
            'error': str(e)
        }
@app.route('/')
def index():
    """Render the main page"""
    return render_template('index.html')

@app.route('/services')
def services():
    """API endpoint to get services data"""
    services_data = get_systemd_services()
    return jsonify(services_data)

@app.route('/control/<service_name>/<action>', methods=['POST'])
def control_service_endpoint(service_name, action):
    """API endpoint to control services"""
    if action not in ['start', 'stop', 'restart']:
        return jsonify({
            'success': False,
            'message': 'Invalid action. Use start, stop, or restart.'
        }), 400
    
    result = control_service(service_name, action)
    return jsonify(result)
if __name__ == '__main__':
    print("Starting SystemD Services Monitor...")
    print("Open http://localhost:5000 in your browser")
    print("Note: Service control requires sudo privileges")
    app.run(host='0.0.0.0', port=5000, debug=True)