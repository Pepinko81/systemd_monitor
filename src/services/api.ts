import type { Service, ServiceControlResponse, ServiceAction } from '../types/service';

const API_BASE_URL = '';

export const api = {
  async getServices(): Promise<Service[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/services`);

      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Flask backend is not running. Please start it with: python3 app.py');
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return response.json();
    } catch (error) {
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error('Cannot connect to Flask backend. Make sure it is running on port 5000.');
      }
      throw error;
    }
  },

  async controlService(serviceName: string, action: ServiceAction): Promise<ServiceControlResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/control/${encodeURIComponent(serviceName)}/${action}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Flask backend is not responding correctly');
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return response.json();
    } catch (error) {
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error('Cannot connect to Flask backend');
      }
      throw error;
    }
  },
};
