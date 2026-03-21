# Inspection API

Endpoints para la gestión de archivos de inspección vehicular (fotos y videos) con almacenamiento en AWS S3.

Base URL: `/korea/v1`

## Estructura S3

Los archivos se almacenan en el bucket configurado con la siguiente estructura:
```
KoreaInspect/
  {order_id}/
    {uuid}.jpg
    {uuid}.mp4
```

---

## POST `/uploadInspectionFile`

Sube un archivo (foto o video) de inspección a S3 y registra los metadatos en la tabla `Inspection_File`.

### Request

**Headers:**
| Header | Valor |
|--------|-------|
| Content-Type | multipart/form-data |

**Form Data:**
| Campo | Tipo | Requerido | Descripción |
|-------|------|-----------|-------------|
| file | File | Sí | Archivo a subir (JPG, PNG, WEBP, MP4, MOV). Max 50MB |
| order_id | Integer | Sí | ID de la orden |
| vehicule_part_id | Integer | Sí | ID de la parte del vehículo |

### Tipos de archivo permitidos
- `image/jpeg`
- `image/png`
- `image/webp`
- `video/mp4`
- `video/quicktime`

### Response (200)
```json
{
  "success": true,
  "payload": {
    "id": 1,
    "order_id": 1,
    "vehicule_part_id": 3,
    "original_name": "puerta_delantera_1710000000000.jpg",
    "stored_name": "92a73895-0e56-4286-b431-70de32d7e47e.jpg",
    "file_type": "image",
    "s3_path": "https://bkt-korea.s3.us-east-2.amazonaws.com/KoreaInspect/1/92a73895-0e56-4286-b431-70de32d7e47e.jpg",
    "create_date": "2026-03-12T12:00:00.000Z"
  }
}
```

### Campos de respuesta
| Campo | Descripción |
|-------|-------------|
| original_name | Nombre original del archivo enviado |
| stored_name | Nombre UUID generado para almacenamiento en S3 |
| file_type | `image` o `video` |
| s3_path | URL completa del archivo en S3 |

---

## GET `/getInspectionFiles/:orderId`

Obtiene todos los archivos de inspección de una orden, con la información de la parte del vehículo asociada. Ordenados por fecha de creación descendente.

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
      "vehicule_part_id": 3,
      "original_name": "puerta_delantera_1710000000000.jpg",
      "stored_name": "92a73895-0e56-4286-b431-70de32d7e47e.jpg",
      "file_type": "image",
      "s3_path": "https://bkt-korea.s3.us-east-2.amazonaws.com/KoreaInspect/1/92a73895-0e56-4286-b431-70de32d7e47e.jpg",
      "create_date": "2026-03-12T12:00:00.000Z",
      "vehicule_part": {
        "id": 3,
        "name": "Puerta delantera izquierda"
      }
    }
  ]
}
```

---

## PUT `/deleteInspectionFile/:id`

Elimina lógicamente un archivo de inspección (soft delete: cambia `status` de 1 a 0). El archivo permanece en S3 pero no se muestra en consultas.

### Request

**Params:**
| Param | Tipo | Descripción |
|-------|------|-------------|
| id | Integer | ID del archivo de inspección |

### Response (200)
```json
{
  "success": true,
  "payload": [1]
}
```

---

## Tabla `Inspection_File`

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | INT (PK, AUTO_INCREMENT) | Identificador único |
| order_id | INT (FK → Order_Header) | ID de la orden |
| vehicule_part_id | INT (FK → Vehicle_Part) | ID de la parte del vehículo |
| original_name | VARCHAR(255) | Nombre original del archivo |
| stored_name | VARCHAR(255) | Nombre UUID almacenado en S3 |
| file_type | VARCHAR(50) | Tipo: `image` o `video` |
| s3_path | VARCHAR(500) | URL completa en S3 |
| create_date | DATETIME | Fecha de creación |
| status | INT (default 1) | 1=activo, 0=eliminado (soft delete) |
