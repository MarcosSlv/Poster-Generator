# Sistema de Cartazes Promocionais e Envio de Cobranças

Esse projeto foi desenvolvido para agilizar o processo de criação de cartazes promocionais e envio de e-mails de cobrança para fornecedores no supermercado onde trabalho. O sistema foi pensado para facilitar a comunicação de promoções e melhorar a gestão de cobrança, reduzindo o tempo e os erros manuais associados a essas tarefas.

## Funcionalidade

- **Criação de Cartazes Promocionais**  
  O sistema permite criar cartazes de promoção de forma rápida e personalizada. Com base nas informações de produtos e preços, é possível gerar cartazes prontos para impressão.
  
## Tecnologias Utilizadas

- **Frontend**: React com Tailwind CSS para uma interface moderna e responsiva.
- **Backend**: Node.js e Express

## Testar o layout experimental (branch `test`)

```bash
git switch test
git pull --ff-only
cd front-end
npm install
npm start
```

Abra a URL local informada pelo Vite. O estúdio reúne o formulário e uma prévia de conteúdo que acompanha os dados de cartazes individuais, combos e o primeiro produto de uma planilha. A prévia é ilustrativa; confira o PDF gerado antes de imprimir. Os modelos de PDF e a integração com a API permanecem os mesmos.

O layout se adapta ao celular e mantém a preferência por tema claro ou escuro.
