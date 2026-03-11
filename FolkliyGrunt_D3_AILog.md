# 📝 D3: AI Usage Log

Every team member MUST log their AI usage here.

### Entry 1 — Project Scaffold & Dependency Configuration
- **Date:** 2026-03-11
- **Person:** Person 1 (Project Lead)
- **AI Tool:** Gemini (Antigravity Agent)
- **Task:** Initializing Node.js project, formatting `package.json`, and configuring `.env.example`.

**Prompt:**
> Please generate the package.json with dependencies for Express, pg, Supabase, CORS, NodeMailer, and Stripe. Also, create a template .env.example file for the environment variables.

**AI Output (Summary):**
> Generated `package.json` with the required dependencies (Express, pg, Supabase, CORS, NodeMailer, Stripe, etc.) and created `.env.example` mapping to Supabase and other services.

**Decision:**
- [x] ✅ Accepted as-is

**Verification Method:**
> Ran `npm install` and manually checked `package.json` against the instructions.

### Entry 2 — Database and Auth Middleware Setup
- **Date:** 2026-03-11
- **Person:** Person 1 (Project Lead)
- **AI Tool:** Gemini (Antigravity Agent)
- **Task:** Setting up Supabase instances and API authentication middleware.

**Prompt:**
> I need to set up the PostgreSQL database connection using the pg library and initialize the Supabase client for authentication. Can you also create an Express middleware to verify Supabase JWT tokens and fetch the user profile?

**AI Output (Summary):**
> Generated `config/db.js` for PostgreSQL connection pooling and `config/supabase.js` to export both anon and admin clients. Also generated `middleware/authMiddleware.js` for intercepting JWT tokens.

**Decision:**
- [x] ✅ Accepted as-is

**Verification Method:**
> Reviewed the code format. Matches the required interface `req.user = { id, email, role, profile }` required by the rest of the team.

### Entry 3 — Auth APIs and System Schema Schema
- **Date:** 2026-03-11
- **Person:** Person 1 (Project Lead)
- **AI Tool:** Gemini (Antigravity Agent)
- **Task:** Implementing Auth Controllers, REST routes, and translating ER diagram into PostgreSQL schema.

**Prompt:**
> Could you implement the Express routes and controllers for user registration, login, fetching the profile, and an admin endpoint to disable users? Also, please write the SQL schema to create tables for profiles, courts, bookings, waitlist, and reviews.

**AI Output (Summary):**
> Wrote `routes/auth.js` and `controllers/authController.js` for signup, login, profile, and admin account suspension. Built `schema.sql` encompassing all application tables with optimal query indexes. Design system CSS was also built.

**Decision:**
- [x] ✅ Accepted as-is

**Verification Method:**
> Examined code visually to ensure SQL relations were sound (cascading deletes, unique fields) and Supabase methods used correctly. Design uses variables for simple theming.

### Entry 4 — Connection Debugging and Dashboard Implementation
- **Date:** 2026-03-11
- **Person:** Person 1
- **AI Tool:** Gemini (Antigravity Agent)
- **Task:** Resolving `ENOTFOUND` connection errors, fixing data mapping bugs, and building the dashboard.

**Prompt:**
> Resolve the "ENOTFOUND base" error occurring during registration. Fix the profile creation crash where full_name was null. Then, implement a central dashboard that greets the user and handles session redirection.

**AI Output (Summary):**
> Identified hidden characters in `.env` causing DNS errors; refactored to individual host/user variables. Fixed frontend `fullName` to backend `full_name` mapping mismatch. Created `index.html` and updated `app.js` with session-aware routing and profile fetching.

**Decision:**
- [x] ✅ Accepted as-is

**Verification Method:**
> Ran `npm test`—all 6 suite tests passed. Manually verified end-to-end registration and dashboard redirection in the browser.
### Entry 5 — SonarCloud Remediation & Test Coverage Optimization
- **Date:** 2026-03-11
- **Person:** Person 1
- **AI Tool:** Gemini (Antigravity Agent)
- **Task:** Resolving Reliability and Maintainability issues, reducing Cognitive Complexity, and boosting test coverage to 80%+.

