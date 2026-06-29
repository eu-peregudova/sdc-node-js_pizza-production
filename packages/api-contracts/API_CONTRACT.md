# Pizza Production Service - API Contract

## Services

This API contract covers three services:
1. **Ordering Service** (port 3001) - Record and manage pizza orders
2. **Production Service** (port 3002) - Orchestrate pizza availability and readiness
3. **Shipment Service** (port 8080) - Register ingredient shipments and check ingredient availability

---

## Ordering Service

### POST /pizzas/ready 

Mark pizzas as ready, recording them in the pizza log.
> Used by Production Service.

#### Request Body

```json
[
  { "name": "Margherita", "amount": 5 },
  { "name": "Classic", "amount": 3 }
]
```

---

### GET /pizzas/is-available

Check if a specific pizza can be made based on ingredient availability. 
> Delegates to Production Service.

#### Query Parameters

| Parameter | Description |
|-----------|-------------|
| `pizzaName` | Name of the pizza to check (required) |

#### Example Request

```bash
GET /pizzas/is-available?pizzaName=Margherita
```

---

## Production Service

### GET /pizzas/available

Check availability of pizzas based on ingredient request.

>Delegates to Shipment Service.

>Used by Ordering Service.

#### Query Parameters

| Parameter | Description |
|-----------|-------------|
| `ids` | Array of ingredient IDs (repeatable parameter) |
| `units` | Array of required units per ingredient (repeatable parameter) |

#### Example Request

```bash
GET /pizzas/available?ids=ingredient-123&ids=ingredient-456&units=50&units=30
```

---

### POST /pizzas/ready

Mark pizzas as ready.
> Delegates to Ordering Service.

#### Request Body

```json
[
  { "name": "margherita", "amount": 5 },
  { "name": "pepperoni", "amount": 3 }
]
```

---

## Shipment Service

### POST /shipment

Register ingredients for shipment to a warehouse. May create multiple shipments if contents need to be split.

#### Request Body

```json
{
  "targetWarehouse": "M",
  "ingredients": [
    { "id": "ingredient-123", "units": 50 }, 
    { "id": "ingredient-456", "units": 30 }
  ] // id has to be already in DB, consult seed.ts
}
```

#### Special Response: (422) - Partial Failure (We added something, but not all)

Some shipments succeeded, some failed:

```json
{
  "error": "Failed to process 1 of 3 split shipments",
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

---

### GET /ingredients/availability

Check availability of ingredients by ID.

#### Query Parameters

| Parameter | Description |
|-----------|-------------|
| `ids` | Array of ingredient IDs (repeatable parameter) |
| `units` | Array of required units per ingredient (repeatable parameter) |

#### Example Request

```bash
GET /ingredients/availability?ids=ingredient-123&ids=ingredient-456&units=50&units=30
```

---

## Warehouse Sizes

| Size | Code | Description |
|------|------|-------------|
| Small | `S` | Small warehouse |
| Standard | `M` | Standard warehouse |
| Large | `L` | Large warehouse |

---

## Schema Reference

### Ingredient Request

```typescript
// Query parameters for checking ingredient availability
import { IngredientRequest, ingredientRequestSchema } from '@pizza/api-contracts';

// Example:
const req: IngredientRequest = {
  ids: ['ingredient-123', 'ingredient-456'],
  units: [50, 30],
};
```

### Ingredient Availability Response

```typescript
import {
  IngredientAvailability,
  CheckIngredientAvailabilityResponse,
  checkIngredientAvailabilityResponseSchema,
} from '@pizza/api-contracts';
```

### Import All Types

```typescript
import {
  // Pizza ordering
  Pizza,
  pizzaSchema,
  PizzaLog,
  pizzaLogSchema,
  ReadyPizzasRequest,
  readyPizzasRequestSchema,
  ReadyPizzasResponse,
  readyPizzasResponseSchema,
  AvailablePizzasRequest,
  availablePizzasRequestSchema,
  AvailablePizzasResponse,
  availablePizzasResponseSchema,

  // Ingredient availability
  IngredientRequest,
  ingredientRequestSchema,
  IngredientAvailability,
  ingredientAvailabilitySchema,
  CheckIngredientAvailabilityResponse,
  checkIngredientAvailabilityResponseSchema,

  // Shipment
  TargetWarehouse,
  Ingredient,
  ingredientSchema,
  Shipment,
  shipmentSchema,

  // Errors
  ErrorWithStatus,
  PartialShipmentError,
} from '@pizza/api-contracts';
```
