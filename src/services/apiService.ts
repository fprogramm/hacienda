// Servicio para conectar con la API REST
const API_BASE_URL = 'http://localhost:3000/api';

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  count?: number;
  message?: string;
  error?: string;
}

interface User {
  id: number;
  cedula: string;
  name: string;
  fullName: string;
  email?: string;
  phone?: string;
  isActive: boolean;
  createdAt: string;
  lastLogin?: string;
}

interface Property {
  id: number;
  userId: number;
  propertyNumber: string;
  propertyType: string;
  address: string;
  isActive: boolean;
  userName?: string;
  userFullName?: string;
}

interface Transaction {
  id: number;
  userId: number;
  referencia: string;
  estado: string;
  fecha: string;
  valor: string;
  concepto: string;
  isApproved: boolean;
  userName?: string;
  userFullName?: string;
}

interface Payment {
  id: number;
  userId: number;
  transactionId: number;
  paymentMethod: string;
  paymentDate: string;
  amount: number;
  status: string;
  adminNotes?: string;
  createdAt: string;
  userName?: string;
  userFullName?: string;
  transactionRef?: string;
  transactionConcept?: string;
}

class ApiService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = API_BASE_URL;
  }

  // Método genérico para hacer peticiones HTTP
  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const url = `${this.baseUrl}${endpoint}`;
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('API Request Error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido',
      };
    }
  }

  // ==================== USUARIOS ====================

  // Obtener todos los usuarios
  async getAllUsers(): Promise<ApiResponse<User[]>> {
    return this.makeRequest<User[]>('/users');
  }

  // Obtener usuario por ID
  async getUserById(id: number): Promise<ApiResponse<User>> {
    return this.makeRequest<User>(`/users/${id}`);
  }

  // Crear nuevo usuario
  async createUser(userData: {
    cedula: string;
    password: string;
    name: string;
    fullName: string;
    email?: string;
    phone?: string;
  }): Promise<ApiResponse<{ id: number }>> {
    return this.makeRequest<{ id: number }>('/users', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  // Autenticar usuario (usando la API)
  async authenticateUser(cedula: string, password: string): Promise<User | null> {
    try {
      const response = await this.getAllUsers();
      if (response.success && response.data) {
        const user = response.data.find(
          (u) => u.cedula === cedula && u.isActive
        );
        // En un escenario real, la API debería manejar la autenticación
        // Por ahora, simulamos la verificación del password
        return user || null;
      }
      return null;
    } catch (error) {
      console.error('Authentication error:', error);
      return null;
    }
  }

  // ==================== PROPIEDADES ====================

  // Obtener todas las propiedades
  async getAllProperties(): Promise<ApiResponse<Property[]>> {
    return this.makeRequest<Property[]>('/properties');
  }

  // Obtener propiedades por usuario
  async getPropertiesByUser(userId: number): Promise<ApiResponse<Property[]>> {
    return this.makeRequest<Property[]>(`/properties/user/${userId}`);
  }

  // Crear nueva propiedad
  async createProperty(propertyData: {
    userId: number;
    propertyNumber: string;
    propertyType: string;
    address: string;
  }): Promise<ApiResponse<{ id: number }>> {
    return this.makeRequest<{ id: number }>('/properties', {
      method: 'POST',
      body: JSON.stringify(propertyData),
    });
  }

  // ==================== TRANSACCIONES ====================

  // Obtener todas las transacciones
  async getAllTransactions(): Promise<ApiResponse<Transaction[]>> {
    return this.makeRequest<Transaction[]>('/transactions');
  }

  // Obtener transacciones por usuario
  async getTransactionsByUser(userId: number): Promise<ApiResponse<Transaction[]>> {
    return this.makeRequest<Transaction[]>(`/transactions/user/${userId}`);
  }

  // Crear nueva transacción
  async createTransaction(transactionData: {
    userId: number;
    referencia: string;
    estado: string;
    fecha: string;
    valor: string;
    concepto: string;
  }): Promise<ApiResponse<{ id: number }>> {
    return this.makeRequest<{ id: number }>('/transactions', {
      method: 'POST',
      body: JSON.stringify(transactionData),
    });
  }

  // ==================== PAGOS ====================

  // Obtener todos los pagos
  async getAllPayments(): Promise<ApiResponse<Payment[]>> {
    return this.makeRequest<Payment[]>('/payments');
  }

  // Obtener pagos por usuario
  async getPaymentsByUser(userId: number): Promise<ApiResponse<Payment[]>> {
    return this.makeRequest<Payment[]>(`/payments/user/${userId}`);
  }

  // Crear nuevo pago
  async createPayment(paymentData: {
    userId: number;
    transactionId: number;
    paymentMethod: string;
    amount: number;
    adminNotes?: string;
  }): Promise<ApiResponse<{ id: number }>> {
    return this.makeRequest<{ id: number }>('/payments', {
      method: 'POST',
      body: JSON.stringify(paymentData),
    });
  }

  // ==================== ESTADÍSTICAS ====================

  // Obtener estadísticas generales
  async getStats(): Promise<ApiResponse<{
    totalUsers: number;
    totalProperties: number;
    totalTransactions: number;
    totalPayments: number;
    activeUsers: number;
    pendingTransactions: number;
    completedPayments: number;
  }>> {
    return this.makeRequest('/stats');
  }

  // Exportar todos los datos
  async exportAllData(): Promise<ApiResponse<{
    users: User[];
    properties: Property[];
    transactions: Transaction[];
    payments: Payment[];
  }>> {
    return this.makeRequest('/export/all');
  }

  // ==================== UTILIDADES ====================

  // Verificar conexión con la API
  async checkConnection(): Promise<boolean> {
    try {
      const response = await fetch(this.baseUrl.replace('/api', '/'));
      return response.ok;
    } catch (error) {
      console.error('API connection check failed:', error);
      return false;
    }
  }

  // Cambiar URL base de la API (útil para desarrollo/producción)
  setBaseUrl(newBaseUrl: string): void {
    this.baseUrl = newBaseUrl;
  }
}

// Exportar instancia singleton
export const apiService = new ApiService();
export default apiService;
