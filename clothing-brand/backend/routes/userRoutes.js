const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const nodemailer = require('nodemailer');
const crypto = require('crypto');

// Generate JWT
function generateToken(user) {
    return jwt.sign(
        { id: user._id, email: user.email, isAdmin: user.isAdmin },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
    );
}

// Helper: send verification email
async function sendVerificationEmail(user, req) {
    if (!user.email) return;
    // Use backend URL for verification link (backend serves the verification page)
    const baseUrl = process.env.BACKEND_URL || `http://localhost:${process.env.PORT || 5000}`;
    const verifyUrl = `${baseUrl}/api/users/verify?token=${user.verificationToken}`;
    
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        console.error('Email credentials not configured. Cannot send verification email.');
        return;
    }
    
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });
    
    try {
        await transporter.sendMail({
            from: `6IX Clothing <${process.env.EMAIL_USER}>`,
            to: user.email,
            subject: 'Verify your email - 6IX Clothing',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #333;">Welcome to 6IX Clothing!</h2>
                    <p>Thank you for registering. Please verify your email address by clicking the link below:</p>
                    <p style="margin: 30px 0;">
                        <a href="${verifyUrl}" style="background-color: #e10600; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">Verify Email Address</a>
                    </p>
                    <p>Or copy and paste this link into your browser:</p>
                    <p style="color: #666; word-break: break-all;">${verifyUrl}</p>
                    <p style="color: #999; font-size: 12px; margin-top: 30px;">This link will expire in 24 hours.</p>
                </div>
            `
        });
    } catch (error) {
        console.error('Error sending verification email:', error);
        throw error;
    }
}

// Register
router.post('/register', async (req, res) => {
    const { name, email, password, phone } = req.body;
    try {
        if (!email && !phone) return res.status(400).json({ message: 'Email or phone required' });
        const userExists = await User.findOne({ $or: [ { email }, { phone } ] });
        if (userExists) return res.status(400).json({ message: 'User already exists' });
        const verificationToken = crypto.randomBytes(32).toString('hex');
        const verificationExpires = Date.now() + 1000 * 60 * 60 * 24; // 24h
        const user = await User.create({ name, email, phone, password, verificationToken, verificationExpires });
        if (email) await sendVerificationEmail(user, req);
        // TODO: send SMS if phone
        if (phone) {
            // Placeholder: Integrate SMS provider here (e.g., Twilio)
            console.log(`Send SMS verification to ${phone} with token: ${verificationToken}`);
        }
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            isAdmin: user.isAdmin,
            verificationRequired: true,
            message: 'Verification email sent. Please check your inbox.'
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Email verification endpoint
router.get('/verify', async (req, res) => {
    const { token } = req.query;
    if (!token) {
        return res.status(400).send(`
            <!DOCTYPE html>
            <html>
            <head><title>Verification Failed</title></head>
            <body style="font-family: Arial, sans-serif; text-align: center; padding: 50px;">
                <h2 style="color: #e10600;">Invalid Verification Link</h2>
                <p>The verification link is missing or invalid.</p>
                <a href="/" style="color: #e10600;">Return to Home</a>
            </body>
            </html>
        `);
    }
    
    try {
        const user = await User.findOne({ verificationToken: token, verificationExpires: { $gt: Date.now() } });
        if (!user) {
            return res.status(400).send(`
                <!DOCTYPE html>
                <html>
                <head><title>Verification Failed</title></head>
                <body style="font-family: Arial, sans-serif; text-align: center; padding: 50px;">
                    <h2 style="color: #e10600;">Verification Link Expired or Invalid</h2>
                    <p>The verification link has expired or is invalid. Please register again or contact support.</p>
                    <a href="/" style="color: #e10600;">Return to Home</a>
                </body>
                </html>
            `);
        }
        
        user.isVerified = true;
        user.verificationToken = undefined;
        user.verificationExpires = undefined;
        await user.save();
        
        res.send(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>Email Verified - 6IX Clothing</title>
                <style>
                    body { font-family: Arial, sans-serif; text-align: center; padding: 50px; background: #f5f5f5; }
                    .success-card { background: white; padding: 40px; border-radius: 10px; max-width: 500px; margin: 0 auto; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
                    .checkmark { color: #28a745; font-size: 60px; margin-bottom: 20px; }
                    h2 { color: #333; margin-bottom: 15px; }
                    p { color: #666; line-height: 1.6; }
                    .btn { display: inline-block; margin-top: 20px; padding: 12px 24px; background: #e10600; color: white; text-decoration: none; border-radius: 5px; }
                    .btn:hover { background: #c10500; }
                </style>
            </head>
            <body>
                <div class="success-card">
                    <div class="checkmark">✓</div>
                    <h2>Email Verified Successfully!</h2>
                    <p>Your email address has been verified. You can now log in to your account.</p>
                    <a href="/" class="btn">Go to Login</a>
                </div>
            </body>
            </html>
        `);
    } catch (error) {
        console.error('Verification error:', error);
        res.status(500).send(`
            <!DOCTYPE html>
            <html>
            <head><title>Verification Error</title></head>
            <body style="font-family: Arial, sans-serif; text-align: center; padding: 50px;">
                <h2 style="color: #e10600;">Verification Error</h2>
                <p>An error occurred during verification. Please try again later.</p>
                <a href="/" style="color: #e10600;">Return to Home</a>
            </body>
            </html>
        `);
    }
});

