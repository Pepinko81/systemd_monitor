import type { Service, ServiceControlResponse, ServiceAction } from '../types/service';

const API_BASE_URL = '';

export const api = {
  async getServices(): Promise<Service[]> {
    const response = await fetch(`${API_BASE_URL}/services`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  },

  async controlService(serviceName: string, action: ServiceAction): Promise<ServiceControlResponse> {
    const response = await fetch(`${API_BASE_URL}/control/${encodeURIComponent(serviceName)}/${action}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  },
};