**Prompt:**
> Address the SonarCloud issues: fix the parseInt calls in db.js, use optional chaining in authController.js, and refactor the monolithic DOM content logic in app.js to reduce cognitive complexity. Also, create a unit test for the Profile model and auth endpoints to ensure we hit the 80% coverage target.

**AI Output (Summary):**
> Updated `db.js` with `Number.parseInt`. Refactored `app.js` into modular functions (`updateAuthUI`, `fetchAndSyncProfile`). Implemented `profile.test.js` and updated `auth.test.js` with comprehensive mocks.

**Decision:**
- [x] ✅ Accepted as-is

**Verification Method:**
> Ran `npm run test -- --coverage`. Verified an overall statement coverage of **83.8%** and confirmed all 11 tests pass.

---

## Person 2: Court Search
*Log your AI interactions here...*

---

## Person 3: Bookings & Equipment
*Log your AI interactions here...*

---

## Person 4: Waitlist & Payments
*Log your AI interactions here...*

### Entry 4 — Waitlist Model & Payment Service Implementation
- **Date:** 2026-03-11
- **Person:** Nattapat Yotraksa / Person 4
- **AI Tool:** Gemini (Antigravity Agent)
- **Task:** Implementing the Waitlist model (`models/Waitlist.js`) and Payment Service (`services/paymentService.js`) as specified in `PERSON4_WAITLIST_PAYMENT_NOTIFICATION.md`.

**Prompt:**
> Implement the Person 4 spec: create the Waitlist model with static methods (add, getNextInQueue, markNotified, findByUser, expireOldEntries) using the existing config/db pool, and create the Payment Service with Stripe Charges API for processPayment and Stripe Refunds API for processRefund.

**AI Output (Summary):**
> Generated `models/Waitlist.js` with all required static methods matching the waitlist table schema. Generated `services/paymentService.js` using the Stripe Node.js SDK with `processPayment` (Charges API) and `processRefund` (Refunds API). Both files follow the exact function signatures from the spec for Person 3 integration.

**Decision:**
- [x] ✅ Accepted as-is

**Modifications / Rejection Reason:**
> Added a `remove(waitlistId, userId)` method to the Waitlist model (not in original spec) to fully implement the DELETE endpoint instead of leaving it as a TODO.

**Verification Method:**
> Ran `npx jest --forceExit --detectOpenHandles` — all tests pass. Verified function signatures match the interface table in the spec.

### Entry 5 — Notification Service Implementation
- **Date:** 2026-03-11
- **Person:** Nattapat Yotraksa / Person 4
- **AI Tool:** Gemini (Antigravity Agent)
- **Task:** Implementing the Notification Service (`services/notificationService.js`) using Nodemailer with SMTP.

**Prompt:**
> Create the Notification Service with Nodemailer that sends email alerts when a waitlisted court becomes available. Include notifyWaitlist (gets next user in queue, marks as notified, sends email) and sendNotification (generic email sender). Use SMTP config from .env.

**AI Output (Summary):**
> Generated `services/notificationService.js` with a reusable SMTP transporter using Nodemailer. Includes `notifyWaitlist(courtId, startTime, endTime)` which queries the waitlist, marks the user as notified, and sends an HTML email. Also includes `sendNotification(userEmail, subject, message)` for generic emails. Email failures are caught gracefully without blocking the calling operation.

**Decision:**
- [x] ✅ Accepted as-is

**Modifications / Rejection Reason:**
> None — code matches the spec exactly.

**Verification Method:**
> Ran unit tests with mocked Nodemailer transporter — all 5 notification tests pass. Configured Mailtrap SMTP credentials for dev testing.

### Entry 6 — Waitlist Controller, Routes & Frontend Page
- **Date:** 2026-03-11
- **Person:** Nattapat Yotraksa / Person 4
- **AI Tool:** Gemini (Antigravity Agent)
- **Task:** Implementing the waitlist REST API controller, Express routes, and the frontend HTML page.

