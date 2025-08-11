# Vinnora CRM Backend

Enterprise-level CRM backend built with Node.js, Express, TypeScript, Supabase, and WebSocket integration.

## 🚀 Features

- **Enterprise Architecture**: Scalable, secure, and maintainable codebase
- **Database**: Supabase (PostgreSQL) with Row Level Security (RLS)
- **Real-time**: WebSocket integration for live updates
- **Authentication**: JWT-based auth with bcrypt password hashing
- **Multi-tenant**: Organization-based data isolation
- **Security**: Helmet, CORS, rate limiting, input validation
- **Logging**: Comprehensive logging with Winston
- **Error Handling**: Centralized error handling with custom error classes
- **TypeScript**: Full type safety and IDE support

## 📋 Prerequisites

- Node.js 18+ and npm 9+
- Supabase account and project
- Git

## 🛠️ Quick Setup

1. **Clone and Install**
   ```bash
   cd backend
   npm install
   ```

2. **Environment Setup**
   ```bash
   cp .env.example .env
   # Edit .env with your Supabase credentials
   ```

3. **Run Setup Check**
   ```bash
   npm run setup
   ```

4. **Create Database Schema**
   - Open Supabase SQL Editor
   - Run the contents of `database/schema.sql`

5. **Start Development Server**
   ```bash
   npm run dev
   ```

## 📖 Detailed Setup

For detailed setup instructions, see [SUPABASE_SETUP.md](./SUPABASE_SETUP.md)

## 🏗️ Project Structure

```
backend/
├── src/
│   ├── config/
│   │   └── database.ts          # Supabase configuration
│   ├── middleware/
│   │   ├── errorHandler.ts      # Error handling middleware
│   │   └── socketAuth.ts        # WebSocket authentication
│   ├── routes/
│   │   ├── auth/
│   │   │   └── authRoutes.ts    # Authentication endpoints
│   │   ├── customers/
│   │   ├── leads/
│   │   └── users/
│   ├── utils/
│   │   └── logger.ts            # Winston logging configuration
│   ├── websocket/
│   │   └── socketHandler.ts     # WebSocket event handlers
│   └── server.ts                # Main server file
├── database/
│   └── schema.sql               # Complete database schema
├── .env.example                 # Environment variables template
├── setup.js                     # Setup verification script
└── SUPABASE_SETUP.md           # Detailed setup guide
```

## 🔧 Available Scripts

```bash
npm run dev         # Start development server with hot reload
npm run build       # Build TypeScript to JavaScript
npm run start       # Start production server
npm run setup       # Run setup verification
npm run check-env   # Check environment variables
npm run lint        # Check code quality
npm run lint:fix    # Fix linting issues
npm test           # Run tests
npm run test:watch  # Run tests in watch mode
```

## 🔐 Environment Variables

Create a `.env` file in the backend directory:

```env
# Supabase Configuration
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_KEY=your-service-role-key-here

# JWT Configuration
JWT_SECRET=your-super-secure-jwt-secret-here

# Server Configuration
PORT=3001
NODE_ENV=development
```

## 📊 Database Schema

The database includes the following main entities:

- **Organizations**: Multi-tenant organization data
- **Users**: User accounts with role-based access
- **Leads**: Sales leads and prospects
- **Customers**: Converted customers
- **Deals**: Sales opportunities and pipeline
- **Bills**: Invoicing and billing
- **Support Tickets**: Customer support system
- **Notes**: Contextual notes for all entities
- **Activities**: Audit trail and activity logging
- **Notifications**: In-app notifications

All tables include:
- UUID primary keys
- Timestamps (created_at, updated_at)
- Row Level Security (RLS) policies
- Proper indexes for performance

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user and organization
- `POST /api/auth/login` - User login
- `POST /api/auth/refresh` - Refresh JWT token
- `POST /api/auth/logout` - User logout

### Users
- `GET /api/users` - Get all users in organization
- `GET /api/users/:id` - Get specific user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

