# Introdução ao Vega-lite

## Exemplos iniciais

```js
import * as vega from "npm:vega";
import * as vegaLite from "npm:vega-lite";
import * as vegaLiteApi from "npm:vega-lite-api";

const vl = vegaLiteApi.register(vega, vegaLite);

const toy = await FileAttachment("./data/toy.json").json({typed: true});

function ex01() {
    return {
        spec: {
            width: "container",
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

function ex02() {
    return {
        spec: {
            width: "container",
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

function ex03() {
    return {
        spec: {
            width: "container",
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

function ex04() {
    return {
        spec: {
            width: "container",
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


function ex05() {
    return {
        spec: {
            width: "container",
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

<div class="grid grid-cols-2">
    <div class="card">
        <h1>Exemplo 01</h1>
        <div style="width: 100%; margin-top: 15px;">
            ${ vl.render(ex01()) }
        </div>
    </div>
    <div class="card">
        <h1>Exemplo 02</h1>
        <div style="width: 100%; margin-top: 15px;">
            ${ vl.render(ex02()) }
        </div>
    </div>
    <div class="card">
        <h1>Exemplo 03</h1>
        <div style="width: 100%; margin-top: 15px;">
            ${ vl.render(ex03()) }
        </div>
    </div>
    <div class="card">
        <h1>Exemplo 04</h1>
        <div style="width: 100%; margin-top: 15px;">
            ${ vl.render(ex04()) }
        </div>
    </div>
</div>

<div class="grid grid-cols-2">
    <div class="card">
        <h1>Exemplo 05</h1>
        <div style="width: 100%; margin-top: 15px;">
            ${ vl.render(ex05()) }
        </div>
    </div>
</div>