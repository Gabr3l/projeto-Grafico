USE precos;

CREATE TABLE produtos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100),
    valor DECIMAL(10, 2)
);

INSERT INTO produtos (nome, valor) VALUES 
('Dildo', 19.99),
('Davi Grande', 29.99),
('Pirulito', 39.99);