// Authentication API integration
const API_BASE_URL = 'http://localhost:5000/api';

class AuthService {
    constructor() {
        this.token = localStorage.getItem('token');
        this.user = JSON.parse(localStorage.getItem('user'));
    }

    async login(identifier, password) {
        try {
            // identifier can be email or phone
            const isEmail = identifier.includes('@');
            const body = isEmail ? { email: identifier, password } : { phone: identifier, password };
            const response = await fetch(`${API_BASE_URL}/users/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(body),
            });
            const data = await response.json();
            if (response.ok) {
                this.token = data.token;
                this.user = {
                    id: data._id,
                    name: data.name,
                    email: data.email,
                    phone: data.phone,
                    isAdmin: data.isAdmin
                };
                localStorage.setItem('token', this.token);
                localStorage.setItem('user', JSON.stringify(this.user));
                // Hide login bubble if it exists
                const bubble = document.getElementById('login-bubble');
                if (bubble) bubble.remove();
                return { success: true, user: this.user };
            } else {
                return { success: false, message: data.message };
            }
        } catch (error) {
            return { success: false, message: 'Network error. Please try again.' };
        }
    }

    async register(name, email, password, phone) {
        try {
            const response = await fetch(`${API_BASE_URL}/users/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, email, password, phone }),
            });
            const data = await response.json();
            if (response.ok) {
                // If verification is required, don't set token/user yet
                if (data.verificationRequired) {
                    return { success: true, verificationRequired: true };
                }
                this.token = data.token;
                this.user = {
                    id: data._id,
                    name: data.name,
                    email: data.email,
                    phone: data.phone,
                    isAdmin: data.isAdmin
                };
                localStorage.setItem('token', this.token);
                localStorage.setItem('user', JSON.stringify(this.user));
                return { success: true, user: this.user };
            } else {
                return { success: false, message: data.message };
            }
        } catch (error) {
            return { success: false, message: 'Network error. Please try again.' };
        }
    }

    async getProfile() {
        if (!this.token) {
            return { success: false, message: 'No token available' };
        }

        try {
            const response = await fetch(`${API_BASE_URL}/users/profile`, {
                headers: {
                    'Authorization': `Bearer ${this.token}`,
                },
            });

            const data = await response.json();

            if (response.ok) {
                this.user = data;
                localStorage.setItem('user', JSON.stringify(this.user));
                return { success: true, user: this.user };
            } else {
                return { success: false, message: data.message };
            }
        } catch (error) {
            return { success: false, message: 'Network error. Please try again.' };
        }
    }

    async updateProfile({ name, email, phone, password }) {
        if (!this.token) {
            return { success: false, message: 'Not authenticated' };
        }
        try {
            const response = await fetch(`${API_BASE_URL}/users/profile`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.token}`,
                },
                body: JSON.stringify({ name, email, phone, password }),
            });
            const data = await response.json();
            if (response.ok) {
                this.user = data;
                localStorage.setItem('user', JSON.stringify(this.user));
                return { success: true, user: this.user };
            } else {
                return { success: false, message: data.message };
            }
        } catch (error) {
            return { success: false, message: 'Network error. Please try again.' };
        }
    }

    logout() {
        this.token = null;
        this.user = null;
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        // Trigger storage event to update login bubble
        window.dispatchEvent(new Event('storage'));
    }

    isAuthenticated() {
        return !!this.token;
    }

    isAdmin() {
        return this.user && this.user.isAdmin;
    }

    getToken() {
        return this.token;
    }

    getUser() {
        return this.user;
    }
}

// Global auth service instance
window.authService = new AuthService(); 