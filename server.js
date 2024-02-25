const express = require('express');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');

const app = express();

app.use(express.static(path.join(__dirname, 'front')));

app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'front', 'views'));

app.use(express.json());

const portfolioItemSchema = new mongoose.Schema({
    information: String,
    description: String,
    files: [String], // Array of file URLs (pictures or videos)
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

const PortfolioItem = mongoose.model('PortfolioItem', portfolioItemSchema);

// Create a new portfolio item
// Create a new portfolio item
app.post('/api/portfolio', async (req, res) => {
    try {
        const { information, description, files } = req.body;

        const portfolioItem = new PortfolioItem({
            information: information,
            description: description,
            files: files || []
        });

        await portfolioItem.save();

        res.status(201).json({ message: 'Portfolio item created successfully', portfolioItem });
    } catch (error) {
        console.error('Error creating portfolio item:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


// Get all portfolio items
app.get('/api/portfolio', async (req, res) => {
    try {
        const portfolioItems = await PortfolioItem.find();
        res.json(portfolioItems);
    } catch (error) {
        console.error('Error getting portfolio items:', error);
        res.status(500).send('Error getting portfolio items');
    }
});

// Update a portfolio item
app.put('/api/portfolio/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { information, description, files } = req.body;
        const updatedItem = await PortfolioItem.findByIdAndUpdate(id, { information, description, files, updatedAt: Date.now() }, { new: true });
        res.json(updatedItem);
    } catch (error) {
        console.error('Error updating portfolio item:', error);
        res.status(500).send('Error updating portfolio item');
    }
});

// Delete a portfolio item
app.delete('/api/portfolio/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await PortfolioItem.findByIdAndDelete(id);
        res.send('Portfolio item deleted successfully');
    } catch (error) {
        console.error('Error deleting portfolio item:', error);
        res.status(500).send('Error deleting portfolio item');
    }
});



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
        console.log('Authenticating user...');
        console.log('Request body:', req.body); // Log the request body to ensure username and password are present
        let username = req.body.username || req.params.username; // Check both body and params
        console.log('Username:', username);

        if (!username) {
            console.log('Username not provided');
            return res.status(400).send('Username not provided');
        }

        const user = await User.findOne({ username: username });
        console.log('User found:', user);

        if (!user) {
            console.log('User not found');
            return res.status(404).send('User not found');
        }

        const validPassword = await bcrypt.compare(req.body.password, user.password);
        console.log('Password is valid:', validPassword);

        if (!validPassword) {
            console.log('Invalid password');
            return res.status(400).send('Invalid password');
        }

        console.log('Authentication successful');
        console.log('User found:', user);
        req.user = user; // Attach user object to request
        next(); // Proceed to next middleware/route handler
    } catch (error) {
        console.error('Error logging in:', error);
        res.status(500).send('Error logging in');
    }
};


app.get('/', (req, res) => {
    res.render('index'); // Render the index.ejs file
});

app.get('/register', (req, res) => {
    res.render('loginreg');
});

app.get('/admin', (req, res) => {
    res.render('admin');
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

app.post('/login', authenticateUser, async (req, res) => {
    try {
        const user = req.user;

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const validPassword = await bcrypt.compare(req.body.password, user.password);
        if (!validPassword) {
            return res.status(400).json({ error: 'Invalid password' });
        }

        console.log('Authentication successful');
        console.log('User found:', user);

        // Instead of redirecting, send a JSON response with the user's role
        res.status(200).json({ role: user.role });
    } catch (error) {
        console.error('Error logging in:', error);
        res.status(500).json({ error: 'Error logging in' });
    }
});


app.get('/admin', authenticateUser, (req, res) => {
    if (req.user && req.user.role === 'admin') {
        res.render('admin');
    } else {
        res.redirect('/'); // Redirect unauthorized users to the home page
    }
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
