const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

const database = require('./database');

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(helmet());
app.use(cors());
app.use(morgan('combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware para manejo de errores
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// Inicializar base de datos
database.initializeDatabase().catch(console.error);

// RUTAS DE LA API

// Ruta de bienvenida
app.get('/', (req, res) => {
  res.json({
    message: 'API REST de Hacienda',
    version: '1.0.0',
    endpoints: {
      users: '/api/users',
      properties: '/api/properties',
      transactions: '/api/transactions',
      payments: '/api/payments'
    },
    documentation: 'Usa Postman para probar los endpoints'
  });
});

// ==================== USUARIOS ====================

// GET /api/users - Obtener todos los usuarios
app.get('/api/users', asyncHandler(async (req, res) => {
  const users = await database.getAllUsers();
  res.json({
    success: true,
    count: users.length,
    data: users
  });
}));

// GET /api/users/:id - Obtener usuario por ID
app.get('/api/users/:id', asyncHandler(async (req, res) => {
  const { id } = req.params;
  const user = await database.getUserById(id);
  
  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'Usuario no encontrado'
    });
  }
  
  res.json({
    success: true,
    data: user
  });
}));

// POST /api/users - Crear nuevo usuario
app.post('/api/users', asyncHandler(async (req, res) => {
  const { cedula, password, name, fullName, email, phone } = req.body;
  
  if (!cedula || !password || !name || !fullName) {
    return res.status(400).json({
      success: false,
      message: 'Campos requeridos: cedula, password, name, fullName'
    });
  }
  
  const result = await database.createUser({
    cedula, password, name, fullName, email, phone
  });
  
  res.status(201).json({
    success: true,
    message: 'Usuario creado exitosamente',
    data: { id: result.id }
  });
}));

// ==================== PROPIEDADES ====================

// GET /api/properties - Obtener todas las propiedades
app.get('/api/properties', asyncHandler(async (req, res) => {
  const properties = await database.getAllProperties();
  res.json({
    success: true,
    count: properties.length,
    data: properties
  });
}));

// GET /api/properties/user/:userId - Obtener propiedades por usuario
app.get('/api/properties/user/:userId', asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const properties = await database.getPropertiesByUser(userId);
  
  res.json({
    success: true,
    count: properties.length,
    data: properties
  });
}));

// POST /api/properties - Crear nueva propiedad
app.post('/api/properties', asyncHandler(async (req, res) => {
  const { userId, propertyNumber, propertyType, address } = req.body;
  
  if (!userId || !propertyNumber || !propertyType || !address) {
    return res.status(400).json({
      success: false,
      message: 'Campos requeridos: userId, propertyNumber, propertyType, address'
    });
  }
  
  const result = await database.createProperty({
    userId, propertyNumber, propertyType, address
  });
  
  res.status(201).json({
    success: true,
    message: 'Propiedad creada exitosamente',
    data: { id: result.id }
  });
}));

// ==================== TRANSACCIONES ====================

// GET /api/transactions - Obtener todas las transacciones
app.get('/api/transactions', asyncHandler(async (req, res) => {
  const transactions = await database.getAllTransactions();
  res.json({
    success: true,
    count: transactions.length,
    data: transactions
  });
}));

// GET /api/transactions/user/:userId - Obtener transacciones por usuario
app.get('/api/transactions/user/:userId', asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const transactions = await database.getTransactionsByUser(userId);
  
  res.json({
    success: true,
    count: transactions.length,
    data: transactions
  });
}));

// POST /api/transactions - Crear nueva transacción
app.post('/api/transactions', asyncHandler(async (req, res) => {
  const { userId, referencia, estado, fecha, valor, concepto } = req.body;
  
  if (!userId || !referencia || !estado || !fecha || !valor || !concepto) {
    return res.status(400).json({
      success: false,
      message: 'Campos requeridos: userId, referencia, estado, fecha, valor, concepto'
    });
  }
  
  const result = await database.createTransaction({
    userId, referencia, estado, fecha, valor, concepto
  });
  
  res.status(201).json({
    success: true,
    message: 'Transacción creada exitosamente',
    data: { id: result.id }
  });
}));

