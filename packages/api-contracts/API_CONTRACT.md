# Pizza Production Service - API Contract

## Services

This API contract covers two services:
1. **Pizza Ordering Service** - Get count of pizzas made by type
2. **Shipment Service** - Register ingredient shipments to warehouses

---

## Pizza Ordering Service

### Endpoint: GET /pizzas

Retrieve count of pizzas made, grouped by type.

#### Query Parameters

| Parameter | Description |
|-----------|-------------|
| `status` | (Optional) Filter by status (e.g., `ready`, `baking`, `delivered`) |

#### Example Requests

```bash
# Get all pizzas
GET /pizzas

# Get pizzas with ready status
GET /pizzas?status=ready
```

#### Response (200)

```json
[
  { "pizzaType": "pineapple", "amount": 5 },
  { "pizzaType": "ham", "amount": 1 },
  { "pizzaType": "margherita", "amount": 3 }
]
```

#### TypeScript Usage

```typescript
import { GetPizzasResponse, getPizzasResponseSchema } from '@pizza/api-contracts';

async function getPizzas(status?: string): Promise<GetPizzasResponse> {
  const query = status ? `?status=${status}` : '';
  const response = await fetch(`/pizzas${query}`);
  const data = await response.json();
  return getPizzasResponseSchema.parse(data);
}
```

---

## Shipment Service

### Endpoint: POST /shipment

Register ingredients for shipment to a warehouse. May create multiple shipments if contents need to be split.

#### Request Body

```json
{
  "targetWarehouse": "M",
  "ingredients": [
    { "id": "ingredient-123", "units": 50 },
    { "id": "ingredient-456", "units": 30 }
  ]
}
```

#### Request Schema

| Field | Type | Description |
|-------|------|-------------|
| `targetWarehouse` | string | Warehouse size: `S` (Small), `M` (Standard), `L` (Large) |
| `ingredients` | array | List of ingredients to ship |
| `ingredients[].id` | string | Ingredient identifier |
| `ingredients[].units` | number | Number of units |

#### Response (200) - Success

Array of shipment IDs:

```json
[
  "550e8400-e29b-41d4-a716-446655440000",
  "550e8400-e29b-41d4-a716-446655440001"
]
```

#### Response (422) - Partial Failure

Some shipments succeeded, some failed:

```json
{
  "error": "Some shipments failed validation",
  "successfulIds": [
    "550e8400-e29b-41d4-a716-446655440000"
  ],
  "failedShipments": [
    {
      "targetWarehouse": "L",
      "ingredients": [
        { "id": "ingredient-789", "units": 1000 }
      ]
    }
  ]
}
```

#### TypeScript Usage

```typescript
import { 
  shipmentSchema, 
  TargetWarehouse, 
  PartialShipmentError 
} from '@pizza/api-contracts';

async function registerShipment(
  targetWarehouse: TargetWarehouse,
  ingredients: Array<{ id: string; units: number }>
): Promise<string[]> {
  const response = await fetch('/shipment', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      targetWarehouse,
      ingredients,
    }),
  });

  if (response.status === 422) {
    const error = await response.json();
    throw new PartialShipmentError(
      error.error,
      error.successfulIds,
      error.failedShipments
    );
  }

  return response.json();
}

// Usage
const shipmentIds = await registerShipment(TargetWarehouse.STANDARD, [
  { id: 'ing-1', units: 50 },
  { id: 'ing-2', units: 30 },
]);
```

---

## Warehouse Sizes

| Size | Code | Description |
|------|------|-------------|
| Small | `S` | Small warehouse |
| Standard | `M` | Standard warehouse |
| Large | `L` | Large warehouse |

---

## Import All Types

```typescript
import {
  // Pizza Ordering
  pizzaSchema,
  Pizza,
  getPizzasResponseSchema,
  GetPizzasResponse,
  getPizzasQuerySchema,
  GetPizzasQuery,
  
  // Shipment
  TargetWarehouse,
  ingredientSchema,
  Ingredient,
  shipmentSchema,
  Shipment,
  ErrorWithStatus,
  PartialShipmentError,
} from '@pizza/api-contracts';
```
