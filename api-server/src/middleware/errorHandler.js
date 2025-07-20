// Middleware para manejo de errores async
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// Middleware de manejo de errores
const errorHandler = (error, req, res, next) => {
  console.error('Error:', error);
  res.status(500).json({
    success: false,
    message: 'Error interno del servidor',
    error: process.env.NODE_ENV === 'development' ? error.message : 'Error interno'
  });
};

// Middleware para rutas no encontradas
const notFoundHandler = (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint no encontrado',
    availableEndpoints: [
      'GET /api/',
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
};

module.exports = {
  asyncHandler,
  errorHandler,
  notFoundHandler
};
