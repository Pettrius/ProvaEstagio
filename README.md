# Sistema de Gerenciamento de Biblioteca

[Biblioteca MVP]

# Sobre o Projeto

Sistema completo de gerenciamento de biblioteca desenvolvido como MVP, permitindo o cadastro de livros e controle de empréstimos. O projeto demonstra a construção de uma aplicação full-stack com separação clara entre Backend (API RESTful) e Frontend (aplicação web).

# Tema

Biblioteca Digital: Controle de acervo de livros e gerenciamento de empréstimos para usuários.

---

# Como Rodar o Projeto

# Pré-requisitos

- Python 3.8 ou superior
- MySQL Server 5.7 ou superior
- Navegador web moderno

# 1. Configurar o Banco de Dados

\bash
# Acessar o MySQL
mysql -u root -p

# Criar o banco de dados
CREATE DATABASE biblioteca_db;
EXIT;

# 2. Rodar o Backend

\bash
# Navegar até a pasta do backend
cd backend

# Criar ambiente virtual (recomendado)
python -m venv venv

# Ativar ambiente virtual
# No Windows:
venv\Scripts\activate

# No Linux/Mac:
source venv/bin/activate

# Instalar dependências
pip install -r requirements.txt

# Criar arquivo .env na pasta backend (opcional)
# Adicione suas credenciais do MySQL:
DB_USER=root
DB_PASSWORD=sua_senha
DB_HOST=localhost
DB_PORT=3306
DB_NAME=biblioteca_db

# Rodar o servidor
python app.py

\bash

O backend estará rodando em: http://localhost:5000

---

# 3. Rodar o Frontend

# Abrir diretamente os arquivos HTML no navegador
# Navegue até a pasta frontend/ e abra o arquivo index.html

---

# Capturas de Tela
Ainda em desenvolvimento...

---

# Autor

Pettrius Vilas Boas De Paiva Cardoso

Desenvolvido como projeto de avaliação técnica para vaga de Estagiário.

---

# Planejamento do projeto

https://www.notion.so/Prova-Estagi-rio-Desenvolvimento-API-Client-1e29b9448bfc806582a8c8d8fd9cc189?source=copy_link

---

# Licença

Este projeto foi desenvolvido para fins educacionais e de avaliação técnica.
