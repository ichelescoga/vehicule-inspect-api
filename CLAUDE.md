# Vehicle Inspect API - Project Context

## Stack
- **Runtime:** Node.js + Express
- **ORM:** Sequelize 6
- **Database:** MySQL (mysql2 dialect)
- **Auth:** Token-based (custom encryption via `src/utils/security`)

## Architecture (MVC + Repository)
```
router/ → controller/ → repository/ → src/modelKorea/ → MySQL
```
- **Router:** `router/korea.router.js` — Defines all endpoints under `/korea/v1`
- **Models:** `src/modelKorea/` — Sequelize model definitions (auto-generated with sequelize-auto)
- **Init Models:** `src/modelKorea/init-models.js` — Model initialization + associations

### Controllers (by domain)
| File | Domain | Entities |
|------|--------|----------|
| `controller/order.controller.js` | Órdenes | Order_Header, Order_Vehicule_Part, Service_Option_Assign |
| `controller/client.controller.js` | Clientes | Client |
| `controller/vehicle.controller.js` | Vehículos | Vehicle, Vehicle_Brand, Vehicle_Type, Vehicle_Part |
| `controller/service.controller.js` | Servicios | Service, Service_Option |
| `controller/catalog.controller.js` | Catálogos | Vendor, Technical |

### Repositories (by domain)
| File | Domain | Entities |
|------|--------|----------|
| `repository/OrderRepository.js` | Órdenes | Order_Header, Order_Vehicule_Part, Service_Option_Assign |
| `repository/ClientRepository.js` | Clientes | Client |
| `repository/VehicleRepository.js` | Vehículos | Vehicle, Vehicle_Brand, Vehicle_Type, Vehicle_Part |
| `repository/ServiceRepository.js` | Servicios | Service, Service_Option |
| `repository/CatalogRepository.js` | Catálogos | Vendor, Technical |

## Key Files
- `app.js` — Express entry point, mounts router on `/korea/v1`
- `components/config.js` — DB credentials from env vars
- `components/conn_sqlz.js` — Sequelize connection instance
- `.env` — Environment variables (MYSQL_DB_*, EXPOSED_PORT)

## Database Tables (16)
| Entity | Table | Description |
|--------|-------|-------------|
| Order_Header | Order_Header | Orden de inspección (FK: client, vendor, vehicle, technical) |
| Order_Vehicule_Part | Order_Vehicule_Part | Partes inspeccionadas por orden (FK: order, vehicle_part) |
| Service_Option_Assign | Service_Option_Assign | Opciones de servicio asignadas a orden |
| Client | Client | Clientes |
| Vehicle | Vehicle | Vehículos (FK: brand, type) |
| Vehicle_Brand | Vehicle_Brand | Marcas de vehículo |
| Vehicle_Type | Vehicle_Type | Tipos de vehículo |
| Vehicle_Part | Vehicle_Part | Partes de vehículo |
| Service | Service | Servicios |
| Service_Option | Service_Option | Opciones de servicio (FK: service) |
| Service_Type | Service_Type | Tipos de servicio |
| Technical | Technical | Técnicos |
| Vendor | Vendor | Proveedores |
| User | User | Usuarios (timestamps: true) |
| User_Rol | User_Rol | Roles de usuario |
| User_Rol_Assign | User_Rol_Assign | Asignación usuario-rol (timestamps: true) |

## Conventions
- All models use `timestamps: false` except User and User_Rol_Assign
- Manual audit fields: `create_date`, `update_date`, `status` (1=active)
- Response format: `{ success: boolean, payload: any }`
- Repository uses module pattern (IIFE) exporting functions
- Controller functions: `async (req, res, next)` with try/catch
- Search endpoints use Sequelize `Op.like` with `%query%` for partial matching

## API Endpoints (base: `/korea/v1`)

### Healthcheck
- `GET /healthcheck`

### Catalog (Vendor / Technical)
- `GET /getAllVendors` — Listar proveedores
- `POST /createVendor` — Crear proveedor
- `PUT /updateVendor/:id` — Actualizar proveedor
- `GET /getAllTechnicals` — Listar técnicos
- `POST /createTechnical` — Crear técnico
- `PUT /updateTechnical/:id` — Actualizar técnico

### Vehicle
- `GET /getAllVehicles` — Listar vehículos con marca y tipo
- `GET /getAllVehiculeBrands` — Listar marcas
- `GET /getAllVehiculeType` — Listar tipos
- `GET /getAllVehicleParts` — Listar partes
- `GET /searchVehicleByPlate/:plate` — Buscar vehículos por placa (búsqueda parcial)
- `POST /createVehicle` — Crear vehículo
- `PUT /updateVehicle/:id` — Actualizar vehículo
- `POST /createVehiculeBrand` — Crear marca
- `POST /createVehiculeType` — Crear tipo
- `GET /searchVehicleParts/:name` — Buscar partes por nombre (búsqueda parcial)
- `POST /createVehiclePart` — Crear parte de vehículo

### Client
- `GET /getAllClients` — Listar clientes activos
- `GET /searchClientByNit/:nit` — Buscar clientes por NIT (búsqueda parcial)
- `GET /searchClientByName/:name` — Buscar clientes por nombre (búsqueda parcial)
- `POST /createClient` — Crear cliente
- `PUT /updateClient/:id` — Actualizar cliente

### Service
- `GET /getAllServices` — Listar servicios con opciones

### Order
- `GET /searchOrders` — Buscar órdenes con filtros opcionales (number_pass, client_nit, client_name, plate_id, vendor_name, technical_name)
- `POST /createOrder` — Crear encabezado de orden
- `POST /createOrderVehiculePart` — Agregar parte inspeccionada a orden
- `POST /createOrderServiceOption` — Asignar opción de servicio a orden
- `GET /getOrderById/:id` — Orden con todas sus relaciones
- `GET /getAllOrders` — Listar órdenes
- `PUT /updateOrder/:id` — Actualizar orden completa
- `PUT /updateOrderStatus/:id` — Actualizar estado de orden
- `GET /getOrdersByClient/:clientId` — Órdenes por cliente

## Documentation
- `docs/order/ORDER_API.md` — Documentación de endpoints de órdenes
- `docs/client/CLIENT_API.md` — Documentación de endpoints de clientes (incluye búsqueda por NIT y nombre)
- `docs/vehicle/VEHICLE_API.md` — Documentación de endpoints de vehículos
- `docs/service/SERVICE_API.md` — Documentación de endpoints de servicios
- `docs/catalog/CATALOG_API.md` — Documentación de endpoints de catálogos
- `docs/Vehicle_Inspect_API.postman_collection.json` — Postman collection

## Frontend Companion
- Proyecto Flutter en `../vehicule-inspect-front/` consume esta API
- Ver `../vehicule-inspect-front/CLAUDE.md` para contexto del frontend

## Commands
- `npm run devStart` — Development with nodemon
- `npm start` — Production
