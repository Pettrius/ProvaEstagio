// Variável para controlar o modo de edição
let livroEmEdicao = null;

// Carrega todos os livros da API
async function carregarLivros() {
    const loadingElement = document.getElementById('loading-livros');
    const listaElement = document.getElementById('lista-livros');

    // Mostra loading
    loadingElement.style.display = 'block';
    listaElement.innerHTML = '';

    // Busca os livros
    const resposta = await LivrosAPI.listar();

    // Esconde loading
    loadingElement.style.display = 'none';

    if (!resposta.sucesso) {
        listaElement.innerHTML = `<div class="alert alert-error">${resposta.dados.erro}</div>`;
        return;
    }

    const livros = resposta.dados.dados;

    if (livros.length === 0) {
        listaElement.innerHTML = '<div class="empty-message">📚 Nenhum livro cadastrado ainda. Cadastre o primeiro livro acima!</div>';
        return;
    }

    // Cria a tabela
    let html = `
        <table class="table">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Título</th>
                    <th>Autor</th>
                    <th>Ano</th>
                    <th>Total</th>
                    <th>Disponível</th>
                    <th>Ações</th>
                </tr>
            </thead>
            <tbody>
    `;

    livros.forEach(livro => {
        html += `
            <tr>
                <td>${livro.id}</td>
                <td><strong>${livro.titulo}</strong></td>
                <td>${livro.autor}</td>
                <td>${livro.ano_publicacao}</td>
                <td>${livro.quantidade_total}</td>
                <td>
                    ${livro.quantidade_disponivel}
                    ${livro.quantidade_disponivel === 0 ? 
                        '<span style="color: #dc3545; font-size: 0.85em;">(Indisponível)</span>' : 
                        ''}
                </td>
                <td class="table-actions">
                    <button class="btn btn-warning" onclick="editarLivro(${livro.id})">Editar</button>
                    <button class="btn btn-danger" onclick="confirmarDelecaoLivro(${livro.id})">Deletar</button>
                </td>
            </tr>
        `;
    });

    html += `
            </tbody>
        </table>
    `;

    listaElement.innerHTML = html;
}

// Manipula o envio do formulário de livro
document.getElementById('form-livro').addEventListener('submit', async function(e) {
    e.preventDefault();

    const btnTexto = document.getElementById('btn-livro-texto');
    const btnLoading = document.getElementById('btn-livro-loading');
    const btnSubmit = document.getElementById('btn-submit-livro');

    // Mostra loading
    btnTexto.style.display = 'none';
    btnLoading.style.display = 'inline';
    btnSubmit.disabled = true;

    // Coleta os dados do formulário
    const quantidadeTotal = parseInt(document.getElementById('quantidade_total').value);
    
    const livro = {
        titulo: document.getElementById('titulo').value.trim(),
        autor: document.getElementById('autor').value.trim(),
        ano_publicacao: parseInt(document.getElementById('ano_publicacao').value),
        quantidade_total: quantidadeTotal,
        quantidade_disponivel: quantidadeTotal
    };

    let resposta;

    // Se está em modo de edição, atualiza. Caso contrário, cria novo
    if (livroEmEdicao) {
        resposta = await LivrosAPI.atualizar(livroEmEdicao, livro);
    } else {
        resposta = await LivrosAPI.criar(livro);
    }

    // Esconde loading
    btnTexto.style.display = 'inline';
    btnLoading.style.display = 'none';
    btnSubmit.disabled = false;

    if (resposta.sucesso) {
        mostrarSucesso(resposta.dados.mensagem);
        limparFormularioLivro();
        carregarLivros();
    } else {
        mostrarErro(resposta.dados.erro);
    }
});

// Função para editar livro
async function editarLivro(id) {
    const resposta = await LivrosAPI.buscarPorId(id);

    if (!resposta.sucesso) {
        mostrarErro('Erro ao carregar dados do livro');
        return;
    }

    const livro = resposta.dados.dados;

    // Preenche o formulário
    document.getElementById('titulo').value = livro.titulo;
    document.getElementById('autor').value = livro.autor;
    document.getElementById('ano_publicacao').value = livro.ano_publicacao;
    document.getElementById('quantidade_total').value = livro.quantidade_total;

    // Muda o texto do botão e título
    document.getElementById('titulo-form-livro').textContent = 'Editar Livro';
    document.getElementById('btn-livro-texto').textContent = 'Atualizar Livro';
    document.getElementById('btn-cancelar-livro').style.display = 'inline-block';

    // Armazena o ID do livro em edição
    livroEmEdicao = id;

    // Rola até o formulário
    document.getElementById('form-livro').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// Função para cancelar edição
function cancelarEdicaoLivro() {
    limparFormularioLivro();
}

// Limpa o formulário
function limparFormularioLivro() {
    document.getElementById('form-livro').reset();
    document.getElementById('titulo-form-livro').textContent = 'Cadastrar Novo Livro';
    document.getElementById('btn-livro-texto').textContent = 'Cadastrar Livro';
    document.getElementById('btn-cancelar-livro').style.display = 'none';
    livroEmEdicao = null;
}

// Função para confirmar deleção
function confirmarDelecaoLivro(id) {
    const modal = document.getElementById('modal-confirmacao');
    const mensagem = document.getElementById('modal-mensagem');
    const btnConfirmar = document.getElementById('modal-confirmar');

    mensagem.textContent = 'Tem certeza que deseja deletar este livro? Esta ação não pode ser desfeita.';
    modal.style.display = 'block';

    // Remove listeners antigos clonando o botão
    const novoBtn = btnConfirmar.cloneNode(true);
    btnConfirmar.parentNode.replaceChild(novoBtn, btnConfirmar);

    // Adiciona novo listener
    document.getElementById('modal-confirmar').addEventListener('click', async function() {
        await deletarLivro(id);
        fecharModal();
    });
}

// Função para deletar livro
async function deletarLivro(id) {
    const resposta = await LivrosAPI.deletar(id);

    if (resposta.sucesso) {
        mostrarSucesso(resposta.dados.mensagem);
        carregarLivros();
        // Atualiza o select de livros na aba de empréstimos
        carregarLivrosNoSelect();
    } else {
        mostrarErro(resposta.dados.erro);
    }
}