// ==================== PAGOS ====================

// GET /api/payments - Obtener todos los pagos
app.get('/api/payments', asyncHandler(async (req, res) => {
  const payments = await database.getAllPayments();
  res.json({
    success: true,
    count: payments.length,
    data: payments
  });
}));

// GET /api/payments/user/:userId - Obtener pagos por usuario
app.get('/api/payments/user/:userId', asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const payments = await database.getPaymentsByUser(userId);
  
  res.json({
    success: true,
    count: payments.length,
    data: payments
  });
}));

// POST /api/payments - Crear nuevo pago
app.post('/api/payments', asyncHandler(async (req, res) => {
  const { userId, transactionId, paymentMethod, amount, adminNotes } = req.body;
  
  if (!userId || !transactionId || !paymentMethod || !amount) {
    return res.status(400).json({
      success: false,
      message: 'Campos requeridos: userId, transactionId, paymentMethod, amount'
    });
  }
  
  const result = await database.createPayment({
    userId, transactionId, paymentMethod, amount, adminNotes
  });
  
  res.status(201).json({
    success: true,
    message: 'Pago registrado exitosamente',
    data: { id: result.id }
  });
}));

// ==================== ENDPOINTS ESPECIALES ====================

// GET /api/stats - Estadísticas generales
app.get('/api/stats', asyncHandler(async (req, res) => {
  const [users, properties, transactions, payments] = await Promise.all([
    database.getAllUsers(),
    database.getAllProperties(),
    database.getAllTransactions(),
    database.getAllPayments()
  ]);
  
  res.json({
    success: true,
    data: {
      totalUsers: users.length,
      totalProperties: properties.length,
      totalTransactions: transactions.length,
      totalPayments: payments.length,
      activeUsers: users.filter(u => u.isActive).length,
      pendingTransactions: transactions.filter(t => !t.isApproved).length,
      completedPayments: payments.filter(p => p.status === 'completed').length
    }
  });
}));

// GET /api/export/all - Exportar todos los datos
app.get('/api/export/all', asyncHandler(async (req, res) => {
  const [users, properties, transactions, payments] = await Promise.all([
    database.getAllUsers(),
    database.getAllProperties(),
    database.getAllTransactions(),
    database.getAllPayments()
  ]);
  
  res.json({
    success: true,
    exportDate: new Date().toISOString(),
    data: {
      users,
      properties,
      transactions,
      payments
    }
  });
}));

// Middleware de manejo de errores
app.use((error, req, res, next) => {
  console.error('Error:', error);
  res.status(500).json({
    success: false,
    message: 'Error interno del servidor',
    error: process.env.NODE_ENV === 'development' ? error.message : 'Error interno'
  });
});

// Middleware para rutas no encontradas
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint no encontrado',
    availableEndpoints: [
      'GET /',
      'GET /api/users',
      'GET /api/users/:id',
      'POST /api/users',
      'GET /api/properties',
      'GET /api/properties/user/:userId',
      'POST /api/properties',
      'GET /api/transactions',
      'GET /api/transactions/user/:userId',
      'POST /api/transactions',
      'GET /api/payments',
      'GET /api/payments/user/:userId',
      'POST /api/payments',
      'GET /api/stats',
      'GET /api/export/all'
    ]
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor API ejecutándose en http://localhost:${PORT}`);
  console.log(`📊 Documentación disponible en http://localhost:${PORT}`);
  console.log(`🔧 Usa Postman para probar los endpoints`);
});

// Manejo de cierre graceful
process.on('SIGINT', () => {
  console.log('\n🛑 Cerrando servidor...');
  database.closeDatabase();
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n🛑 Cerrando servidor...');
  database.closeDatabase();
  process.exit(0);
});
