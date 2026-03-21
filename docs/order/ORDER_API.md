# Order API

Endpoints para la gestión de órdenes de inspección vehicular.

Base URL: `/korea/v1`

---

## GET `/searchOrders`

Busca órdenes con filtros opcionales. Todos los filtros son independientes y se pueden combinar. Utiliza búsqueda parcial (LIKE) en todos los campos.

### Query Parameters
| Parámetro | Tipo | Requerido | Descripción |
|-----------|------|-----------|-------------|
| number_pass | String | No | Número de pase (búsqueda parcial) |
| client_nit | String | No | NIT del cliente (búsqueda parcial) |
| client_name | String | No | Nombre del cliente (búsqueda parcial) |
| plate_id | String | No | Placa del vehículo (búsqueda parcial) |
| vendor_name | String | No | Nombre del vendedor (búsqueda parcial) |
| technical_name | String | No | Nombre del técnico (búsqueda parcial) |

### Request Example
```
GET /korea/v1/searchOrders?client_name=Juan&plate_id=ABC
```

### Response (200)
```json
{
  "success": true,
  "payload": [
    {
      "id": 1,
      "number_pass": 1,
      "order_date": "2026-03-10T00:00:00.000Z",
      "client_id": 1,
      "status": 1,
      "client": { "id": 1, "name": "Juan Pérez" },
      "vendor": { "id": 1, "name": "AutoParts Korea" },
      "vehicule": { "id": 1, "plate_id": "ABC123" },
      "technical": { "id": 1, "name": "Carlos Gómez" }
    }
  ]
}
```

---

## POST `/createOrder`

Crea el encabezado de una orden de inspección.

### Request

**Headers:**
| Header | Valor |
|--------|-------|
| Content-Type | application/json |

**Body:**
| Campo | Tipo | Requerido | Descripción |
|-------|------|-----------|-------------|
| number_pass | Integer | Sí | Número de pase |
| order_date | Date (ISO 8601) | No | Fecha de la orden (default: fecha actual) |
| payment_type | Integer | No | Tipo de pago |
| delivery_date | Date (ISO 8601) | No | Fecha de entrega |
| client_id | Integer | No | ID del cliente |
| vendor_id | Integer | No | ID del proveedor |
| vehicule_id | Integer | No | ID del vehículo |
| technical_id | Integer | No | ID del técnico asignado |

### Request Example
```json
{
  "number_pass": 1,
  "order_date": "2026-03-10",
  "payment_type": 1,
  "delivery_date": "2026-03-15",
  "client_id": 1,
  "vendor_id": 1,
  "vehicule_id": 1,
  "technical_id": 1
}
```

### Response (200)
```json
{
  "success": true,
  "payload": {
    "id": 1,
    "number_pass": 1,
    "order_date": "2026-03-10T00:00:00.000Z",
    "payment_type": 1,
    "delivery_date": "2026-03-15T00:00:00.000Z",
    "client_id": 1,
    "vendor_id": 1,
    "vehicule_id": 1,
    "technical_id": 1,
    "create_date": "2026-03-10T12:00:00.000Z",
    "status": 1
  }
}
```

---

## GET `/getOrderById/:id`

Obtiene una orden por su ID con todas sus relaciones (cliente, proveedor, vehículo con marca y tipo, técnico, partes inspeccionadas y opciones de servicio asignadas).

### Request

**Params:**
| Param | Tipo | Descripción |
|-------|------|-------------|
| id | Integer | ID de la orden |

### Response (200)
```json
{
  "success": true,
  "payload": {
    "id": 1,
    "number_pass": 1,
    "order_date": "2026-03-10T00:00:00.000Z",
    "payment_type": 1,
    "delivery_date": "2026-03-15T00:00:00.000Z",
    "client_id": 1,
    "vendor_id": 1,
    "vehicule_id": 1,
    "technical_id": 1,
    "create_date": "2026-03-10T12:00:00.000Z",
    "update_date": null,
    "status": 1,
    "close_date": null,
    "client": {
      "id": 1,
      "name": "Juan Pérez",
      "address": "Calle 123 #45-67",
      "bill_name": "Juan Pérez SA",
      "nit": "900123456",
      "email": "juan@email.com",
      "office_cel": "3001234567",
      "residence_cel": "6011234567"
    },
    "vendor": {
      "id": 1,
      "name": "AutoParts Korea"
    },
    "vehicule": {
      "id": 1,
      "model": 2024,
      "plate_id": "ABC123",
      "color": 1,
      "vehicule_brand": {
        "id": 1,
        "name": "Hyundai"
      },
      "vehicule_type": {
        "id": 1,
        "name": "Sedan"
      }
    },
    "technical": {
      "id": 1,
      "name": "Carlos Gómez"
    },
    "Order_Vehicule_Parts": [
      {
        "id": 1,
        "order_id": 1,
        "vehicule_part_id": 1,
        "url": "https://storage.example.com/photo_puerta.jpg",
        "asset_type_id": 1,
        "vehicule_part": {
          "id": 1,
          "name": "Puerta delantera izquierda"
        }
      }
    ],
    "Service_Option_Assigns": [
      {
        "id": 1,
        "order_id": 1,
        "service_option_id": 1,
        "price": 50000,
        "service_option": {
          "id": 1,
          "name": "Pintura completa"
        }
      }
    ]
  }
}
```

