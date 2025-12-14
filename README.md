# Sistema de Gerenciamento de Biblioteca

[Biblioteca MVP]

## Sobre o Projeto

Sistema completo de gerenciamento de biblioteca desenvolvido como MVP, permitindo o cadastro de livros e controle de empréstimos. O projeto demonstra a construção de uma aplicação full-stack com separação clara entre Backend (API RESTful) e Frontend (aplicação web).

### Tema

**Biblioteca Digital**: Controle de acervo de livros e gerenciamento de empréstimos para usuários.

---

## Tecnologias Utilizadas

### Backend
- **Python 3.14
- **Flask**
- **Flask-SQLAlchemy** 
- **Flask-CORS** 
- **MySQL** 
- **PyMySQL** 

### Frontend
- **HTML5** - Estrutura
- **CSS3** - Estilização
- **JavaScript (Vanilla)** - Lógica e consumo da API

---

## Estrutura do Projeto

\`\`\`
bibliotecamvp/
│
├── backend/                    # API RESTful em Python/Flask
│   ├── app.py                 # Arquivo principal da aplicação
│   ├── config.py              # Configurações do banco de dados
│   ├── models.py              # Modelos de dados (Livro e Emprestimo)
│   ├── requirements.txt       # Dependências Python
│   └── routes/                # Rotas da API
│       ├── __init__.py
│       ├── livros.py          # Endpoints de livros
│       └── emprestimos.py     # Endpoints de empréstimos
│
└── frontend/                   # Cliente web
    ├── index.html             # Página inicial (dashboard)
    ├── livros.html            # Gerenciamento de livros
    ├── emprestimos.html       # Gerenciamento de empréstimos
    ├── css/
    │   └── estilos.css        # Estilos da aplicação
    └── js/
        ├── api.js             # Camada de comunicação com API
        ├── inicio.js          # Lógica da página inicial
        ├── livros.js          # Lógica de gerenciamento de livros
        └── emprestimos.js     # Lógica de gerenciamento de empréstimos
\`\`\`

---

## Banco de Dados

### Modelagem

O sistema possui duas tabelas principais com relacionamento **1:N** (um para muitos):

#### Tabela: `livros`
\`\`\`sql
- id (PK, INT, AUTO_INCREMENT)
- titulo (VARCHAR 200, NOT NULL)
- autor (VARCHAR 200, NOT NULL)
- ano_publicacao (INT, NOT NULL)
- quantidade_total (INT, NOT NULL)
- quantidade_disponivel (INT, NOT NULL)
\`\`\`

#### Tabela: `emprestimos`
\`\`\`sql
- id (PK, INT, AUTO_INCREMENT)
- nome_usuario (VARCHAR 200, NOT NULL)
- livro_id (FK, INT, NOT NULL) -> livros.id
- status (VARCHAR 50, NOT NULL) ['ativo', 'devolvido']
- data_emprestimo (DATE, NOT NULL)
- data_devolucao (DATE, NULLABLE)
\`\`\`

**Relacionamento**: Um livro pode ter vários empréstimos (1:N)

---

## Como Rodar o Projeto

### Pré-requisitos

- Python 3.8 ou superior
- MySQL Server 5.7 ou superior
- Navegador web moderno

### 1. Configurar o Banco de Dados

\`\`\`bash
# Acessar o MySQL
mysql -u root -p

# Criar o banco de dados
CREATE DATABASE biblioteca_db;
EXIT;
\`\`\`

### 2. Rodar o Backend

\`\`\`bash
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
\`\`\`

O backend estará rodando em: **http://localhost:5000**

### 3. Rodar o Frontend

\`\`\`bash
# Opção 1: Abrir diretamente os arquivos HTML no navegador
# Navegue até a pasta frontend/ e abra o arquivo index.html

# Opção 2: Usar servidor HTTP simples (recomendado)
# No diretório raiz do projeto:
cd frontend

# Python 3:
python -m http.server 8080

# OU usar Node.js (se tiver instalado):
npx http-server -p 8080
\`\`\`

O frontend estará rodando em: **http://localhost:8080**

---

## API Endpoints

### Livros

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/api/livros` | Lista todos os livros |
| GET | `/api/livros/<id>` | Busca um livro específico |
| POST | `/api/livros` | Cria um novo livro |
| PUT | `/api/livros/<id>` | Atualiza um livro |
| DELETE | `/api/livros/<id>` | Deleta um livro |

