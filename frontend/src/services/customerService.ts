import { Customer } from '../types/Customer';

// API Gateway URL from CDK deployment
const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://gat72i753g.execute-api.us-east-1.amazonaws.com/prod';

class CustomerService {
  private async makeRequest(endpoint: string, options: RequestInit = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  async getAllCustomers(): Promise<Customer[]> {
    return this.makeRequest('/api/customers');
  }

  async getCustomer(customerId: string): Promise<Customer> {
    return this.makeRequest(`/api/customers/${customerId}`);
  }

  async createCustomer(customerData: Omit<Customer, 'customerId' | 'registrationDate' | 'updatedAt'>): Promise<Customer> {
    return this.makeRequest('/api/customers', {
      method: 'POST',
      body: JSON.stringify(customerData),
    });
  }

  async updateCustomer(customerId: string, customerData: Omit<Customer, 'customerId' | 'registrationDate' | 'updatedAt'>): Promise<Customer> {
    return this.makeRequest(`/api/customers/${customerId}`, {
      method: 'PUT',
      body: JSON.stringify(customerData),
    });
  }

  async deleteCustomer(customerId: string): Promise<void> {
    return this.makeRequest(`/api/customers/${customerId}`, {
      method: 'DELETE',
    });
  }
}

export const customerService = new CustomerService();
