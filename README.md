# Gerador de Cartazes Promocionais

Sistema para criar cartazes de promoção prontos para impressão, usado no supermercado onde
trabalho. A partir dos dados de produto e preço — digitados um a um ou importados de uma
planilha — o sistema gera um PDF em A4 pronto para imprimir, reduzindo o tempo e os erros
do processo manual.

## Funcionalidades

- **Cartaz grande (A4)** — um produto por página.
- **Cartaz pequeno (A5)** — dois produtos por página.
- **Cartaz combo** — oferta do tipo "N unidades por R$ 10,00".
- **Entrada individual** — formulário para um cartaz de cada vez.
- **Importação de planilha** — `.xlsx`/`.xls` para gerar vários cartazes de uma vez
  (até 200 por envio), com validação de cabeçalhos e de linhas incompletas.

## Tecnologias

- **Front-end:** React 18, Vite, Tailwind CSS, React Hook Form, Radix Tabs, Framer Motion, SheetJS
- **Back-end:** Node.js, Express, TypeScript, pdfmake

## Estrutura

```
backend/          API Express que monta e serve os PDFs
  src/
    controllers/  validação do payload e resposta HTTP
    services/     montagem do PDF (layout, textos, geração)
    utils/        criação de diretório, limpeza de PDFs, fontes
front-end/        SPA React
  src/
    components/   UI e formulários de cartaz
    hooks/        leitura de planilha e ciclo de geração
    services/     cliente HTTP e parser de planilha
```

## Como rodar

Pré-requisitos: Node.js 18+ e Yarn.

### Back-end

```bash
cd backend && yarn install && cp .env.example .env && yarn dev
```

Sobe em `http://localhost:3333`.

### Front-end

```bash
cd front-end && yarn install && cp .env.example .env && yarn start
```

Sobe em `http://localhost:5173`. Ajuste `VITE_API_URL` no `.env` para apontar à API local.

## Variáveis de ambiente

### `backend/.env`

| Variável | Descrição |
|---|---|
| `PORT` | Porta do servidor (padrão `3333`) |
| `CORS_ORIGIN` | Origens liberadas, separadas por vírgula. **Se ficar vazio, todas as origens são aceitas** — defina em produção |

### `front-end/.env`

| Variável | Descrição |
|---|---|
| `VITE_API_URL` | URL base da API, incluindo o sufixo `/api` |

## Scripts

| Comando | Onde | O que faz |
|---|---|---|
| `yarn dev` | backend | Servidor com recarga automática |
| `yarn build` | backend | Compila TypeScript para `dist/` |
| `yarn start` | backend | Roda a versão compilada |
| `yarn start` | front-end | Servidor de desenvolvimento do Vite |
| `yarn build` | front-end | Build de produção |
| `yarn lint` | front-end | ESLint |

## API

Todas as rotas recebem `POST` com corpo `{ "sheet": [...] }` e devolvem
`{ status, message, download }`, onde `download` é a URL do PDF gerado.

| Rota | Campos obrigatórios de cada item |
|---|---|
| `POST /api/posters/big` | `produto`, `preco`, `medida` (opcional: `limite`) |
| `POST /api/posters/small` | `produto`, `preco`, `medida` (opcional: `limite`) |
| `POST /api/posters/combo` | `produto`, `medida`, `comboQtd` (opcional: `comboVlr`) |

Limites: 20 requisições por minuto por IP, 200 itens por requisição e corpo de até 1 MB.
Os PDFs gerados ficam disponíveis em `/pdfs/<arquivo>` e são apagados após 1 hora.

## Modelos de planilha

O próprio sistema oferece os modelos para download, em "Dúvidas quanto ao modelo da
planilha? Veja aqui". Os cabeçalhos são reconhecidos sem diferenciar maiúsculas,
minúsculas ou espaços em volta.

| Tipo | Colunas |
|---|---|
| Padrão | `produto`, `preco`, `medida`, `limite` (opcional) |
| Combo | `produto`, `medida`, `comboVlr`, `comboQtd` |

## Documentos

- [CORRECOES.md](CORRECOES.md) — correções de bugs e de segurança
- [QUALIDADE.md](QUALIDADE.md) — refatorações de qualidade de código
