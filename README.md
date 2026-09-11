# 💰 Expense Tracker REST API

A clean, production-ready, and lightweight RESTful API built with **Node.js** and **Express 5** to track and manage personal expenses. It features full CRUD operations, advanced query filtering (by category and date range), aggregated expense analytics, route-level validation, security headers, CORS configuration, and local JSON file persistence.

---

## 📑 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Security & Middleware](#-security--middleware)
- [Project Architecture](#-project-architecture)
- [Getting Started](#-getting-started)
    - [Prerequisites](#prerequisites)
    - [Installation](#installation)
    - [Environment Variables](#environment-variables)
    - [Running the Server](#running-the-server)
- [API Reference](#-api-reference)
    - [Base URL](#base-url)
    - [Endpoints Summary](#endpoints-summary)
    - [Detailed Endpoints & Examples](#detailed-endpoints--examples)
- [Data Model & Validation](#-data-model--validation)
    - [Expense Object Schema](#expense-object-schema)
    - [Validation Rules](#validation-rules)
- [Error Handling](#-error-handling)
- [Author](#-author)

---

## ✨ Features

- **Full CRUD Support**: Create, view, partially update (`PATCH`), and delete expense entries.
- **Modern Route Chaining**: Uses Express 5 chained `route()` definitions for clean and maintainable endpoints (`/` and `/:id`).
- **Flexible Filtering & Search**: Query expenses by category (case-insensitive) and filter by specific date ranges (`from` and `to`).
- **Financial Analytics & Summary**: Computes real-time totals and per-category spending breakdowns via `/api/expenses/summary`.
- **Security & Cross-Origin Ready**:
    - **Helmet**: Sets protective HTTP headers to guard against common web vulnerabilities.
    - **CORS**: Configured cross-origin resource sharing for frontend integration (e.g. Vite on `http://127.0.0.1:5173`).
- **Data Integrity & Validation**:
    - Validates request body structure and data types.
    - Custom date validation checking `YYYY-MM-DD` formatting, calendar leap year / day bounds, and historical range (1950 to present).
    - Malformed JSON body handling middleware.
- **File-Based JSON Persistence**: Reads and writes data directly to `data/expenses.json` using Node.js `fs`.
- **Auto-Generated UUIDs**: Leverages Node's native `crypto.randomUUID()` for unique IDs and returns resource `location` references.

---

## 🛠 Tech Stack

- **Runtime Environment**: [Node.js](https://nodejs.org/) (v18+ recommended)
- **Web Framework**: [Express 5](https://expressjs.com/) (`v5.2.1`)
- **Security**: [Helmet](https://helmetjs.github.io/) (`v8.3.0`)
- **CORS**: [cors](https://github.com/expressjs/cors) (`v2.8.6`)
- **Dev Server & Hot Reloading**: [Nodemon](https://nodemon.io/) (`v3.1.14`)
- **Storage**: Local JSON (`fs` module)

---

## 🛡 Security & Middleware

The API incorporates multi-layered middleware for safety and reliability:

1. **Helmet (`helmet`)**: Sets important security headers including Content Security Policy, X-Frame-Options, and Strict-Transport-Security.
2. **CORS (`cors`)**: Configured with origin filtering (`http://127.0.0.1:5173`) allowing smooth integration with modern frontend build tools like Vite.
3. **JSON Body Parser (`express.json()`)**: Parses incoming request buffers into structured JSON objects.
4. **Syntax Error Interceptor**: Catches and intercepts malformed JSON before it can crash the request lifecycle.
5. **Data Existence Guard**: Verifies that expense data is available before running operations.
6. **Route Parameter Guard (`checkParam`)**: Pre-validates `:id` presence and existence in data before executing ID-dependent operations.

---

## 📂 Project Architecture

```text
3-Expense-Tracker-API/
├── data/
│   └── expenses.json            # Persistent JSON file storing expense records
├── src/
│   ├── modules/
│   │   ├── controllers.js       # Request controllers & business logic (CRUD & Summary)
│   │   └── expensesRoutes.js    # Express route definitions, chained handlers & validation
│   ├── services/
│   │   ├── readExpensesData.js  # Service loading data from expenses.json
│   │   └── ValidateDate.js      # Date format & calendar bounds validator
│   └── app.js                   # App setup, security middleware (CORS, Helmet), routes
├── .env                         # Environment variables (PORT, NODE_ENV)
├── example.env                  # Template for environment configuration
├── package.json                 # Project dependencies and npm scripts
├── server.js                    # HTTP server entry point
└── README.md                    # Project documentation
```

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18.0.0 or higher recommended)
- [npm](https://www.npmjs.com/) (bundled with Node.js)

### Installation

1. **Clone the repository:**

    ```bash
    git clone https://github.com/Fayed12/Expense-Tracker-API.git
    cd 3-Expense-Tracker-API
    ```

2. **Install dependencies:**
    ```bash
    npm install
    ```

### Environment Variables

Copy `example.env` to a new file named `.env`:

```bash
cp example.env .env
```

Set your desired configuration:

```env
PORT=4000
NODE_ENV=development
```

### Running the Server

Start the development server with hot-reloading:

```bash
npm start
```

The console will indicate that the server is active:

```text
app is running on port 4000...
```

---

## 📖 API Reference

### Base URL

```text
http://localhost:4000
```

### Endpoints Summary

| Method   | Endpoint                | Description                               | Handlers & Middleware                            |
| -------- | ----------------------- | ----------------------------------------- | ------------------------------------------------ |
| `GET`    | `/`                     | Health check / Welcome greeting           | Returns plain text `hello`                       |
| `GET`    | `/api/expenses`         | List all expenses with optional filtering | `getAllData` (supports `category`, `from`, `to`) |
| `GET`    | `/api/expenses/summary` | Get financial total & per-category sum    | `getSummary`                                     |
| `GET`    | `/api/expenses/:id`     | Retrieve single expense by ID             | `checkParam` → `getExpenseById`                  |
| `POST`   | `/api/expenses`         | Add a new expense                         | `checkReqBody` → `createNewExpense`              |
| `PATCH`  | `/api/expenses/:id`     | Partially update an existing expense      | `updateExpense`                                  |
| `DELETE` | `/api/expenses/:id`     | Remove an expense by ID                   | `checkParam` → `deleteItem`                      |

---

### Detailed Endpoints & Examples

#### 1. Root / Health Check

- **Method:** `GET`
- **Path:** `/`
- **Response:**
    ```text
    hello
    ```

---

#### 2. Get All Expenses (with Filtering)

- **Method:** `GET`
- **Path:** `/api/expenses`
- **Query Parameters:**
    - `category` _(optional)_: Filter by category (case-insensitive, e.g., `food`, `transport`).
    - `from` _(optional)_: Lower date boundary in `YYYY-MM-DD` format (inclusive).
    - `to` _(optional)_: Upper date boundary in `YYYY-MM-DD` format (inclusive).
- **Example Request:**
    ```bash
    curl "http://localhost:4000/api/expenses?category=food&from=2026-09-01"
    ```
- **Success Response (`200 OK`):**
    ```json
    {
        "status": "success",
        "data": [
            {
                "id": "e7a1c2d4-0001-4a5b-8c9d-1a2b3c4d5e6f",
                "title": "Groceries",
                "amount": 42.5,
                "category": "food",
                "date": "2026-09-01",
                "createdAt": "2026-09-01T09:15:00.000Z"
            }
        ]
    }
    ```

---

#### 3. Get Expense Summary

Calculates aggregate total spending across all records and an itemized breakdown grouped by category.

- **Method:** `GET`
- **Path:** `/api/expenses/summary`
- **Example Request:**
    ```bash
    curl "http://localhost:4000/api/expenses/summary"
    ```
- **Success Response (`200 OK`):**
    ```json
    {
        "status": "success",
        "data": {
            "total": 379.75,
            "byCategory": {
                "food": 282.5,
                "transport": 25,
                "utilities": 60.25,
                "entertainment": 12
            }
        }
    }
    ```

---

#### 4. Get Expense by ID

- **Method:** `GET`
- **Path:** `/api/expenses/:id`
- **Example Request:**
    ```bash
    curl "http://localhost:4000/api/expenses/e7a1c2d4-0001-4a5b-8c9d-1a2b3c4d5e6f"
    ```
- **Success Response (`200 OK`):**
    ```json
    {
        "status": "success",
        "data": [
            {
                "id": "e7a1c2d4-0001-4a5b-8c9d-1a2b3c4d5e6f",
                "title": "Groceries",
                "amount": 42.5,
                "category": "food",
                "date": "2026-09-01",
                "createdAt": "2026-09-01T09:15:00.000Z"
            }
        ]
    }
    ```
- **Error Response (`404 Not Found`):**
    ```json
    {
        "status": "failed",
        "message": "this id is not exist, try another one!"
    }
    ```

---

#### 5. Create a New Expense

- **Method:** `POST`
- **Path:** `/api/expenses`
- **Headers:** `Content-Type: application/json`
- **Request Body:**
    ```json
    {
        "title": "Gym Membership",
        "amount": 50,
        "category": "fitness",
        "date": "2026-09-10"
    }
    ```
- **Example Request:**
    ```bash
    curl -X POST "http://localhost:4000/api/expenses" \
         -H "Content-Type: application/json" \
         -d '{"title": "Gym Membership", "amount": 50, "category": "fitness", "date": "2026-09-10"}'
    ```
- **Success Response (`201 Created`):**
    ```json
    {
      "status": "success",
      "location": "get /api/expenses/b3b2d187-5735-4679-b141-860e65bc93c0",
      "data": [ ... ]
    }
    ```

---

#### 6. Update an Expense (`PATCH`)

Partially updates specific attributes of an existing expense. The `id` property is immutable.

- **Method:** `PATCH`
- **Path:** `/api/expenses/:id`
- **Headers:** `Content-Type: application/json`
- **Request Body:** Any subset of `{ "title", "amount", "category", "date" }`
    ```json
    {
        "amount": 65
    }
    ```
- **Example Request:**
    ```bash
    curl -X PATCH "http://localhost:4000/api/expenses/e7a1c2d4-0001-4a5b-8c9d-1a2b3c4d5e6f" \
         -H "Content-Type: application/json" \
         -d '{"amount": 65}'
    ```
- **Success Response (`200 OK`):**
    ```json
    {
      "status": "success",
      "location": "get /api/expenses/e7a1c2d4-0001-4a5b-8c9d-1a2b3c4d5e6f",
      "data": [ ... ]
    }
    ```

---

#### 7. Delete an Expense

- **Method:** `DELETE`
- **Path:** `/api/expenses/:id`
- **Example Request:**
    ```bash
    curl -X DELETE "http://localhost:4000/api/expenses/e7a1c2d4-0001-4a5b-8c9d-1a2b3c4d5e6f"
    ```
- **Success Response (`200 OK`):**
    ```json
    {
      "status": "success",
      "data": [ ... ]
    }
    ```

---

## 📋 Data Model & Validation

### Expense Object Schema

| Field       | Type            | Required       | Description                                                      |
| ----------- | --------------- | -------------- | ---------------------------------------------------------------- |
| `id`        | `string` (UUID) | Auto-generated | Globally unique identifier generated using `crypto.randomUUID()` |
| `title`     | `string`        | Yes            | Title or short description of the expense                        |
| `amount`    | `number`        | Yes            | Numerical expense cost (must strictly be of type `number`)       |
| `category`  | `string`        | Yes            | Category tag (e.g., `food`, `transport`, `utilities`)            |
| `date`      | `string`        | Yes            | Date string formatted as `YYYY-MM-DD`                            |
| `createdAt` | `string` (ISO)  | Optional       | Server timestamp marking creation                                |

### Validation Rules

- **Missing Value Check (`checkReqBody`)**: Requires `title`, `amount`, `category`, and `date` upon creation.
- **Type Guard**: `amount` must be a numerical value (`typeof amount === "number"`).
- **Date Format & Boundary (`ValidateDate.js`)**:
    - Regex check against `/^\d{4}-\d{2}-\d{2}$/`.
    - Leap-year & calendar day validity check (rejects invalid dates like `2026-02-30`).
    - Historical & future date boundaries: Must be between `1950-01-01` and the current date.
- **Immutable ID**: Reject requests attempting to mutate an existing expense's `id`.
- **Redundancy Guard**: Rejects updates where provided values match existing values (`400 nothing to update all values are the same`).

---

## 🚦 Error Handling

All error responses are returned with descriptive status messages and appropriate HTTP status codes:

- **400 Bad Request**:
    - Malformed JSON payload:
        ```json
        { "message": "Malformed JSON body" }
        ```
    - Missing field / Invalid type:
        ```json
        {
            "status": "failed",
            "message": "please insert number value to amount "
        }
        ```
    - Unchanged values:
        ```json
        {
            "status": "failed",
            "message": "nothing to update all values are the same"
        }
        ```
- **404 Not Found**:
    - Non-existent resource ID:
        ```json
        {
            "status": "failed",
            "message": "this id is not exist, try another one!"
        }
        ```
    - Empty dataset or no matching filter results:
        ```json
        { "status": "failed", "message": "no data found!" }
        ```
- **500 Internal Server Error**:
    - File system disk write failure:
        ```json
        { "status": "failed", "message": "server error!" }
        ```

---

## 👤 Author

Developed by **Mohamed Fayed**  
GitHub: [@Fayed12](https://github.com/Fayed12)  
Repository: [Expense-Tracker-API](https://github.com/Fayed12/Expense-Tracker-API)
