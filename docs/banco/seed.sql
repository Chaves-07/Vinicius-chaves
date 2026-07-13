INSERT INTO itens (nome, tipo, preco, estoque, descricao) VALUES
    ('Detergentes',      'Saneantes',   15.00, 50, 'Atuam diretamente na quebra e remoção de gorduras e sujeiras orgânicas.'),
    ('Desinfetantes',    'Saneantes',   20.00, 30, 'Utilizados para eliminar ou reduzir micro-organismos a níveis seguros, cruciais em banheiros e áreas comuns.'),
    ('Vassouras',        'Ferramentas', 8.50,  15, 'limpeza e secagem de pisos com alta produtividade.'),
    ('Esponjas',         'Ferramentas', 5.00,  40, 'Abrasivos para remoção de sujeiras incrustadas em diferentes tipos de materiais.'),
    ('Baldes',           'Ferramentas', 45.00, 10, 'Para armazenamento de água e recolhimento de resíduos.'),
    ('Sabonete Líquido', 'EPIs',        12.00, 25, 'Necessário para poções de velocidade'),
    ('Papéis',           'EPIs',        35.00,  8, 'Papel toalha, papel higiênico');

SELECT * FROM itens;
SELECT * FROM itens ORDER BY tipo, nome
SELECT id, nome, tipo FROM itens ORDER BY nome