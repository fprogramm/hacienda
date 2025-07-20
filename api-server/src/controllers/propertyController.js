const database = require('../services/database');

class PropertyController {
  // GET /api/properties - Obtener todas las propiedades
  async getAllProperties(req, res) {
    try {
      const properties = await database.getAllProperties();
      res.json({
        success: true,
        count: properties.length,
        data: properties
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error al obtener propiedades',
        error: error.message
      });
    }
  }

  // GET /api/properties/user/:userId - Obtener propiedades por usuario
  async getPropertiesByUser(req, res) {
    try {
      const { userId } = req.params;
      const properties = await database.getPropertiesByUser(userId);
      
      res.json({
        success: true,
        count: properties.length,
        data: properties
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error al obtener propiedades del usuario',
        error: error.message
      });
    }
  }

  // POST /api/properties - Crear nueva propiedad
  async createProperty(req, res) {
    try {
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
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error al crear propiedad',
        error: error.message
      });
    }
  }
}

module.exports = new PropertyController();
