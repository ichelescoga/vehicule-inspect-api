# Client API

Endpoints para la gestión de clientes.

Base URL: `/korea/v1`

---

## GET `/getAllClients`

Retorna todos los clientes activos (status = 1).

### Response (200)
```json
{
  "success": true,
  "payload": [
    {
      "id": 1,
      "name": "Juan Pérez",
      "address": "Calle 123 #45-67",
      "bill_name": "Juan Pérez SA",
      "nit": "900123456",
      "email": "juan@email.com",
      "office_cel": "3001234567",
      "residence_cel": "6011234567",
      "create_date": "2026-03-10T12:00:00.000Z",
      "update_date": null,
      "status": 1
    },
    {
      "id": 2,
      "name": "María López",
      "address": "Carrera 45 #12-34",
      "bill_name": "López y Asociados",
      "nit": "800987654",
      "email": "maria@email.com",
      "office_cel": "3109876543",
      "residence_cel": "6019876543",
      "create_date": "2026-03-09T10:00:00.000Z",
      "update_date": null,
      "status": 1
    }
  ]
}
```

---

## GET `/searchClientByNit/:nit`

Busca clientes activos cuyo NIT coincida parcialmente con el valor proporcionado.

### Parameters
| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| nit | String | NIT o parte del NIT a buscar |

### Response (200)
```json
{
  "success": true,
  "payload": [
    {
      "id": 1,
      "name": "Juan Pérez",
      "address": "Calle 123 #45-67",
      "bill_name": "Juan Pérez SA",
      "nit": "900123456",
      "email": "juan@email.com",
      "office_cel": "3001234567",
      "residence_cel": "6011234567",
      "create_date": "2026-03-10T12:00:00.000Z",
      "update_date": null,
      "status": 1
    }
  ]
}
```

---

## GET `/searchClientByName/:name`

Busca clientes activos cuyo nombre coincida parcialmente con el valor proporcionado.

### Parameters
| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| name | String | Nombre o parte del nombre a buscar |

### Response (200)
```json
{
  "success": true,
  "payload": [
    {
      "id": 1,
      "name": "Juan Pérez",
      "address": "Calle 123 #45-67",
      "bill_name": "Juan Pérez SA",
      "nit": "900123456",
      "email": "juan@email.com",
      "office_cel": "3001234567",
      "residence_cel": "6011234567",
      "create_date": "2026-03-10T12:00:00.000Z",
      "update_date": null,
      "status": 1
    }
  ]
}
```

---

## POST `/createClient`

Crea un nuevo cliente con estado activo.

### Request

**Headers:**
| Header | Valor |
|--------|-------|
| Content-Type | application/json |

**Body:**
| Campo | Tipo | Requerido | Descripción |
|-------|------|-----------|-------------|
| name | String (100) | No | Nombre del cliente |
| address | String (250) | No | Dirección |
| bill_name | String (100) | No | Nombre de facturación |
| nit | String (25) | No | NIT / Identificación fiscal |
| email | String (45) | No | Correo electrónico |
| office_cel | String (45) | No | Teléfono de oficina |
| residence_cel | String (45) | No | Teléfono de residencia |

### Request Example
```json
{
  "name": "Juan Pérez",
  "address": "Calle 123 #45-67",
  "bill_name": "Juan Pérez SA",
  "nit": "900123456",
  "email": "juan@email.com",
  "office_cel": "3001234567",
  "residence_cel": "6011234567"
}
```

### Response (200)
```json
{
  "success": true,
  "payload": {
    "id": 1,
    "name": "Juan Pérez",
    "address": "Calle 123 #45-67",
    "bill_name": "Juan Pérez SA",
    "nit": "900123456",
    "email": "juan@email.com",
    "office_cel": "3001234567",
    "residence_cel": "6011234567",
    "create_date": "2026-03-10T12:00:00.000Z",
    "status": 1
  }
}
```

---

## PUT `/updateClient/:id`

Actualiza los datos de un cliente existente y registra la fecha de actualización.

### Request

**Params:**
| Param | Tipo | Descripción |
|-------|------|-------------|
| id | Integer | ID del cliente |

**Headers:**
| Header | Valor |
|--------|-------|
| Content-Type | application/json |

**Body:**
| Campo | Tipo | Requerido | Descripción |
|-------|------|-----------|-------------|
| name | String (100) | No | Nombre del cliente |
| address | String (250) | No | Dirección |
| bill_name | String (100) | No | Nombre de facturación |
| nit | String (25) | No | NIT / Identificación fiscal |
| email | String (45) | No | Correo electrónico |
| office_cel | String (45) | No | Teléfono de oficina |
| residence_cel | String (45) | No | Teléfono de residencia |

### Request Example
```json
{
  "name": "Juan Pérez Actualizado",
  "address": "Calle 456 #78-90",
  "bill_name": "Juan Pérez SA",
  "nit": "900123456",
  "email": "juan.new@email.com",
  "office_cel": "3001234567",
  "residence_cel": "6011234567"
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
