require('dotenv').config({ path: './config.env' });
const mongoose = require('mongoose');
const Product = require('./models/Product');

// Sample products data
const sampleProducts = [
    {
        name: "6IX Classic Tee",
        description: "A classic tee for everyday comfort. Made from 100% cotton with a modern fit.",
        price: 129.99,
        currency: "R",
        category: "T-Shirts",
        image: "../images/placeholder.svg",
        inStock: true,
        featured: true
    },
    {
        name: "6IX Hoodie",
        description: "Stay warm and stylish with our signature hoodie. Perfect for casual outings.",
        price: 249.99,
        currency: "R",
        category: "Hoodies",
        image: "../images/placeholder.svg",
        inStock: true,
        featured: true
    },
    {
        name: "6IX Cap",
        description: "Top off your look with a 6IX cap. Adjustable fit with embroidered logo.",
        price: 89.99,
        currency: "R",
        category: "Accessories",
        image: "../images/placeholder.svg",
        inStock: true,
        featured: true
    },
    {
        name: "6IX Denim Jacket",
        description: "Classic denim jacket with modern styling. Perfect for layering in any season.",
        price: 399.99,
        currency: "R",
        category: "Jackets",
        image: "../images/placeholder.svg",
        inStock: true,
        featured: true
    },
    {
        name: "6IX Cargo Pants",
        description: "Comfortable cargo pants with multiple pockets. Perfect for outdoor activities.",
        price: 179.99,
        currency: "R",
        category: "Pants",
        image: "../images/placeholder.svg",
        inStock: true,
        featured: false
    },
    {
        name: "6IX Sneakers",
        description: "Stylish sneakers for everyday wear. Comfortable and durable design.",
        price: 299.99,
        currency: "R",
        category: "Footwear",
        image: "../images/placeholder.svg",
        inStock: true,
        featured: false
    }
];

async function seedDatabase() {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/clothing_brand', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('Connected to MongoDB');

        // Clear existing products
        await Product.deleteMany({});
        console.log('Cleared existing products');

        // Insert sample products
        const products = await Product.insertMany(sampleProducts);
        console.log(`Inserted ${products.length} products`);

        console.log('Database seeded successfully!');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
}

seedDatabase(); 