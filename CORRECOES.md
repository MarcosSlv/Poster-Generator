# Correções aplicadas — bugs e segurança

Data: 10/08/2026

Este documento descreve as correções de bugs e de segurança aplicadas ao projeto, o
motivo de cada uma e como foram verificadas. Melhorias de qualidade de código e de
produto (refatorações, testes, acessibilidade) foram levantadas mas **não** fazem parte
deste conjunto de alterações — estão listadas no final.

---

## 1. Bugs corrigidos

### 1.1 Botão travava permanentemente após um erro de requisição

**Arquivos:** `StandardSheetUpload.jsx`, `ComboSheetUpload.jsx`, `StandardSingleForm.jsx`, `ComboSingleForm.jsx`

Os quatro formulários usavam o mesmo estado (`reqResponse`) para a mensagem de sucesso e
para a de erro, e o botão de envio tinha `disabled={... || reqResponse}`. Consequência: em
qualquer falha (rede, cold start do servidor, erro 500), o botão ficava desabilitado, a
mensagem de erro **não era exibida em lugar nenhum** — só era renderizada dentro do bloco
`{downloadUrl && ...}`, que nunca aparecia — e o botão "Criar outro cartaz" também não
surgia. O usuário precisava recarregar a página.

**Correção:**
- Novo estado `submitError`, separado de `reqResponse` (sucesso).
- A mensagem de erro passou a ser renderizada acima do botão, com `role="alert"`.
- O botão agora usa `disabled={!!downloadUrl}` (impede reenvio após gerar), sem bloquear
  em caso de erro.
- `setIsSubmiting(false)` movido para `finally`, garantindo que o spinner sempre pare.
- Respostas com `status !== "Success"` passaram a virar mensagem de erro em vez de serem
  ignoradas silenciosamente.
- O `useEffect` de limpeza deixou de ser condicionado a `downloadUrl`, para que o erro
  também seja limpo ao trocar de arquivo, de valores ou de tamanho de cartaz.

### 1.2 Mensagens de erro amigáveis por tipo de falha

**Arquivo novo:** `front-end/src/services/requestError.js`

Antes toda falha virava o texto genérico "Erro ao criar cartaz". Agora `getRequestErrorMessage`
distingue timeout, servidor inacessível e mensagem devolvida pela API, repassando o texto do
backend quando existe.

### 1.3 Erro de validação exibido no campo errado

**Arquivo:** `ComboSingleForm.jsx`

O campo `comboQtd` mostrava `errors.preco` — um campo que não existe nesse formulário —
então a validação de quantidade nunca aparecia na tela. Passou a exibir `errors.comboQtd`.

A validação também estava incorreta: `min` não funciona de forma confiável em input de
texto. Substituída por `pattern` (apenas dígitos) + `validate` (maior que zero).

### 1.4 Nomes de PDF com alta chance de colisão

**Arquivo:** `backend/src/controllers/PostersController.ts`

O nome era `Cartaz_${dia}_${mês}_${Math.random().toFixed(2)}.pdf`, o que gera cerca de 100
nomes possíveis por dia. Dois usuários no mesmo dia podiam sobrescrever o PDF um do outro,
e os nomes eram adivinháveis — permitindo baixar o cartaz de outra pessoa.

**Correção:** `Cartaz_${randomUUID()}.pdf`.

### 1.5 Código morto que quebrava o build

**Arquivo removido:** `front-end/src/components/PosterForm/index.jsx` (309 linhas)

O arquivo importava `../../hooks/useSheetReader`, que **não existe** no projeto. Também
apontava para `http://localhost:3333/api/posters` (rota inexistente) e referenciava uma
imagem inexistente. Nenhum componente o importava, mas ele quebraria o build assim que
fosse referenciado.

### 1.6 Erro 500 com valores numéricos vindos da planilha

**Arquivo:** `backend/src/services/GeneratePostersService.ts`

O serviço chamava `row.preco.replace(...)` diretamente. Quando o valor chegava como número
(caso comum ao ler células de planilha) ou ausente, a chamada estourava e virava um erro 500
genérico. O filtro `row.medida != ""` também deixava passar campos `undefined`.

