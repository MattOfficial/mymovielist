# My Movie List

A full-stack application built with ReactJS, TypeScript, ExpressJS, NodeJS, and SQLite3 that allows users to manage their movie watchlist.

## Prerequisites

- Node.js v22 or higher
- npm or bun package manager
- TMDB API Key (instructions below)

## Setup TMDB API Key

1. Visit [TMDB website](https://www.themoviedb.org/) and create an account
2. Go to your account settings
3. Click on "API" in the left sidebar
4. Click "Create" under "Request an API Key"
5. Fill out the form selecting "Developer" option
6. Once approved, you'll receive your API key and access token

## Project Setup

1. Clone the repository

```bash
git clone https://github.com/MattOfficial/mymovielist.git
cd mymovielist
```

2. Install dependencies

```bash
npm install
# or
bun i
```

3. Create environment files

Root directory `.env`:

```env
VITE_API_URL=http://localhost:3000/api
```

Server directory `server/.env`:

```env
PORT=3000
TMDB_BASE_URL=https://api.themoviedb.org/3
TMDB_API_KEY=your_api_key_here
TMDB_ACCESS_TOKEN=your_access_token_here
```

4. Start the development server

```bash
npm run dev
# or
bun run dev
```

## Project Structure

```
my-movie-list/
├── src/                  # Frontend source files
├── server/               # Backend source files
├── public/               # Public assets
├── .env                  # Frontend environment variables
├── server/.env           # Backend environment variables
└── package.json          # Project dependencies and scripts
```

## Technology Stack

- **Frontend**

  - ReactJS
  - TypeScript
  - Vite

- **Backend**
  - ExpressJS
  - NodeJS
  - SQLite3

## Available Scripts

- `npm install:all` or `bun install:all`: Installs all packages in root and server
- `npm run dev` or `bun run dev`: Starts both frontend and backend in development mode
- `npm run dev:frontend`: Runs only the frontend
- `npm run dev:backend`: Runs only the backend
- `npm run build`: Builds the frontend for production
- `npm run preview`: Preview the production build locally

## Environment Variables

### Frontend (.env)

- `VITE_API_URL`: Backend API URL

### Backend (server/.env)

- `PORT`: Server port number
- `TMDB_BASE_URL`: TMDB API base URL
- `TMDB_API_KEY`: Your TMDB API key
- `TMDB_ACCESS_TOKEN`: Your TMDB access token

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details

## Acknowledgments

- [TMDB API](https://developers.themoviedb.org/3) for providing movie data
