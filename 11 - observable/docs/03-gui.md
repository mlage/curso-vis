<style>
    body, div, p, li, ol { max-width: none; }
</style>

# Elementos de Interface Visual

O Observable Framework fornece acesso nativo a uma biblioteca, chamada [Inputs](https://observablehq.com/collection/@observablehq/inputs), com a implementação de inúmeros elementos de intaface como 
*botões*, *dropdowns*, *sliders*, *checkboxes*, entre outros. O uso desta biblioteca facilita a construção 
 de interfaces sofisticadas e interativas.

Elementos de interface gerados pela biblioteca Inputs, são exibidos usando o comando `view`. Além disso, a função view retorna um `Generator` 
que guardam o valor corrente do elemento de interface e podem ser armazenados em uma variável.

 Veja alguns exemplos:

 ## Botões
 Um botão, por padrão, gera um contador de clicks.
 ```js
const clicks = view(Inputs.button("Botão"));
 ```
 O botão acima foi clicado ${clicks} vezes.
 

Para mudar este comportamento, botões podem invocar *callbacks*.  

```js
function gera_valor(old) {
    return Math.floor(100 * Math.random()) + old;
}

const update = view(Inputs.button("Update", {value: 0, reduce: gera_valor}));
```

O Botão acima gerou o numero ${update}.


 ## Toggle
```js
const val = view(Inputs.toggle({label: "Toggle Exemplo", value: true}));
```
O acima Toggle está ${val ? "selecionado" : "desselecionado"}!


```js
view(Inputs.toggle({label: "Toggle desabilitado", disabled: true}));
```
O acima Toggle está desabilitado!

## Checkbox

```js
const teams = [
  {name: "Lakers", location: "Los Angeles, California"},
  {name: "Warriors", location: "San Francisco, California"},
  {name: "Celtics", location: "Boston, Massachusetts"},
  {name: "Nets", location: "New York City, New York"},
  {name: "Raptors", location: "Toronto, Ontario"},
];

const lab = x => x.name;

const sel = view(Inputs.checkbox(teams, {label: "Escolha os times", format: lab}));
```
Os times selecionados foram: [${sel.map(lab).join(", ")}]