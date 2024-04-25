# Vega-lite

```js
import * as vega from "npm:vega";
import * as vegaLite from "npm:vega-lite";
import * as vegaLiteApi from "npm:vega-lite-api";

const vl = vegaLiteApi.register(vega, vegaLite);

const stores = await FileAttachment("./data/superstore.csv").csv({typed: true});

function scatter(data) {
    return {
        spec: {
            width: "container",
            data: {
                values: data
            },
            mark: "point",
            encoding: {
                x: {
                    type: "quantitative",
                    field: "Profit"
                },
                y: {
                    type: "quantitative",
                    field: "Sales"
                }
            }
        }
    };
}
```

<div class="grid grid-cols-2">
    <div class="card">
        <h1>Scatter plot</h1>
        <div style="width: 100%; margin-top: 15px;">
            ${ vl.render(scatter(stores)) }
        </div>
    </div>
    <div class="card">
        <h1>Scatter plot</h1>
        <div style="width: 100%; margin-top: 15px;">
        </div>
    </div>
    <div class="card grid-colspan-2">
        <h1>Scatter plot</h1>
        <div style="width: 100%; margin-top: 15px;">
        </div>
    </div>
</div>
