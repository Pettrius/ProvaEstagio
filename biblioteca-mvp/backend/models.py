from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

# Instância do SQLAlchemy
db = SQLAlchemy()

class Livro(db.Model):
    """Modelo para a tabela de livros"""
    
    __tablename__ = 'livros'
    
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    autor = db.Column(db.String(200), nullable=False)
    titulo = db.Column(db.String(200), nullable=False)
    ano_publicacao = db.Column(db.Integer, nullable=False)
    quantidade_total = db.Column(db.Integer, nullable=False, default=0)
    quantidade_disponivel = db.Column(db.Integer, nullable=False, default=0)
    
    # Relacionamento 1:N - Um livro pode ter vários empréstimos
    emprestimos = db.relationship('Emprestimo', backref='livro', lazy=True, cascade='all, delete-orphan')
    
    def __repr__(self):
        return f'<Livro {self.titulo}>'
    
    def para_dicionario(self):
        """Converte o objeto Livro para dicionário (JSON)"""
        return {
            'id': self.id,
            'autor': self.autor,
            'titulo': self.titulo,
            'ano_publicacao': self.ano_publicacao,
            'quantidade_total': self.quantidade_total,
            'quantidade_disponivel': self.quantidade_disponivel
        }


class Emprestimo(db.Model):
    """Modelo para a tabela de empréstimos"""
    
    __tablename__ = 'emprestimos'
    
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    nome_usuario = db.Column(db.String(200), nullable=False)
    livro_id = db.Column(db.Integer, db.ForeignKey('livros.id'), nullable=False)
    status = db.Column(db.String(50), nullable=False, default='ativo')  # 'ativo' ou 'devolvido'
    data_emprestimo = db.Column(db.Date, nullable=False, default=datetime.utcnow)
    data_devolucao = db.Column(db.Date, nullable=True)
    
    def __repr__(self):
        return f'<Emprestimo {self.id} - {self.nome_usuario}>'
    
    def para_dicionario(self):
        """Converte o objeto Emprestimo para dicionário (JSON)"""
        return {
            'id': self.id,
            'nome_usuario': self.nome_usuario,
            'livro_id': self.livro_id,
            'titulo_livro': self.livro.titulo if self.livro else None,
            'status': self.status,
            'data_emprestimo': self.data_emprestimo.strftime('%Y-%m-%d') if self.data_emprestimo else None,
            'data_devolucao': self.data_devolucao.strftime('%Y-%m-%d') if self.data_devolucao else None
        }