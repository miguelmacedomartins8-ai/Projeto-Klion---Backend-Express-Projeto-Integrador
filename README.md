# Contextualização
## O que o KLion busca resolver.

&emsp;Um levantamento da empresa Acordo Certo mostrou que apenas cerca de 55% dos brasileiros sabem o 
que precisa ser declarado no Imposto de Renda, e aproximadamente 64% sabem quem é obrigado a 
declarar. Esses números indicam que uma parcela significativa da população não domina nem mesmo as 
regras básicas do processo.

&emsp;Atualmente, cerca de 38 milhões de brasileiros entregam a declaração do Imposto de Renda à Receita 
Federal, o que representa pouco mais de um terço da população economicamente ativa. Mesmo entre os 
que declaram, calcular corretamente o imposto devido exige conhecimento sobre alíquotas progressivas, 
deduções e regras específicas. Não declarar, errar no cálculo ou omitir informações pode causar problemas com a Receita Federal, fazendo a pessoa cair na malha fina, gerando multas e juros.

## Como o KLion resolve esse problema?

&emsp;O KLion foi desenvolvido com o propósito de permitir que o usuário não apenas utilize uma ferramenta 
de cálculo, mas que também compreenda a parte conceitual por trás do Imposto de Renda antes de 
colocá-lo em prática. A plataforma integra explicações teóricas sobre alíquotas, faixas de tributação e 
deduções com uma calculadora interativa, possibilitando que o usuário visualize como cada elemento 
influencia no valor final do imposto. Dessa forma, o site promove aprendizado ativo, conectando teoria e 
aplicação prática, e transformando um tema técnico e complexo em uma experiência educativa, clara e 
acessível.

# Como testar o Site:
#### **1ª Etapa:** Clone o repositório, e acesse a pasta "backend"

```bash
git clone https://github.com/miguelmacedomartins8-ai/Projeto-Klion---Backend-Express-Projeto-Integrador
cd backend
```

#### **2ª Etapa:** Instale as dependências do Projeto

```bash
npm install
```

### **3ª Etapa:** Conecte-se ao banco de dados  
Na pasta `backend` abra o arquivo `Banco_Klion.js`.

<sub>backend > Banco_Klion.js</sub>

E altere os campos `sua_senha` para a senha do seu root local.
```javascript
const Sequelize = require('sequelize')
const sequelize = new Sequelize('klion_data', 'root', 'sua_senha', {
    host: "localhost",
    dialect: 'mysql'
})
```
Após isso rode os comandos "CREATE" e o comando do banco de dados `klion_data.sql` na `database`.

<sub>database > klion_data.sql</sub>

> [!WARNING]
> Caso queira rodar no seu próprio `CREATE DATABASE` altere o nome `klion_data` na linha do código de conexão com o banco. **APENAS SE FOR RODAR NO PRÓPRIO DATABASE**

#### **4ª Etapa:** Abra o `MySQL Workbench` e execute o comando `USE klion_data;`

Para a calculadora funcionar será necessário popular a tabela `tabela_aliquota` com o `INSERT` a baixo:

```sql
INSERT INTO tabela_aliquota (faixa, limite_reais, aliquota) VALUES
(1, '24511.92', '0'),
(2, '33919.80', '7.5'),
(3, '45012.60', '15'),
(4, '55976.16', '22.5'),
(5, '999999999', '27.5');
```

#### **5ª Etapa:** Inicie o servidor local

```bash
nodemon app.js
```
Ou

```bash
npm start
```

#### **6ª Etapa:** Acesse no navegador o link da página inicial do site

```
[Página Inicial do KLion](http://localhost:2026/views/login.html)
```

## Tecnologias Utilizadas:
O projeto foi desenvolvido utilizando as seguintes tecnologias:

### Backend
* **Node.js** & **Express** — Estrutura base para a criação da API e gerenciamento de rotas.
* **Sequelize** & **MySQL2** — ORM e driver de conexão para gerenciar o banco de dados relacional (MySQL).
* **JSON Web Token (JWT)** — Implementação de autenticação e geração de tokens de segurança.
* **Bcrypt** — Criptografia de senhas para armazenamento seguro no banco de dados.
* **Nodemailer** — Ferramenta para envio automático de e-mails através da aplicação.
* **CORS** — Configuração de segurança para permitir que o frontend acesse a API.
* **Nodemon** — Atualização automática do servidor local durante o desenvolvimento.

### Frontend
* **JavaScript (ES6+)** — Lógica principal e interatividade do site.
* **HTML5** — Estruturação do conteúdo das páginas.
* **CSS3** — Estilização, layout e design responsivo.

### Integrantes:
* Rafael Silva Machado - Documentação
* Gabriel Povidaiko Suto de Morais - FrontEnd
* Miguel Macedo Martins - BackEnd
* André Joaquim Santana da Silva - Banco de Dados

<p align="center">
  <sub>
    &copy; 2026 - KLion, Seu imposto de Renda, Simples e Seguro.
    <a href="#"><img src="./frontend/image/logo-aba.png" width="22" align="center" alt="Logomarca do Projeto Klion"></a>
  </sub>
git push</p>