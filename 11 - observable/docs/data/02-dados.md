---
sql:
  stores: ../datasets/superstore.csv
---


<style>
    body, div, p, li, ol { max-width: none; }
</style>


# Carregamento de Dados

Usando o Observable Framework é possivel carregar dados de APIs, arquivos, comandos SQL e até mesmo rodando scripts escritos outras linguagens.


### Carregamento usando APIs de dados

```js
    import {load_movies} from "../components/data_api.js";

    const movies = await load_movies();

    display(movies.slice(0,10));
```

### Carregamento de arquivos

```js
    const stores = await FileAttachment("../datasets/superstore.csv").csv({typed: true});

    display(stores.slice(0,10));
```

### Carregamento de dados usando scripts Python

```js
    const stores = await FileAttachment("../components/02-dados.csv").json({typed: true});

    display(stores);
```

### Acessando uma base de dados SQLite

```sql
SELECT * FROM stores LIMIT 10
```


