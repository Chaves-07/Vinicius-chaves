const { Client } = require('pg');
const prompt = require('prompt-sync')();

// ─────────────────────────────────────────
// CONFIGURAÇÃO DA CONEXÃO
// ─────────────────────────────────────────
function criarCliente() {
    return new Client({
        host:     'localhost',
        port:     5432,
        user:     'postgres',
        password: 'sua_senha',
        database: 'almoxarifado_db'
    });
}

// ─────────────────────────────────────────
// LISTAR ITENS
// ─────────────────────────────────────────
async function listarItens() {
    const client = criarCliente();
    try {
        await client.connect();
        const resultado = await client.query(
            'SELECT * FROM itens ORDER BY tipo, nome'
        );

        console.log('\n╔════════════════════════════════════════════════════╗');
        console.log('║         ⚗️  LOJA DO ALQUIMISTA VALDRIS              ║');
        console.log('╚════════════════════════════════════════════════════╝\n');

        if (resultado.rows.length === 0) {
            console.log('A loja está vazia no momento.');
        } else {
            resultado.rows.forEach(item => {
                console.log(`[${item.id}] ${item.nome}`);
                console.log(`    Tipo: ${item.tipo} | Preço: R$ ${item.preco} | Estoque: ${item.estoque}`);
                console.log(`    ${item.descricao}`);
                console.log('    ─────────────────────────────────────────');
            });
            console.log(`\nTotal de itens: ${resultado.rows.length}`);
        }
    } catch (erro) {
        console.log('❌ Erro ao listar itens:', erro.message);
    } finally {
        await client.end();
    }
}

// ─────────────────────────────────────────
// CADASTRAR ITEM
// ─────────────────────────────────────────
async function cadastrarItem() {
    const client = criarCliente();
    try {
        await client.connect();

        console.log('\n⚗️  CADASTRAR NOVO ITEM\n');
        const nome      = prompt('Nome do item: ');
        const tipo      = prompt('Tipo (Poção/Ingrediente/Elixir): ');
        const preco     = prompt('Preço: ');
        const estoque   = prompt('Estoque inicial: ');
        const descricao = prompt('Descrição: ');

        if (!nome || !tipo || !preco) {
            console.log('❌ Nome, tipo e preço são obrigatórios.');
            return;
        }

        const resultado = await client.query(
            `INSERT INTO itens (nome, tipo, preco, estoque, descricao)
             VALUES ($1, $2, $3, $4, $5)
             RETURNING *`,
            [nome, tipo, preco, estoque, descricao]
        );

        console.log('\n✅ Item cadastrado com sucesso!');
        console.log(`   ID: ${resultado.rows[0].id} | ${resultado.rows[0].nome}`);

    } catch (erro) {
        console.log('❌ Erro ao cadastrar:', erro.message);
    } finally {
        await client.end();
    }
}

// ─────────────────────────────────────────
// ATUALIZAR ESTOQUE
// ─────────────────────────────────────────
async function atualizarEstoque() {
    const client = criarCliente();
    try {
        await client.connect();

        const lista = await client.query(
            'SELECT id, nome, estoque FROM itens ORDER BY nome'
        );

        console.log('\n✏️  ATUALIZAR ESTOQUE\n');
        lista.rows.forEach(item => {
            console.log(`[${item.id}] ${item.nome} — Estoque: ${item.estoque}`);
        });

        console.log('');
        const id          = prompt('ID do item: ');
        const novoEstoque = prompt('Novo estoque: ');

        const resultado = await client.query(
            `UPDATE itens SET estoque = $1 WHERE id = $2 RETURNING nome, estoque`,
            [novoEstoque, id]
        );

        if (resultado.rows.length === 0) {
            console.log('❌ Item não encontrado.');
        } else {
            console.log(`\n✅ ${resultado.rows[0].nome}: ${resultado.rows[0].estoque} unidades`);
        }

    } catch (erro) {
        console.log('❌ Erro ao atualizar:', erro.message);
    } finally {
        await client.end();
    }
}

// ─────────────────────────────────────────
// REMOVER ITEM
// ─────────────────────────────────────────
async function removerItem() {
    const client = criarCliente();
    try {
        await client.connect();

        const lista = await client.query(
            'SELECT id, nome, tipo FROM itens ORDER BY nome'
        );

        console.log('\n🗑️  REMOVER ITEM\n');
        lista.rows.forEach(item => {
            console.log(`[${item.id}] ${item.nome} (${item.tipo})`);
        });

        console.log('');
        const id = prompt('ID do item a remover: ');

        const busca = await client.query(
            'SELECT nome FROM itens WHERE id = $1', [id]
        );

        if (busca.rows.length === 0) {
            console.log('❌ Item não encontrado.');
            return;
        }

        const confirmacao = prompt(
            `⚠️  Remover "${busca.rows[0].nome}"? (s/n): `
        );

        if (confirmacao.toLowerCase() !== 's') {
            console.log('Operação cancelada.');
            return;
        }

        await client.query('DELETE FROM itens WHERE id = $1', [id]);
        console.log(`\n✅ "${busca.rows[0].nome}" removido da loja.`);

    } catch (erro) {
        console.log('❌ Erro ao remover:', erro.message);
    } finally {
        await client.end();
    }
}

// ─────────────────────────────────────────
// MENU PRINCIPAL
// ─────────────────────────────────────────
async function menu() {
    let rodando = true;

    while (rodando) {
        console.log('\n╔════════════════════════════════════════╗');
        console.log('║     ⚗️  LOJA DO ALQUIMISTA VALDRIS     ║');
        console.log('╠════════════════════════════════════════╣');
        console.log('║  1 - Ver itens da loja                 ║');
        console.log('║  2 - Cadastrar novo item               ║');
        console.log('║  3 - Atualizar estoque                 ║');
        console.log('║  4 - Remover item                      ║');
        console.log('║  0 - Fechar a loja                     ║');
        console.log('╚════════════════════════════════════════╝');

        const opcao = prompt('\nEscolha uma opção: ');

        switch (opcao) {
            case '1': await listarItens();      break;
            case '2': await cadastrarItem();    break;
            case '3': await atualizarEstoque(); break;
            case '4': await removerItem();      break;
            case '0':
                rodando = false;
                console.log('\n🧙 Até a próxima, aventureiro!\n');
                break;
            default:
                console.log('❌ Opção inválida. Tente novamente.');
        }
    }
}

menu();