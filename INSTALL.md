# TrustDate Installation and Execution Guide

## System Requirements

- Node.js 16.x or higher
- npm 7.x or higher or yarn 1.22.x or higher

## Installation Method

1. Clone the repository

```bash
git clone https://github.com/your-username/trustdate.git
cd trustdate
```

2. Install dependencies

```bash
# Using npm
npm install

# Or using yarn
yarn install
```

3. Set environment variables (if needed)

```bash
# Create a .env.local file to set necessary environment variables
cp .env.example .env.local
```

4. Run the development server

```bash
# Using npm
npm run dev

# Or using yarn
yarn dev
```

Now you can access the TrustDate application in your browser at `http://localhost:3000`.

## Build and Production Execution

1. Build the application

```bash
# Using npm
npm run build

# Or using yarn
yarn build
```

2. Run the production server

```bash
# Using npm
npm run start

# Or using yarn
yarn start
```

## Special Notes

### Humanity Protocol API Integration

The current implementation replaces the Humanity Protocol API with a mock implementation to suit the hackathon environment. To integrate with the actual Humanity Protocol API, follow these steps:

1. Obtain an API key from Humanity Protocol
2. Set the API key and endpoint in the `.env.local` file
3. Update the `src/services/humanityApi.ts` file:
   - Change the API base URL to the actual Humanity Protocol API endpoint
   - Add authentication information to API request headers

```typescript
// Example modification to src/services/humanityApi.ts file
const API_BASE_URL = process.env.HUMANITY_API_URL || 'https://api.humanity.example';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${process.env.HUMANITY_API_KEY}`
  },
});
```

### Database Integration

The current implementation uses in-memory data structures. To integrate with an actual database:

1. Set up your preferred database service (MongoDB, PostgreSQL, etc.)
2. Install the appropriate ORM or driver for that database
3. Implement data models for users, profiles, matches, messages, etc.
4. Implement API routes and database integration logic

## Troubleshooting

**Problem: "Module not found" error during execution**

This problem can occur when dependencies are not properly installed. Try the following command:

```bash
npm install
```

**Problem: API connection error**

If a Humanity Protocol API connection error occurs:

1. Verify that the API key and endpoint URL are correct
2. Verify that the API service is running
3. Check network connectivity

**Problem: Styles not applied properly**

If Tailwind CSS is not working properly:

```bash
npm run build:css
npm run dev
```

## Sponsorship and Contributions

TrustDate is an open source project. If you wish to contribute, check the issues in the GitHub repository or send a pull request.

## License

MIT License 