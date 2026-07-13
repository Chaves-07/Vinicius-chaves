CREATE TABLE itens (
    id         SERIAL PRIMARY KEY,
    nome       VARCHAR(100) NOT NULL,
    tipo       VARCHAR(50)  NOT NULL,
    preco      DECIMAL(10,2) NOT NULL,
    estoque    INTEGER DEFAULT 0,
    descricao  TEXT
);