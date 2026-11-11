# School Admission System

A web-based school admission management system with a Next.js frontend
and a single ASP.NET Core Web API backend. The system supports student
applications, admission-office operations, payment tracking, and
administrator management.

> **Project layout:** Keep the backend as one ASP.NET Core project. The
> backend project file is `backend/backend.csproj`. Do not create
> separate backend projects for individual modules.

## 1. Technology Stack

### Backend

-   ASP.NET Core Web API (.NET 10)
-   Entity Framework Core
-   PostgreSQL (including hosted PostgreSQL providers such as Supabase)
-   JWT-based authentication
-   Role-based authorization

### Frontend

-   Next.js
-   React
-   TypeScript
-   Tailwind CSS
-   `lucide-react` for icons
-   `@react-oauth/google` for Google sign-in UI integration

Confirm the exact package versions in the project's `.csproj` and
`package.json` files.

## 2. Project Structure

The repository is expected to have one backend project and one frontend
application:

``` text
school/
├── backend/
│   ├── backend.csproj
│   ├── Program.cs
│   ├── Controllers/
│   ├── DTOs/
│   ├── Entities/
│   ├── Data/
│   ├── Services/
│   ├── Repositories/
│   ├── Authentication/
│   ├── Payments/
│   ├── BackgroundJobs/
│   ├── Middleware/
│   ├── Migrations/
│   ├── appsettings.json
│   └── appsettings.Development.json
│
├── frontend/
│   ├── package.json
│   ├── .env.local
│   └── src/
│       ├── app/
│       ├── components/
│       ├── context/
│       ├── hooks/
│       ├── lib/
│       └── types/
│
├── README.md
├── ASSUMPTIONS.md
└── AI_USAGE.md
```

The folder names above describe the intended organization. Keep the
actual source files and namespaces consistent with the existing
repository.

## 3. User Roles

The frontend and backend use these role identifiers:

    Role ID Role
  --------- ------------------
          1 Student
          2 Admission Office
          3 Admin

The backend must enforce authorization on protected endpoints. Hiding a
menu item or protecting a frontend route is not a substitute for backend
authorization.

## 4. Main Functional Areas

### Public website

-   Home
-   Our Story
-   Admission information and published circulars
-   Application entry point
-   Contact

### Authentication

-   Email/password login
-   Google login, when configured
-   Forgot-password and reset-password flow
-   JWT-based authenticated requests
-   Logout and refresh-token handling, where implemented

### Student

-   View profile
-   Submit an application against an eligible admission circular
-   View own applications
-   View own payment records
-   View lottery result when published

### Admission Office

-   Review applications within its authorized scope
-   View admission circular information
-   Perform only the application actions permitted by backend policy

### Admin

-   Manage users
-   Manage classes and class shifts
-   Manage academic years
-   Manage admission circulars
-   Run and review the lottery, if enabled by the approved project
    requirements
-   View reports

## 5. Local Development Setup

### Prerequisites

-   .NET 10 SDK
-   Node.js version supported by the installed Next.js version
-   npm
-   A reachable PostgreSQL database
-   Git (if working from a repository)

### Backend configuration

1.  Open a terminal in the repository root.
2.  Change to the backend directory:

``` powershell
cd "E:\.NET Project\school\backend"
```

3.  Configure the PostgreSQL connection string using local development
    configuration or user-secrets/environment variables. Do not commit
    real database credentials.
4.  Configure JWT settings and any required Google/payment provider
    settings using development-only secrets.
5.  Restore, build, and run:

``` powershell
dotnet restore
dotnet build
dotnet run
```

Use the actual listening URL printed by ASP.NET Core. Do not assume a
fixed HTTP or HTTPS port.

### Database migrations

If Entity Framework Core migrations are part of the current backend
setup, use:

``` powershell
dotnet ef migrations add InitialCreate
dotnet ef database update
```

Do not create a new initial migration if the project already has
migrations. Inspect the existing migrations first. If the `dotnet-ef`
command is unavailable, install or update the EF Core CLI tool version
compatible with the project's EF Core packages.

### Frontend configuration

