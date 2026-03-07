# URL Shortener Backend

Backend robusto y escalable para un sistema de acortamiento de URLs con gestión avanzada de usuarios, roles, permisos y grupos.

## 📋 Descripción

Sistema backend completo de acortador de URLs que permite a los usuarios crear, gestionar y compartir enlaces cortos de manera segura. Implementa un sistema de autenticación basado en JWT con control de acceso basado en roles (RBAC), permitiendo la gestión granular de permisos y la organización de URLs en grupos como tambnien añadir a favoritos las url que desea el usuario.

### Características Principales

- 🔗 **Acortamiento de URLs**: Genera enlaces cortos únicos con algoritmo Snowflake de Twitter
- ⚡ **IDs Distribuidos**: Sistema escalable que genera millones de códigos por segundo
- 🔐 **Autenticación JWT**: Sistema seguro de autenticación con tokens
- 👥 **Sistema RBAC**: Control de acceso basado en roles y permisos
- 📁 **Gestión de Grupos**: Organiza URLs en grupos categorizados
- 🔒 **URLs Protegidas**: URLs privadas con protección por contraseña
- ⭐ **Favoritos**: Marca URLs como favoritas para acceso rápido
- 📊 **Estadísticas**: Seguimiento y análisis de uso de URLs (en desarrollo)
- 🌐 **URLs Públicas**: Compartir enlaces sin necesidad de autenticación

## 🛠️ Stack Tecnológico

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js 5.x
- **Lenguaje**: TypeScript 5.x
- **ORM**: Prisma 7.x con Prisma Client
- **Base de Datos**: PostgreSQL 15.x

### Algoritmos y Generación de IDs
- **Snowflake**: Algoritmo de Twitter para IDs distribuidos únicos
- **Base62**: Codificación compacta para URLs cortas legibles

### Seguridad y Autenticación
- **JWT**: jsonwebtoken para autenticación
- **Encriptación**: bcryptjs para hashing de contraseñas
- **CORS**: Configuración de políticas de seguridad

### Desarrollo
- **Package Manager**: pnpm 10.x
- **Hot Reload**: ts-node-dev para desarrollo
- **Linting**: TypeScript estricto
- **Containerización**: Docker Compose

## ⚡ Algoritmo Snowflake para Generación de URLs Cortas

El proyecto implementa el **algoritmo Snowflake de Twitter** para generar identificadores únicos distribuidos y escalables para los códigos cortos de las URLs. Esta elección garantiza unicidad global, alta performance y escalabilidad horizontal.

### 🔬 ¿Qué es Snowflake?

Snowflake es un algoritmo de generación de IDs desarrollado por Twitter que crea identificadores únicos de **64 bits** ordenados temporalmente, permitiendo generar millones de IDs por segundo de forma distribuida sin colisiones.

### 🏗️ Estructura del ID (64 bits)

```
┌─────────────────────────────────────────────┬──────────────┬──────────────┐
│        Timestamp (41 bits)                  │  Machine ID  │  Sequence    │
│  Milisegundos desde época personalizada     │   (10 bits)  │  (12 bits)   │
└─────────────────────────────────────────────┴──────────────┴──────────────┘
```

#### Componentes:

1. **Timestamp (41 bits)**: 
   - Milisegundos transcurridos desde la época personalizada (1 enero 2024)
   - Permite generar IDs durante aproximadamente 69 años
   - Garantiza ordenamiento temporal de los IDs

2. **Machine ID (10 bits)**:
   - Identificador único de la máquina/instancia (0-1023)
   - Permite hasta **1024 máquinas** trabajando simultáneamente
   - Configurado mediante variable de entorno `MACHINE_ID`

3. **Sequence (12 bits)**:
   - Contador incremental por milisegundo (0-4095)
   - Permite generar hasta **4096 IDs por máquina por milisegundo**
   - Se resetea a 0 en cada nuevo milisegundo

### 🎯 Ventajas del Algoritmo

✅ **Unicidad Garantizada**: Sin colisiones entre diferentes instancias  
✅ **Alta Performance**: Millones de IDs por segundo por máquina  
✅ **Ordenamiento Temporal**: Los IDs se pueden ordenar cronológicamente  
✅ **Escalabilidad Horizontal**: Soporta hasta 1024 instancias simultáneas  
✅ **Sin Dependencias Externas**: No requiere coordinación entre nodos  
✅ **Compacto**: IDs más cortos que UUIDs (64 bits vs 128 bits)


### 📊 Capacidad y Performance

| Métrica | Valor |
|---------|-------|
| **IDs por milisegundo** | 4,096 |
| **IDs por segundo (por máquina)** | ~4 millones |
| **Instancias simultáneas** | 1,024 |
| **Capacidad total por segundo** | ~4 mil millones |
| **Longitud promedio Base62** | 10-11 caracteres |
| **Años de operación** | ~69 años |

