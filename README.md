# Ancestry Autoencoder

Ancestry Autoencoder is a tool to train variational autoencoder machine learning models on genotyping data for discovering population structures by unsupervised clustering of genotypes.

# Run

## Run dev server
```
fastapi dev backend/__main__.py
```

## Run tests
```
pytest -s
```
"-s" is for capturing stdout during tests

## Run vite server
```
pnpm run dev
```

Note: there is also fullstack debug/run in .vscode/launch.json that launches both frontend and backend at the same time.

## TS Client Generated from backend for frontend

```
pnpm run generate-client
```


# TODO

- [x] VCF Manager
  - [x] load
  - [x] check headers
  - [x] check it is phased
  - [x] method: get sample names
  - [x] method: get phased genotypes
  - [x] use it in api
- [ ] Frontend file manager
  - [x] component
  - [ ] bind with api
    - [ ] use the openapi produced ts client
- [ ] Autoencoder lightining
- [ ] add political entities to names for testing
- [ ] return the latent space representations of samples by api

# Usage

1. Start the eel server
2. go to localhost:8000
3. choose genome .vcf/.vcf.gz, must be phased, for phasing you can use tools like beagle.
4. Train model / Load Model
5. Open / Create sample annotation tsv file by providing the path
6. annotate the samples by selecting them on the plotly plot.
7. save the annotation.tsv for downstream applications.


# Vite template stuff
## React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

### Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config({
  extends: [
    // Remove ...tseslint.configs.recommended and replace with this
    ...tseslint.configs.recommendedTypeChecked,
    // Alternatively, use this for stricter rules
    ...tseslint.configs.strictTypeChecked,
    // Optionally, add this for stylistic rules
    ...tseslint.configs.stylisticTypeChecked,
  ],
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config({
  plugins: {
    // Add the react-x and react-dom plugins
    'react-x': reactX,
    'react-dom': reactDom,
  },
  rules: {
    // other rules...
    // Enable its recommended typescript rules
    ...reactX.configs['recommended-typescript'].rules,
    ...reactDom.configs.recommended.rules,
  },
})
```
