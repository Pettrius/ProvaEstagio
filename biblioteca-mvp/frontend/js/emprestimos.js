// Carrega todos os empréstimos da API
async function carregarEmprestimos() {
    const loadingElement = document.getElementById('loading-emprestimos');
    const listaElement = document.getElementById('lista-emprestimos');

    // Mostra loading
    loadingElement.style.display = 'block';
    listaElement.innerHTML = '';

    // Busca os empréstimos
    const resposta = await EmprestimosAPI.listar();

    // Esconde loading
    loadingElement.style.display = 'none';

    if (!resposta.sucesso) {
        listaElement.innerHTML = `<div class="alert alert-error">${resposta.dados.erro}</div>`;
        return;
    }

    const emprestimos = resposta.dados.dados;

    if (emprestimos.length === 0) {
        listaElement.innerHTML = '<div class="empty-message">📖 Nenhum empréstimo registrado ainda. Realize o primeiro empréstimo acima!</div>';
        return;
    }

    // Cria a tabela
    let html = `
        <table class="table">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Usuário</th>
                    <th>Livro</th>
                    <th>Data Empréstimo</th>
                    <th>Data Devolução</th>
                    <th>Status</th>
                    <th>Ações</th>
                </tr>
            </thead>
            <tbody>
    `;

    emprestimos.forEach(emprestimo => {
        const statusClass = emprestimo.status === 'ativo' ? 'badge-warning' : 'badge-success';
        const statusTexto = emprestimo.status === 'ativo' ? 'Ativo' : 'Devolvido';

        html += `
            <tr>
                <td>${emprestimo.id}</td>
                <td><strong>${emprestimo.nome_usuario}</strong></td>
                <td>${emprestimo.titulo_livro || 'N/A'}</td>
                <td>${formatarData(emprestimo.data_emprestimo)}</td>
                <td>${emprestimo.data_devolucao ? formatarData(emprestimo.data_devolucao) : '-'}</td>
                <td><span class="badge ${statusClass}">${statusTexto}</span></td>
                <td class="table-actions">
                    ${emprestimo.status === 'ativo' ? 
                        `<button class="btn btn-success" onclick="devolverLivro(${emprestimo.id})">Devolver</button>` : 
                        ''}
                    <button class="btn btn-danger" onclick="confirmarDelecaoEmprestimo(${emprestimo.id})">Deletar</button>
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

// Carrega os livros disponíveis no select
async function carregarLivrosNoSelect() {
    const select = document.getElementById('livro_select');
    select.innerHTML = '<option value="">Carregando...</option>';

    const resposta = await LivrosAPI.listar();

    if (!resposta.sucesso) {
        select.innerHTML = '<option value="">Erro ao carregar livros</option>';
        return;
    }

    const livros = resposta.dados.dados;

    if (livros.length === 0) {
        select.innerHTML = '<option value="">Nenhum livro cadastrado</option>';
        return;
    }

    // Filtra apenas livros disponíveis
    const livrosDisponiveis = livros.filter(livro => livro.quantidade_disponivel > 0);

    if (livrosDisponiveis.length === 0) {
        select.innerHTML = '<option value="">Nenhum livro disponível no momento</option>';
        return;
    }

    // Cria as opções
    let html = '<option value="">Selecione um livro</option>';
    
    livrosDisponiveis.forEach(livro => {
        html += `<option value="${livro.id}">
            ${livro.titulo} - ${livro.autor} (${livro.quantidade_disponivel} disponível)
        </option>`;
    });

    select.innerHTML = html;
}

// Manipula o envio do formulário de empréstimo
document.getElementById('form-emprestimo').addEventListener('submit', async function(e) {
    e.preventDefault();

    const btnTexto = document.getElementById('btn-emprestimo-texto');
    const btnLoading = document.getElementById('btn-emprestimo-loading');
    const btnSubmit = document.getElementById('btn-submit-emprestimo');

    // Mostra loading
    btnTexto.style.display = 'none';
    btnLoading.style.display = 'inline';
    btnSubmit.disabled = true;

    // Coleta os dados do formulário
    const emprestimo = {
        nome_usuario: document.getElementById('nome_usuario').value.trim(),
        livro_id: parseInt(document.getElementById('livro_select').value)
    };

    // Cria o empréstimo
    const resposta = await EmprestimosAPI.criar(emprestimo);

    // Esconde loading
    btnTexto.style.display = 'inline';
    btnLoading.style.display = 'none';
    btnSubmit.disabled = false;

    if (resposta.sucesso) {
        mostrarSucesso(resposta.dados.mensagem);
        document.getElementById('form-emprestimo').reset();
        carregarEmprestimos();
        carregarLivrosNoSelect(); // Atualiza o select
    } else {
        mostrarErro(resposta.dados.erro);
    }
});

// Função para devolver livro
async function devolverLivro(id) {
    const resposta = await EmprestimosAPI.atualizar(id, { status: 'devolvido' });

    if (resposta.sucesso) {
        mostrarSucesso('Livro devolvido com sucesso!');
        carregarEmprestimos();
        carregarLivrosNoSelect(); // Atualiza o select com a nova disponibilidade
    } else {
        mostrarErro(resposta.dados.erro);
    }
}

// Função para confirmar deleção de empréstimo
function confirmarDelecaoEmprestimo(id) {
    const modal = document.getElementById('modal-confirmacao');
    const mensagem = document.getElementById('modal-mensagem');
    const btnConfirmar = document.getElementById('modal-confirmar');

    mensagem.textContent = 'Tem certeza que deseja deletar este empréstimo? Esta ação não pode ser desfeita.';
    modal.style.display = 'block';

    // Remove listeners antigos clonando o botão
    const novoBtn = btnConfirmar.cloneNode(true);
    btnConfirmar.parentNode.replaceChild(novoBtn, btnConfirmar);

    // Adiciona novo listener
    document.getElementById('modal-confirmar').addEventListener('click', async function() {
        await deletarEmprestimo(id);
        fecharModal();
    });
}

// Função para deletar empréstimo
async function deletarEmprestimo(id) {
    const resposta = await EmprestimosAPI.deletar(id);

    if (resposta.sucesso) {
        mostrarSucesso(resposta.dados.mensagem);
        carregarEmprestimos();
        carregarLivrosNoSelect(); // Atualiza o select
    } else {
        mostrarErro(resposta.dados.erro);
    }
}

// Função auxiliar para formatar data
function formatarData(dataString) {
    if (!dataString) return '-';
    
    const partes = dataString.split('-');
    if (partes.length !== 3) return dataString;
    
    const [ano, mes, dia] = partes;
    return `${dia}/${mes}/${ano}`;
}