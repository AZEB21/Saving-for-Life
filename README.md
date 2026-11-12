# Saving for Life 🌸

A simple, private Equb tracker for a group of friends. Everyone saves together, and each week one slot receives the pot, so the money goes toward something important.

The site only **records** contributions and payouts. Members still pay by Telebirr or bank transfer, and an admin confirms each payment.

## How the Equb works

- One **slot** = **200 ETB per week**.
- A slot has a **payout position** (week 1, 2, 3, ...). When its week comes, it receives the pot.
- **Pot per week** = 200 × total number of slots.
- **Split a slot:** two friends can share one slot. Each pays 100 ETB/week and each receives half of the payout.
- **Double slot:** one person can take two slots (400 ETB/week) and gets paid twice, in two different weeks.
- The cycle lasts as many weeks as there are slots.

The goal is to keep the Equb inclusive, whether a member has a lot of money to put in or only a little.

## Features

- Login for members and admins
- Dashboard: current week, what I owe, who has paid, who receives next
- Admin page: confirm payments, create slots and shares, mark payouts as done
- Optional purpose note for each payout (for example "school fees")

Not included on purpose: public registration, notifications, payment integration. Chat stays in the Telegram group.

## Tech stack

| Part | Technology |
| --- | --- |
| Backend | Node.js, Express, TypeScript |
| Database | PostgreSQL (SQLite while developing) with Prisma |
| Auth | JWT, with roles `ADMIN` and `MEMBER` |
| Frontend | React, Vite, TypeScript, Tailwind CSS |

## Project structure

```
saving-for-life/
├── backend/
│   ├── prisma/          # schema.prisma, seed.ts
│   └── src/
│       ├── config/      # env.ts
│       ├── lib/         # prisma client
│       ├── middleware/  # auth, requireAdmin, errorHandler
│       ├── routes/      # URL -> controller
│       ├── controllers/ # request/response handling
│       ├── services/    # money logic: dues, pot, current week, payout
│       └── types/
└── frontend/
    └── src/
        ├── api/         # fetch wrapper
        ├── context/     # AuthContext
        ├── pages/       # Login, Dashboard, Admin
        └── components/  # ProgressCard, PaymentRow, ProtectedRoute
```

All money calculations live in `backend/src/services/`, so a rule change happens in one place.

## Data model

- **User**: name, phone, password, role
- **Slot**: payout position, paid-out date
- **SlotShare**: which user holds how much of a slot (`1.0` full, `0.5` half)
- **Payment**: one record per slot share per week, with a confirmed flag

Amounts are computed, not stored:

- Amount due = `200 × share`
- Weekly pot = `200 × number of slots`
- Payout for week N goes to the shares of the slot at position N

## Getting started

### Prerequisites

- Node.js 18+
- PostgreSQL (or use SQLite for local development)

### Backend

```bash
cd backend
npm install
cp .env.example .env        # then fill in the values
npx prisma migrate dev
npx prisma db seed          # optional test data
npm run dev
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

### Environment variables (`backend/.env`)

```
DATABASE_URL="postgresql://user:password@localhost:5432/saving_for_life"
JWT_SECRET="change-this-to-a-long-random-string"
PORT=4000
```

## API overview

| Method | Endpoint | Access | Purpose |
| --- | --- | --- | --- |
| POST | `/auth/login` | Public | Log in |
| GET | `/me` | Member | My weekly due, payout weeks, payment status |
| GET | `/summary` | Member | Current week, who has paid, next recipient |
| POST | `/payments/:id/confirm` | Admin | Confirm a payment |
| POST | `/slots` | Admin | Create a slot |
| POST | `/slots/:id/shares` | Admin | Add a member (or a split) to a slot |
| POST | `/slots/:id/payout` | Admin | Mark a payout as done |

## Rules and security

- Only admins can confirm payments. Members cannot edit payment records.
- Passwords are hashed. No bank passwords, OTPs, or card details are ever stored.
- Members see only their own details plus the group summary.
- Admins create the accounts. There is no public sign-up.

<!-- ## Group rules to agree on

These are decided by the group, not the code:

1. If one half of a shared slot doesn't pay, does the partner cover it or does the round wait?
2. What happens to a shared slot if one partner drops out?
3. How is the payout order chosen (lottery or agreement)?
4. What is the late-payment rule? -->

## Roadmap

- [ ] Backend setup, Prisma schema, seed data
- [ ] Auth and middleware
- [ ] `/me` and `/summary` endpoints
- [ ] Admin endpoints
- [ ] Frontend: Login, Dashboard, Admin
- [ ] Deploy (Render + Vercel)