# Service API

Endpoints para el catálogo jerárquico de servicios: Service_Type → Service → Service_Option → Service_Option_Assign (a órdenes).

Base URL: `/korea/v1`

---

## Estructura de tablas

| Tabla | Descripción | FK |
|-------|-------------|-----|
| Service_Type | Tipos de servicio (Repuestos, Llantas, etc.) | — |
| Service | Servicios dentro de un tipo (Bujía, Bumper, etc.) | service_type_id → Service_Type |
| Service_Option | Opciones/items de un servicio | service_id → Service |
| Service_Option_Assign | Asignación de opción a orden con precio | service_option_id → Service_Option, order_id → Order_Header |

---

## Service Type

### GET `/getAllServiceTypes`

Retorna todos los tipos de servicio activos.

**Response (200)**
```json
{
  "success": true,
  "payload": [
    { "id": 1, "name": "Repuestos", "create_date": "2026-03-13T00:00:00.000Z", "update_date": null, "status": 1 },
    { "id": 2, "name": "Llantas", "create_date": "2026-03-13T00:00:00.000Z", "update_date": null, "status": 1 }
  ]
}
```

### POST `/createServiceType`

Crea un nuevo tipo de servicio.

**Body**
```json
{ "name": "Repuestos" }
```

**Response (200)**
```json
{ "success": true, "payload": { "id": 3, "name": "Repuestos", "create_date": "2026-03-13T...", "status": 1 } }
```

### PUT `/updateServiceType/:id`

Actualiza el nombre de un tipo de servicio.

**Body**
```json
{ "name": "Repuestos Automotrices" }
```

---

## Service

### GET `/getAllServices`

Retorna todos los servicios activos con sus opciones y tipo de servicio.

**Response (200)**
```json
{
  "success": true,
  "payload": [
    {
      "id": 1,
      "name": "Bujías",
      "service_type_id": 1,
      "status": 1,
      "Service_Options": [
        { "id": 1, "name": "Bujía NGK", "service_id": 1, "status": 1 }
      ],
      "service_type": { "id": 1, "name": "Repuestos" }
    }
  ]
}
```

### GET `/getServicesByType/:serviceTypeId`

Retorna servicios filtrados por tipo, con sus opciones incluidas.

**Response (200)**
```json
{
  "success": true,
  "payload": [
    {
      "id": 1,
      "name": "Bujías",
      "service_type_id": 1,
      "status": 1,
      "Service_Options": [...]
    }
  ]
}
```

### POST `/createService`

Crea un nuevo servicio asociado a un tipo.

**Body**
```json
{ "name": "Bujías", "service_type_id": 1 }
```

### PUT `/updateService/:id`

Actualiza un servicio.

**Body**
```json
{ "name": "Bujías Premium", "service_type_id": 1 }
```

---

## Service Option

### GET `/getServiceOptions/:serviceId`

Retorna opciones de un servicio, incluyendo datos del servicio padre.

**Response (200)**
```json
{
  "success": true,
  "payload": [
    {
      "id": 1,
      "name": "Bujía NGK Iridium",
      "service_id": 1,
      "status": 1,
      "service": { "id": 1, "name": "Bujías" }
    }
  ]
}
```

### POST `/createServiceOption`

Crea una nueva opción de servicio.

**Body**
```json
{ "name": "Bujía NGK Iridium", "service_id": 1 }
```

### PUT `/updateServiceOption/:id`

Actualiza el nombre de una opción.

**Body**
```json
{ "name": "Bujía NGK Platinum" }
```

---

## Service Option Assign (Orden)

### POST `/createOrderServiceOption`

Asigna una opción de servicio a una orden con precio. (Manejado por order.controller)

**Body**
```json
{ "order_id": 1, "service_option_id": 5, "price": 150.00 }
```

### GET `/getOrderServiceOptions/:orderId`

Retorna las opciones de servicio asignadas a una orden, con datos del servicio y opción.

**Response (200)**
```json
{
  "success": true,
  "payload": [
    {
      "id": 1,
      "service_option_id": 5,
      "order_id": 1,
      "price": "150.00",
      "service_option": {
        "id": 5,
        "name": "Bujía NGK Iridium",
        "service": { "id": 1, "name": "Bujías" }
      }
    }
  ]
}
```

### DELETE `/deleteOrderServiceOption/:id`

Elimina la asignación de una opción de servicio a una orden (hard delete).
