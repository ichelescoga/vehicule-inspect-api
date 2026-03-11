# Service API

Endpoints para la consulta de servicios y sus opciones.

Base URL: `/korea/v1`

---

## GET `/getAllServices`

Retorna todos los servicios activos (status = 1) con sus opciones de servicio incluidas.

### Response (200)
```json
{
  "success": true,
  "payload": [
    {
      "id": 1,
      "name": "Inspección mecánica",
      "create_date": "2026-03-01T00:00:00.000Z",
      "update_date": null,
      "service_type_id": 1,
      "status": 1,
      "Service_Options": [
        { "id": 1, "name": "Revisión de frenos", "service_id": 1, "create_date": "2026-03-01T00:00:00.000Z", "update_date": null, "status": 1 },
        { "id": 2, "name": "Revisión de suspensión", "service_id": 1, "create_date": "2026-03-01T00:00:00.000Z", "update_date": null, "status": 1 }
      ]
    },
    {
      "id": 2,
      "name": "Inspección de carrocería",
      "create_date": "2026-03-01T00:00:00.000Z",
      "update_date": null,
      "service_type_id": 1,
      "status": 1,
      "Service_Options": [
        { "id": 3, "name": "Pintura completa", "service_id": 2, "create_date": "2026-03-01T00:00:00.000Z", "update_date": null, "status": 1 },
        { "id": 4, "name": "Reparación de abolladuras", "service_id": 2, "create_date": "2026-03-01T00:00:00.000Z", "update_date": null, "status": 1 }
      ]
    }
  ]
}
```
