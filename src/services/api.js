// Configuração da API
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  // Método auxiliar para fazer requisições
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`Erro na requisição para ${endpoint}:`, error);
      throw error;
    }
  }

  // Métodos do Stripe
  async createCheckoutSession(customerEmail, priceId = null) {
    return this.request('/api/stripe/create-checkout-session', {
      method: 'POST',
      body: JSON.stringify({
        customerEmail,
        priceId
      }),
    });
  }

  async getCheckoutSession(sessionId) {
    return this.request(`/api/stripe/checkout-session/${sessionId}`);
  }

  async createCustomerPortal(customerId) {
    return this.request('/api/stripe/create-customer-portal', {
      method: 'POST',
      body: JSON.stringify({
        customerId
      }),
    });
  }

  async getCustomerByEmail(email) {
    return this.request(`/api/stripe/customer/${encodeURIComponent(email)}`);
  }

  // Métodos de assinatura
  async cancelSubscription(subscriptionId, cancelImmediately = false) {
    return this.request('/api/subscriptions/cancel', {
      method: 'POST',
      body: JSON.stringify({
        subscriptionId,
        cancelImmediately
      }),
    });
  }

  async reactivateSubscription(subscriptionId) {
    return this.request('/api/subscriptions/reactivate', {
      method: 'POST',
      body: JSON.stringify({
        subscriptionId
      }),
    });
  }

  async getSubscription(subscriptionId) {
    return this.request(`/api/subscriptions/${subscriptionId}`);
  }

  async getCustomerSubscriptions(customerId) {
    return this.request(`/api/subscriptions/customer/${customerId}`);
  }

  // Método para verificar saúde do servidor
  async healthCheck() {
    return this.request('/health');
  }
}

export default new ApiService();
