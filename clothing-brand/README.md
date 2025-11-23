# 6IX Clothing Brand

A modern e-commerce website for the 6IX clothing brand, featuring a responsive design and full-stack functionality.

## Features

- **Responsive Design**: Modern, mobile-friendly interface
- **User Authentication**: Secure login/register system with JWT
- **Product Management**: Full CRUD operations for products
- **Shopping Cart**: Local storage-based cart functionality
- **Admin Panel**: Product management for administrators
- **Order Management**: Order history and checkout process

## Project Structure

```
clothing-brand/
├── backend/           # Node.js/Express API
│   ├── models/       # MongoDB models
│   ├── routes/       # API routes
│   ├── config.env    # Environment variables
│   └── server.js     # Express server
├── css/              # Stylesheets
├── html/             # HTML pages
├── js/               # JavaScript files
└── images/           # Image assets
```

## Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- Modern web browser

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**
   - Edit `config.env` file
   - Update `MONGO_URI` to point to your MongoDB instance
   - Change `JWT_SECRET` to a secure random string

4. **Start the server:**
   ```bash
   npm run dev
   ```
   The API will be available at `http://localhost:5000`

### Frontend Setup

1. **Open the project in a web server:**
   - Use a local server like Live Server (VS Code extension)
   - Or use Python: `python -m http.server 8000`
   - Or use Node.js: `npx serve .`

2. **Access the website:**
   - Open `html/index.html` in your browser
   - Or navigate to the served URL

## API Endpoints

### Authentication
- `POST /api/users/register` - Register new user
- `POST /api/users/login` - User login
- `GET /api/users/profile` - Get user profile (protected)

### Products
- `GET /api/products` - Get all products
- `GET /api/products/featured` - Get featured products
- `GET /api/products/:id` - Get product by ID
- `POST /api/products` - Create product (admin only)
- `PUT /api/products/:id` - Update product (admin only)
- `DELETE /api/products/:id` - Delete product (admin only)

## Default Admin Account

For testing purposes, you can create an admin user through the registration system. The first registered user will automatically be assigned admin privileges.

## Technologies Used

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **bcryptjs** - Password hashing

### Frontend
- **HTML5** - Markup
- **CSS3** - Styling with custom properties
- **JavaScript (ES6+)** - Client-side logic
- **Local Storage** - Cart and session management

## Security Features

- Password hashing with bcrypt
- JWT-based authentication
- Protected admin routes
- Input validation
- CORS configuration

## Browser Compatibility

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## Development

### Adding New Features

1. **Backend**: Add new routes in `backend/routes/`
2. **Frontend**: Create new HTML pages in `html/`
3. **Styling**: Add CSS in `css/style.css`
4. **JavaScript**: Add functionality in `js/`

### Database Schema

#### User Model
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  isAdmin: Boolean,
  timestamps: true
}
```

#### Product Model
```javascript
{
  name: String,
  description: String,
  price: Number,
  currency: String,
  category: String,
  image: String,
  inStock: Boolean,
  featured: Boolean,
  timestamps: true
}
```

## Production Deployment

### Backend
1. Set `NODE_ENV=production` in `config.env` (already set).
2. Set a strong, unique `JWT_SECRET` in `config.env` (do NOT use the default value).
3. Set real `EMAIL_USER` and `EMAIL_PASS` for email verification (do NOT use test credentials).
4. Use a production MongoDB instance for `MONGO_URI`.
5. CORS is restricted to your frontend domain in production (see `server.js`).
6. Security headers are enabled via `helmet`.
7. Deploy to platforms like Heroku, Vercel, AWS, or your own server.

### Frontend
1. Update `API_BASE_URL` in JavaScript files to point to your deployed backend API (e.g., `https://api.yourdomain.com`).
2. Deploy static files (`html/`, `css/`, `js/`, `images/`) to a CDN or hosting service.
3. Configure your domain and SSL (HTTPS is required for production security).

### Final Checklist
- [ ] All environment variables are set and secure.
- [ ] CORS and security headers are enabled in production.
- [ ] All test/demo data and debug code are removed.
- [ ] All user data and orders are stored securely.
- [ ] You have tested the full user flow (register, login, cart, checkout, order history) on desktop and mobile.

## License

This project is for educational purposes. Please respect the original design and code structure.

## Support

For issues or questions:
1. Check the troubleshooting section
2. Review the API documentation
3. Ensure all dependencies are installed
4. Verify environment variables are set correctly 