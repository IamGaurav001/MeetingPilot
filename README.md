# MeetingPilot AI

A desktop AI meeting copilot that continuously listens to meetings, understands conversations, stores long-term memory, performs RAG, generates live AI suggestions, extracts action items, detects decisions, and generates meeting summaries.

## Tech Stack

- **Desktop**: Electron + React + Vite
- **Backend**: Node.js + Express.js (Modular Monolith)
- **Database**: PostgreSQL + Prisma ORM
- **Vector DB**: Qdrant
- **AI**: Gemini API + LangChain JS + LangGraph JS
- **Messaging**: Apache Kafka
- **Auth**: JWT

## Getting Started

### Prerequisites

- Node.js >= 20
- Docker & Docker Compose

### Setup

```bash
# Clone and install
git clone <repo-url>
cd MeetingPilot
npm install

# Copy environment variables
cp .env.example .env

# Start local services (PostgreSQL, Qdrant, Kafka)
docker compose up -d

# Run database migrations
npm run db:migrate

# Start backend
npm run dev:backend

# Start desktop app (in a new terminal)
npm run dev:desktop
```

## Project Structure

```
MeetingPilot/
├── backend/       # Express.js modular monolith
├── desktop/       # Electron + React + Vite
├── shared/        # Shared constants and types
└── docs/          # Architecture docs (local only)
```

## Architecture

The backend follows a **Modular Monolith** architecture. Each module is isolated with its own controller, service, routes, and validator. Business logic never leaks across module boundaries.

See `docs/ARCHITECTURE.md` for the full system design.

## License

Private
