---
toc: true
---

<style>
    body, div, p, li, ol { max-width: none; }
</style>

# Exemplo de Aplicação

Análise do conjunto de dados da [Gapminder](https://www.gapminder.org/), simulando a visualização de dados proposta por Hans Rosling no Ted Talk [The best stats You've ever seen](https://www.ted.com/talks/hans_rosling_the_best_stats_you_ve_ever_seen).

## Data set

```js
const gap = await FileAttachment("./data/gap.json").json({typed: true});
const yrs = gap.map(d => d['year']);

const min = Math.min(...yrs);
const max = Math.max(...yrs);

view(Inputs.table(gap));
```

## Interações
```js

const year = view(Inputs.range([min, max], {value: min, step: 5, label: "Years"}))
```

## Visualizações

<div class="grid grid-cols-2">
    <div id="ex01" class="card grid-colspan-2" >
        <h2 class="title">Fertilidade X Espectativa de Vida no ano ${year}</h2>
        <div style="width: 100%; margin-top: 15px;">
            ${ vl.render(ex01(divWidth - 200)) }
        </div>
    </div>
    <div id="ex02" class="card grid-colspan-2">
        <h2>População por país no ano ${year}</h2>
        <div style="width: 100%; margin-top: 15px;">
            ${ vl.render(ex02(divWidth - 55)) }
        </div>
    </div>
</div>

<!--Tamanho dos cards. Caso vcs usem cards de multiplos tamanhos, 
    será necessário criar um generator para cada classe de card.
-->
```js
const divWidth = Generators.width(document.querySelector("#ex01"));

```

```js
const gapSubset = gap.filter(d => d['year'] === year);
```

```js
import * as vega from "npm:vega";
import * as vegaLite from "npm:vega-lite";
import * as vegaLiteApi from "npm:vega-lite-api";

const vl = vegaLiteApi.register(vega, vegaLite);

function ex01(divWidth) {
    return {
        spec: {
            width: divWidth,
            height: 400,
            data: {
                values: gapSubset
            },
            "mark": {
                "type": "point",
                "filled": true,
                "opacity": 0.5,
                "tooltip": true
            },
            "encoding": {
                "x": {
                    "field": "fertility",
                    "type": "quantitative",
                    "scale": {
                        "domain": [0, 9]
                    }
                },
                "y": {
                    "field": "life_expect",
                    "type": "quantitative",
                    "scale": {
                        "domain": [0, 90]
                    }
                },
                "size": {
                    "field": "pop",
                    "type": "quantitative",
                    "scale": {
                        "range": [50, 5000],
                        "domain": [200000, 1200000000]
                    }
                },
                "color": {
                    "field": "cluster",
                    "type": "nominal",
                    "legend": null
                },
                "order": {
                    "field": "pop",
                    "type": "quantitative",
                    "sort": "descending"
                }
            }
        }
    }
}


function ex02(divWidth) {
    return {
        spec: {
            width: divWidth,
            height: 400,
            data: {
                values: gapSubset
            },
            "mark": {
                "type": "bar",
                "tooltip": true
            },
            "encoding": {
                "x": {
                    "field": "country",
                    "type": "nominal"
                },
                "y": {
                    "field": "pop",
                    "type": "quantitative",
                    "axis": {
                        "format": "~s"
                    }
                },
                "color": {
                    "field": "cluster",
                    "type": "nominal",
                    "legend": null
                },
                "order": {
                    "field": "pop",
                    "type": "quantitative",
                    "sort": "descending"
                }
            }
        }
    }
}
```


## Análise
Você deve responder cada pergunta formulada no enunciado com base nas visualizações construídas.  
Utilize essa área para esta finalidade.

**Observações:**
1. Escreva sua argumentação de forma clara, direta e organizada. Sendo assim, evite respostas muito curtas ou textos longos demais.
2. Caso a sua argumentação dependa de interações ou parâmetro modificados pelo usuário na interface, é importante que você descreva os passos necessários para reporduzir sua análise.

## Design utilizados
Por fim, você deve justificar a escolha dos designs das visualizações construídas nos trabalhos.  
Utilize esta área para esta finalidade.

**Observações:**
1. Descreva quais marcadores e canais visuais foram utilizados.
2. Argumente se existe algum viés que pode ser causado pelo design escolhido.
3. Discuta sobre outros temas vistos em aula como separabilidade e discriminabilidade dos canais visuais.