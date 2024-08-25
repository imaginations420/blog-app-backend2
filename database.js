const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Create a new SQLite database or connect to an existing one
const db = new sqlite3.Database(path.join(__dirname, 'blog.db'), (err) => {
    if (err) {
        console.error('Error opening database ' + err.message);
    } else {
        console.log('Connected to the SQLite database.');
        // Create the posts table if it does not exist
        db.run(`CREATE TABLE IF NOT EXISTS posts (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            content TEXT NOT NULL,
            excerpt TEXT NOT NULL
        )`, (err) => {
            if (err) {
                console.error('Error creating table ' + err.message);
            } else {
                console.log('Posts table created or already exists.');
                // Insert default data
                db.run(`INSERT INTO posts (title, content, excerpt) VALUES 
                    ('First Post', 'This is the content of the first post.', 'This is an excerpt for the first post.'),
                    ('Second Post', 'This is the content of the second post.', 'This is an excerpt for the second post.'),
                    ('Third Post', 'This is the content of the third post.', 'This is an excerpt for the third post.'),
                    ('Fourth Post', 'This is the content of the fourth post.', 'This is an excerpt for the fourth post.')
                `, (err) => {
                    if (err) {
                        console.error('Error inserting default posts ' + err.message);
                    } else {
                        console.log('Default posts inserted.');
                    }
                });
            }
        });
    }
});

module.exports = db;
