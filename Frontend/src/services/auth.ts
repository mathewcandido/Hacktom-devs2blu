import type { LoginCredentials, User } from '../types/Auth';

// Mock users database
const MOCK_USERS: User[] = [
  {
    id: '1',
    email: 'admin@hacktom.com',
    name: 'Administrador',
    role: 'admin',
  },
  {
    id: '2',
    email: 'leader@hacktom.com',
    name: 'Líder Técnico',
    role: 'leader',
  },
  {
    id: '3',
    email: 'participant@hacktom.com',
    name: 'Participante',
    role: 'participant',
  },
];

// Mock authentication service
export class AuthService {
  private static readonly STORAGE_KEY = 'hacktom_auth_token';
  private static readonly USER_KEY = 'hacktom_user';

  static async login(credentials: LoginCredentials): Promise<User> {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    const user = MOCK_USERS.find(u => u.email === credentials.email);
    
    if (!user) {
      throw new Error('Usuário não encontrado');
    }

    // Mock password validation (in real app, this would be done server-side)
    if (credentials.password !== '123456') {
      throw new Error('Senha incorreta');
    }

    // Store mock token and user in localStorage
    const mockToken = `mock_token_${user.id}_${Date.now()}`;
    localStorage.setItem(this.STORAGE_KEY, mockToken);
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));

    return user;
  }

  static logout(): void {
    localStorage.removeItem(this.STORAGE_KEY);
    localStorage.removeItem(this.USER_KEY);
  }

  static getCurrentUser(): User | null {
    try {
      const token = localStorage.getItem(this.STORAGE_KEY);
      const userData = localStorage.getItem(this.USER_KEY);
      
      if (!token || !userData) {
        return null;
      }

      return JSON.parse(userData);
    } catch {
      return null;
    }
  }

  static isAuthenticated(): boolean {
    return !!localStorage.getItem(this.STORAGE_KEY);
  }
}