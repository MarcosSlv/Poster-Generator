# Sistema de Cartazes Promocionais

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
- **Assistente de formatação** — cole a lista de ofertas como ela chega ("CAFÉ PILÃO 500G
  R$ 20,99") e receba as linhas prontas. O assistente identifica sozinho o que é promoção
  normal e o que é combo, normaliza a medida para `UN`/`KG`, tira o `R$` do preço e devolve
  cada bloco na ordem de colunas do arquivo modelo. Cada bloco pode ser copiado como texto,
  para colar na planilha, ou baixado como `.xlsx` já preenchido, pronto para subir na
  importação de planilha.

## Tecnologias

- **Front-end:** React 18, Vite, Tailwind CSS, React Hook Form, Radix Tabs, Framer Motion,
  xlsx-js-style (fork do SheetJS que escreve estilo de célula)
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
| `GEMINI_API_KEY` | Chave do [Google AI Studio](https://aistudio.google.com/apikey) usada pelo assistente. Sem ela a rota do assistente responde `503` e o resto segue funcionando |
| `GEMINI_MODEL` | Modelo do assistente (padrão `gemini-flash-lite-latest`, alias que acompanha a versão estável mais nova) |

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

### Cartazes

Recebem `POST` com corpo `{ "sheet": [...] }` e devolvem `{ status, message, download }`,
onde `download` é a URL do PDF gerado.

| Rota | Campos obrigatórios de cada item |
|---|---|
| `POST /api/posters/big` | `produto`, `preco`, `medida` (opcional: `limite`) |
| `POST /api/posters/small` | `produto`, `preco`, `medida` (opcional: `limite`) |
| `POST /api/posters/combo` | `produto`, `medida`, `comboQtd` (opcional: `comboVlr`) |

### Assistente

| Rota | Corpo | Resposta |
|---|---|---|
| `POST /api/assistant/format` | `{ "texto": "..." }` (até 5000 caracteres) | `{ status, blocos, avisos }` |

Cada bloco traz `tipo` (`promocional` ou `combo`) e `linhas` já no formato aceito pelas rotas
de cartaz. Linhas com campo obrigatório faltando são descartadas e viram `avisos`.

Limites: 20 requisições por minuto por IP no geral e **5 por minuto na rota do assistente**,
200 itens por requisição e corpo de até 1 MB. Os PDFs gerados ficam disponíveis em
`/pdfs/<arquivo>` e são apagados após 1 hora.

## Modelos de planilha

O próprio sistema oferece os modelos para download, em "Dúvidas quanto ao modelo da
planilha? Veja aqui". Os cabeçalhos são reconhecidos sem diferenciar maiúsculas,
minúsculas ou espaços em volta.

| Tipo | Colunas, na ordem do arquivo |
|---|---|
| Padrão | `Produto`, `Medida`, `Preco`, `Limite` (opcional) |
| Combo | `Produto`, `Medida`, `Combovlr`, `Comboqtd` |

`Medida` é `UN` ou `KG` — a gramatura do produto fica no nome, não nesta coluna. `Preco` e
`Combovlr` levam só o número (`13,99`), sem `R$`. No combo, `Comboqtd` × `Combovlr` fecha em
R$ 10,00, que é o valor impresso no cartaz.
