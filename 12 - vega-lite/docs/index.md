# Introdução ao Vega-lite

## Exemplos iniciais

<div class="grid grid-cols-2">
    <div id="ex01" class="card">
        <h1>Exemplo 01</h1>
        <div style="width: 100%; margin-top: 15px;">
            ${ vl.render(ex01(div01Width - 10)) }
        </div>
    </div>
    <div id="ex02" class="card">
        <h1>Exemplo 02</h1>
        <div style="width: 100%; margin-top: 15px;">
            ${ vl.render(ex02(div02Width - 70)) }
        </div>
    </div>
    <div id="ex03" class="card">
        <h1>Exemplo 03</h1>
        <div style="width: 100%; margin-top: 15px;">
            ${ vl.render(ex03(div03Width - 70)) }
        </div>
    </div>
    <div id="ex04" class="card">
        <h1>Exemplo 04</h1>
        <div style="width: 100%; margin-top: 15px;">
            ${ vl.render(ex04(div04Width - 70)) }
        </div>
    </div>
</div>

<div class="grid grid-cols-2">
    <div  id="ex05" class="card">
        <h1>Exemplo 05</h1>
        <div style="width: 100%; margin-top: 15px;">
            ${ vl.render(ex05(div05Width - 40)) }
        </div>
    </div>
</div>


```js
const div01Width = Generators.width(document.querySelector("#ex01"));
const div02Width = Generators.width(document.querySelector("#ex02"));
const div03Width = Generators.width(document.querySelector("#ex03"));
const div04Width = Generators.width(document.querySelector("#ex04"));
const div05Width = Generators.width(document.querySelector("#ex05"));

```


```js
import * as vega from "npm:vega";
import * as vegaLite from "npm:vega-lite";
import * as vegaLiteApi from "npm:vega-lite-api";

const vl = vegaLiteApi.register(vega, vegaLite);

const toy = await FileAttachment("./data/toy.json").json({typed: true});

function ex01(divWidth) {
    return {
        spec: {
            width: divWidth,
            data: {
                values: toy
            },
            mark: {
                "type": "point",
                "size": 100
            }
        }
    };
}

function ex02(divWidth) {
    return {
        spec: {
            width: divWidth,
            data: {
                values: toy
            },
            mark: {
                "type": "point",
                "size": 100
            },
            "encoding": {
                "y": {
                    "field": "city",
                    "type": "nominal"
                }
            }
        }
    };
}

function ex03(divWidth) {
    return {
        spec: {
            width: divWidth,
            data: {
                values: toy
            },
            mark: {
                "type": "point",
                "size": 100
            },
            "encoding": {
                "x": {
                    "field": "precip",
                    "type": "quantitative"
                },
                "y": {
                    "field": "city",
                    "type": "nominal"
                }
            }
        }
    };
}

function ex04(divWidth) {
    return {
        spec: {
            width: divWidth,
            data: {
                values: toy
            },
            "mark": {
                "type": "bar"
            },
            "encoding": {
                "x": {
                    "field": "precip",
                    "type": "quantitative",
                    "aggregate": "average"
                },
                "y": {
                    "field": "city",
                    "type": "nominal"
                }
            }
        }
    };
}


function ex05(divWidth) {
    return {
        spec: {
            width: divWidth,
            data: {
                values: toy
            },
            "mark": {
                "type": "bar"
            },
            "encoding": {
                "y": {
                    "field": "precip",
                    "type": "quantitative",
                    "aggregate": "average"
                },
                "x": {
                    "field": "city",
                    "type": "nominal"
                }
            }
        }
    };
}
```