# Vehicle API

Endpoints para la gestión de vehículos, marcas, tipos y partes.

Base URL: `/korea/v1`

---

## GET `/getAllVehicles`

Retorna todos los vehículos activos (status = 1) con su marca y tipo incluidos.

### Response (200)
```json
{
  "success": true,
  "payload": [
    {
      "id": 1,
      "model": 2024,
      "linea": "Tucson",
      "plate_id": "ABC123",
      "color": "Rojo",
      "vehicule_type_id": 1,
      "vehicule_brand_id": 1,
      "create_date": "2026-03-10T12:00:00.000Z",
      "update_date": null,
      "status": 1,
      "vehicule_brand": { "id": 1, "name": "Hyundai" },
      "vehicule_type": { "id": 1, "name": "Sedan" }
    },
    {
      "id": 2,
      "model": 2023,
      "linea": "Sportage",
      "plate_id": "XYZ789",
      "color": "Azul",
      "vehicule_type_id": 2,
      "vehicule_brand_id": 2,
      "create_date": "2026-03-09T10:00:00.000Z",
      "update_date": null,
      "status": 1,
      "vehicule_brand": { "id": 2, "name": "Kia" },
      "vehicule_type": { "id": 2, "name": "SUV" }
    }
  ]
}
```

---

## GET `/getAllVehiculeBrands`

Retorna todas las marcas de vehículo.

### Response (200)
```json
{
  "success": true,
  "payload": [
    { "id": 1, "name": "Hyundai", "create_date": "2026-03-01T00:00:00.000Z", "update_date": null, "status": 1 },
    { "id": 2, "name": "Kia", "create_date": "2026-03-01T00:00:00.000Z", "update_date": null, "status": 1 },
    { "id": 3, "name": "SsangYong", "create_date": "2026-03-01T00:00:00.000Z", "update_date": null, "status": 1 }
  ]
}
```

---

## GET `/getAllVehiculeType`

Retorna todos los tipos de vehículo.

### Response (200)
```json
{
  "success": true,
  "payload": [
    { "id": 1, "name": "Sedan", "create_date": "2026-03-01T00:00:00.000Z", "update_date": null, "status": 1 },
    { "id": 2, "name": "SUV", "create_date": "2026-03-01T00:00:00.000Z", "update_date": null, "status": 1 },
    { "id": 3, "name": "Pickup", "create_date": "2026-03-01T00:00:00.000Z", "update_date": null, "status": 1 }
  ]
}
```

---

## GET `/getAllVehicleParts`

Retorna todas las partes de vehículo activas (status = 1).

### Response (200)
```json
{
  "success": true,
  "payload": [
    { "id": 1, "name": "Puerta delantera izquierda", "create_date": "2026-03-01T00:00:00.000Z", "update_date": null, "status": 1 },
    { "id": 2, "name": "Puerta delantera derecha", "create_date": "2026-03-01T00:00:00.000Z", "update_date": null, "status": 1 },
    { "id": 3, "name": "Cofre", "create_date": "2026-03-01T00:00:00.000Z", "update_date": null, "status": 1 },
    { "id": 4, "name": "Cajuela", "create_date": "2026-03-01T00:00:00.000Z", "update_date": null, "status": 1 },
    { "id": 5, "name": "Parabrisas frontal", "create_date": "2026-03-01T00:00:00.000Z", "update_date": null, "status": 1 }
  ]
}
```

---

## GET `/searchVehicleByPlate/:plate`

Busca vehiculos activos cuya placa coincida parcialmente con el valor proporcionado. Incluye marca y tipo.

### Parameters
| Parametro | Tipo | Descripcion |
|-----------|------|-------------|
| plate | String | Placa o parte de la placa a buscar |

### Response (200)
```json
{
  "success": true,
  "payload": [
    {
      "id": 1,
      "model": 2024,
      "linea": "Tucson",
      "plate_id": "ABC123",
      "color": "Rojo",
      "vehicule_type_id": 1,
      "vehicule_brand_id": 1,
      "create_date": "2026-03-10T12:00:00.000Z",
      "update_date": null,
      "status": 1,
      "vehicule_brand": { "id": 1, "name": "Hyundai" },
      "vehicule_type": { "id": 1, "name": "Sedan" }
    }
  ]
}
```

---

## POST `/createVehiculeBrand`

Crea una nueva marca de vehículo.

### Request

**Headers:**
| Header | Valor |
|--------|-------|
| Content-Type | application/json |

**Body:**
| Campo | Tipo | Requerido | Descripción |
|-------|------|-----------|-------------|
| name | String (100) | Sí | Nombre de la marca |

