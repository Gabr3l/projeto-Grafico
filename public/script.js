document.addEventListener('DOMContentLoaded', () => {
    const formProduto = document.getElementById('form-produto');
    const tableBody = document.querySelector('#product-table tbody');
    const totalValorDisplay = document.getElementById('total-valor');
    const editModal = document.getElementById('editModal');
    const spanClose = document.querySelector('.close');
    const formEditarProduto = document.getElementById('form-editar-produto');
    let editProductId = null;

    // Função para cadastrar novo produto
    formProduto.addEventListener('submit', (event) => {
        event.preventDefault();
        const nomeProduto = document.getElementById('nomeProduto').value;
        const valorProduto = parseFloat(document.getElementById('valorProduto').value);
        const vencimentoProduto = document.getElementById('vencimentoProduto').value;
        const quantidadeProduto = parseInt(document.getElementById('quantidadeProduto').value); // Novo campo de quantidade

        if (isNaN(valorProduto) || isNaN(quantidadeProduto)) {
            alert('Por favor, insira valores válidos.');
            return;
        }

        fetch('/api/produtos', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                nome: nomeProduto, 
                valor: valorProduto, 
                vencimento: vencimentoProduto, 
                quantidade: quantidadeProduto // Enviar quantidade
            }) 
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro ao cadastrar o produto.');
            }
            return response.json();
        })
        .then(data => {
            alert(data.message || 'Produto cadastrado com sucesso!');
            formProduto.reset();
            carregarProdutos(); // Recarregar a tabela de produtos
        })
        .catch(error => {
            console.error('Erro ao cadastrar produto:', error);
            alert('Erro ao cadastrar produto. Verifique o console para mais informações.');
        });
    });

    
    // Função para carregar produtos no carregamento da página
    function carregarProdutos() {
        fetch('/api/produtos')
            .then(response => response.json())
            .then(produtos => {
                tableBody.innerHTML = '';
                let totalValor = 0;

                produtos.forEach(produto => {
                    const valorFormatado = `R$ ${(produto.valor * produto.quantidade).toFixed(2)}`;
                    const vencimentoFormatado = produto.vencimento
                        ? new Date(produto.vencimento).toLocaleDateString('pt-BR')
                        : 'Sem vencimento';

                    totalValor += parseFloat(produto.valor) * produto.quantidade;

                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${produto.nome}</td>
                        <td>${valorFormatado} (Qtd: ${produto.quantidade})</td>
                        <td>${vencimentoFormatado}</td>
                        <td>
                            <button class="edit-btn" data-id="${produto.id}" data-nome="${produto.nome}" data-valor="${produto.valor}" data-vencimento="${produto.vencimento}" data-quantidade="${produto.quantidade}">Editar</button>
                            <button class="delete-btn" data-id="${produto.id}">Excluir</button>
                        </td>
                    `;
                    tableBody.appendChild(row);
                });

                totalValorDisplay.textContent = `Valor Total: R$ ${totalValor.toFixed(2)}`;

                document.querySelectorAll('.delete-btn').forEach(button => {
                    button.addEventListener('click', (e) => {
                        const productId = e.target.getAttribute('data-id');
                        const productName = e.target.closest('tr').children[0].innerText;
                        confirmarExclusao(productId, productName);
                    });
                });

                document.querySelectorAll('.edit-btn').forEach(button => {
                    button.addEventListener('click', (e) => {
                        editProductId = e.target.getAttribute('data-id');
                        const nomeProduto = e.target.getAttribute('data-nome');
                        const valorProduto = e.target.getAttribute('data-valor');
                        const vencimentoProduto = e.target.getAttribute('data-vencimento');
                        const quantidadeProduto = e.target.getAttribute('data-quantidade');
                        abrirModalEdicao(nomeProduto, valorProduto, vencimentoProduto, quantidadeProduto);
                    });
                });
            })
            .catch(error => {
                console.error('Erro ao carregar produtos:', error);
                alert('Erro ao carregar produtos. Verifique o console para mais informações.');
            });
    }

    // Função para abrir o modal de edição
    function abrirModalEdicao(nome, valor, vencimento, quantidade) {
        document.getElementById('editarNomeProduto').value = nome;
        document.getElementById('editarValorProduto').value = valor;
        document.getElementById('editarVencimentoProduto').value = vencimento;
        document.getElementById('editarQuantidadeProduto').value = quantidade;
        editModal.style.display = 'block'; // Exibir o modal de edição
    }

    // Fechar o modal de edição
    spanClose.onclick = () => {
        editModal.style.display = 'none'; // Esconder o modal quando fechar
    };

    window.onclick = (event) => {
        if (event.target === editModal) {
            editModal.style.display = 'none'; // Fechar o modal clicando fora
        }
    };

    // Função para atualizar o produto
    formEditarProduto.addEventListener('submit', (event) => {
        event.preventDefault();
        const nomeProduto = document.getElementById('editarNomeProduto').value;
        const valorProduto = parseFloat(document.getElementById('editarValorProduto').value);
        const vencimentoProduto = document.getElementById('editarVencimentoProduto').value;
        const quantidadeProduto = parseInt(document.getElementById('editarQuantidadeProduto').value);

        if (isNaN(valorProduto) || isNaN(quantidadeProduto)) {
            alert('Por favor, insira valores válidos.');
            return;
        }

        fetch(`/api/produtos/${editProductId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nome: nomeProduto, valor: valorProduto, vencimento: vencimentoProduto, quantidade: quantidadeProduto })
        })
        .then(response => response.json())
        .then(data => {
            alert(data.message);
            carregarProdutos();
            editModal.style.display = 'none'; // Fechar o modal após salvar
        })
        .catch(error => {
            console.error('Erro ao atualizar produto:', error);
            alert('Erro ao atualizar produto. Verifique o console para mais informações.');
        });
    });

    // Função para confirmar exclusão
    function confirmarExclusao(id, nomeProduto) {
        if (confirm(`Tem certeza que deseja excluir o produto "${nomeProduto}"?`)) {
            fetch(`/api/produtos/${id}`, { method: 'DELETE' })
                .then(response => response.json())
                .then(data => {
                    alert(data.message);
                    carregarProdutos();
                })
                .catch(error => {
                    console.error('Erro ao excluir produto:', error);
                    alert('Erro ao excluir produto. Verifique o console para mais informações.');
                });
        }
    }

    carregarProdutos();
});
