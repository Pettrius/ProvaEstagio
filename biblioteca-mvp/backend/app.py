from flask import Flask, jsonify
from flask_cors import CORS
from config import Config
from models import db

# Importa os blueprints das rotas
from routes.livros import livros_bp
from routes.emprestimos import emprestimos_bp

def criar_app():
    """Função factory para criar e configurar a aplicação Flask"""
    
    # Cria a instância do Flask
    app = Flask(__name__)
    
    # Carrega as configurações
    app.config.from_object(Config)
    
    # Habilita CORS para permitir requisições do frontend
    CORS(app)
    
    # Inicializa o banco de dados com a aplicação
    db.init_app(app)
    
    # Registra os blueprints (rotas)
    app.register_blueprint(livros_bp)
    app.register_blueprint(emprestimos_bp)
    
    # Rota raiz para testar se a API está funcionando
    @app.route('/')
    def index():
        return jsonify({
            'mensagem': 'API da Biblioteca está funcionando!',
            'endpoints': {
                'livros': '/api/livros',
                'emprestimos': '/api/emprestimos'
            }
        }), 200
    
    # Rota para verificar status da API
    @app.route('/api/status')
    def status():
        return jsonify({
            'status': 'online',
            'mensagem': 'API funcionando corretamente'
        }), 200
    
    # Cria as tabelas no banco de dados (se não existirem)
    with app.app_context():
        db.create_all()
        print("✅ Banco de dados inicializado com sucesso!")
    
    return app


if __name__ == '__main__':
    app = criar_app()
    print("🚀 Iniciando servidor Flask...")
    print("📚 API da Biblioteca rodando em: http://localhost:5000")
    print("📖 Endpoints disponíveis:")
    print("   - GET    /api/livros")
    print("   - POST   /api/livros")
    print("   - GET    /api/livros/<id>")
    print("   - PUT    /api/livros/<id>")
    print("   - DELETE /api/livros/<id>")
    print("   - GET    /api/emprestimos")
    print("   - POST   /api/emprestimos")
    print("   - GET    /api/emprestimos/<id>")
    print("   - PUT    /api/emprestimos/<id>")
    print("   - DELETE /api/emprestimos/<id>")
    print("="*50)
    
    app.run(debug=True, host='0.0.0.0', port=5000)