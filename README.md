# Solana Indexing Platform

Index Solana blockchain data directly into your Postgres database with no RPC, Geyser, or Validator infrastructure needed.


## Features

- **Easy Database Integration** - Connect your Postgres database and start indexing blockchain data in seconds with zero configuration.
- **Real-time Data** - Get live blockchain data through Helius webhooks with automatic syncing and millisecond latency on the Solana.
- **Secure & Reliable** - Your data is protected with enterprise-grade security and reliability with 99.9% uptime guarantee.
- **High Performance** - Process thousands of transactions per second with our optimized indexing engine built for scale.
- **Cloud Managed** - No infrastructure to maintain. We handle scaling, updates, and monitoring so you can focus on building.
- **Infinite Scalability** - Automatically scale with your application's growth - handle millions of transactions without performance degradation or added complexity.

## Tech Stack

- **Helius** - Blockchain Data
- **Redis** - Cache & Queue
- **BullMQ** - Job Processing
- **Supabase** - Auth & Storage
- **Next.js** - Frontend Framework

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Postgres Database
- Supabase Account

### Installation

1. Clone the repository
```bash
git clone https://github.com/bevatsal1122/solana-indexer-helius.git
cd solana-indexer-helius
```

2. Install dependencies
```bash
npm install
```

3. Create a `.env` file in the root directory with the following variables:
```
# Supabase Credentials
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_KEY=your_supabase_service_key
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
DATABASE_PASSWORD=your_database_password

# Miscellaneous
APP_URL=http://localhost:3000
SERVER_URL=your_backend_server_url
```

4. Run the development server
```bash
npm run dev
# or
yarn dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Backend Repository

This is the frontend part of the Solana Indexer Platform. You'll also need to run the backend service:

[Solana Indexer Backend Repository](https://github.com/bevatsal1122/solana-indexer-backend)

Follow the instructions in the backend repository README to set up and run the backend service.

## Environment Variables

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL |
| `SUPABASE_SERVICE_KEY` | Service key for Supabase admin operations |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Anonymous key for client-side Supabase operations |
| `DATABASE_PASSWORD` | Password for your database |
| `APP_URL` | URL for the frontend application |
| `SERVER_URL` | URL for the backend server |

## Development

- The frontend is built with Next.js and uses the App Router
- Authentication is handled via Supabase
- The UI is built with a custom design system

## Production Deployment

1. Build the application:
```bash
npm run build
```

2. Start the production server:
```bash
npm start
```

## License

MIT

## Contact

For questions or support, please contact us on [Twitter](https://x.com/bevatsal1122).
