const express = require('express');
const userRoutes = require('./userRoutes');
// const propertyRoutes = require('./propertyRoutes');
// const transactionRoutes = require('./transactionRoutes');
// const paymentRoutes = require('./paymentRoutes');

const router = express.Router();

// Ruta de bienvenida de la API
router.get('/', (req, res) => {
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

// Estadísticas generales
router.get('/stats', async (req, res) => {
  try {
    const database = require('../services/database');
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
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener estadísticas',
      error: error.message
    });
  }
});

// Exportar todos los datos
router.get('/export/all', async (req, res) => {
  try {
    const database = require('../services/database');
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
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al exportar datos',
      error: error.message
    });
  }
});

// Montar rutas específicas
router.use('/users', userRoutes);
// router.use('/properties', propertyRoutes);
// router.use('/transactions', transactionRoutes);
// router.use('/payments', paymentRoutes);

module.exports = router;
