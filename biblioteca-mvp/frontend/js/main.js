// Inicialização quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Sistema de Biblioteca carregado!');
    console.log('📡 API URL:', API_URL);
    
    // Carrega os dados iniciais
    carregarLivros();
    carregarEmprestimos();
    
    // Testa conexão com a API
    testarConexaoAPI();
});

// Função para trocar de aba
function mostrarAba(aba) {
    // Esconde todas as abas
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });

    // Remove active de todos os botões
    document.querySelectorAll('.tab-button').forEach(button => {
        button.classList.remove('active');
    });

    // Mostra a aba selecionada
    if (aba === 'livros') {
        document.getElementById('aba-livros').classList.add('active');
        document.querySelectorAll('.tab-button')[0].classList.add('active');
        carregarLivros();
    } else if (aba === 'emprestimos') {
        document.getElementById('aba-emprestimos').classList.add('active');
        document.querySelectorAll('.tab-button')[1].classList.add('active');
        carregarEmprestimos();
        carregarLivrosNoSelect();
    }
}

// Função para fechar modal
function fecharModal() {
    document.getElementById('modal-confirmacao').style.display = 'none';
}

// Fecha modal ao clicar fora dele
window.onclick = function(event) {
    const modal = document.getElementById('modal-confirmacao');
    if (event.target === modal) {
        fecharModal();
    }
}

// Testa conexão com a API
async function testarConexaoAPI() {
    try {
        const resposta = await fetch('http://localhost:5000/api/status');
        if (resposta.ok) {
            console.log('✅ Conexão com a API estabelecida com sucesso!');
        } else {
            console.warn('⚠️ API respondeu com status:', resposta.status);
        }
    } catch (erro) {
        console.error('❌ Erro ao conectar com a API:', erro);
        console.log('💡 Verifique se o backend está rodando em http://localhost:5000');
    }
}