// Configuração da URL base da API
const API_URL = 'http://localhost:5000/api';

// Função genérica para fazer requisições à API
async function fazerRequisicao(endpoint, metodo = 'GET', dados = null) {
    const opcoes = {
        method: metodo,
        headers: {
            'Content-Type': 'application/json',
        }
    };

    // Adiciona o body apenas se houver dados e o método não for GET
    if (dados && metodo !== 'GET') {
        opcoes.body = JSON.stringify(dados);
    }

    try {
        const resposta = await fetch(`${API_URL}${endpoint}`, opcoes);
        const json = await resposta.json();

        // Retorna os dados e o status
        return {
            sucesso: resposta.ok,
            dados: json,
            status: resposta.status
        };
    } catch (erro) {
        console.error('Erro na requisição:', erro);
        return {
            sucesso: false,
            dados: { 
                erro: 'Erro ao conectar com o servidor. Verifique se a API está rodando em http://localhost:5000' 
            },
            status: 0
        };
    }
}

// Funções específicas para Livros
const LivrosAPI = {
    // Listar todos os livros
    async listar() {
        return await fazerRequisicao('/livros', 'GET');
    },

    // Buscar livro por ID
    async buscarPorId(id) {
        return await fazerRequisicao(`/livros/${id}`, 'GET');
    },

    // Criar novo livro
    async criar(livro) {
        return await fazerRequisicao('/livros', 'POST', livro);
    },

    // Atualizar livro
    async atualizar(id, livro) {
        return await fazerRequisicao(`/livros/${id}`, 'PUT', livro);
    },

    // Deletar livro
    async deletar(id) {
        return await fazerRequisicao(`/livros/${id}`, 'DELETE');
    }
};

// Funções específicas para Empréstimos
const EmprestimosAPI = {
    // Listar todos os empréstimos
    async listar() {
        return await fazerRequisicao('/emprestimos', 'GET');
    },

    // Buscar empréstimo por ID
    async buscarPorId(id) {
        return await fazerRequisicao(`/emprestimos/${id}`, 'GET');
    },

    // Criar novo empréstimo
    async criar(emprestimo) {
        return await fazerRequisicao('/emprestimos', 'POST', emprestimo);
    },

    // Atualizar empréstimo (devolver livro)
    async atualizar(id, emprestimo) {
        return await fazerRequisicao(`/emprestimos/${id}`, 'PUT', emprestimo);
    },

    // Deletar empréstimo
    async deletar(id) {
        return await fazerRequisicao(`/emprestimos/${id}`, 'DELETE');
    }
};

// Funções auxiliares para mensagens
function mostrarMensagem(mensagem, tipo = 'success') {
    const areaMensagens = document.getElementById('area-mensagens');
    
    // Remove mensagens antigas
    areaMensagens.innerHTML = '';

    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${tipo}`;
    
    const textoSpan = document.createElement('span');
    textoSpan.textContent = mensagem;
    
    const botaoFechar = document.createElement('button');
    botaoFechar.className = 'alert-close';
    botaoFechar.innerHTML = '×';
    botaoFechar.onclick = () => alertDiv.remove();
    
    alertDiv.appendChild(textoSpan);
    alertDiv.appendChild(botaoFechar);
    
    areaMensagens.appendChild(alertDiv);

    // Remove após 5 segundos
    setTimeout(() => {
        alertDiv.remove();
    }, 5000);

    // Rola para o topo
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function mostrarErro(mensagem) {
    mostrarMensagem(mensagem, 'error');
}

function mostrarSucesso(mensagem) {
    mostrarMensagem(mensagem, 'success');
}