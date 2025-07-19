# CBC-Lite Backend (TypeScript + Prisma)

## Setup

1. Install dependencies:
```
npm install
```

2. Copy `.env.example` ke `.env` dan isi DATABASE_URL

3. Jalankan Prisma migrate:
```
npx prisma migrate dev --name init
```

4. Jalankan server:
```
npm run dev
```

## Endpoints

- `GET /api/patients`
- `POST /api/patients`
