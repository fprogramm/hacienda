# API REST de Hacienda - Estructura Organizada

API REST para acceder a la base de datos del sistema de Hacienda desde aplicaciones externas como Postman.

## 🏗️ **Arquitectura MVC Organizada**

```
api-server/
├── src/
│   ├── controllers/         # Lógica de negocio
│   │   ├── userController.js
│   │   ├── propertyController.js
│   │   ├── transactionController.js
│   │   └── paymentController.js
│   ├── services/           # Servicios de datos
│   │   └── database.js
│   ├── routes/             # Definición de rutas
│   │   ├── index.js
│   │   ├── userRoutes.js
│   │   ├── propertyRoutes.js
│   │   ├── transactionRoutes.js
│   │   └── paymentRoutes.js
│   ├── middleware/         # Middlewares personalizados
│   │   └── errorHandler.js
│   ├── config/            # Configuraciones
│   └── utils/             # Utilidades
├── server.js              # Punto de entrada
├── package.json           # Dependencias
├── .env                   # Variables de entorno
├── .gitignore            # Archivos ignorados
├── README.md             # Documentación
└── hacienda.db           # Base de datos SQLite
```

## 🚀 Instalación y Ejecución

### 1. Instalar dependencias
```bash
cd api-server
npm install
```

### 2. Ejecutar el servidor
```bash
# Modo desarrollo (con nodemon)
npm run dev

# Modo producción
npm start
```

El servidor se ejecutará en `http://localhost:3000`

## 📋 Endpoints Disponibles

### 🏠 Información General
- `GET /` - Información del servidor y arquitectura
- `GET /api/` - Información de la API y endpoints

### 👥 Usuarios
- `GET /api/users` - Obtener todos los usuarios
- `GET /api/users/:id` - Obtener usuario por ID
- `POST /api/users` - Crear nuevo usuario

### 🏘️ Propiedades
- `GET /api/properties` - Obtener todas las propiedades
- `GET /api/properties/user/:userId` - Obtener propiedades por usuario
- `POST /api/properties` - Crear nueva propiedad

### 💰 Transacciones
- `GET /api/transactions` - Obtener todas las transacciones
- `GET /api/transactions/user/:userId` - Obtener transacciones por usuario
- `POST /api/transactions` - Crear nueva transacción

### 💳 Pagos
- `GET /api/payments` - Obtener todos los pagos
- `GET /api/payments/user/:userId` - Obtener pagos por usuario
- `POST /api/payments` - Crear nuevo pago

### 📊 Especiales
- `GET /api/stats` - Estadísticas generales del sistema
- `GET /api/export/all` - Exportar todos los datos

## 🔧 Ejemplos de Uso con Postman

### 1. Información del servidor
```
GET http://localhost:3000/
```

### 2. Obtener todos los usuarios
```
GET http://localhost:3000/api/users
```

### 3. Crear nuevo usuario
```
POST http://localhost:3000/api/users
Content-Type: application/json

{
  "cedula": "11111111",
  "password": "password123",
  "name": "Juan",
  "fullName": "Juan Pérez",
  "email": "juan@example.com",
  "phone": "3001111111"
}
```

### 4. Obtener estadísticas
```
GET http://localhost:3000/api/stats
```

## 🏗️ **Ventajas de la Nueva Estructura**

### ✅ **Separación de Responsabilidades**
- **Controllers**: Lógica de negocio y validaciones
- **Services**: Acceso a datos y operaciones de base de datos
- **Routes**: Definición de endpoints y middlewares
- **Middleware**: Funciones reutilizables (errores, validación, etc.)

### ✅ **Escalabilidad**
- Fácil agregar nuevos endpoints
- Código modular y reutilizable
- Mantenimiento simplificado

### ✅ **Organización Profesional**
- Estructura MVC estándar
- Separación clara de archivos
- Fácil navegación del código

### ✅ **Manejo de Errores Centralizado**
- Middleware de errores unificado
- Respuestas consistentes
- Logging centralizado

## 🔄 Usuarios de Prueba

La API viene con usuarios de prueba preconfigurados:

1. **Luis Fernando** - Cédula: `32165498` / Password: `123456`
2. **Admin** - Cédula: `12345678` / Password: `admin123`
3. **María** - Cédula: `87654321` / Password: `user123`

## 🛠️ Tecnologías Utilizadas

- **Node.js** - Runtime de JavaScript
- **Express.js** - Framework web
- **SQLite3** - Base de datos
- **CORS** - Manejo de CORS
- **Helmet** - Seguridad HTTP
- **Morgan** - Logging de peticiones
- **dotenv** - Variables de entorno

## � Patrón MVC Implementado

### **Model (Modelo)**
- `src/services/database.js` - Acceso a datos y lógica de base de datos

### **View (Vista)**
- Respuestas JSON estructuradas y consistentes

### **Controller (Controlador)**
- `src/controllers/` - Lógica de negocio y validaciones
- Manejo de peticiones HTTP
- Validación de datos de entrada

## 🚨 Notas Importantes

1. **Estructura Modular**: Cada funcionalidad está separada en su propio archivo
2. **Middleware Centralizado**: Manejo de errores y validaciones unificado
3. **Rutas Organizadas**: Endpoints agrupados por funcionalidad
4. **Código Limpio**: Fácil de leer, mantener y escalar
5. **Patrón MVC**: Arquitectura profesional y estándar

¡La API está completamente organizada y lista para usar! 🎉
