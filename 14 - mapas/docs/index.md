---
toc: false
---

<style>

.hero {
  display: flex;
  flex-direction: column;
  align-items: center;
  font-family: var(--sans-serif);
  margin: 4rem 0 8rem;
  text-wrap: balance;
  text-align: center;
}

.hero h1 {
  margin: 2rem 0;
  max-width: none;
  font-size: 14vw;
  font-weight: 900;
  line-height: 1;
  background: linear-gradient(30deg, var(--theme-foreground-focus), currentColor);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero h2 {
  margin: 0;
  max-width: none;
  font-size: 3vw;
  font-style: initial;
  font-weight: 500;
  line-height: 1;
  color: var(--theme-foreground-muted);
}

@media (min-width: 640px) {
  .hero h1 {
    font-size: 90px;
  }
}

</style>

<div class="hero">
  <h2>Visualização com mapas</h2>
</div>

<div style="width: 100%; margin-top: 15px;">
    <h2 class="title">EX01</h2>
    <div id="ex01" style="width: 100%; margin-top: 15px;">
        ${ vl.render(ex01(divWidth01 - 80)) }
    </div>
</div>
<div style="width: 100%; margin-top: 15px;">
    <h2>EX02</h2>
    <div id="ex02" style="width: 100%; margin-top: 15px;">
        ${ vl.render(ex02(divWidth02 - 80)) }
    </div>
</div>


<div style="width: 100%; height: 500px; margin-top: 15px;">
    <h2 class="title">EX03</h2>
    <div id="ex03" style="width: 100%; height: 430px;  margin-top: 15px;">
    </div>
</div>
<div style="width: 100%;  height: 500px; margin-top: 15px;">
    <h2 class="title">EX04</h2>
    <div id="ex04" style="width: 100%; height: 430px;  margin-top: 15px;">
    </div>
</div>

```js
const nycBoroughs = await FileAttachment("./data/nyc-boroughs.json").json({typed: true});
const collisions_borough = await FileAttachment("./data/collisions_borough.csv").csv({typed: true});

const nycNeighs = await FileAttachment("./data/nyc-neighs.json").json({typed: true});
const collisions_neighs = await FileAttachment("./data/collisions_neighs.csv").csv({typed: true});
```

```js
const divWidth01 = Generators.width(document.querySelector("#ex01"));
const divWidth02 = Generators.width(document.querySelector("#ex02"));
const divWidth03 = Generators.width(document.querySelector("#ex03"));
const divWidth04 = Generators.width(document.querySelector("#ex04"));

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
            height: 300,
            background: "#FFFFFF",
            projection: {
                type: "mercator"
            },
            layer: [
                {
                    data: {
                        values: nycBoroughs,
                        format: {
                            type: "json",
                            property: "features"
                        }
                    },
                    transform: [
                    {
                        lookup: "properties.name",
                        from: {
                            data: {
                                values: collisions_borough
                            },
                            key: "name",
                            fields: ["collisions"]
                        }
                    }
                    ],
                    mark: {
                        type: "geoshape",
                        stroke: "#BFBFBF",
                        strokeWidth: 1
                    },
                    encoding: {
                        color: {
                            field: "collisions",
                            type: "quantitative",
                            scale: { scheme: "reds" }
                        }
                    }
                }
            ]
        }
    }
}

function ex02(divWidth) {
    return {
        spec: {
            width: divWidth,
            height: 300,
            background: "#FFFFFF",
            projection: {
                type: "mercator"
            },
            layer: [
                {
                    data: {
                        values: nycNeighs,
                        format: {
                            type: "json",
                            property: "features"
                        }
                    },
                    transform: [
                    {
                        lookup: "properties.name",
                        from: {
                        data: {
                            values: collisions_neighs
                        },
                        key: "name",
                        fields: ["collisions"]
                        }
                    }
                    ],
                    mark: {
                        type: "geoshape",
                        stroke: "#BFBFBF",
                        strokeWidth: 1
                    },
                    encoding: {
                        color: {
                            field: "collisions",
                            type: "quantitative",
                            scale: { scheme: "reds" }
                        }
                    }
                }
            ]
        }
    }
}

```


```js
import maplibregl from "npm:maplibre-gl";

function ex03() {
    const map01 = document.querySelector("#ex03");
    map01.style.width = `${divWidth03}px`;
    map01.style.height = '400px';

    console.log(divWidth03);
    const map = (map01.value = new maplibregl.Map({
        container: map01,
        style: "https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json",
        center: [-120, 50],
        zoom: 2,
    }));

  map.on("load", function () {
    map.addSource("earthquakes", {
      type: "geojson",
      data: "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/1.0_month.geojson",
    });
    map.addLayer({
      id: "earthquakes",
      type: "circle",
      source: "earthquakes",
      paint: {
        "circle-color": "red",
        "circle-stroke-color": "black",
        "circle-stroke-width": 1,
        "circle-radius": 2
      }
    });
  });

    map.on('idle',function(){
        map.resize()
    })

  invalidation.then(() => map.remove());
}

ex03();
```

```js
import maplibregl from "npm:maplibre-gl";

function ex04() {
    const map02 = document.querySelector("#ex04");
    map02.style.width = `${divWidth04}px`;
    map02.style.height = '400px';


    const map = (map02.value = new maplibregl.Map({
        container: map02,
        style: "https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json",
        center: [-120, 50],
        zoom: 2,
    }));

map.on('load', () => {
        // Add a geojson point source.
        // Heatmap layers also work with a vector tile source.
        map.addSource('earthquakes', {
            'type': 'geojson',
            'data': "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/1.0_month.geojson"
        });

        map.addLayer(
            {
                'id': 'earthquakes-heat',
                'type': 'heatmap',
                'source': 'earthquakes',
                'maxzoom': 9,
                'paint': {
                    // Increase the heatmap weight based on frequency and property magnitude
                    'heatmap-weight': [
                        'interpolate',
                        ['linear'],
                        ['get', 'mag'],
                        0,
                        0,
                        6,
                        1
                    ],
                    // Increase the heatmap color weight weight by zoom level
                    // heatmap-intensity is a multiplier on top of heatmap-weight
                    'heatmap-intensity': [
                        'interpolate',
                        ['linear'],
                        ['zoom'],
                        0,
                        1,
                        9,
                        3
                    ],
                    // Color ramp for heatmap.  Domain is 0 (low) to 1 (high).
                    // Begin color ramp at 0-stop with a 0-transparancy color
                    // to create a blur-like effect.
                    'heatmap-color': [
                        'interpolate',
                        ['linear'],
                        ['heatmap-density'],
                        0,
                        'rgba(33,102,172,0)',
                        0.2,
                        'rgb(103,169,207)',
                        0.4,
                        'rgb(209,229,240)',
                        0.6,
                        'rgb(253,219,199)',
                        0.8,
                        'rgb(239,138,98)',
                        1,
                        'rgb(178,24,43)'
                    ],
                    // Adjust the heatmap radius by zoom level
                    'heatmap-radius': [
                        'interpolate',
                        ['linear'],
                        ['zoom'],
                        0,
                        2,
                        9,
                        20
                    ],
                    // Transition from heatmap to circle layer by zoom level
                    'heatmap-opacity': [
                        'interpolate',
                        ['linear'],
                        ['zoom'],
                        7,
                        1,
                        9,
                        0
                    ]
                }
            },
            'waterway'
        );

        map.addLayer(
            {
                'id': 'earthquakes-point',
                'type': 'circle',
                'source': 'earthquakes',
                'minzoom': 7,
                'paint': {
                    // Size circle radius by earthquake magnitude and zoom level
                    'circle-radius': [
                        'interpolate',
                        ['linear'],
                        ['zoom'],
                        7,
                        ['interpolate', ['linear'], ['get', 'mag'], 1, 1, 6, 4],
                        16,
                        ['interpolate', ['linear'], ['get', 'mag'], 1, 5, 6, 50]
                    ],
                    // Color circle by earthquake magnitude
                    'circle-color': [
                        'interpolate',
                        ['linear'],
                        ['get', 'mag'],
                        1,
                        'rgba(33,102,172,0)',
                        2,
                        'rgb(103,169,207)',
                        3,
                        'rgb(209,229,240)',
                        4,
                        'rgb(253,219,199)',
                        5,
                        'rgb(239,138,98)',
                        6,
                        'rgb(178,24,43)'
                    ],
                    'circle-stroke-color': 'white',
                    'circle-stroke-width': 1,
                    // Transition from heatmap to circle layer by zoom level
                    'circle-opacity': [
                        'interpolate',
                        ['linear'],
                        ['zoom'],
                        7,
                        0,
                        8,
                        1
                    ]
                }
            },
            'waterway'
        );
    });

    map.on('idle',function(){
        map.resize()
    })


  invalidation.then(() => map.remove());
}

ex04();
```