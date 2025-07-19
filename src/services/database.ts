import * as SQLite from 'expo-sqlite';
import { User } from '../types';

interface DatabaseUser {
  id: number;
  cedula: string;
  password: string;
  name: string;
  fullName: string;
  email?: string;
  phone?: string;
  isActive: boolean;
  createdAt: string;
  lastLogin?: string;
}

interface UserProperty {
  id: number;
  userId: number;
  propertyNumber: string;
  propertyType: string;
  address: string;
  isActive: boolean;
}

interface UserTransaction {
  id: number;
  userId: number;
  referencia: string;
  estado: string;
  fecha: string;
  valor: string;
  concepto: string;
  isApproved: boolean;
}

interface PaymentRecord {
  id: number;
  userId: number;
  transactionId: number;
  paymentMethod: string;
  paymentDate: string;
  amount: number;
  status: 'pending' | 'completed' | 'failed';
  adminNotes?: string;
  createdAt: string;
}

export interface ExtendedPaymentRecord extends PaymentRecord {
  userName: string;
  userCedula: string;
  transactionReference: string;
  transactionConcept: string;
}

interface ImportData {
  users?: any[];
  properties?: any[];
  transactions?: any[];
  payments?: any[];
}

class DatabaseService {
  private db: SQLite.SQLiteDatabase | null = null;

  async initializeDatabase(): Promise<void> {
    try {
      this.db = await SQLite.openDatabaseAsync('hacienda.db');
      await this.createTables();
      await this.seedInitialData();
    } catch (error) {
      console.error('Error initializing database:', error);
      throw error;
    }
  }

  private async createTables(): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    const createUsersTable = `
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        cedula TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        name TEXT NOT NULL,
        fullName TEXT NOT NULL,
        email TEXT,
        phone TEXT,
        isActive INTEGER DEFAULT 1,
        createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
        lastLogin TEXT
      );
    `;

    const createPropertiesTable = `
      CREATE TABLE IF NOT EXISTS user_properties (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        userId INTEGER NOT NULL,
        propertyNumber TEXT NOT NULL,
        propertyType TEXT NOT NULL,
        address TEXT NOT NULL,
        isActive INTEGER DEFAULT 1,
        FOREIGN KEY (userId) REFERENCES users (id)
      );
    `;

    const createTransactionsTable = `
      CREATE TABLE IF NOT EXISTS user_transactions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        userId INTEGER NOT NULL,
        referencia TEXT NOT NULL,
        estado TEXT NOT NULL,
        fecha TEXT NOT NULL,
        valor TEXT NOT NULL,
        concepto TEXT NOT NULL,
        isApproved INTEGER DEFAULT 0,
        FOREIGN KEY (userId) REFERENCES users (id)
      );
    `;

    const createPaymentsTable = `
      CREATE TABLE IF NOT EXISTS payment_records (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        userId INTEGER NOT NULL,
        transactionId INTEGER NOT NULL,
        paymentMethod TEXT NOT NULL,
        paymentDate TEXT NOT NULL,
        amount REAL NOT NULL,
        status TEXT DEFAULT 'pending',
        adminNotes TEXT,
        createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (userId) REFERENCES users (id),
        FOREIGN KEY (transactionId) REFERENCES user_transactions (id)
      );
    `;

