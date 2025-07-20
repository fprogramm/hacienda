const database = require('../services/database');

class UserController {
  // GET /api/users - Obtener todos los usuarios
  async getAllUsers(req, res) {
    try {
      const users = await database.getAllUsers();
      res.json({
        success: true,
        count: users.length,
        data: users
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error al obtener usuarios',
        error: error.message
      });
    }
  }

  // GET /api/users/:id - Obtener usuario por ID
  async getUserById(req, res) {
    try {
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
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error al obtener usuario',
        error: error.message
      });
    }
  }

  // POST /api/users - Crear nuevo usuario
  async createUser(req, res) {
    try {
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
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error al crear usuario',
        error: error.message
      });
    }
  }
}

module.exports = new UserController();
