const sqlite3 = require('sqlite3').verbose();
const path = require('path');

class DatabaseService {
  constructor() {
    this.db = null;
    // Usar ruta relativa desde la raíz del proyecto
    this.dbPath = path.join(process.cwd(), 'api-server', 'hacienda.db');
  }

  // Inicializar base de datos
  async initializeDatabase() {
    return new Promise((resolve, reject) => {
      this.db = new sqlite3.Database(this.dbPath, (err) => {
        if (err) {
          console.error('Error opening database:', err);
          reject(err);
        } else {
          console.log('Connected to SQLite database');
          this.createTables().then(resolve).catch(reject);
        }
      });
    });
  }

  // Crear tablas
  async createTables() {
    const tables = [
      `CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        cedula TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        name TEXT NOT NULL,
        fullName TEXT NOT NULL,
        email TEXT,
        phone TEXT,
        isActive BOOLEAN DEFAULT 1,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        lastLogin DATETIME
      )`,
      `CREATE TABLE IF NOT EXISTS properties (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        userId INTEGER NOT NULL,
        propertyNumber TEXT NOT NULL,
        propertyType TEXT NOT NULL,
        address TEXT NOT NULL,
        isActive BOOLEAN DEFAULT 1,
        FOREIGN KEY (userId) REFERENCES users (id)
      )`,
      `CREATE TABLE IF NOT EXISTS transactions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        userId INTEGER NOT NULL,
        referencia TEXT NOT NULL,
        estado TEXT NOT NULL,
        fecha TEXT NOT NULL,
        valor TEXT NOT NULL,
        concepto TEXT NOT NULL,
        isApproved BOOLEAN DEFAULT 0,
        FOREIGN KEY (userId) REFERENCES users (id)
      )`,
      `CREATE TABLE IF NOT EXISTS payments (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        userId INTEGER NOT NULL,
        transactionId INTEGER NOT NULL,
        paymentMethod TEXT NOT NULL,
        paymentDate DATETIME DEFAULT CURRENT_TIMESTAMP,
        amount REAL NOT NULL,
        status TEXT DEFAULT 'pending',
        adminNotes TEXT,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (userId) REFERENCES users (id),
        FOREIGN KEY (transactionId) REFERENCES transactions (id)
      )`
    ];

    for (const table of tables) {
      await this.runQuery(table);
    }

    // Insertar datos iniciales si no existen
    await this.seedInitialData();
  }

  // Insertar datos iniciales
  async seedInitialData() {
    const userCount = await this.getQuery('SELECT COUNT(*) as count FROM users');
    
    if (userCount.count === 0) {
      const initialUsers = [
        {
          cedula: '32165498',
          password: '123456',
          name: 'Luis Fernando',
          fullName: 'Luis Fernando García',
          email: 'luis@hacienda.com',
          phone: '3001234567',
          isActive: 1
        },
        {
          cedula: '12345678',
          password: 'admin123',
          name: 'Admin',
          fullName: 'Administrador Sistema',
          email: 'admin@hacienda.com',
          phone: '3009876543',
          isActive: 1
        },
        {
          cedula: '87654321',
          password: 'user123',
          name: 'María',
          fullName: 'María González',
          email: 'maria@hacienda.com',
          phone: '3005555555',
          isActive: 1
        }
      ];

      for (const user of initialUsers) {
        await this.runQuery(
          'INSERT INTO users (cedula, password, name, fullName, email, phone, isActive) VALUES (?, ?, ?, ?, ?, ?, ?)',
          [user.cedula, user.password, user.name, user.fullName, user.email, user.phone, user.isActive]
        );
      }

      console.log('Initial users created');
    }
  }

