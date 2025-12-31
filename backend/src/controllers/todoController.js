const { pool } = require('../db');

exports.getAllTodos = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM todos ORDER BY created_at DESC');
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.createTodo = async (req, res) => {
    const { title } = req.body;
    if (!title) {
        return res.status(400).json({ error: 'Title is required' });
    }
    try {
        const result = await pool.query(
            'INSERT INTO todos (title) VALUES ($1) RETURNING *',
            [title]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.updateTodo = async (req, res) => {
    const { id } = req.params;
    const { title, is_completed } = req.body;

    try {
        // Dynamic query building could be better, but simple is fine for now
        let query, values;

        if (title !== undefined && is_completed !== undefined) {
            query = 'UPDATE todos SET title = $1, is_completed = $2 WHERE id = $3 RETURNING *';
            values = [title, is_completed, id];
        } else if (title !== undefined) {
            query = 'UPDATE todos SET title = $1 WHERE id = $2 RETURNING *';
            values = [title, id];
        } else if (is_completed !== undefined) {
            query = 'UPDATE todos SET is_completed = $1 WHERE id = $2 RETURNING *';
            values = [is_completed, id];
        } else {
            return res.status(400).json({ error: 'Nothing to update' });
        }

        const result = await pool.query(query, values);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Todo not found' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.deleteTodo = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('DELETE FROM todos WHERE id = $1 RETURNING *', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Todo not found' });
        }
        res.json({ message: 'Todo deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