### Response (200 - No encontrado)
```json
{
  "success": false,
  "payload": null
}
```

---

## GET `/getAllOrders`

Lista todas las órdenes con relaciones básicas (cliente, proveedor, vehículo, técnico). Ordenadas por fecha de creación descendente.

### Response (200)
```json
{
  "success": true,
  "payload": [
    {
      "id": 1,
      "number_pass": 1,
      "order_date": "2026-03-10T00:00:00.000Z",
      "payment_type": 1,
      "delivery_date": "2026-03-15T00:00:00.000Z",
      "client_id": 1,
      "vendor_id": 1,
      "vehicule_id": 1,
      "technical_id": 1,
      "create_date": "2026-03-10T12:00:00.000Z",
      "status": 1,
      "client": { "id": 1, "name": "Juan Pérez" },
      "vendor": { "id": 1, "name": "AutoParts Korea" },
      "vehicule": { "id": 1, "plate_id": "ABC123" },
      "technical": { "id": 1, "name": "Carlos Gómez" }
    }
  ]
}
```

---

## PUT `/updateOrder/:id`

Actualiza los datos completos de una orden existente (excepto el estado) y registra la fecha de actualización.

### Request

**Params:**
| Param | Tipo | Descripción |
|-------|------|-------------|
| id | Integer | ID de la orden |

**Headers:**
| Header | Valor |
|--------|-------|
| Content-Type | application/json |

**Body:**
| Campo | Tipo | Requerido | Descripción |
|-------|------|-----------|-------------|
| number_pass | Integer | No | Número de pase |
| order_date | Date (ISO 8601) | No | Fecha de la orden |
| payment_type | Integer | No | Tipo de pago |
| delivery_date | Date (ISO 8601) | No | Fecha de entrega |
| client_id | Integer | No | ID del cliente |
| vendor_id | Integer | No | ID del proveedor |
| vehicule_id | Integer | No | ID del vehículo |
| technical_id | Integer | No | ID del técnico asignado |

### Request Example
```json
{
  "number_pass": 2,
  "order_date": "2026-03-10",
  "payment_type": 2,
  "delivery_date": "2026-03-20",
  "client_id": 1,
  "vendor_id": 1,
  "vehicule_id": 1,
  "technical_id": 2
}
```

### Response (200)
```json
{
  "success": true,
  "payload": [1]
}
```
> El array indica el número de filas afectadas.

---

## Referencia de Estados de Orden

| Valor | Estado | Descripción |
|-------|--------|-------------|
| 1 | Recepcion | Orden recibida |
| 2 | Diagnostico | En diagnóstico |
| 3 | Autorizacion | Pendiente de autorización |
| 4 | Compra de Repuestos | Comprando repuestos |
| 5 | En Proceso | Trabajo en proceso |
| 6 | Control de Calidad | Revisión de calidad |

> Al crear una orden, se asigna automáticamente el status `1` (Recepcion) y se crea un registro en `Order_Status_Log` con `start_date = now`.

---

## PUT `/updateOrderStatus/:id`

Actualiza el estado de una orden. **Solo permite cambios secuenciales** (+1 o -1 respecto al status actual). Internamente cierra el log del status actual (asigna `end_date = now`) y crea un nuevo registro en `Order_Status_Log` con el nuevo status y `start_date = now`.

### Regla de negocio
> El status solo puede avanzar o retroceder **un paso a la vez**. Por ejemplo, si el status actual es 3 (Autorizacion), solo se puede cambiar a 2 (Diagnostico) o 4 (Compra de Repuestos). Intentar saltar estados retorna `{ success: false }` con mensaje de error.

### Request

**Params:**
| Param | Tipo | Descripción |
|-------|------|-------------|
| id | Integer | ID de la orden |