    await this.db.execAsync(createUsersTable);
    await this.db.execAsync(createPropertiesTable);
    await this.db.execAsync(createTransactionsTable);
    await this.db.execAsync(createPaymentsTable);
  }

  private async seedInitialData(): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    // Verificar si ya existen usuarios
    const existingUsers = await this.db.getFirstAsync(
      'SELECT COUNT(*) as count FROM users'
    ) as { count: number };

    if (existingUsers.count === 0) {
      // Insertar usuarios iniciales
      const insertUsers = `
        INSERT INTO users (cedula, password, name, fullName, email, phone) VALUES
        ('32165498', '123456', 'Luis Fernando', 'Luis Fernando Delgado Arboleda', 'luis.delgado@email.com', '+57 300 123 4567'),
        ('12345678', 'admin123', 'Admin', 'Administrador Sistema', 'admin@hacienda.gov.co', '+57 300 000 0000'),
        ('87654321', 'user123', 'María', 'María González Pérez', 'maria.gonzalez@email.com', '+57 300 111 1111');
      `;

      await this.db.execAsync(insertUsers);

      // Insertar propiedades para los usuarios
      const insertProperties = `
        INSERT INTO user_properties (userId, propertyNumber, propertyType, address) VALUES
        (1, '890628', 'RESIDENCIAL', 'Calle 15 #23-45, Liborina'),
        (1, '890629', 'COMERCIAL', 'Carrera 8 #12-34, Liborina'),
        (2, '890630', 'RESIDENCIAL', 'Calle 10 #15-20, Liborina'),
        (3, '890631', 'RESIDENCIAL', 'Carrera 5 #8-12, Liborina');
      `;

      await this.db.execAsync(insertProperties);

      // Insertar transacciones para los usuarios
      const insertTransactions = `
        INSERT INTO user_transactions (userId, referencia, estado, fecha, valor, concepto, isApproved) VALUES
        (1, '000131717545562O', 'Rechazada', '2017-09-06 13:25:24', 'COP $73,375.00', 'Impuesto Predial', 0),
        (1, '000131717545563P', 'Rechazada', '2017-09-06 11:29:06', 'COP $73,375.00', 'Impuesto Predial', 0),
        (1, '000131117479050S', 'Aprobada', '2011-08-03 12:26:37', 'COP $16,882.00', 'Impuesto Predial', 1),
        (2, '000141217148344Z', 'Aprobada', '2012-12-09 14:14:40', 'COP $25,000.00', 'Industria y Comercio', 1),
        (3, '000151318256789A', 'Aprobada', '2018-05-15 09:30:15', 'COP $45,500.00', 'Impuesto Predial', 1);
      `;

      await this.db.execAsync(insertTransactions);

      console.log('Initial data seeded successfully');
    }
  }

  async authenticateUser(cedula: string, password: string): Promise<DatabaseUser | null> {
    if (!this.db) throw new Error('Database not initialized');

    try {
      const user = await this.db.getFirstAsync(
        'SELECT * FROM users WHERE cedula = ? AND password = ? AND isActive = 1',
        [cedula, password]
      ) as DatabaseUser | null;

      if (user) {
        // Actualizar último login
        await this.updateLastLogin(user.id);
        return user;
      }

      return null;
    } catch (error) {
      console.error('Error authenticating user:', error);
      throw error;
    }
  }

  async getUserByCedula(cedula: string): Promise<DatabaseUser | null> {
    if (!this.db) throw new Error('Database not initialized');

    try {
      const user = await this.db.getFirstAsync(
        'SELECT * FROM users WHERE cedula = ? AND isActive = 1',
        [cedula]
      ) as DatabaseUser | null;

      return user;
    } catch (error) {
      console.error('Error getting user by cedula:', error);
      throw error;
    }
  }

  async getUserProperties(userId: number): Promise<UserProperty[]> {
    if (!this.db) throw new Error('Database not initialized');

    try {
      const properties = await this.db.getAllAsync(
        'SELECT * FROM user_properties WHERE userId = ? AND isActive = 1',
        [userId]
      ) as UserProperty[];

      return properties;
    } catch (error) {
      console.error('Error getting user properties:', error);
      throw error;
    }
  }

  async getUserTransactions(userId: number): Promise<UserTransaction[]> {
    if (!this.db) throw new Error('Database not initialized');

    try {
      const transactions = await this.db.getAllAsync(
        'SELECT * FROM user_transactions WHERE userId = ? ORDER BY fecha DESC',
        [userId]
      ) as UserTransaction[];

      return transactions;
    } catch (error) {
      console.error('Error getting user transactions:', error);
      throw error;
    }
  }

  private async updateLastLogin(userId: number): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    await this.db.runAsync(
      'UPDATE users SET lastLogin = CURRENT_TIMESTAMP WHERE id = ?',
      [userId]
    );
  }

  async createUser(userData: Omit<DatabaseUser, 'id' | 'createdAt' | 'lastLogin'>): Promise<number> {
    if (!this.db) throw new Error('Database not initialized');

    try {
      const result = await this.db.runAsync(
        `INSERT INTO users (cedula, password, name, fullName, email, phone, isActive) 
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          userData.cedula,
          userData.password,
          userData.name,
          userData.fullName,
          userData.email || null,
          userData.phone || null,
          userData.isActive ? 1 : 0
        ]
      );

      return result.lastInsertRowId;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  async getAllUsers(): Promise<DatabaseUser[]> {
    if (!this.db) throw new Error('Database not initialized');

    try {
      const users = await this.db.getAllAsync(
        'SELECT * FROM users WHERE isActive = 1 ORDER BY fullName'
      ) as DatabaseUser[];

      return users;
    } catch (error) {
      console.error('Error getting all users:', error);
      throw error;
    }
  }

  async importDataFromJSON(jsonData: ImportData): Promise<{ success: boolean; message: string }> {
    if (!this.db) throw new Error('Database not initialized');

    try {
      await this.db.execAsync('BEGIN TRANSACTION');

      let importedCount = 0;

      // Importar usuarios
      if (jsonData.users && jsonData.users.length > 0) {
        for (const user of jsonData.users) {
          await this.importUser(user);
          importedCount++;
        }
      }

      // Importar propiedades
      if (jsonData.properties && jsonData.properties.length > 0) {
        for (const property of jsonData.properties) {
          await this.importProperty(property);
          importedCount++;
        }
      }

      // Importar transacciones
      if (jsonData.transactions && jsonData.transactions.length > 0) {
        for (const transaction of jsonData.transactions) {
          await this.importTransaction(transaction);
          importedCount++;
        }
      }

      // Importar pagos
      if (jsonData.payments && jsonData.payments.length > 0) {
        for (const payment of jsonData.payments) {
          await this.importPayment(payment);
          importedCount++;
        }
      }

      await this.db.execAsync('COMMIT');
      return { success: true, message: `${importedCount} registros importados exitosamente` };

    } catch (error) {
      await this.db.execAsync('ROLLBACK');
      console.error('Error importing data:', error);
      return { success: false, message: `Error al importar datos: ${error}` };
    }
  }

  private async importUser(userData: any): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    const existingUser = await this.db.getFirstAsync(
      'SELECT id FROM users WHERE cedula = ?',
      [userData.cedula]
    );

    if (!existingUser) {
      await this.db.runAsync(
        `INSERT INTO users (cedula, password, name, fullName, email, phone, isActive) 
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          userData.cedula,
          userData.password || '123456', // Password por defecto
          userData.name,
          userData.fullName,
          userData.email || null,
          userData.phone || null,
          userData.isActive !== false ? 1 : 0
        ]
      );
    }
  }

  private async importProperty(propertyData: any): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    // Buscar usuario por cédula
    const user = await this.db.getFirstAsync(
      'SELECT id FROM users WHERE cedula = ?',
      [propertyData.userCedula]
    ) as { id: number } | null;

    if (user) {
      await this.db.runAsync(
        `INSERT INTO user_properties (userId, propertyNumber, propertyType, address, isActive) 
         VALUES (?, ?, ?, ?, ?)`,
        [
          user.id,
          propertyData.propertyNumber,
          propertyData.propertyType,
          propertyData.address,
          propertyData.isActive !== false ? 1 : 0
        ]
      );
    }
  }

  private async importTransaction(transactionData: any): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    // Buscar usuario por cédula
    const user = await this.db.getFirstAsync(
      'SELECT id FROM users WHERE cedula = ?',
      [transactionData.userCedula]
    ) as { id: number } | null;

    if (user) {
      await this.db.runAsync(
        `INSERT INTO user_transactions (userId, referencia, estado, fecha, valor, concepto, isApproved) 
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          user.id,
          transactionData.referencia,
          transactionData.estado,
          transactionData.fecha,
          transactionData.valor,
          transactionData.concepto,
          transactionData.isApproved ? 1 : 0
        ]
      );
    }
  }

  private async importPayment(paymentData: any): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    // Buscar usuario y transacción
    const user = await this.db.getFirstAsync(
      'SELECT id FROM users WHERE cedula = ?',
      [paymentData.userCedula]
    ) as { id: number } | null;

    const transaction = await this.db.getFirstAsync(
      'SELECT id FROM user_transactions WHERE referencia = ?',
      [paymentData.transactionReference]
    ) as { id: number } | null;

    if (user && transaction) {
      await this.db.runAsync(
        `INSERT INTO payment_records (userId, transactionId, paymentMethod, paymentDate, amount, status, adminNotes) 
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          user.id,
          transaction.id,
          paymentData.paymentMethod,
          paymentData.paymentDate,
          parseFloat(paymentData.amount),
          paymentData.status || 'pending',
          paymentData.adminNotes || null
        ]
      );
    }
  }

  async registerPayment(userId: number, transactionId: number, paymentData: {
    paymentMethod: string;
    amount: number;
    adminNotes?: string;
  }): Promise<{ success: boolean; paymentId?: number; message: string }> {
    if (!this.db) throw new Error('Database not initialized');

    try {
      const result = await this.db.runAsync(
        `INSERT INTO payment_records (userId, transactionId, paymentMethod, paymentDate, amount, status, adminNotes) 
         VALUES (?, ?, ?, ?, ?, 'completed', ?)`,
        [
          userId,
          transactionId,
          paymentData.paymentMethod,
          new Date().toISOString(),
          paymentData.amount,
          paymentData.adminNotes || null
        ]
      );

      // Actualizar estado de la transacción a aprobada
      await this.db.runAsync(
        'UPDATE user_transactions SET estado = ?, isApproved = 1 WHERE id = ?',
        ['Aprobada', transactionId]
      );

      return {
        success: true,
        paymentId: result.lastInsertRowId,
        message: 'Pago registrado exitosamente'
      };

    } catch (error) {
      console.error('Error registering payment:', error);
      return {
        success: false,
        message: `Error al registrar pago: ${error}`
      };
    }
  }

  async getAllPayments(): Promise<ExtendedPaymentRecord[]> {
    if (!this.db) throw new Error('Database not initialized');

    try {
      const payments = await this.db.getAllAsync(`
        SELECT 
          pr.*,
          u.fullName as userName,
          u.cedula as userCedula,
          ut.referencia as transactionReference,
          ut.concepto as transactionConcept
        FROM payment_records pr
        JOIN users u ON pr.userId = u.id
        JOIN user_transactions ut ON pr.transactionId = ut.id
        ORDER BY pr.paymentDate DESC
      `) as any[];

      return payments;
    } catch (error) {
      console.error('Error getting all payments:', error);
      throw error;
    }
  }

  async getPaymentsByDateRange(startDate: string, endDate: string): Promise<ExtendedPaymentRecord[]> {
    if (!this.db) throw new Error('Database not initialized');

    try {
      const payments = await this.db.getAllAsync(`
        SELECT 
          pr.*,
          u.fullName as userName,
          u.cedula as userCedula,
          ut.referencia as transactionReference,
          ut.concepto as transactionConcept
        FROM payment_records pr
        JOIN users u ON pr.userId = u.id
        JOIN user_transactions ut ON pr.transactionId = ut.id
        WHERE pr.paymentDate BETWEEN ? AND ?
        ORDER BY pr.paymentDate DESC
      `, [startDate, endDate]) as any[];

      return payments;
    } catch (error) {
      console.error('Error getting payments by date range:', error);
      throw error;
    }
  }

  async exportPaymentsToJSON(): Promise<string> {
    if (!this.db) throw new Error('Database not initialized');

    try {
      const payments = await this.getAllPayments();
      return JSON.stringify(payments, null, 2);
    } catch (error) {
      console.error('Error exporting payments:', error);
      throw error;
    }
  }

  // Convertir DatabaseUser a User (tipo de la app)
  convertToAppUser(dbUser: DatabaseUser): User {
    return {
      name: dbUser.name,
      fullName: dbUser.fullName,
      cedula: dbUser.cedula,
      email: dbUser.email || undefined,
    };
  }

  async closeDatabase(): Promise<void> {
    if (this.db) {
      await this.db.closeAsync();
      this.db = null;
    }
  }
}

// Singleton instance
export const databaseService = new DatabaseService();
