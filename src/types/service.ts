export interface Service {
  name: string;
  description: string;
  status: 'active' | 'inactive' | 'failed';
  active_state: string;
  sub_state: string;
}

export interface ServiceControlResponse {
  success: boolean;
  message: string;
  output?: string;
  error?: string;
}

export type ServiceAction = 'start' | 'stop' | 'restart';