Open a second terminal:

``` powershell
cd "E:\.NET Project\school\frontend"
npm install
```

Create or update `.env.local` using the actual backend URL and Google
OAuth client ID:

``` env
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_GOOGLE_CLIENT_ID=YOUR_GOOGLE_CLIENT_ID
```

Replace the example API URL with the actual backend URL printed when the
API starts. If Google login is not configured, do not expect that flow
to work.

Start the frontend:

``` powershell
npm run dev
```

Open `http://localhost:3000` unless Next.js reports a different port.

## 6. Build and Validation

Backend:

``` powershell
cd "E:\.NET Project\school\backend"
dotnet build
```

Frontend:

``` powershell
cd "E:\.NET Project\school\frontend"
npm run build
```

A successful frontend build does not prove that every API endpoint
works. Verify API routes, request DTOs, response DTOs, authentication,
authorization, and database behavior against the running backend.

## 7. API Integration Notes

The frontend API client and dashboard configuration may contain endpoint
paths based on the current implementation assumptions. Before treating
an endpoint as final:

1.  Check the corresponding backend controller route.
2.  Check the HTTP method and route parameters.
3.  Check the request DTO property names and types.
4.  Check the response DTO shape.
5.  Check the required role/policy.
6.  Test success, validation failure, unauthorized, forbidden, and
    not-found responses.

Do not assume that a frontend placeholder endpoint exists in the
backend.

## 8. Security Notes

-   Never commit database passwords, JWT signing keys, Google client
    secrets, payment credentials, or webhook secrets.
-   Keep secrets in environment variables, user-secrets, or a suitable
    secret manager.
-   Validate all input on the backend.
-   Enforce role and ownership checks on the backend.
-   A student must only be able to retrieve their own private
    application, payment, and result data.
-   Do not trust payment success or lottery outcomes supplied by the
    browser.
-   Use HTTPS in production.
-   Review token storage and refresh-token handling before production
    deployment.
-   Apply rate limiting to sensitive authentication and public
    submission endpoints where appropriate.

## 9. Payment and Admission Hold Workflow

The intended application workflow is:

1.  A student selects an eligible admission circular and class/shift.
2.  The backend validates eligibility and creates the
    application/Student ID and a temporary admission hold according to
    the implemented domain rules.
3.  The student completes payment before the hold expires.
4.  The backend verifies payment using trusted provider confirmation or
    a verified callback/webhook.
5.  A successful payment preserves the application and Student ID for
    the subsequent admission process.
6.  An expired unpaid hold is released and its related temporary records
    are cleaned up according to database constraints.

The exact payment provider, callback routes, expiry duration, and
transaction rules must be documented from the actual backend
implementation. Do not treat a frontend success screen as proof of
payment.

## 10. Lottery

The project has a requirements discrepancy concerning
first-come-first-served admission versus lottery-based selection. The
currently intended custom workflow includes a lottery after successful
payment. This is documented in `ASSUMPTIONS.md`.

Before production use, the project owner must approve the final
admission-selection policy. The lottery must be executed and persisted
on the backend, not generated in the browser.

## 11. Testing Checklist

-   [ ] Backend builds successfully.
-   [ ] Frontend production build succeeds.
-   [ ] Database connection works.
-   [ ] Migrations apply to a development database.
-   [ ] Student login and logout work.
-   [ ] Admission Office and Admin authorization work.
-   [ ] Student cannot access another student's private records.
-   [ ] Circular publication and eligibility rules work.
-   [ ] Application and hold creation work.
-   [ ] Payment verification is server-side.
-   [ ] Expired unpaid holds are handled correctly.
-   [ ] Lottery eligibility and duplicate-generation rules are enforced.
-   [ ] Error, loading, and empty states display correctly.

## 12. Documentation

-   `README.md` --- project overview, setup, commands, and operational
    notes.
-   `ASSUMPTIONS.md` --- unresolved decisions and requirements
    assumptions.
-   `AI_USAGE.md` --- transparent disclosure of AI-assisted development
    and human verification responsibilities.

Update these documents whenever the implementation or approved
requirements change.
