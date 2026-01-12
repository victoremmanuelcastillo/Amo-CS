# Amo-CS

API RESTful para gestión de usuarios, alimentos y proveedores utilizando Firebase Firestore y Express.

## Descripción

Sistema backend que proporciona endpoints CRUD completos para tres entidades principales:
- **Usuarios**: Gestión de cuentas de usuario con email y contraseña
- **Alimentos**: Catálogo de alimentos por categoría
- **Proveedores**: Información de proveedores de negocio

## Requisitos

- Node.js (v14 o superior)
- Cuenta de Firebase con Firestore habilitado
- npm o yarn

## Instalación

1. Clonar el repositorio:
```bash
git clone https://github.com/victoremmanuelcastillo/Amo-CS.git
cd Amo-CS
```

2. Instalar dependencias:
```bash
npm install
```

3. Configurar Firebase:
   - Crear un proyecto en [Firebase Console](https://console.firebase.google.com/)
   - Generar una clave privada desde "Project Settings > Service Accounts"
   - Guardar el archivo JSON como `firebase-key.json` en la raíz del proyecto

## Uso

Iniciar el servidor:
```bash
npm start
```

El servidor se ejecutará en `http://localhost:4000`

## Endpoints API

### Usuarios

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/` | Verificar estado del servidor |
| POST | `/usuario/add` | Crear nuevo usuario |
| GET | `/usuario/ver` | Obtener todos los usuarios |
| PUT | `/usuario/update/:id` | Actualizar usuario por ID |
| DELETE | `/usuario/delete/:id` | Eliminar usuario por ID |

**Ejemplo de body para crear/actualizar usuario:**
```json
{
  "email": "usuario@ejemplo.com",
  "full_name": "Nombre Completo",
  "password_hash": "hash_de_contraseña"
}
```

### Alimentos

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/alimento/add` | Crear nuevo alimento |
| GET | `/alimento/ver` | Obtener todos los alimentos |
| PUT | `/alimento/update/:id` | Actualizar alimento por ID |
| DELETE | `/alimento/delete/:id` | Eliminar alimento por ID |

**Ejemplo de body para crear/actualizar alimento:**
```json
{
  "category": "Frutas",
  "name": "Manzana"
}
```

### Proveedores

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/proveedor/add` | Crear nuevo proveedor |
| GET | `/proveedor/ver` | Obtener todos los proveedores |
| PUT | `/proveedor/update/:id` | Actualizar proveedor por ID |
| DELETE | `/proveedor/delete/:id` | Eliminar proveedor por ID |

**Ejemplo de body para crear/actualizar proveedor:**
```json
{
  "business_name": "Nombre del Negocio",
  "user_id": "id_del_usuario"
}
```

## Tecnologías

- **Express** v5.1.0 - Framework web
- **Firebase Admin SDK** v13.5.0 - Gestión de Firestore
- **CORS** v2.8.5 - Manejo de CORS
- **Axios** v1.12.2 - Cliente HTTP

## Estructura del Proyecto

```
Amo-CS/
├── index.js          # Archivo principal con todas las rutas
├── package.json      # Dependencias del proyecto
├── firebase-key.json # Credenciales de Firebase (no incluido en repo)
└── README.md         # Documentación
```

## Seguridad

**IMPORTANTE:** El archivo `firebase-key.json` contiene credenciales sensibles y no debe ser incluido en el control de versiones. Asegúrate de agregarlo al `.gitignore`.

## Licencia

ISC
