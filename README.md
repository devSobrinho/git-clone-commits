# Git Clone Commits CLI

## Descrição

**Git Clone Commits CLI** é uma ferramenta de linha de comando (CLI) desenvolvida em TypeScript para clonar commits de um repositório Git com base em critérios específicos. Ela permite que o usuário crie um novo repositório com commits filtrados, de acordo com autores, datas e outras configurações.

## Estrutura de Pastas

A estrutura de pastas do projeto foi organizada para modularizar a funcionalidade da aplicação, separando comandos, containers, interfaces, serviços e utilitários. Abaixo está uma visão geral:

```plaintext
src/
├── cli/                    # Define a CLI principal e suas ações
│   ├── actions/            # Contém ações que a CLI pode executar
│   │   └── clone-commits-action.ts
│   ├── questions/          # Contém as perguntas interativas da CLI
│   │   └── clone-commits-question.ts
│   └── cli.ts              # Configuração e definição de comandos da CLI
├── commands/               # Comandos individuais para operações Git específicas
├── constants/              # Constantes globais usadas na aplicação
├── containers/             # Containers para gerenciar dependências, como o GitContainer
├── interfaces/             # Interfaces que definem tipos e contratos de dados
├── invokers/               # Invokers para gerenciar a execução de múltiplos comandos
├── models/                 # Modelos e contratos de comandos
├── repositories/           # Classes de acesso e manipulação de dados dos repositórios Git
├── services/               # Lógica de negócios principal para operações com Git
└── utils/                  # Utilitários e funções auxiliares
```

## Funcionalidade Principal

A funcionalidade principal desta CLI é clonar um repositório Git, aplicando filtros de acordo com autores, datas e outras configurações definidas pelo usuário durante a execução.

### Comando Principal

O comando principal é `clone-commits`, que inicia a execução do processo interativo para configurar e clonar o repositório com os filtros desejados.

```bash
git-clone commits
```

### Exemplo de Uso

```bash
git-clone commits
```

Este comando iniciará a CLI e fará uma série de perguntas interativas para configurar a clonagem do repositório.

### Perguntas Interativas e Possíveis Respostas

Abaixo está uma lista de perguntas que a CLI fará durante a execução do comando, com exemplos de respostas em português e inglês.

1. **Seleção de Idioma**

   - **Pergunta**:
     - Português: `Selecione o idioma da aplicação`
     - Inglês: `Select the application language`
   - **Opções**: `pt-Br`, `en-Us`
   - **Resposta Exemplo**: `en-Us`

2. **Caminho do Repositório para Clonar**

   - **Pergunta**:
     - Português: `Informe o caminho do repositório`
     - Inglês: `Inform the repository path`
   - **Resposta Exemplo**: `/caminho/para/o/repositorio` ou `/path/to/repository`

3. **Filtragem por Datas**

   - **Pergunta**:
     - Português: `Deseja selecionar data para filtrar commits?`
     - Inglês: `Do you want to select date to filter commits?`
   - **Resposta Exemplo**: `Sim` ou `Yes`

   - **Pergunta para Data de Início**:
     - Português: `Definir data inicial para filtrar commits`
     - Inglês: `Set start date to filter commits`
   - **Resposta Exemplo**: `2023-01-01`

   - **Pergunta para Data de Fim**:
     - Português: `Definir data final para filtrar commits`
     - Inglês: `Set end date to filter commits`
   - **Resposta Exemplo**: `2023-12-31`

4. **Filtragem por Autores**

   - **Pergunta**:
     - Português: `Deseja selecionar autores para filtrar commits?`
     - Inglês: `Do you want to select authors to filter commits?`
   - **Resposta Exemplo**: `Sim` ou `Yes`

   - **Pergunta de Seleção de Autores**:
     - Português: `Definir autores para filtrar commits`
     - Inglês: `Set authors to filter commits`
   - **Resposta Exemplo**: `John Doe, Jane Smith` (Selecionados da lista)

5. **Remover Mensagem do Commit**

   - **Pergunta**:
     - Português: `Deseja remover a mensagem do commit?`
     - Inglês: `Do you want to remove the commit message?`
   - **Resposta Exemplo**: `Sim` ou `Yes`

6. **Geração de Arquivos**
   - **Pergunta**:
     - Português: `Deseja gerar arquivos?`
     - Inglês: `Do you want to generate files?`
   - **Resposta Exemplo**: `Sim` ou `Yes`

### Exemplo Completo de Fluxo Interativo

1. Inicie a CLI com o comando:

   ```bash
   git-clone-commits clone-commits
   ```

2. A CLI faz as perguntas e o usuário responde:

   - **Selecione o idioma da aplicação / Select the application language**: `en-Us`
   - **Informe o caminho do repositório / Inform the repository path**: `/home/user/my-repo`
   - **Deseja selecionar data para filtrar commits? / Do you want to select date to filter commits?**: `Sim` / `Yes`
   - **Definir data inicial para filtrar commits / Set start date to filter commits**: `2023-01-01`
   - **Definir data final para filtrar commits / Set end date to filter commits**: `2023-12-31`
   - **Deseja selecionar autores para filtrar commits? / Do you want to select authors to filter commits?**: `Sim` / `Yes`
   - **Definir autores para filtrar commits / Set authors to filter commits**: `John Doe, Jane Smith`
   - **Deseja remover a mensagem do commit? / Do you want to remove the commit message?**: `Sim` / `Yes`
   - **Deseja gerar arquivos? / Do you want to generate files?**: `Sim` / `Yes`

3. Com as respostas, a CLI processa e cria o repositório clonado com os commits filtrados.

## Tecnologias Utilizadas

- **Node.js**: Ambiente de execução para a CLI.
- **TypeScript**: Linguagem usada para garantir tipagem e estruturação do código.
- **Commander.js**: Biblioteca para criar a CLI e gerenciar comandos e opções.
- **Inquirer.js**: Utilizada para perguntas interativas, facilitando a configuração dos filtros pelos usuários.
- **Lodash**: Utilizada para manipulação de dados, como remoção de duplicatas.

## Instalação e Execução

1. Clone o repositório e navegue até o diretório do projeto:

   ```bash
   git clone <url-do-repositorio>
   cd auto-exec
   ```

2. Instale as dependências:

   ```bash
   npm install
   ```

3. Execute a CLI:
   ```bash
   node src/cli/cli.ts clone-commits
   ```

Para tornar o comando executável globalmente, você pode configurar o binário no `package.json` e instalar o pacote globalmente usando `npm link`.

## Contribuição

Contribuições são bem-vindas! Sinta-se à vontade para abrir issues ou pull requests com melhorias ou correções.

## Licença

Este projeto é licenciado sob a licença MIT. Consulte o arquivo `LICENSE` para mais detalhes.