**Correção:** helper `asText()` aplicado a `produto`, `preco`, `medida` e `comboVlr`, e
filtro de linhas válidas usando `.trim() !== ""`.

---

## 2. Segurança

### 2.1 CORS liberado para qualquer origem

**Arquivo:** `backend/src/app.ts`

A lista `allowedOrigins` era montada e testada, mas ao final o callback retornava
`callback(null, true)` em todos os caminhos — ou seja, qualquer origem era aceita.

**Correção:** origens fora da allowlist passam a ser rejeitadas com **HTTP 403** e corpo
JSON (via `CorsError` e handler de erro dedicado, em vez do 500 padrão do middleware).

> **Compatibilidade:** se `CORS_ORIGIN` estiver vazio ou não definido, o comportamento
> permissivo é mantido e um aviso é registrado no log. Isso evita quebrar o deploy atual.
> **Para que a proteção tenha efeito, defina `CORS_ORIGIN` no ambiente de produção.**

### 2.2 Upload de arquivos sem limites (multer)

**Arquivos:** `posters.routes.ts`, `multerConfigMiddleware.ts` (removido)

As três rotas usavam `upload.single("file")` com `multer({ dest: 'uploads/' })`, sem
`limits` nem filtro de tipo. O front-end envia JSON, então o middleware nunca era usado no
fluxo normal — mas um POST `multipart/form-data` gravava arquivos em disco sem limite algum.

**Correção:** middleware e dependência removidos por completo.

### 2.3 Dependências vulneráveis e não utilizadas

**Arquivo:** `backend/package.json`

Removidas: `multer` (linha 1.x descontinuada, com CVEs de DoS), `nodemailer`,
`express-handlebars`, `nodemailer-express-handlebars`, `@types/bcrypt`, `@types/multer`,
`@types/nodemailer`, `@types/nodemailer-express-handlebars` e o pacote `fs` — este último é
um placeholder de segurança do npm que nunca deveria constar como dependência.

Adicionada: `express-rate-limit`.

### 2.4 Sem limite de requisições nem de volume

**Arquivos:** `backend/src/app.ts`, `backend/src/controllers/PostersController.ts`

A geração de PDF é síncrona e usa CPU. Um único POST com milhares de linhas travava o
processo inteiro, e não havia limite de requisições.

**Correção:**
- Rate limit de **20 requisições por minuto** por IP nas rotas `/api`.
- Teto de **200 cartazes por requisição** (`MAX_ROWS`).
- Limite do corpo JSON reduzido de **20 MB para 1 MB**.

### 2.5 Validação de payload frágil

**Arquivo:** `backend/src/controllers/PostersController.ts`

A checagem usava `hasOwnProperty`, que aceitava campos vazios, nulos ou de tipo inesperado.
Agora `validateSheet()` verifica: array não vazio, dentro do teto de linhas, cada item é um
objeto, e cada campo obrigatório é string ou número não vazio.

### 2.6 PDFs acumulavam indefinidamente no disco

**Arquivo novo:** `backend/src/utils/cleanupPdfs.ts` (iniciado em `server.ts`)

Nada removia os arquivos de `backend/pdfs/`. Foi adicionada uma rotina que roda na
inicialização e a cada 15 minutos, apagando PDFs com mais de 1 hora.

### 2.7 URL da API fixa no código

**Arquivos:** `front-end/src/services/api.js`, `.env.example` (novo em ambos os projetos)

A URL de produção estava hardcoded, impedindo desenvolver contra o backend local sem editar
o arquivo. Passou a usar `import.meta.env.VITE_API_URL`, mantendo a URL de produção como
fallback para não quebrar o deploy atual. Também foi adicionado `timeout: 90000` no axios,
já que o servidor em plano gratuito pode levar cerca de um minuto para acordar.

`front-end/.gitignore` passou a ignorar `.env` e `.env.*`, com exceção de `.env.example`.

### 2.8 Erros engolidos no backend

**Arquivo:** `backend/src/controllers/PostersController.ts`

