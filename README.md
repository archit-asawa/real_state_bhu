# BhuExpert Real Estate API

A comprehensive RESTful API for real estate property search with Google Maps integration, built with Node.js, TypeScript, Express, and MongoDB.

## Features

- 🏠 **Property Search**: Advanced filtering by location, price, type, bedrooms
- 📍 **Location-based Search**: Find properties within a specific radius
- 🗺️ **Google Maps Integration**: Nearby amenities discovery
- 📄 **Pagination**: Efficient pagination for large datasets
- 🔍 **Sorting**: Sort by price or listing date
- ⚡ **Caching**: Redis caching for improved performance
- 🛡️ **Security**: Rate limiting, CORS, Helmet protection
- ✅ **Validation**: Comprehensive input validation with Joi
- 📊 **TypeScript**: Full type safety throughout the application

## Tech Stack

- **Runtime**: Node.js
- **Language**: TypeScript
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Caching**: Redis
- **Validation**: Joi
- **Maps**: Google Maps API
- **Testing**: Jest
- **Linting**: ESLint

## API Endpoints

### Properties

| Method | Endpoint | Description | Query Parameters |
|--------|----------|-------------|------------------|
| GET | `/api/properties/search` | Search properties with filters | city, minPrice, maxPrice, propertyType, minBedrooms, sortBy, sortOrder, page, limit |
| GET | `/api/properties/search-radius` | Search within radius | lat, lng, radius, propertyType, minPrice, maxPrice, minBedrooms, page, limit |
| GET | `/api/properties/:id` | Get property by ID | - |
| GET | `/api/properties/:id/nearby-amenities` | Get nearby amenities | types, radius, limit |
| POST | `/api/properties` | Create new property | - |
| PUT | `/api/properties/:id` | Update property | - |
| DELETE | `/api/properties/:id` | Delete property | - |

### Example Requests

#### Search Properties
```bash
GET /api/properties/search?city=Mumbai&minPrice=5000000&maxPrice=20000000&propertyType=apartment&minBedrooms=2&sortBy=price&sortOrder=asc&page=1&limit=10
```

#### Search Within Radius
```bash
GET /api/properties/search-radius?lat=19.0760&lng=72.8777&radius=5000&propertyType=apartment&page=1&limit=10
```

#### Get Nearby Amenities
```bash
GET /api/properties/60f7b3b3b3b3b3b3b3b3b3b3/nearby-amenities?types=hospital,school,restaurant&radius=2000&limit=5
```

## Installation & Setup

### Prerequisites

- Node.js (v18 or higher)
- MongoDB (local or cloud)
- Redis (optional, for caching)
- Google Maps API Key

### 1. Clone and Install

```bash
git clone <repository-url>
cd bhu-expert-backend
npm install
```

### 2. Environment Configuration

Copy the example environment file and configure your variables:

```bash
cp .env.example .env
```

Update `.env` with your configuration:

```env
NODE_ENV=development
PORT=3000

# Database
MONGODB_URI=mongodb://localhost:27017/bhu-expert

# Redis (optional)
REDIS_HOST=localhost
REDIS_PORT=6379

# Google Maps API
GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
```

### 3. Database Setup

Start MongoDB and seed the database with sample data:

```bash
# Seed database with sample properties
npm run seed
```

### 4. Start the Application

```bash
# Development mode with hot reload
npm run dev

# Production build and start
npm run build
npm start
```

The API will be available at `http://localhost:3000`

## Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Build TypeScript to JavaScript |
| `npm start` | Start production server |
| `npm run seed` | Seed database with sample data |
| `npm test` | Run tests |
| `npm run test:watch` | Run tests in watch mode |
| `npm run lint` | Run ESLint |
| `npm run lint:fix` | Fix ESLint issues |

## Project Structure

```
src/
├── config/           # Configuration files
│   ├── database.ts   # MongoDB connection
│   ├── redis.ts      # Redis connection
│   └── environment.ts # Environment variables
├── controllers/      # Request handlers
│   └── PropertyController.ts
├── middleware/       # Express middleware
│   ├── errorHandler.ts
│   ├── notFoundHandler.ts
│   └── validation.ts
├── models/          # Mongoose models
│   └── Property.ts
├── routes/          # API routes
│   └── propertyRoutes.ts
├── services/        # Business logic
│   ├── PropertyService.ts
│   ├── GoogleMapsService.ts
│   └── AmenityCache.ts
├── types/           # TypeScript interfaces
│   └── index.ts
├── utils/           # Utility functions
│   └── validationSchemas.ts
├── scripts/         # Database scripts
│   └── seedDatabase.ts
└── server.ts        # Application entry point
```

## Environment Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `NODE_ENV` | Environment mode | No | development |
| `PORT` | Server port | No | 3000 |
| `MONGODB_URI` | MongoDB connection string | Yes | - |
| `REDIS_HOST` | Redis host | No | localhost |
| `REDIS_PORT` | Redis port | No | 6379 |
| `GOOGLE_MAPS_API_KEY` | Google Maps API key | Yes | - |
| `CACHE_TTL` | Cache TTL in seconds | No | 3600 |
| `RATE_LIMIT_WINDOW_MS` | Rate limit window | No | 900000 |
| `RATE_LIMIT_MAX_REQUESTS` | Max requests per window | No | 100 |

## Google Maps API Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable the following APIs:
   - Places API
   - Distance Matrix API
   - Geocoding API
4. Create credentials (API Key)
5. Set up API key restrictions for security
6. Add the API key to your `.env` file

## Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm test -- --coverage
```

## Performance Optimizations

- **Database Indexing**: Optimized indexes for common query patterns
- **Redis Caching**: Caches frequently accessed amenity data
- **Pagination**: Efficient pagination with proper limits
- **Query Optimization**: Lean queries and projection optimization
- **Rate Limiting**: Prevents API abuse

## Security Features

- **Helmet**: Security headers
- **CORS**: Cross-origin resource sharing
- **Rate Limiting**: Request rate limiting
- **Input Validation**: Comprehensive validation with Joi
- **Error Handling**: Secure error messages

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new features
5. Ensure all tests pass
6. Submit a pull request

## License

This project is licensed under the MIT License.
