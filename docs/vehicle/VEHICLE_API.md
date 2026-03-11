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
      "plate_id": "ABC123",
      "color": 1,
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
      "plate_id": "XYZ789",
      "color": 2,
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
| plate_id | String (10) | Sí | Número de placa |
| color | Integer | No | ID del color |
| vehicule_type_id | Integer | No | ID del tipo de vehículo |
| vehicule_brand_id | Integer | No | ID de la marca del vehículo |

### Request Example
```json
{
  "model": 2024,
  "plate_id": "ABC123",
  "color": 1,
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
    "plate_id": "ABC123",
    "color": 1,
    "vehicule_type_id": 1,
    "vehicule_brand_id": 1,
    "create_date": "2026-03-10T12:00:00.000Z",
    "status": 1
  }
}
```