## 📁 Estructura del Proyecto

```
url-back/
├── prisma/
│   ├── schema.prisma              # Esquema de base de datos
│   └── migrations/                # Migraciones de base de datos
├── src/
│   ├── app.ts                     # Punto de entrada de la aplicación
│   ├── config/                    # Configuraciones generales
│   │   ├── en-var/env.ts         # Variables de entorno
│   │   └── postgred/              # Configuración de PostgreSQL
│   ├── generated/                 # Código generado por Prisma
│   ├── middlewares/               # Middlewares de Express
│   │   ├── auth.middleware.ts    # Validación JWT y permisos
│   │   └── error.middleware.ts   # Manejo de errores
│   ├── modules/                   # Módulos de la aplicación
│   │   ├── auth/                  # Autenticación (login, register)
│   │   ├── user/                  # Gestión de usuarios
│   │   ├── rol/                   # Gestión de roles
│   │   ├── permission/            # Gestión de permisos
│   │   ├── group/                 # Gestión de grupos de URLs
│   │   └── url/                   # Gestión de URLs
│   │       ├── controller/        # Controladores de URL
│   │       ├── datasource/        # Acceso a datos
│   │       ├── dto/               # Data Transfer Objects
│   │       ├── helpers/           # Utilidades específicas
│   │       │   ├── snowflake.ts   # Generador Snowflake
│   │       │   └── base62.ts      # Conversión Base62
│   │       └── routes/            # Rutas de URL
│   ├── server/                    # Configuración del servidor
│   │   ├── Server.ts             # Clase servidor Express
│   │   └── routes.ts             # Enrutador principal
│   ├── shared/                    # Utilidades compartidas
│   │   ├── adapters/             # Adaptadores (JWT, password)
│   │   ├── context/              # Contexto de usuario
│   │   ├── dto/                  # Data Transfer Objects
│   │   ├── error/                # Manejo de errores personalizados
│   │   └── handler/              # Manejadores asíncronos
│   └── utils/                     # Utilidades generales
└── docker-compose.dev.yml         # Configuración de Docker

```

## 📊 Modelo de Datos

### Entidades Principales

#### Usuario (user)
- Información personal y credenciales
- Relación con roles (many-to-many)
- Propietario de URLs y grupos

#### Rol (role)
- Define conjunto de permisos
- Asignable a múltiples usuarios
- Relación con permisos (many-to-many)

#### Permiso (permission)
- Permisos granulares por módulo
- Asociados a roles específicos

#### URL (url)
- URL original y acortada
- Configuración de visibilidad (pública/privada)
- Protección por contraseña opcional
- Estadísticas y favoritos
- Asociación con grupos y usuarios

#### Grupo (group)
- Organización de URLs por categorías
- Pertenece a un usuario
- Contiene múltiples URLs

## 🚀 Instalación y Configuración

### Requisitos Previos

- **Node.js**: >= 18.x
- **pnpm**: >= 10.x
- **PostgreSQL**: >= 15.x
- **Docker** (opcional): Para desarrollo local

### Instalación

1. **Clonar el repositorio**
```bash
git clone https://github.com/Jose-YC/node-url-back.git
cd url-back
```

2. **Instalar dependencias**
```bash
pnpm install
```

3. **Configurar variables de entorno**

Crear un archivo `.env` en la raíz del proyecto:

```env
# Entorno
NODE_ENV=development

# Servidor
PORT=3000

# Base de datos
DATABASE_URL="postgresql://usuario:contraseña@localhost:5432/url_db"

# Para desarrollo con Docker
POSTGRES_USER=usuario
POSTGRES_PASSWORD=contraseña
POSTGRES_DB=url_db
MACHINE_ID=1

# JWT
JWT_SECRET=tu_clave_secreta_muy_segura_aqui
```

**Importante**: Cada instancia/servidor debe tener un `MACHINE_ID` diferente para evitar colisiones.

4. **Configurar base de datos con Docker (opcional)**
```bash
docker-compose -f docker-compose.dev.yml up -d
```

5. **Ejecutar migraciones**
```bash
npx prisma migrate deploy
```

6. **Generar cliente Prisma**
```bash
npx prisma generate
```

7. **Poblar base de datos (opcional)**
```bash
pnpm seed
```

## 🎯 Uso

### Modo Desarrollo
```bash
pnpm dev
```
El servidor se ejecutará en `http://localhost:3000` con hot-reload activado.

### Modo Producción
```bash
# Compilar TypeScript
pnpm build

# Ejecutar aplicación compilada
pnpm start
```

