# labook-template
Repositório do projeto Labook
<h1 align="center"><img src="https://readme-typing-svg.demolab.com?font=Exo+2&weight=700&size=43&duration=3000&pause=600&color=1E90FF&width=600&height=130&lines=LABOOK;Projeto+Feito+com+TypeScript%2C;MySQL%2C+ NodeJS%2C+ ExpressJS%2C;+ Cors%2C+Dotenv%2C+Bcrypt%2C+JWT+Hash ."/></h1>

---
##  🕵Sobre
O labook veio para ser mais uma rede social com o objetivo de promover a conexão e interação entre seus mais diversos usuários. Os usuários podem criar posts de dois tipos ("evento" ou "normal"), comentá-los e curti-los também.

Desenvolvido com arquitetura de softwere 3 camadas, arquitetura limpa, autenticação e criptografia de senhas! 
---
##  Biblioteca ultilizadas
 - 🌀 uuid 
 - 🌀 jwt hash
 - 🌀 bcrypt
---
## 📖 Documentação 

<a href="https://documenter.getpostman.com/view/22376175/2s935oM4Wt" target="_blank">Documentação no Postman</a>

---
## 📚 Deploy no Render
"https://api-labook-7.onrender.com"


---
## 🚧 Requisitos do Projeto

- 🌀 Cadastrar Usuário (Com Criptografia e autenticação);
- 🌀 Criar posts;
- 🌀 Fazer amizade (Com autenticação);
- 🌀 Desfazer amizade  (Com autenticação);
- 🌀 Ver todo o Feed
- 🌀 Ver feed só de amigos (Com  autenticação);
- 🌀 Buscar um post específico por id 
- 🌀 Ver lista de amigos (Com  autenticação);
- 🌀 Ver todos usuarios
- 🌀 Login (Com Criptografia e autenticação);



---
## ⚙️ Rodando o Projeto

```bash
# Para rodar o repositório é necessário clona-lo:

- git clone https://github.com/future4code/Barros-labook7.git

# Instalação de dependências:

- npm install

# Após instaladas as dependências, configure o arquivo .env:

* - DB_HOST = 
* - DB_USER = 
* - DB_PASSWORD = 
* - DB_SCHEMA = 
* - JWT_KEY = 
* - BCRYPT_COST = 

# Agora dê o comando seguinte para rodar o migration:

- npm run migrations

# Após o migration, dê o comando seguinte para rodar a aplicação:

- npm run dev ou start
```
