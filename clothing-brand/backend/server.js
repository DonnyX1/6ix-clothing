require('dotenv').config({ path: './config.env' });
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const helmet = require('helmet');

const app = express();

// Middleware
app.use(helmet());

// CORS: allow only frontend domain in production
if (process.env.NODE_ENV === 'production') {
    app.use(cors({ origin: 'https://your-frontend-domain.com' }));
} else {
    app.use(cors());
}
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/clothing_brand', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

// Test route
app.get('/', (req, res) => {
    res.send('API is running');
});

const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');

app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);

// Global error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Internal server error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));