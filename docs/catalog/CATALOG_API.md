# Catalog API

Endpoints para la gestión de catálogos generales (proveedores y técnicos).

Base URL: `/korea/v1`

---

## Vendor (Proveedores)

### GET `/getAllVendors`

Retorna todos los proveedores.

#### Response (200)
```json
{
  "success": true,
  "payload": [
    { "id": 1, "name": "AutoParts Korea", "create_date": "2026-03-01T00:00:00.000Z", "update_date": null, "status": 1 },
    { "id": 2, "name": "Korea Motors Supply", "create_date": "2026-03-01T00:00:00.000Z", "update_date": null, "status": 1 }
  ]
}
```

---

### POST `/createVendor`

Crea un nuevo proveedor.

#### Request

**Headers:**
| Header | Valor |
|--------|-------|
| Content-Type | application/json |

**Body:**
| Campo | Tipo | Requerido | Descripción |
|-------|------|-----------|-------------|
| name | String (100) | Sí | Nombre del proveedor |

#### Request Example
```json
{
  "name": "AutoParts Korea"
}
```

#### Response (200)
```json
{
  "success": true,
  "payload": {
    "id": 1,
    "name": "AutoParts Korea",
    "create_date": "2026-03-10T12:00:00.000Z",
    "status": 1
  }
}
```

---

### PUT `/updateVendor/:id`

Actualiza el nombre de un proveedor existente.

#### Request

**Params:**
| Param | Tipo | Descripción |
|-------|------|-------------|
| id | Integer | ID del proveedor |

**Headers:**
| Header | Valor |
|--------|-------|
| Content-Type | application/json |

**Body:**
| Campo | Tipo | Requerido | Descripción |
|-------|------|-----------|-------------|
| name | String (100) | Sí | Nuevo nombre del proveedor |

#### Request Example
```json
{
  "name": "AutoParts Korea Updated"
}
```

#### Response (200)
```json
{
  "success": true,
  "payload": [1]
}
```
> El array indica el número de filas afectadas.

---

## Technical (Técnicos)

### GET `/getAllTechnicals`

Retorna todos los técnicos.

#### Response (200)
```json
{
  "success": true,
  "payload": [
    { "id": 1, "name": "Carlos Gómez", "create_date": "2026-03-01T00:00:00.000Z", "update_date": null, "status": 1 },
    { "id": 2, "name": "Andrés Martínez", "create_date": "2026-03-01T00:00:00.000Z", "update_date": null, "status": 1 }
  ]
}
```

---

### POST `/createTechnical`

Crea un nuevo técnico.

#### Request

**Headers:**
| Header | Valor |
|--------|-------|
| Content-Type | application/json |

**Body:**
| Campo | Tipo | Requerido | Descripción |
|-------|------|-----------|-------------|
| name | String (100) | Sí | Nombre del técnico |

#### Request Example
```json
{
  "name": "Carlos Gómez"
}
```

#### Response (200)
```json
{
  "success": true,
  "payload": {
    "id": 1,
    "name": "Carlos Gómez",
    "create_date": "2026-03-10T12:00:00.000Z",
    "status": 1
  }
}
```

---

### PUT `/updateTechnical/:id`

Actualiza el nombre de un técnico existente.

#### Request

**Params:**
| Param | Tipo | Descripción |
|-------|------|-------------|
| id | Integer | ID del técnico |

**Headers:**
| Header | Valor |
|--------|-------|
| Content-Type | application/json |

**Body:**
| Campo | Tipo | Requerido | Descripción |
|-------|------|-----------|-------------|
| name | String (100) | Sí | Nuevo nombre del técnico |

#### Request Example
```json
{
  "name": "Carlos Gómez Jr."
}
```

#### Response (200)
```json
{
  "success": true,
  "payload": [1]
}
```
> El array indica el número de filas afectadas.
