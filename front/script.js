const express = require('express');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path'); // Import the path module

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs'); // Set EJS as the view engine
app.set('views', path.join(__dirname, 'views')); // Set the views directory

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/portfolio', { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
    console.log('Connected to MongoDB');
});

// Define User schema and model
const userSchema = new mongoose.Schema({
    username: String,
    password: String,
    // Add other fields (first name, last name, age, country, gender)
});

const User = mongoose.model('User', userSchema);

// Define route for root URL
app.get('/', (req, res) => {
    res.render('index'); // Render the index.ejs file
});

// Handle user registration POST request
app.post('/register', async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const user = new User({
            username: req.body.username,
            password: hashedPassword,
            // Assign other fields accordingly
        });
        await user.save();
        res.send('Registration successful');
    } catch (error) {
        res.status(500).send('Error registering user');
    }
});

// Start server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