  // Ejecutar query
  runQuery(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.run(sql, params, function(err) {
        if (err) {
          reject(err);
        } else {
          resolve({ id: this.lastID, changes: this.changes });
        }
      });
    });
  }

  // Obtener un registro
  getQuery(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.get(sql, params, (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row);
        }
      });
    });
  }

  // Obtener múltiples registros
  allQuery(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.all(sql, params, (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }

  // MÉTODOS PARA LA API

  // Obtener todos los usuarios
  async getAllUsers() {
    return await this.allQuery('SELECT * FROM users ORDER BY createdAt DESC');
  }

  // Obtener usuario por ID
  async getUserById(id) {
    return await this.getQuery('SELECT * FROM users WHERE id = ?', [id]);
  }

  // Obtener todas las propiedades
  async getAllProperties() {
    return await this.allQuery(`
      SELECT p.*, u.name as userName, u.fullName as userFullName 
      FROM properties p 
      LEFT JOIN users u ON p.userId = u.id 
      ORDER BY p.id DESC
    `);
  }

  // Obtener propiedades por usuario
  async getPropertiesByUser(userId) {
    return await this.allQuery('SELECT * FROM properties WHERE userId = ?', [userId]);
  }

  // Obtener todas las transacciones
  async getAllTransactions() {
    return await this.allQuery(`
      SELECT t.*, u.name as userName, u.fullName as userFullName 
      FROM transactions t 
      LEFT JOIN users u ON t.userId = u.id 
      ORDER BY t.fecha DESC
    `);
  }

  // Obtener transacciones por usuario
  async getTransactionsByUser(userId) {
    return await this.allQuery('SELECT * FROM transactions WHERE userId = ?', [userId]);
  }

  // Obtener todos los pagos
  async getAllPayments() {
    return await this.allQuery(`
      SELECT p.*, u.name as userName, u.fullName as userFullName,
             t.referencia as transactionRef, t.concepto as transactionConcept
      FROM payments p 
      LEFT JOIN users u ON p.userId = u.id 
      LEFT JOIN transactions t ON p.transactionId = t.id
      ORDER BY p.createdAt DESC
    `);
  }

  // Obtener pagos por usuario
  async getPaymentsByUser(userId) {
    return await this.allQuery(`
      SELECT p.*, t.referencia as transactionRef, t.concepto as transactionConcept
      FROM payments p 
      LEFT JOIN transactions t ON p.transactionId = t.id
      WHERE p.userId = ?
      ORDER BY p.createdAt DESC
    `, [userId]);
  }

  // Crear nuevo usuario
  async createUser(userData) {
    const { cedula, password, name, fullName, email, phone } = userData;
    return await this.runQuery(
      'INSERT INTO users (cedula, password, name, fullName, email, phone) VALUES (?, ?, ?, ?, ?, ?)',
      [cedula, password, name, fullName, email, phone]
    );
  }

  // Crear nueva propiedad
  async createProperty(propertyData) {
    const { userId, propertyNumber, propertyType, address } = propertyData;
    return await this.runQuery(
      'INSERT INTO properties (userId, propertyNumber, propertyType, address) VALUES (?, ?, ?, ?)',
      [userId, propertyNumber, propertyType, address]
    );
  }

  // Crear nueva transacción
  async createTransaction(transactionData) {
    const { userId, referencia, estado, fecha, valor, concepto } = transactionData;
    return await this.runQuery(
      'INSERT INTO transactions (userId, referencia, estado, fecha, valor, concepto) VALUES (?, ?, ?, ?, ?, ?)',
      [userId, referencia, estado, fecha, valor, concepto]
    );
  }

  // Crear nuevo pago
  async createPayment(paymentData) {
    const { userId, transactionId, paymentMethod, amount, adminNotes } = paymentData;
    return await this.runQuery(
      'INSERT INTO payments (userId, transactionId, paymentMethod, amount, adminNotes) VALUES (?, ?, ?, ?, ?)',
      [userId, transactionId, paymentMethod, amount, adminNotes]
    );
  }

  // Cerrar conexión
  closeDatabase() {
    if (this.db) {
      this.db.close((err) => {
        if (err) {
          console.error('Error closing database:', err);
        } else {
          console.log('Database connection closed');
        }
      });
    }
  }
}

module.exports = new DatabaseService();