### Empréstimos

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/api/emprestimos` | Lista todos os empréstimos |
| GET | `/api/emprestimos/<id>` | Busca um empréstimo específico |
| POST | `/api/emprestimos` | Cria um novo empréstimo |
| PUT | `/api/emprestimos/<id>` | Atualiza um empréstimo (devolução) |
| DELETE | `/api/emprestimos/<id>` | Deleta um empréstimo |

### Status Codes Utilizados

- **200** - Sucesso (GET, PUT, DELETE)
- **201** - Criado com sucesso (POST)
- **400** - Erro de validação ou requisição inválida
- **404** - Recurso não encontrado
- **500** - Erro interno do servidor

---

## Funcionalidades

### Gerenciamento de Livros
- Cadastrar novos livros com título, autor, ano e quantidades
- Listar todos os livros do acervo
- Editar informações de livros existentes
- Excluir livros (apenas se não houver empréstimos ativos)
- Visualizar quantidades total e disponível

### Gerenciamento de Empréstimos
- Realizar novos empréstimos (apenas livros disponíveis)
- Listar todos os empréstimos
- Filtrar empréstimos por status (ativos/devolvidos/todos)
- Registrar devolução de livros
- Excluir registros de empréstimos
- Controle automático de quantidade disponível

### Dashboard
- Estatísticas gerais do sistema
- Total de livros no acervo
- Total de empréstimos realizados
- Empréstimos ativos
- Navegação intuitiva

---

## Capturas de Tela

### Página Inicial (Dashboard)
![Dashboard](https://via.placeholder.com/800x500/2563eb/ffffff?text=Dashboard+com+Estatisticas)

*Dashboard mostrando estatísticas gerais do sistema: total de livros, empréstimos realizados e empréstimos ativos.*

---

### Gerenciamento de Livros
![Livros](https://via.placeholder.com/800x500/2563eb/ffffff?text=Gerenciamento+de+Livros)

*Tela de gerenciamento completo de livros com tabela listando todos os livros cadastrados, botões de ação (editar/excluir) e modal para adicionar/editar livros.*

---

### Gerenciamento de Empréstimos
![Empréstimos](https://via.placeholder.com/800x500/2563eb/ffffff?text=Gerenciamento+de+Emprestimos)

*Tela de controle de empréstimos com filtros por status, opções de devolução e histórico completo de empréstimos realizados.*

---

## Diferenciais Implementados

- **Validações Completas**: Backend valida todos os dados recebidos
- **Feedback Visual**: Interface reage a todas as ações do usuário
- **Controle de Estoque**: Atualização automática de quantidades
- **Status Codes Corretos**: API retorna códigos HTTP apropriados
- **Design Responsivo**: Interface adaptável a diferentes telas
- **Código Limpo**: Variáveis e comentários em português
- **Mensagens de Erro**: Tratamento adequado de exceções
- **Relacionamento Cascata**: Integridade referencial no banco

---

## Requisitos Atendidos

- ✅ Banco de dados relacional (MySQL)
- ✅ Relacionamento 1:N entre tabelas (Livro → Empréstimos)
- ✅ API RESTful em Python/Flask
- ✅ CRUD completo para Livros e Empréstimos
- ✅ Uso correto dos métodos HTTP (GET, POST, PUT, DELETE)
- ✅ Status codes apropriados (200, 201, 400, 404, 500)
- ✅ Respostas em formato JSON
- ✅ Frontend consumindo API real (sem dados mockados)
- ✅ Feedback ao usuário (mensagens de sucesso/erro)
- ✅ Interface completa para CRUD via API
- ✅ README completo com instruções
- ✅ Código organizado e limpo

---

## Autor

Pettrius Vilas Boas De Paiva Cardoso

Desenvolvido como projeto de avaliação técnica para vaga de Estagiário.

---


## Planejamento do projeto

https://www.notion.so/Prova-Estagi-rio-Desenvolvimento-API-Client-1e29b9448bfc806582a8c8d8fd9cc189?source=copy_link

---


## Licença

Este projeto foi desenvolvido para fins educacionais e de avaliação técnica.