### Request Example
```json
{
  "name": "Hyundai"
}
```

### Response (200)
```json
{
  "success": true,
  "payload": {
    "id": 1,
    "name": "Hyundai",
    "create_date": "2026-03-10T12:00:00.000Z",
    "status": 1
  }
}
```

---

## POST `/createVehiculeType`

Crea un nuevo tipo de vehículo.

### Request

**Headers:**
| Header | Valor |
|--------|-------|
| Content-Type | application/json |

**Body:**
| Campo | Tipo | Requerido | Descripción |
|-------|------|-----------|-------------|
| name | String (100) | Sí | Nombre del tipo |

### Request Example
```json
{
  "name": "SUV"
}
```

### Response (200)
```json
{
  "success": true,
  "payload": {
    "id": 1,
    "name": "SUV",
    "create_date": "2026-03-10T12:00:00.000Z",
    "status": 1
  }
}
```

---

## POST `/createVehicle`

Crea un nuevo vehículo.

### Request

**Headers:**
| Header | Valor |
|--------|-------|
| Content-Type | application/json |

**Body:**
| Campo | Tipo | Requerido | Descripción |
|-------|------|-----------|-------------|
| model | Integer | No | Año del modelo |
| linea | String (45) | No | Línea del vehículo |
| plate_id | String (10) | Sí | Número de placa |
| color | String (45) | No | Color del vehículo |
| vehicule_type_id | Integer | No | ID del tipo de vehículo |
| vehicule_brand_id | Integer | No | ID de la marca del vehículo |

### Request Example
```json
{
  "model": 2024,
  "linea": "Tucson",
  "plate_id": "ABC123",
  "color": "Rojo",
  "vehicule_type_id": 1,
  "vehicule_brand_id": 1
}
```

### Response (200)
```json
{
  "success": true,
  "payload": {
    "id": 1,
    "model": 2024,
    "linea": "Tucson",
    "plate_id": "ABC123",
    "color": "Rojo",
    "vehicule_type_id": 1,
    "vehicule_brand_id": 1,
    "create_date": "2026-03-10T12:00:00.000Z",
    "status": 1
  }
}
```

---

## PUT `/updateVehicle/:id`

Actualiza los datos de un vehículo existente y registra la fecha de actualización.

### Request

**Params:**
| Param | Tipo | Descripción |
|-------|------|-------------|
| id | Integer | ID del vehículo |

**Headers:**
| Header | Valor |
|--------|-------|
| Content-Type | application/json |

**Body:**
| Campo | Tipo | Requerido | Descripción |
|-------|------|-----------|-------------|
| model | Integer | No | Año del modelo |
| linea | String (45) | No | Línea del vehículo |
| plate_id | String (10) | No | Número de placa |
| color | String (45) | No | Color del vehículo |
| vehicule_type_id | Integer | No | ID del tipo de vehículo |
| vehicule_brand_id | Integer | No | ID de la marca del vehículo |

### Request Example
```json
{
  "model": 2025,
  "linea": "Tucson",
  "plate_id": "ABC123",
  "color": "Azul",
  "vehicule_type_id": 1,
  "vehicule_brand_id": 1
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

## GET `/searchVehicleParts/:name`

Busca partes de vehículo activas cuyo nombre coincida parcialmente con el valor proporcionado.

### Parameters
| Parametro | Tipo | Descripcion |
|-----------|------|-------------|
| name | String | Nombre o parte del nombre a buscar |

### Request Example
```
GET /korea/v1/searchVehicleParts/puerta
```

### Response (200)
```json
{
  "success": true,
  "payload": [
    { "id": 1, "name": "Puerta delantera izquierda", "create_date": "2026-03-01T00:00:00.000Z", "update_date": null, "status": 1 },
    { "id": 2, "name": "Puerta delantera derecha", "create_date": "2026-03-01T00:00:00.000Z", "update_date": null, "status": 1 }
  ]
}
```

---

## POST `/createVehiclePart`

Crea una nueva parte de vehículo.

### Request

**Headers:**
| Header | Valor |
|--------|-------|
| Content-Type | application/json |

**Body:**
| Campo | Tipo | Requerido | Descripción |
|-------|------|-----------|-------------|
| name | String (100) | Sí | Nombre de la parte |

### Request Example
```json
{
  "name": "Espejo lateral izquierdo"
}
```

### Response (200)
```json
{
  "success": true,
  "payload": {
    "id": 6,
    "name": "Espejo lateral izquierdo",
    "create_date": "2026-03-11T12:00:00.000Z",
    "status": 1
  }
}
```
