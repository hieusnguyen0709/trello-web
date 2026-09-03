# Trello Clone Web

Frontend web application for a Trello-style task management system, built with React and Vite. Provides board and card management, drag-and-drop interactions, authentication flows, board invitations, notifications, and real-time updates through Socket.io.

**Live Demo:** [https://trello-clone.website](https://trello-clone.website)

**Backend Repo:** [trello-api](https://github.com/hieusnguyen0709/trello-api)

---

## Table of Contents

- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Available Scripts](#available-scripts)
- [Testing](#testing)
- [Authentication & Authorization](#authentication--authorization)
- [Real-Time Updates](#real-time-updates)
- [CI/CD & Deployment](#cicd--deployment)
- [Project Structure](#project-structure)

---

## Tech Stack

| Category | Technology |
|---|---|
| Framework | React 18 |
| Build Tool | Vite |
| UI Library | Material UI (MUI) |
| State Management | Redux Toolkit, React Redux |
| State Persistence | Redux Persist |
| Routing | React Router DOM |
| HTTP Client | Axios |
| Form Handling | React Hook Form |
| Drag & Drop | dnd-kit |
| Real-time | Socket.io Client |
| Notifications | React Toastify |
| Markdown | MDEditor, rehype-sanitize |
| Utilities | Lodash, Moment.js, Random Color |
| Testing | Vitest |
| Code Quality | ESLint |
| CI | GitHub Actions |
| Deployment | Vercel |

## Architecture

The application follows a component-based React architecture with Redux Toolkit for shared application state and a dedicated API layer for communication with the backend.

```text
Pages / Components
        ↓
     Redux
        ↓
   API Layer
        ↓
   Axios Instance
        ↓
   Trello Clone API
```

- **Pages**: represent application-level views such as authentication, board listing, board details, and account settings.
- **Components**: reusable UI components for forms, modals, navigation, loading states, and board/card interactions.
- **Redux**: manages shared state for the current user, active board, active card, and notifications.
- **API Layer**: centralizes REST API calls for boards, columns, cards, users, invitations, and labels.
- **Axios Instance**: provides common request/response handling, credentials, loading indicators, error handling, and automatic access-token refresh.
- **Socket.io Client**: maintains a real-time connection with the backend for board invitation events and other real-time interactions.

The board page keeps the active board in Redux and uses local component state for drag-and-drop operations. Board and card ordering is updated optimistically in the UI before the corresponding API request completes.

## Getting Started

### Prerequisites

- Node.js >= 18.x
- Yarn 1.x
- A running instance of the [Trello Clone API](https://github.com/hieusnguyen0709/trello-api)

### Installation

```bash
git clone https://github.com/hieusnguyen0709/trello-web.git
cd trello-web
yarn install
```

Create an environment file:

```bash
touch .env
```

Configure the backend API URL as described in [Environment Variables](#environment-variables).

### Run in development

```bash
yarn dev
```

### Build and preview production bundle

```bash
yarn build
yarn preview
```

The production bundle is generated in Vite's `dist` directory.

## Environment Variables

| Variable | Description |
|---|---|
| `VITE_API_ROOT` | Base URL of the deployed Trello Clone API |

In development, the application uses:

```text
http://localhost:8017
```

In production, `VITE_API_ROOT` is used as the API base URL.

Example:

```env
VITE_API_ROOT=https://your-api-domain.example
```

## Available Scripts

| Script | Description |
|---|---|
| `yarn dev` | Run the Vite development server |
| `yarn lint` | Run ESLint with zero tolerance for warnings |
| `yarn test` | Run the Vitest test suite |
| `yarn build` | Build the production frontend bundle |
| `yarn preview` | Preview the production build locally |

## Testing

The project uses Vitest for frontend unit testing.

Current tests are organized under:

```text
tests/
└── utils/
    └── sorts.test.js
```

The test suite currently focuses on utility-level logic, including board/card ordering helpers.

Run the tests with:

```bash
yarn test
```

The CI pipeline also runs the test suite before building the application.

## Authentication & Authorization

Authentication is handled by the backend API using JWT tokens stored in HTTP-only cookies. The frontend communicates with the API using an Axios instance configured with credentials.

The authentication flow is divided into several responsibilities:

- **Login** — sends user credentials to the backend and stores the returned user information in Redux.
- **Registration** — creates a new account and redirects the user to the verification flow.
- **Account verification** — allows users to verify their account before logging in.
- **Logout** — calls the backend logout endpoint and clears the current user from Redux.
- **Protected routes** — authenticated application pages are wrapped by a `ProtectedRoute`. Users without an authenticated Redux user are redirected to `/login`.
- **Automatic token refresh** — when the backend returns the configured token-expiration response, the Axios response interceptor refreshes the access token and retries the original request. Concurrent failed requests share the same refresh promise to avoid multiple refresh-token calls.
- **Unauthorized handling** — a `401` response triggers the frontend logout flow.

The authenticated user is persisted with Redux Persist so the user state survives a browser refresh.

## Real-Time Updates

The application uses Socket.io Client to establish a real-time connection with the backend API.

The Socket.io client is initialized from the same API root used by Axios:

```js
export const socketIoInstance = io(API_ROOT)
```

One implemented real-time workflow is board invitations:

1. A user invites another user to a board through the REST API.
2. The invitation is emitted through Socket.io.
3. The invited user's client receives the event.
4. The notification state can be updated immediately without requiring a full page refresh.

This complements the REST API by separating persistent data operations from real-time UI updates.

## CI/CD & Deployment

GitHub Actions runs the frontend quality and build pipeline on pushes and pull requests targeting `master`.

The CI workflow performs:

1. **Checkout** the repository.
2. **Setup Node.js 18.x** with Yarn dependency caching.
3. **Install dependencies** using the frozen lockfile.
4. **Lint** the source code with ESLint and zero warnings allowed.
5. **Run tests** with Vitest.
6. **Build** the production frontend bundle with Vite.

The workflow is defined in:

```text
.github/workflows/ci.yml
```

The application is configured for Vercel deployment. `vercel.json` rewrites all routes to `index.html`, allowing React Router client-side routes such as `/boards/:boardId` and `/settings/account` to work correctly after direct navigation or page refresh.

## Project Structure

```text
src/
├── apis/                 # REST API functions for backend communication
├── assets/               # Static assets and application icons
├── components/           # Reusable UI components
│   ├── AppBar/           # Application navigation bar
│   ├── Form/             # Form-related components
│   ├── Loading/          # Loading indicators and spinners
│   ├── Modal/            # Reusable modal components
│   └── ModeSelect/       # UI mode/theme selection
├── customHooks/          # Reusable React hooks
├── customLibraries/      # Custom integrations and helpers
├── pages/                # Route-level application views
│   ├── 404/              # Not-found page
│   ├── Auth/             # Login, registration, verification
│   ├── Boards/           # Board list and board workspace
│   └── Settings/         # Account and security settings
├── redux/                # Global application state
│   ├── activeBoard/      # Active board state and board fetching
│   ├── activeCard/       # Active card and card modal state
│   ├── notifications/    # Board invitation notifications
│   ├── user/             # Current authenticated user
│   └── store.js          # Redux store and persistence configuration
├── utils/                # Axios, constants, formatters, validators, sorting
├── App.jsx               # Application routes and protected route handling
├── main.jsx              # Application entry point
├── socketClient.js       # Socket.io client configuration
└── theme.js              # Material UI theme configuration
```

### Board Workspace

The board workspace is organized around the following hierarchy:

```text
Board
├── BoardBar
│   ├── Board information
│   ├── Board members
│   └── Board invitations
└── BoardContent
    ├── Column
    │   └── Cards
    │       └── Card details
    └── Drag & Drop
```

The board content uses `dnd-kit` to support:

- Reordering columns within a board.
- Reordering cards within the same column.
- Moving cards between different columns.
- Drag overlays for columns and cards.
- Custom mouse and touch sensors.
- Custom collision detection for nested board/column/card interactions.
- Placeholder cards for empty columns.

Board and card changes are reflected optimistically in the UI and then synchronized with the backend API.