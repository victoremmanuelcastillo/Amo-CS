# API CRUD Endpoints

Este proyecto implementa operaciones CRUD completas para 3 tablas de Firebase:

## 🚀 Iniciar el servidor
```bash
npm start
```
El servidor corre en: `http://localhost:4000`

## 👥 USUARIOS
- **email** (string)
- **full_name** (string)
- **password_hash** (string)
- **user_id** (auto-generado por Firebase)

### Endpoints:
- **POST** `/usuario/add` - Crear usuario
- **GET** `/usuario/ver` - Obtener todos los usuarios
- **PUT** `/usuario/update/:id` - Actualizar usuario
- **DELETE** `/usuario/delete/:id` - Eliminar usuario

## 🍎 ALIMENTOS
- **category** (string)
- **name** (string)
- **item_id** (auto-generado por Firebase)

### Endpoints:
- **POST** `/alimento/add` - Crear alimento
- **GET** `/alimento/ver` - Obtener todos los alimentos
- **PUT** `/alimento/update/:id` - Actualizar alimento
- **DELETE** `/alimento/delete/:id` - Eliminar alimento

## 🏢 PROVEEDORES
- **business_name** (string)
- **user_id** (string)
- **provider_id** (auto-generado por Firebase)

### Endpoints:
- **POST** `/proveedor/add` - Crear proveedor
- **GET** `/proveedor/ver` - Obtener todos los proveedores
- **PUT** `/proveedor/update/:id` - Actualizar proveedor
- **DELETE** `/proveedor/delete/:id` - Eliminar proveedor

## 🧪 Probar la API
```bash
node test-crud.js
```

## 📝 Ejemplos de uso

### Crear Usuario
```bash
curl -X POST http://localhost:4000/usuario/add \
  -H "Content-Type: application/json" \
  -d '{"email":"test@email.com","full_name":"Juan Pérez","password_hash":"hash123"}'
```

### Crear Alimento
```bash
curl -X POST http://localhost:4000/alimento/add \
  -H "Content-Type: application/json" \
  -d '{"category":"Frutas","name":"Manzana"}'
```

### Crear Proveedor
```bash
curl -X POST http://localhost:4000/proveedor/add \
  -H "Content-Type: application/json" \
  -d '{"business_name":"Distribuidora ABC","user_id":"USER_ID_AQUI"}'
```