### Leads
- `GET /api/leads` - Get all leads
- `POST /api/leads` - Create new lead
- `GET /api/leads/:id` - Get specific lead
- `PUT /api/leads/:id` - Update lead
- `DELETE /api/leads/:id` - Delete lead

### Customers
- `GET /api/customers` - Get all customers
- `POST /api/customers` - Create new customer
- `GET /api/customers/:id` - Get specific customer
- `PUT /api/customers/:id` - Update customer
- `DELETE /api/customers/:id` - Delete customer

*Similar patterns for deals, bills, and support tickets*

## 🔄 WebSocket Events

### Connection
- `connection` - Client connects
- `authenticated` - User authenticated
- `disconnect` - Client disconnects

### Real-time Updates
- `lead:created` - New lead created
- `lead:updated` - Lead updated
- `lead:deleted` - Lead deleted
- `customer:created` - New customer created
- `customer:updated` - Customer updated
- `deal:created` - New deal created
- `deal:updated` - Deal updated
- `notification:new` - New notification

### User Activity
- `user:online` - User comes online
- `user:offline` - User goes offline
- `user:typing` - User is typing (in notes/comments)

## 🛡️ Security Features

- **Row Level Security (RLS)**: Database-level multi-tenancy
- **JWT Authentication**: Stateless authentication
- **Password Hashing**: bcrypt with salt rounds
- **Rate Limiting**: API endpoint protection
- **CORS**: Cross-origin request security
- **Helmet**: Security headers
- **Input Validation**: Joi schema validation
- **SQL Injection Protection**: Parameterized queries
- **XSS Protection**: Input sanitization

## 📝 Logging

The application uses Winston for comprehensive logging:

- **Application Logs**: General application events
- **Security Logs**: Authentication and authorization events
- **Performance Logs**: Slow queries and performance metrics
- **Error Logs**: Errors and exceptions with stack traces

Logs are written to:
- Console (development)
- Files (production)
- External services (configurable)

## 🔧 Error Handling

Centralized error handling with custom error classes:

- `APIError`: General API errors
- `ValidationError`: Input validation errors
- `AuthenticationError`: Authentication failures
- `AuthorizationError`: Permission errors
- `NotFoundError`: Resource not found errors

All errors are logged and return consistent JSON responses.

## 🧪 Testing

```bash
npm test           # Run all tests
npm run test:watch # Run tests in watch mode
```

Test structure:
- Unit tests for utilities and middleware
- Integration tests for API endpoints
- WebSocket connection tests

## 📈 Performance

- **Database Indexes**: Optimized queries with proper indexing
- **Connection Pooling**: Efficient database connections
- **Compression**: Gzip compression for responses
- **Caching**: Redis caching (configurable)
- **Rate Limiting**: Prevent abuse and improve stability

## 🚀 Deployment

### Production Build
```bash
npm run build
npm start
```

### Environment Variables for Production
```env
NODE_ENV=production
PORT=3001
SUPABASE_URL=your-production-supabase-url
SUPABASE_SERVICE_KEY=your-production-service-key
JWT_SECRET=your-production-jwt-secret
```

### Docker (Optional)
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY dist ./dist
EXPOSE 3001
CMD ["npm", "start"]
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Run linting and tests
6. Submit a pull request

## 📚 Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Socket.IO Documentation](https://socket.io/docs/v4/)
- [Express.js Documentation](https://expressjs.com/)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)

## 🐛 Troubleshooting

### Common Issues

1. **"Missing required environment variable"**
   - Check your `.env` file has all required variables
   - Run `npm run setup` to verify configuration

2. **"Cannot connect to Supabase"**
   - Verify your Supabase URL and keys
   - Check your internet connection
   - Ensure your Supabase project is active

3. **"JWT token invalid"**
   - Make sure JWT_SECRET is set consistently
   - Check token expiration settings

4. **"Database query failed"**
   - Ensure database schema is created
   - Check RLS policies are properly configured
   - Verify user permissions

For more help, see [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) or create an issue.

## 📄 License

MIT License - see LICENSE file for details.

---

Built with ❤️ by the Vinnora Team
