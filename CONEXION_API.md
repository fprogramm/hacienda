# 🔗 Guía de Conexión: App React Native ↔ API REST

Esta guía te explica cómo conectar tu aplicación React Native con la API REST para sincronizar datos.

## 🚀 **Pasos para Conectar**

### 1. **Iniciar el Servidor API**
```bash
# Navegar al directorio de la API
cd api-server

# Instalar dependencias (solo la primera vez)
npm install

# Iniciar el servidor
npm start
```

El servidor se ejecutará en `http://localhost:3000`

### 2. **Configurar la App React Native**
```bash
# En otra terminal, navegar al directorio principal
cd d:\03-PROYECTO2024_2\hacienda

# Iniciar la app React Native
npm start
```

### 3. **Conectar desde la App**
1. **Abrir la app** en tu dispositivo/emulador
2. **Iniciar sesión** con cualquiera de estos usuarios:
   - `32165498` / `123456` (Luis Fernando)
   - `12345678` / `admin123` (Admin)
   - `87654321` / `user123` (María)
3. **Ir a "Configuración API"** desde el menú principal
4. **Verificar la URL**: `http://localhost:3000/api`
5. **Presionar "Probar Conexión"**

## 🔄 **Modos de Funcionamiento**

### ✅ **Modo Conectado (API Disponible)**
- ✅ Datos sincronizados con el servidor
- ✅ Acceso a todos los usuarios, propiedades, transacciones y pagos
- ✅ Estadísticas en tiempo real
- ✅ Exportación de datos
- ✅ Acceso desde Postman y otras aplicaciones

### 📱 **Modo Offline (API No Disponible)**
- ⚠️ Datos locales limitados
- ⚠️ Solo usuarios hardcodeados disponibles
- ⚠️ Datos mock para propiedades y transacciones
- ⚠️ Sin sincronización con servidor

## 🛠️ **Configuración de Red**

### **Para Emulador Android:**
- URL: `http://10.0.2.2:3000/api`

### **Para Dispositivo Físico:**
- Encuentra tu IP local: `ipconfig` (Windows) o `ifconfig` (Mac/Linux)
- URL: `http://[TU_IP]:3000/api`
- Ejemplo: `http://192.168.1.100:3000/api`

### **Para iOS Simulator:**
- URL: `http://localhost:3000/api`

## 📊 **Endpoints Disponibles**

Una vez conectado, puedes usar estos endpoints desde Postman:

### **Usuarios**
- `GET http://localhost:3000/api/users` - Todos los usuarios
- `GET http://localhost:3000/api/users/1` - Usuario específico
- `POST http://localhost:3000/api/users` - Crear usuario

### **Propiedades**
- `GET http://localhost:3000/api/properties` - Todas las propiedades
- `GET http://localhost:3000/api/properties/user/1` - Por usuario

### **Transacciones**
- `GET http://localhost:3000/api/transactions` - Todas las transacciones
- `GET http://localhost:3000/api/transactions/user/1` - Por usuario

### **Pagos**
- `GET http://localhost:3000/api/payments` - Todos los pagos
- `GET http://localhost:3000/api/payments/user/1` - Por usuario

### **Especiales**
- `GET http://localhost:3000/api/stats` - Estadísticas generales
- `GET http://localhost:3000/api/export/all` - Exportar todos los datos

## 🔧 **Solución de Problemas**

### **❌ "No se puede conectar a la API"**
1. Verificar que el servidor API esté ejecutándose
2. Comprobar la URL en la configuración
3. Verificar la conexión de red
4. Para dispositivos físicos, usar la IP local

### **❌ "Error CORS"**
- El servidor ya tiene CORS habilitado
- Verificar que la URL no tenga espacios extra

### **❌ "Timeout de conexión"**
- Verificar firewall/antivirus
- Probar desde el navegador: `http://localhost:3000`

### **❌ "Datos no se actualizan"**
- Presionar "Actualizar Estadísticas" en la app
- Reiniciar el servidor API si es necesario

## 🎯 **Flujo de Trabajo Recomendado**

### **Para Desarrollo:**
1. Iniciar servidor API: `cd api-server && npm start`
2. Iniciar app React Native: `npm start`
3. Conectar desde la app usando `http://localhost:3000/api`
4. Usar Postman para probar endpoints

### **Para Producción:**
1. Desplegar API en servidor (Heroku, AWS, etc.)
2. Actualizar URL en la app
3. Configurar variables de entorno
4. Usar HTTPS en producción

## 📱 **Características de la Integración**

### **En la App React Native:**
- ✅ Detección automática de conexión
- ✅ Fallback a modo offline
- ✅ Indicador visual de estado de conexión
- ✅ Sincronización de datos en tiempo real
- ✅ Manejo de errores robusto

### **En la API REST:**
- ✅ Estructura MVC organizada
- ✅ Validación de datos
- ✅ Manejo de errores centralizado
- ✅ Logging de peticiones
- ✅ Documentación completa

## 🎉 **¡Listo!**

Una vez conectado, tendrás:
- 📱 App React Native funcional con datos reales
- 🌐 API REST accesible desde Postman
- 🔄 Sincronización bidireccional
- 📊 Estadísticas en tiempo real
- 🛠️ Sistema escalable y profesional

¡Tu sistema está completamente integrado y listo para usar! 🚀