**Prompt:**
> Create the waitlist controller with addToWaitlist, getMyWaitlist, removeFromWaitlist handlers. Create Express routes (POST /, GET /my, DELETE /:id) protected by authMiddleware. Uncomment the waitlist route in server.js. Also create a waitlist.html page following the same patterns as the existing login.html.

**AI Output (Summary):**
> Generated `controllers/waitlistController.js` with three handler methods. Generated `routes/waitlist.js` applying authMiddleware to all routes. Modified `server.js` to uncomment the waitlist route registration. Created `public/pages/waitlist.html` with a join-waitlist form, entry listing, and remove functionality using fetch API with Bearer token auth.

**Decision:**
- [x] ✏️ Accepted with modifications (describe changes below)

**Modifications / Rejection Reason:**
> The spec had `removeFromWaitlist` as a TODO stub returning only a message. Modified to fully implement deletion using the Waitlist model's `remove` method with proper 404 handling when the entry is not found.

**Verification Method:**
> Ran integration tests via supertest — all 8 waitlist API tests pass (add, auth check, DB error, list entries, empty list, remove, not found). Verified route is active in server.js.

### Entry 7 — Unit Tests for Payment & Notification Services
- **Date:** 2026-03-11
- **Person:** Nattapat Yotraksa / Person 4
- **AI Tool:** Gemini (Antigravity Agent)
- **Task:** Writing Jest unit tests for `paymentService.js` and `notificationService.js`.

**Prompt:**
> Create unit tests for the payment service (mock Stripe SDK, test processPayment success/failure, processRefund success/failure) and notification service (mock Waitlist model and Nodemailer, test notifyWaitlist with user found/empty queue/email failure, test sendNotification success/failure).

**AI Output (Summary):**
> Generated `tests/paymentService.test.js` with 4 tests mocking Stripe's charges.create and refunds.create. Generated `tests/notificationService.test.js` with 5 tests mocking Nodemailer's sendMail and the Waitlist model. Initial version had mock reference issues — the mock functions were created inside jest.mock() factory but referenced separately in tests.

**Decision:**
- [x] ✏️ Accepted with modifications (describe changes below)

**Modifications / Rejection Reason:**
> First iteration had mock isolation issues (Stripe mock instances not linked between mock factory and test assertions). Fixed by hoisting `mockChargesCreate`, `mockRefundsCreate`, and `mockSendMail` as top-level `jest.fn()` references above `jest.mock()` calls so the same mock objects are shared.

**Verification Method:**
> Ran `npx jest --forceExit --detectOpenHandles` — all 22 tests pass across 4 suites (auth: 5, waitlist: 8, payment: 4, notification: 5). Coverage: paymentService.js at 100%, notificationService.js at 100%.

### Entry 8 — Stripe API & Mailtrap SMTP Configuration
- **Date:** 2026-03-11
- **Person:** Nattapat Yotraksa / Person 4
- **AI Tool:** Gemini (Antigravity Agent)
- **Task:** Configuring Stripe test API keys and Mailtrap SMTP credentials in `.env`.

**Prompt:**
> Connect the Stripe API keys (secret key: sk_test_..., publishable key: pk_test_...) to the env file. Also configure Mailtrap SMTP credentials (host: sandbox.smtp.mailtrap.io, port: 2525, username and password) for dev email testing.

**AI Output (Summary):**
> Updated both `env` and `.env` files with the real Stripe test keys (STRIPE_SECRET_KEY and STRIPE_PUBLISHABLE_KEY) and Mailtrap SMTP credentials (SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS). Noted that `pk_test_` is the frontend publishable key and `sk_test_` is the backend secret key.

**Decision:**
- [x] ✅ Accepted as-is

**Modifications / Rejection Reason:**
> None — credentials were placed in the correct environment variables.

**Verification Method:**
> Ran all tests after configuration — 22 tests pass. Verified `.env` file is loaded by dotenv in paymentService.js and notificationService.js.


---

## Person 5: Reviews & Localization
*Log your AI interactions here...*