**Body:**
| Campo | Tipo | Requerido | Descripción |
|-------|------|-----------|-------------|
| status | Integer | Sí | Nuevo estado de la orden (1-6, ver referencia). Debe ser ±1 del status actual. |

### Request Example
```json
{
  "status": 2
}
```

### Response (200 - Éxito)
```json
{
  "success": true,
  "payload": [1]
}
```
> El array indica el número de filas afectadas.

### Response (200 - Error de validación)
```json
{
  "success": false,
  "payload": "Status can only change one step at a time. Current: 1, Requested: 3"
}
```

### Comportamiento interno
1. Valida que el nuevo status sea exactamente `current ± 1`, si no lanza error
2. Busca el `Order_Status_Log` activo (donde `end_date IS NULL`) para la orden
3. Cierra el log actual asignando `end_date = NOW()`
4. Crea nuevo `Order_Status_Log` con `status = nuevo_status`, `start_date = NOW()`, `end_date = NULL`
5. Actualiza `Order_Header.status` con el nuevo valor

---

## GET `/getOrderStatusLog/:orderId`

Obtiene el historial de cambios de estado de una orden, ordenado por fecha de inicio ascendente. Permite ver cuánto tiempo estuvo la orden en cada status.

### Request

**Params:**
| Param | Tipo | Descripción |
|-------|------|-------------|
| orderId | Integer | ID de la orden |

### Response (200)
```json
{
  "success": true,
  "payload": [
    {
      "id": 1,
      "order_id": 1,
      "status": 1,
      "start_date": "2026-03-10T12:00:00.000Z",
      "end_date": "2026-03-10T14:30:00.000Z",
      "create_date": "2026-03-10T12:00:00.000Z"
    },
    {
      "id": 2,
      "order_id": 1,
      "status": 2,
      "start_date": "2026-03-10T14:30:00.000Z",
      "end_date": null,
      "create_date": "2026-03-10T14:30:00.000Z"
    }
  ]
}
```
> El registro con `end_date: null` es el status activo actual.

---

## GET `/getOrdersByClient/:clientId`

Obtiene todas las órdenes de un cliente específico.

### Request

**Params:**
| Param | Tipo | Descripción |
|-------|------|-------------|
| clientId | Integer | ID del cliente |

### Response (200)
```json
{
  "success": true,
  "payload": [
    {
      "id": 1,
      "number_pass": 1,
      "order_date": "2026-03-10T00:00:00.000Z",
      "client_id": 1,
      "status": 1,
      "client": { "id": 1, "name": "Juan Pérez" },
      "vendor": { "id": 1, "name": "AutoParts Korea" },
      "vehicule": { "id": 1, "plate_id": "ABC123" },
      "technical": { "id": 1, "name": "Carlos Gómez" }
    }
  ]
}
```

---

## POST `/createOrderVehiculePart`

Registra una parte de vehículo inspeccionada dentro de una orden existente.

### Request

**Body:**
| Campo | Tipo | Requerido | Descripción |
|-------|------|-----------|-------------|
| order_id | Integer | Sí | ID de la orden |
| vehicule_part_id | Integer | Sí | ID de la parte del vehículo |
| url | String (500) | No | URL del asset (foto/documento) |
| asset_type_id | Integer | No | Tipo de asset |

### Request Example
```json
{
  "order_id": 1,
  "vehicule_part_id": 3,
  "url": "https://storage.example.com/photo_cofre.jpg",
  "asset_type_id": 1
}
```

### Response (200)
```json
{
  "success": true,
  "payload": {
    "id": 1,
    "order_id": 1,
    "vehicule_part_id": 3,
    "url": "https://storage.example.com/photo_cofre.jpg",
    "asset_type_id": 1,
    "create_date": "2026-03-10T12:00:00.000Z"
  }
}
```

---

## POST `/createOrderServiceOption`

Asigna una opción de servicio con su precio a una orden existente.

### Request

**Body:**
| Campo | Tipo | Requerido | Descripción |
|-------|------|-----------|-------------|
| order_id | Integer | Sí | ID de la orden |
| service_option_id | Integer | Sí | ID de la opción de servicio |
| price | Decimal | No | Precio del servicio |

### Request Example
```json
{
  "order_id": 1,
  "service_option_id": 2,
  "price": 75000
}
```

### Response (200)
```json
{
  "success": true,
  "payload": {
    "id": 1,
    "order_id": 1,
    "service_option_id": 2,
    "price": 75000
  }
}
```
