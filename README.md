# CodeLeap Junior Test – (React)

## Como rodar
```bash
# Node 18+ recomendado
npm install
npm start
```

## Variáveis de ambiente
Crie um arquivo `.env` na raiz, se precisar alterar a API:
```
REACT_APP_API_BASE_URL=https://dev.codeleap.co.uk
```

## Scripts
- `npm start` – inicia em modo desenvolvimento (CRA).
- `npm run build` – build de produção.
- `npm test` – testes (CRA).

## Estrutura
- `public/index.html` – ponto de entrada do CRA.
- `src/services/api.js` – baseURL configurável.
- `src/components/*` – componentes visuais (com classes CSS responsivas).
- `src/pages/PostsPage.js` – listagem/edição/remoção de posts.
- `src/index.css` – estilos responsivos e paleta.
