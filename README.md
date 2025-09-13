# TeaBack

TeaBack is a Next.js (App Router) project for anonymous messages and simple user onboarding. Users sign up with an email and username, verify via a one-time code (OTP) sent by email, and can toggle whether they accept incoming messages. Visitors can send messages to verified users.

Key features
- Email verification flow using Resend to deliver templated verification emails.
- Authentication and session handling with `next-auth`.
- Users can opt-in to receive messages and view received messages in reverse chronological order.
- MongoDB (via Mongoose) for user and message storage.

Getting started
1. Install dependencies:

```bash
npm install
```

2. Create a `.env.local` file in the project root and add the required environment variables (see below).

3. Run the development server:

```bash
npm run dev
```

Open http://localhost:3000 in your browser.

Available scripts
- `npm run dev` — start Next.js in development mode.
- `npm run build` — build the app for production.
- `npm run start` — start the built app.
- `npm run lint` — run ESLint.

Environment variables
Add the following to `.env.local` before running the app. Values are examples — replace them with your own credentials.

- `MONGODB_URI` — MongoDB connection string (required).
- `RESEND_API_KEY` — API key for Resend (used to send verification emails) (required).
- `NEXTAUTH_URL` — Base URL for NextAuth (e.g. `http://localhost:3000`).
- `NEXTAUTH_SECRET` — Secret used by NextAuth for signing (recommended in production).

If you deploy to Vercel you may instead set these as project environment variables in the dashboard.

Project structure (high level)
- `app/` — Next.js App Router routes and pages.
  - `(auth)/` — auth pages (login, signup, verify).
  - `(app)/dashboard` — logged-in user dashboard.
  - `api/` — server routes used by the frontend.
- `src/lib/` — helpers like `dbconfig.ts` and `resend.ts`.
- `src/helpers/` — email helper `sendverifyemail.tsx` and templates in `emails/`.
- `src/models/` — Mongoose models for users and messages.

Important server API routes
These routes live under `src/app/api/` and are used by the frontend.

- `POST /api/signup` — Create or update a user and send verification OTP via email. Expects JSON `{ email, username, password }`.
- `POST /api/verifyUser` — Verify a user with `{ username, otp }`.
- `GET /api/check-username-uniqe?username=...` — Validate username availability. Returns 200 when available or 409 if taken.
- `POST /api/send-message` — Send a message to a user (public endpoint). Expects `{ username, content }`.
- `POST /api/accept-messages` — Toggle authenticated user's `msgAccepted` flag. Requires session.
- `GET /api/accept-messages` — Get authenticated user's details (including `msgAccepted`) and messages.
- `GET /api/getUseMessage` — Get messages for the authenticated user (sorted newest first).

Notes and implementation details
- Database: `src/lib/dbconfig.ts` connects to MongoDB using `MONGODB_URI`.
- Email: `src/lib/resend.ts` expects `RESEND_API_KEY` and constructs a `Resend` client. The verification email template is in `emails/verificationMail.tsx` and is sent via `src/helpers/sendverifyemail.tsx`.
- Auth: `next-auth` is configured under `src/app/api/auth/[...nextauth]` and uses `NEXTAUTH_SECRET`/`NEXTAUTH_URL` as typical.
- OTP: Signup generates a 6-digit OTP and stores `verifyCode` and `verifyCodeExpiry` on the user document.

Testing and running
- Start dev: `npm run dev` and test the frontend flows (signup → check email → verify → login).
- You can also exercise the API with `curl` or Postman. Example signup request:

```bash
curl -X POST http://localhost:3000/api/signup \
  -H "Content-Type: application/json" \
  -d '{ "email": "you@example.com", "username": "alice", "password": "secret" }'
```

Security and production
- Keep `RESEND_API_KEY`, `MONGODB_URI`, and `NEXTAUTH_SECRET` secret and never commit them to Git.
- Consider rate-limiting the signup and verify endpoints to avoid abuse.

Contributing
- The repo follows typical Next.js + TypeScript conventions. If you add features, please update this README with new env vars, routes, or scripts.

License
- This project does not include a license file. Add one if you plan to open source it.