// Login
router.post('/login', async (req, res) => {
    const { email, phone, password } = req.body;
    try {
        if ((!email && !phone) || !password) {
            return res.status(400).json({ message: 'Email or phone and password required' });
        }
        const user = await User.findOne(email ? { email } : { phone });
        if (!user) return res.status(401).json({ message: 'Invalid email/phone or password' });
        if (!user.isVerified) return res.status(401).json({ message: 'Please verify your email before logging in.' });
        if (user && (await user.matchPassword(password))) {
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                isAdmin: user.isAdmin,
                token: generateToken(user)
            });
        } else {
            res.status(401).json({ message: 'Invalid email/phone or password' });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Auth middleware
function protect(req, res, next) {
    let token = req.headers.authorization;
    if (token && token.startsWith('Bearer ')) {
        token = token.split(' ')[1];
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = decoded;
            next();
        } catch (err) {
            return res.status(401).json({ message: 'Not authorized, token failed' });
        }
    } else {
        return res.status(401).json({ message: 'Not authorized, no token' });
    }
}

// Profile (protected)
router.get('/profile', protect, async (req, res) => {
    const user = await User.findById(req.user.id).select('-password');
    if (user) {
        res.json(user);
    } else {
        res.status(404).json({ message: 'User not found' });
    }
});

// Update profile (protected)
router.put('/profile', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: 'User not found' });
        if (req.body.name) user.name = req.body.name;
        if (req.body.email) user.email = req.body.email;
        if (req.body.phone) user.phone = req.body.phone;
        if (req.body.password) user.password = req.body.password; // will be hashed by pre-save hook
        await user.save();
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            isAdmin: user.isAdmin
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// ORDER: Receive checkout/order, send email to tirosmashego@gmail.com
router.post('/order', async (req, res) => {
    // Extract info: name, email, phone, address, payment, cart[]
    const { name, email, phone, address, city, state, zip, payment, cart } = req.body;
    try {
        // Validate required fields
        if (!name || !email || !phone || !address || !cart || cart.length === 0) {
            return res.status(400).json({ success: false, message: 'Missing required order information' });
        }
        
        // Compose email body
        const orderDate = new Date().toLocaleString();
        let orderTotal = 0;
        const itemsList = cart.map(item => {
            const itemName = item.name || `Product #${item.id}`;
            const qty = item.qty || 1;
            const size = item.size ? `, Size: ${item.size}` : '';
            const colour = item.colour ? `, Colour: ${item.colour}` : '';
            // Estimate price for email (in production, fetch from database)
            const estimatedPrice = 50; // placeholder
            orderTotal += estimatedPrice * qty;
            return `<li style="padding: 8px 0; border-bottom: 1px solid #eee;">${qty} x ${itemName}${size}${colour}</li>`;
        }).join('');
        
        const orderDetails = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                <h2 style="color: #e10600;">New Order Received - 6IX Clothing</h2>
                <div style="background: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
                    <h3 style="margin-top: 0;">Customer Information</h3>
                    <p><b>Name:</b> ${name}</p>
                    <p><b>Email:</b> ${email}</p>
                    <p><b>Phone:</b> ${phone}</p>
                    <p><b>Address:</b> ${address}, ${city}, ${state} ${zip}</p>
                    <p><b>Payment Method:</b> ${payment.toUpperCase()}</p>
                </div>
                <div style="background: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
                    <h3 style="margin-top: 0;">Order Items</h3>
                    <ul style="list-style: none; padding: 0; margin: 0;">
                        ${itemsList}
                    </ul>
                </div>
                <p style="color: #666; font-size: 12px; margin-top: 20px;"><b>Order Date:</b> ${orderDate}</p>
            </div>
        `;
        if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
            console.error('Email credentials not configured. Cannot send order email.');
            return res.status(500).json({ success: false, message: 'Email service not configured' });
        }
        
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
        });
        
        try {
            await transporter.sendMail({
                from: `6IX Clothing <${process.env.EMAIL_USER}>`,
                to: 'tirosmashego@gmail.com',
                subject: `New Order from ${name} - 6IX Clothing`,
                html: orderDetails
            });
            res.json({ success: true, message: 'Order received and email sent successfully' });
        } catch (emailError) {
            console.error('Error sending order email:', emailError);
            res.status(500).json({ success: false, message: 'Order received but failed to send email: ' + emailError.message });
        }
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

module.exports = router; 