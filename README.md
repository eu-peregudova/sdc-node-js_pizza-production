### Overview

Pizza production application

### Requirements

- Node.js
- npm

### Installation

```bash
git clone <repository-url>
cd <project-folder>
npm install
```

### Configuration

Add environment variables to .env file to shipment-service's root.

Example:

```env
PG_USER=example
PG_PASS=example
PG_HOST=localhost
PG_PORT=5432
PG_NAME=example

DATABASE_URL=example
```

### Usage

First, run the docker
```bash
podman compose up
```

Then, the database has to be populated with necessary data (warehouses, ingredients).

After that

```bash
npm run start
```

