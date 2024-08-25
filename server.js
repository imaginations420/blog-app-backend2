const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const db = require('./database'); // Import the database connection

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

// Get all posts
app.get('/posts', (req, res) => {
    db.all('SELECT * FROM posts', [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
});

// Get a specific post
app.get('/posts/:id', (req, res) => {
    const { id } = req.params.id;
    db.get('SELECT * FROM posts WHERE id = ?', [id], (err, row) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        if (!row) {
            res.status(404).json({ error: 'Post not found' });
            return;
        }
        res.json(row);
    });
});

// Create a new post
app.post('/posts', (req, res) => {
    const { title, content, excerpt } = req.body;

    // Input validation
    if (!title || !content || !excerpt) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    db.run('INSERT INTO posts (title, content, excerpt) VALUES (?, ?, ?)', [title, content, excerpt], function(err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.status(201).json({ id: this.lastID });
    });
});

// Update a post
app.put('/posts/:id', (req, res) => {
    const { id } = req.params;
    const { title, content, excerpt } = req.body;

    // Input validation
    if (!title || !content || !excerpt) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    db.run('UPDATE posts SET title = ?, content = ?, excerpt = ? WHERE id = ?', [title, content, excerpt, id], function(err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        if (this.changes === 0) {
            res.status(404).json({ error: 'Post not found' });
            return;
        }
        res.json({ message: 'Post updated successfully' });
    });
});

// Delete a post
app.delete('/posts/:id', (req, res) => {
    const { id } = req.params;
    db.run('DELETE FROM posts WHERE id = ?', [id], function(err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        if (this.changes === 0) {
            res.status(404).json({ error: 'Post not found' });
            return;
        }
        res.status(204).send();
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