### Scripts Disponibles

- `pnpm dev` - Inicia el servidor en modo desarrollo
- `pnpm build` - Compila el proyecto TypeScript
- `pnpm start` - Compila y ejecuta en producción
- `pnpm seed` - Ejecuta el script de semillas

## 📡 API Endpoints

### Autenticación (`/auth`)
- `POST /auth/register` - Registrar nuevo usuario
- `POST /auth/login` - Iniciar sesión
- `GET /auth/refresh` - Renovar token JWT

### Usuarios (`/user`)
- `GET /user` - Listar usuarios (autenticado)
- `POST /user` - Crear usuario (con permisos)
- `GET /user/:id` - Obtener usuario por ID
- `PATCH /user/:id` - Actualizar usuario
- `DELETE /user/:id` - Eliminar usuario

### Roles (`/rol`)
- `GET /rol` - Listar roles
- `POST /rol` - Crear rol
- `GET /rol/:id` - Obtener rol
- `PATCH /rol/:id` - Actualizar rol
- `DELETE /rol/:id` - Eliminar rol

### Permisos (`/permission`)
- `GET /permission` - Listar permisos
- `POST /permission` - Crear permiso
- `GET /permission/:id` - Obtener permiso
- `PATCH /permission/:id` - Actualizar permiso
- `DELETE /permission/:id` - Eliminar permiso

### Grupos (`/group`)
- `GET /group` - Listar grupos del usuario
- `POST /group` - Crear grupo
- `GET /group/:id` - Obtener grupo
- `PATCH /group/:id` - Actualizar grupo
- `DELETE /group/:id` - Eliminar grupo

### URLs (`/url`)
**Endpoints Privados (requieren autenticación)**
- `GET /url` - Listar URLs del usuario
- `POST /url/create` - Crear nueva URL corta
- `GET /url/:id` - Obtener URL por ID
- `PATCH /url/update/:id` - Actualizar URL
- `DELETE /url/delete/:id` - Eliminar URL
- `PATCH /url/favorite/:id` - Marcar/desmarcar favorito

**Endpoints Públicos**
- `GET /url/redirect/:short` - Redireccionar a URL original
- `POST /url/login/:short` - Autenticar para URL protegida

## 🔐 Seguridad

### Autenticación
- Sistema de autenticación basado en JWT
- Tokens con expiración configurable
- Refresh tokens para renovación

### Autorización
- Control de acceso basado en roles (RBAC)
- Middleware de validación de permisos
- Contexto de usuario por petición

### Protección de Datos
- Hashing de contraseñas con bcryptjs
- URLs sensibles protegidas por contraseña
- Validación de entrada de datos
- Soft delete para mantener integridad referencial

## 🏗️ Arquitectura

### Patrón de Capas
- **Routes**: Definición de endpoints y middlewares
- **Controllers**: Lógica de control y validación
- **Datasource**: Acceso a datos y lógica de negocio
- **DTOs**: Objetos de transferencia de datos

### Características de Diseño
- **Inyección de Contexto**: Gestión de usuario por petición
- **Manejo Centralizado de Errores**: Middleware global de errores
- **Adaptadores**: Abstracción de servicios externos
- **Soft Delete**: Eliminación lógica de registros

## 🐳 Docker

El proyecto incluye configuración Docker para desarrollo:

```bash
# Iniciar servicios
docker-compose -f docker-compose.dev.yml up -d

# Detener servicios
docker-compose -f docker-compose.dev.yml down

# Ver logs
docker-compose -f docker-compose.dev.yml logs -f
```

## 📝 Prisma

### Comandos Útiles

```bash
# Generar cliente Prisma
npx prisma generate

# Crear nueva migración
npx prisma migrate dev --name nombre_migracion

# Aplicar migraciones
npx prisma migrate deploy

# Abrir Prisma Studio
npx prisma studio

# Resetear base de datos
npx prisma migrate reset
```

## 🤝 Contribución

Las contribuciones son bienvenidas. Por favor:

1. Fork el repositorio
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

ISC License

## 👤 Autor

**Jose YC**
- GitHub: [@Jose-YC](https://github.com/Jose-YC)
- Repository: [node-url-back](https://github.com/Jose-YC/node-url-back)

## 🗺️ Roadmap

- [ ] Implementación completa de estadísticas
- [ ] Sistema de análisis y reportes
- [ ] Códigos QR para URLs
- [ ] API pública con rate limiting
- [ ] Integración con servicios externos
- [ ] Dashboard administrativo
- [ ] Testing completo (unitario e integración)
- [ ] Documentación OpenAPI/Swagger

---

**Nota**: Este proyecto está en desarrollo activo. Las funcionalidades pueden cambiar sin previo aviso.