Os blocos `catch (e)` retornavam `"Something went wrong"` sem registrar `e` — sem rastro
algum quando algo quebrasse em produção. Agora todos registram o erro no log e devolvem
mensagem em português, coerente com o restante da API.

### 2.9 Logs de dados em produção

Removidos os `console.log` que despejavam o conteúdo completo da planilha nos controllers,
no serviço de geração e nos componentes do front-end.

---

## 3. Limpeza de comentários

Todos os comentários foram removidos dos arquivos de código: `src/**/*.{ts,js,jsx}` de ambos
os projetos, `vite.config.js`, `tailwind.config.js` e as ~90 linhas de comentários gerados
pelo `tsc --init` em `backend/tsconfig.json`.

Os arquivos `.env.example` mantêm comentários por serem documentação de configuração.

Como efeito colateral, o import não utilizado de `React` em `main.jsx` foi removido — ele
existia apenas por causa do comentário "Adicione esta linha" e gerava erro de lint.

---

## 4. Verificação

Tudo abaixo foi executado e conferido:

| Verificação | Resultado |
|---|---|
| `tsc --noEmit` (backend) | sem erros |
| `yarn build` (backend e front-end) | ok |
| `eslint` nos arquivos alterados | limpo (restam apenas erros pré-existentes em `sheetReader.js`) |
| POST `/api/posters/big`, `/small`, `/combo` | PDFs válidos gerados (`%PDF-1.3`, texto embutido conferido) |
| Payload sem campo obrigatório | 400 com mensagem em português |
| `sheet` vazio | 400 "Nenhum item foi enviado..." |
| 201 linhas | 400 "Limite de 200 cartazes..." |
| `preco` como número (não string) | 200 — não estoura mais |
| Origem fora da allowlist | 403 "Origem não autorizada." |
| Origem na allowlist | 200 com `Access-Control-Allow-Origin` |
| 25 requisições seguidas | as 20 primeiras passam, as demais retornam 429 |
| Limpeza de PDFs | arquivo com 2h de idade removido; recentes preservados |
| Fluxo no navegador: erro → nova tentativa | mensagem de erro exibida, botão continua ativo, envio seguinte funciona **sem recarregar a página** |

---

## 5. Ação necessária no deploy

1. **Definir `CORS_ORIGIN`** no ambiente do backend com o domínio do front-end
   (ex.: `https://seu-front.vercel.app`). Sem essa variável, o CORS continua aceitando
   qualquer origem.
2. **Definir `VITE_API_URL`** no ambiente do front-end. Sem ela, a URL de produção
   atual continua sendo usada como fallback.

---

## 6. O que ficou de fora

Itens levantados na análise que **não** foram tratados por serem qualidade de código ou
melhoria de produto, e não bug ou vulnerabilidade:

- `xlsx@0.18.5` tem vulnerabilidades conhecidas (CVE-2023-30533, CVE-2024-22363) e a versão
  publicada no npm está abandonada. A correção exige migrar para `cdn.sheetjs.com` ou trocar
  por `exceljs` — mudança com risco de regressão no leitor de planilhas, que merece ser
  feita e testada separadamente. **É o item pendente mais relevante.**
- `sheetReader.js`: os métodos `standardPoster`/`comboPoster` são hooks disfarçados de objeto
  (chamam `useState`/`useEffect`), violando as regras dos hooks — origem dos erros de lint
  restantes. Renomear para `useStandardSheet`/`useComboSheet` resolveria, junto com as ~120
  linhas duplicadas entre os dois.
- Três controllers praticamente idênticos e duplicação do bloco de download nos quatro
  formulários.
- `generateSmallPoster` duplica o layout inteiro entre os ramos `if/else`.
- Preço do combo hardcoded no PDF (`"10ZÃO"` e `"10,00"`).
- Acessibilidade: "Veja aqui" é `<a onClick>` sem `href` (inalcançável por teclado); o modal
  não tem `role="dialog"`, foco preso nem fechamento com `Esc`; `id="button-click-here"`
  duplicado.
- Ausência de testes automatizados e de CI.
- README desatualizado (menciona "Envio de Cobranças", funcionalidade que não existe no
  código, e não explica como rodar o projeto).
