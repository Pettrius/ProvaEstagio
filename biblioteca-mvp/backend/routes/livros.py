from flask import Blueprint, request, jsonify
from models import db, Livro, Emprestimo

# Blueprint para rotas de livros
livros_bp = Blueprint('livros', __name__)

@livros_bp.route('/api/livros', methods=['GET'])
def listar_livros():
    """Lista todos os livros cadastrados"""
    try:
        livros = Livro.query.all()
        return jsonify({
            'sucesso': True,
            'dados': [livro.para_dicionario() for livro in livros],
            'total': len(livros)
        }), 200
    except Exception as erro:
        return jsonify({
            'sucesso': False,
            'erro': f'Erro ao listar livros: {str(erro)}'
        }), 500


@livros_bp.route('/api/livros/<int:id>', methods=['GET'])
def buscar_livro(id):
    """Busca um livro específico pelo ID"""
    try:
        livro = Livro.query.get(id)
        
        if not livro:
            return jsonify({
                'sucesso': False,
                'erro': 'Livro não encontrado'
            }), 404
        
        return jsonify({
            'sucesso': True,
            'dados': livro.para_dicionario()
        }), 200
    except Exception as erro:
        return jsonify({
            'sucesso': False,
            'erro': f'Erro ao buscar livro: {str(erro)}'
        }), 500


@livros_bp.route('/api/livros', methods=['POST'])
def criar_livro():
    """Cria um novo livro"""
    try:
        dados = request.get_json()
        
        # Validações
        if not dados:
            return jsonify({
                'sucesso': False,
                'erro': 'Nenhum dado foi enviado'
            }), 400
        
        if not dados.get('titulo'):
            return jsonify({
                'sucesso': False,
                'erro': 'O campo "titulo" é obrigatório'
            }), 400
        
        if not dados.get('autor'):
            return jsonify({
                'sucesso': False,
                'erro': 'O campo "autor" é obrigatório'
            }), 400
        
        if not dados.get('ano_publicacao'):
            return jsonify({
                'sucesso': False,
                'erro': 'O campo "ano_publicacao" é obrigatório'
            }), 400
        
        quantidade_total = dados.get('quantidade_total', 0)
        quantidade_disponivel = dados.get('quantidade_disponivel', quantidade_total)
        
        # Validação de quantidades
        if quantidade_total < 0:
            return jsonify({
                'sucesso': False,
                'erro': 'A quantidade total não pode ser negativa'
            }), 400
        
        if quantidade_disponivel > quantidade_total:
            return jsonify({
                'sucesso': False,
                'erro': 'A quantidade disponível não pode ser maior que a quantidade total'
            }), 400
        
        # Cria o novo livro
        novo_livro = Livro(
            titulo=dados['titulo'],
            autor=dados['autor'],
            ano_publicacao=dados['ano_publicacao'],
            quantidade_total=quantidade_total,
            quantidade_disponivel=quantidade_disponivel
        )
        
        db.session.add(novo_livro)
        db.session.commit()
        
        return jsonify({
            'sucesso': True,
            'dados': novo_livro.para_dicionario(),
            'mensagem': 'Livro cadastrado com sucesso'
        }), 201
        
    except Exception as erro:
        db.session.rollback()
        return jsonify({
            'sucesso': False,
            'erro': f'Erro ao criar livro: {str(erro)}'
        }), 500


@livros_bp.route('/api/livros/<int:id>', methods=['PUT'])
def atualizar_livro(id):
    """Atualiza um livro existente"""
    try:
        livro = Livro.query.get(id)
        
        if not livro:
            return jsonify({
                'sucesso': False,
                'erro': 'Livro não encontrado'
            }), 404
        
        dados = request.get_json()
        
        if not dados:
            return jsonify({
                'sucesso': False,
                'erro': 'Nenhum dado foi enviado'
            }), 400
        
        # Atualiza os campos se fornecidos
        if 'titulo' in dados:
            livro.titulo = dados['titulo']
        
        if 'autor' in dados:
            livro.autor = dados['autor']
        
        if 'ano_publicacao' in dados:
            livro.ano_publicacao = dados['ano_publicacao']
        
        if 'quantidade_total' in dados:
            nova_quantidade_total = dados['quantidade_total']
            
            if nova_quantidade_total < 0:
                return jsonify({
                    'sucesso': False,
                    'erro': 'A quantidade total não pode ser negativa'
                }), 400
            
            livro.quantidade_total = nova_quantidade_total
        
        if 'quantidade_disponivel' in dados:
            nova_quantidade_disponivel = dados['quantidade_disponivel']
            
            if nova_quantidade_disponivel > livro.quantidade_total:
                return jsonify({
                    'sucesso': False,
                    'erro': 'A quantidade disponível não pode ser maior que a quantidade total'
                }), 400
            
            livro.quantidade_disponivel = nova_quantidade_disponivel
        
        db.session.commit()
        
        return jsonify({
            'sucesso': True,
            'dados': livro.para_dicionario(),
            'mensagem': 'Livro atualizado com sucesso'
        }), 200
        
    except Exception as erro:
        db.session.rollback()
        return jsonify({
            'sucesso': False,
            'erro': f'Erro ao atualizar livro: {str(erro)}'
        }), 500


@livros_bp.route('/api/livros/<int:id>', methods=['DELETE'])
def deletar_livro(id):
    """Deleta um livro"""
    try:
        livro = Livro.query.get(id)
        
        if not livro:
            return jsonify({
                'sucesso': False,
                'erro': 'Livro não encontrado'
            }), 404
        
        # Verifica se existem empréstimos ativos
        emprestimos_ativos = Emprestimo.query.filter_by(
            livro_id=id,
            status='ativo'
        ).count()
        
        if emprestimos_ativos > 0:
            return jsonify({
                'sucesso': False,
                'erro': f'Não é possível deletar o livro. Existem {emprestimos_ativos} empréstimo(s) ativo(s)'
            }), 400
        
        db.session.delete(livro)
        db.session.commit()
        
        return jsonify({
            'sucesso': True,
            'mensagem': 'Livro deletado com sucesso'
        }), 200
        
    except Exception as erro:
        db.session.rollback()
        return jsonify({
            'sucesso': False,
            'erro': f'Erro ao deletar livro: {str(erro)}'
        }), 500