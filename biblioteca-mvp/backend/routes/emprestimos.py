from flask import Blueprint, request, jsonify
from models import db, Livro, Emprestimo
from datetime import datetime

# Blueprint para rotas de empréstimos
emprestimos_bp = Blueprint('emprestimos', __name__)

@emprestimos_bp.route('/api/emprestimos', methods=['GET'])
def listar_emprestimos():
    """Lista todos os empréstimos cadastrados"""
    try:
        emprestimos = Emprestimo.query.all()
        return jsonify({
            'sucesso': True,
            'dados': [emprestimo.para_dicionario() for emprestimo in emprestimos],
            'total': len(emprestimos)
        }), 200
    except Exception as erro:
        return jsonify({
            'sucesso': False,
            'erro': f'Erro ao listar empréstimos: {str(erro)}'
        }), 500


@emprestimos_bp.route('/api/emprestimos/<int:id>', methods=['GET'])
def buscar_emprestimo(id):
    """Busca um empréstimo específico pelo ID"""
    try:
        emprestimo = Emprestimo.query.get(id)
        
        if not emprestimo:
            return jsonify({
                'sucesso': False,
                'erro': 'Empréstimo não encontrado'
            }), 404
        
        return jsonify({
            'sucesso': True,
            'dados': emprestimo.para_dicionario()
        }), 200
    except Exception as erro:
        return jsonify({
            'sucesso': False,
            'erro': f'Erro ao buscar empréstimo: {str(erro)}'
        }), 500


@emprestimos_bp.route('/api/emprestimos', methods=['POST'])
def criar_emprestimo():
    """Cria um novo empréstimo"""
    try:
        dados = request.get_json()
        
        # Validações
        if not dados:
            return jsonify({
                'sucesso': False,
                'erro': 'Nenhum dado foi enviado'
            }), 400
        
        if not dados.get('nome_usuario'):
            return jsonify({
                'sucesso': False,
                'erro': 'O campo "nome_usuario" é obrigatório'
            }), 400
        
        if not dados.get('livro_id'):
            return jsonify({
                'sucesso': False,
                'erro': 'O campo "livro_id" é obrigatório'
            }), 400
        
        # Verifica se o livro existe
        livro = Livro.query.get(dados['livro_id'])
        
        if not livro:
            return jsonify({
                'sucesso': False,
                'erro': 'Livro não encontrado'
            }), 404
        
        # Verifica se há livros disponíveis
        if livro.quantidade_disponivel <= 0:
            return jsonify({
                'sucesso': False,
                'erro': 'Livro indisponível para empréstimo'
            }), 400
        
        # Cria o novo empréstimo
        novo_emprestimo = Emprestimo(
            nome_usuario=dados['nome_usuario'],
            livro_id=dados['livro_id'],
            status='ativo',
            data_emprestimo=datetime.utcnow().date()
        )
        
        # Decrementa a quantidade disponível do livro
        livro.quantidade_disponivel -= 1
        
        db.session.add(novo_emprestimo)
        db.session.commit()
        
        return jsonify({
            'sucesso': True,
            'dados': novo_emprestimo.para_dicionario(),
            'mensagem': 'Empréstimo realizado com sucesso'
        }), 201
        
    except Exception as erro:
        db.session.rollback()
        return jsonify({
            'sucesso': False,
            'erro': f'Erro ao criar empréstimo: {str(erro)}'
        }), 500


@emprestimos_bp.route('/api/emprestimos/<int:id>', methods=['PUT'])
def atualizar_emprestimo(id):
    """Atualiza um empréstimo existente"""
    try:
        emprestimo = Emprestimo.query.get(id)
        
        if not emprestimo:
            return jsonify({
                'sucesso': False,
                'erro': 'Empréstimo não encontrado'
            }), 404
        
        dados = request.get_json()
        
        if not dados:
            return jsonify({
                'sucesso': False,
                'erro': 'Nenhum dado foi enviado'
            }), 400
        
        status_anterior = emprestimo.status
        
        # Atualiza os campos se fornecidos
        if 'nome_usuario' in dados:
            emprestimo.nome_usuario = dados['nome_usuario']
        
        if 'status' in dados:
            novo_status = dados['status']
            
            # Valida o status
            if novo_status not in ['ativo', 'devolvido']:
                return jsonify({
                    'sucesso': False,
                    'erro': 'Status inválido. Use "ativo" ou "devolvido"'
                }), 400
            
            emprestimo.status = novo_status
            
            # Se mudou de ativo para devolvido, incrementa quantidade disponível
            if status_anterior == 'ativo' and novo_status == 'devolvido':
                livro = Livro.query.get(emprestimo.livro_id)
                if livro:
                    livro.quantidade_disponivel += 1
                    emprestimo.data_devolucao = datetime.utcnow().date()
            
            # Se mudou de devolvido para ativo, decrementa quantidade disponível
            elif status_anterior == 'devolvido' and novo_status == 'ativo':
                livro = Livro.query.get(emprestimo.livro_id)
                if livro:
                    if livro.quantidade_disponivel <= 0:
                        return jsonify({
                            'sucesso': False,
                            'erro': 'Não há exemplares disponíveis para reativar o empréstimo'
                        }), 400
                    livro.quantidade_disponivel -= 1
                    emprestimo.data_devolucao = None
        
        db.session.commit()
        
        return jsonify({
            'sucesso': True,
            'dados': emprestimo.para_dicionario(),
            'mensagem': 'Empréstimo atualizado com sucesso'
        }), 200
        
    except Exception as erro:
        db.session.rollback()
        return jsonify({
            'sucesso': False,
            'erro': f'Erro ao atualizar empréstimo: {str(erro)}'
        }), 500


@emprestimos_bp.route('/api/emprestimos/<int:id>', methods=['DELETE'])
def deletar_emprestimo(id):
    """Deleta um empréstimo"""
    try:
        emprestimo = Emprestimo.query.get(id)
        
        if not emprestimo:
            return jsonify({
                'sucesso': False,
                'erro': 'Empréstimo não encontrado'
            }), 404
        
        # Se o empréstimo está ativo, devolve o livro antes de deletar
        if emprestimo.status == 'ativo':
            livro = Livro.query.get(emprestimo.livro_id)
            if livro:
                livro.quantidade_disponivel += 1
        
        db.session.delete(emprestimo)
        db.session.commit()
        
        return jsonify({
            'sucesso': True,
            'mensagem': 'Empréstimo deletado com sucesso'
        }), 200
        
    except Exception as erro:
        db.session.rollback()
        return jsonify({
            'sucesso': False,
            'erro': f'Erro ao deletar empréstimo: {str(erro)}'
        }), 500