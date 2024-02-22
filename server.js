const express = require('express');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'front', 'views'));

mongoose.connect('mongodb://localhost:27017/portfolio', { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
    console.log('Connected to MongoDB');
});

const userSchema = new mongoose.Schema({
    name: String,
    username: String,
    phone: String,
    password: String,
    role: {
        type: String,
        enum: ['admin', 'user'],
        default: 'user'
    }
});

const User = mongoose.model('User', userSchema);

// Middleware to authenticate user
const authenticateUser = async (req, res, next) => {
    try {
        const user = await User.findOne({ username: req.body.username });
        if (!user) {
            return res.status(404).send('User not found');
        }
        const validPassword = await bcrypt.compare(req.body.password, user.password);
        if (!validPassword) {
            return res.status(400).send('Invalid password');
        }
        req.user = user; // Attach user object to request
        next(); // Proceed to next middleware/route handler
    } catch (error) {
        res.status(500).send('Error logging in');
    }
};

app.get('/', (req, res) => {
    res.render('index'); // Render the index.ejs file
});

app.get('/register', (req, res) => {
    res.render('loginreg');
});

app.post('/register', async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const user = new User({
            name: req.body.name,
            username: req.body.username,
            phone: req.body.phone,
            password: hashedPassword,
            role: req.body.role // Get the role from the registration form
        });
        await user.save();
        res.send('Registration successful');
    } catch (error) {
        res.status(500).send('Error registering user');
    }
});

app.post('/login', authenticateUser, (req, res) => {
    if (req.user.role === 'admin') {
        return res.redirect('/admin');
    } else {
        return res.redirect('/');
    }
});

// Apply authenticateUser middleware to the /admin route
app.get('/admin', authenticateUser, (req, res) => {
    if (req.user && req.user.role === 'admin') {
        res.render('admin'); // Render the admin page
    } else {
        res.status(403).send('Unauthorized'); // If not admin, send forbidden status
    }
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
