const express = require('express');
const cors = require('cors');
const { Sequelize, DataTypes } = require('sequelize');

// Initialize Express app
const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json()); // Middleware to parse JSON requests

// Setup DB connection
const sequelize = new Sequelize('mydb', 'admin', 'Timndbpw10!', {
    host: 'database-1.cnqe00p5d1ax.us-east-1.rds.amazonaws.com',
    dialect: 'mysql'
});


// Define Puppy model
const Puppy = sequelize.define('Puppy', {
    pet_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    breed: {
        type: DataTypes.STRING(20),
        allowNull: true
    },
    age_est: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    current_kennel_number: {
        type: DataTypes.INTEGER,
        allowNull: true
    }
}, {
    tableName: 'puppies',
    timestamps: false
});

// Sync database (optional: use { force: true } to reset table)
sequelize.sync()
    .then(() => console.log('Database connected and Puppy table ready'))
    .catch(err => console.error('DB connection error:', err));

// Routes

// GET all puppies
app.get('/puppies', async (req, res) => {
    try {
        const puppies = await Puppy.findAll();
        res.json(puppies);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET a puppy by ID
app.get('/puppies/:id', async (req, res) => {
    try {
        const puppy = await Puppy.findByPk(req.params.id);
        if (puppy) {
            res.json(puppy);
        } else {
            res.status(404).json({ message: 'Puppy not found' });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// CREATE a new puppy
app.post('/puppies', async (req, res) => {
    try {
        const newPuppy = await Puppy.create(req.body);
        res.status(201).json(newPuppy);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// UPDATE a puppy by ID
app.put('/puppies/:id', async (req, res) => {
    try {
        const updated = await Puppy.update(req.body, {
            where: { pet_id: req.params.id }
        });
        if (updated[0]) {
            res.json({ message: 'Puppy updated successfully' });
        } else {
            res.status(404).json({ message: 'Puppy not found' });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// DELETE a puppy by ID
app.delete('/puppies/:id', async (req, res) => {
    try {
        const deleted = await Puppy.destroy({
            where: { pet_id: req.params.id }
        });
        if (deleted) {
            res.json({ message: 'Puppy deleted successfully' });
        } else {
            res.status(404).json({ message: 'Puppy not found' });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
