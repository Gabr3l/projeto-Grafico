const express = require('express');
const app = express();
const port = 3000;
const mysql = require('mysql2');
const cors = require('cors');

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Conexão com o banco de dados
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'maciel',
    database: 'precos'
});

connection.connect((err) => {
    if (err) throw err;
    console.log('Conectado ao banco de dados MySQL');
});

// Rota para listar todos os produtos
app.get('/api/produtos', (req, res) => {
    const query = 'SELECT id, nome, valor, vencimento, quantidade FROM produtos';
    connection.query(query, (err, results) => {
        if (err) {
            console.error('Erro ao buscar produtos:', err);
            res.status(500).json({ error: 'Erro ao buscar produtos.' });
        } else {
            res.json(results);
        }
    });
});

// Rota para cadastrar novo produto ou atualizar a quantidade se já tiver
app.post('/api/produtos', (req, res) => {
    const { nome, valor, vencimento, quantidade } = req.body;

    // olha se ja existe o nome do produto
    const checkQuery = 'SELECT * FROM produtos WHERE nome = ?';
    connection.query(checkQuery, [nome], (err, results) => {
        if (err) {
            console.error('Erro ao verificar produto:', err);
            res.status(500).json({ error: 'Erro ao verificar produto.' });
        } else if (results.length > 0) {
            // se existe atualiza a quantidade
            const existingProduct = results[0];
            const novaQuantidade = existingProduct.quantidade + quantidade;

            const updateQuery = 'UPDATE produtos SET quantidade = ?, valor = ?, vencimento = ? WHERE id = ?';
            connection.query(updateQuery, [novaQuantidade, valor, vencimento, existingProduct.id], (err, result) => {
                if (err) {
                    console.error('Erro ao atualizar produto:', err);
                    res.status(500).json({ error: 'Erro ao atualizar produto.' });
                } else {
                    res.json({ message: 'Produto atualizado com sucesso.' });
                }
            });
        } else {
            // Caso contrário, insere um novo produto
            const insertQuery = 'INSERT INTO produtos (nome, valor, vencimento, quantidade) VALUES (?, ?, ?, ?)';
            connection.query(insertQuery, [nome, valor, vencimento, quantidade], (err, result) => {
                if (err) {
                    console.error('Erro ao cadastrar produto:', err);
                    res.status(500).json({ error: 'Erro ao cadastrar produto.' });
                } else {
                    res.json({ message: 'Produto cadastrado com sucesso.' });
                }
            });
        }
    });
});

// Rota pra atualizar um produto
app.put('/api/produtos/:id', (req, res) => {
    const { id } = req.params;
    const { nome, valor, vencimento, quantidade } = req.body;
    const query = 'UPDATE produtos SET nome = ?, valor = ?, vencimento = ?, quantidade = ? WHERE id = ?';
    connection.query(query, [nome, valor, vencimento, quantidade, id], (err, result) => {
        if (err) {
            console.error('Erro ao atualizar produto:', err);
            res.status(500).json({ error: 'Erro ao atualizar produto.' });
        } else {
            res.json({ message: 'Produto atualizado com sucesso.' });
        }
    });
});

// Rota pra excluir um produto
app.delete('/api/produtos/:id', (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM produtos WHERE id = ?';
    connection.query(query, [id], (err, result) => {
        if (err) {
            console.error('Erro ao excluir produto:', err);
            res.status(500).json({ error: 'Erro ao excluir produto.' });
        } else {
            res.json({ message: 'Produto excluído com sucesso.' });
        }
    });
});

app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});
