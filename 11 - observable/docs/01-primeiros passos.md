<style>
    body, div, p, li, ol { max-width: none; }
</style>


# Primeiros Passos

As páginas de uma aplicação desenvolvida usando o Observable Framework são escritas usando [Markdown](https://www.markdownguide.org/) e [HTML](https://developer.mozilla.org/en-US/docs/Web/HTML).  


## Markdown
A linguagem Markdown permite a construção de documentos formatados de forma simples e intuitiva.  
Com Markdown podemos criar títulos, textos em **negrito** e *itálico*, [links](http://www.ic.uff.br), listas, tabelas entre outros. 

Veja alguns exemplos:

Títulos:

### Título 3
#### Título 4

Listas:
1. Primeiro elemento
2. Segundo elemento
3. Terceiro elemento

* Item
* Item
* Item

Tabelas:
| Header 1    | Header 2    | Header 3      |
| :---        |    :----:   |          ---: |
| Item 1,1    | Item 1,2    | Item 1,3      |
| Item 2,1    | Item 2,2    | Item 2,3      |

Existem diversas outros comandos disponíveis, não cobertos neste exemplo.  
É recomendado que os alunos consultem o site [markdownguide.org](https://www.markdownguide.org/) para ter uma visão geral dos comandos disponíveis.

## HTML
Além da sintaxe básica ilustrada acima, documentos escritos usando Markdown podem ter estruturas HTML embutidas. 

Exemplo:
<div style="width: 100%; height: 50px; line-height: 50px; border: 5px solid #85C1E9; background-color: #D1F2EB; font-weight: bolder; color: #888;">
    Este é um div definido usando HTML
</div>

Em particular, o Observable oferece um conjunto de classes CSS (Cards, Color, Grid, Note), muito úteis para compor os elementos e definir de forma consistente o estilo da aplicação. Veja o exemplo abaixo a construção de cards em uma estrutura de grids com 4 colunas:

<div class="grid grid-cols-4">
    <div class="card" >
        Card 01
    </div>
    <div class="card" >
        Card 02
    </div>
    <div class="card" >
        Card 03
    </div>
    <div class="card" >
        Card 04
    </div>
    <div class="card" >
        Card 05
    </div>
    <div class="card" >
        Card 06
    </div>
    <div class="card" >
        Card 07
    </div>
</div>


Podemos alterar o exemplo anterior para que se tenha 3 cards por linha:

<div class="grid grid-cols-3">
    <div class="card" >
        Card 01
    </div>
    <div class="card" >
        Card 02
    </div>
    <div class="card" >
        Card 03
    </div>
    <div class="card" >
        Card 04
    </div>
    <div class="card" >
        Card 05
    </div>
    <div class="card" >
        Card 05
    </div>
</div>

Todo o conteúdo visto nas aulas sobre HTML podem ser utilizados para compor a estrutura das páginas de uma aplicação construída com o Observable.


## JavaScript
Por fim, o Observable Framework permite que códigos javascript sejam adicionados a página.  

1. Para adicionar um código, basta coloca-lo entre a marcação inicial \`\`\``js` e a marcação final \`\`\`.  
No exemplo abaixo, usamos a função `display` do framework, para imprimir o resultado de uma soma:
```js
display(1 + 2);
```


2. Uma computação JavaScript também pode ser inserida no usando no Markdown com a notação `${}`.  
Por exemplo, a soma 1 + 2 = ${display(1 + 2)}.

3. Analogamente, usando a mesma anotação, podemos incluir chamandas JavaScript no código HTML.
<div style="padding-left: 40px; margin-top: -17px">
Por exemplo, a soma 1 + 2 = ${display(1 + 2)}
</div>

4. Códigos mais sofisticados também podem ser adicionados:

<div id="chart"></div>

```js
function createSvg() {
    let div = document.querySelector('#chart');

    // Um nó svg é especial!
    let node = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    
    // svg position
    node.setAttribute('x', 10);
    node.setAttribute('y', 10);

    // svg size
    node.setAttribute('width', 400);
    node.setAttribute('height', 150);
    
    div.appendChild(node);
    
    let circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    
    circle.setAttribute('cx', 75);
    circle.setAttribute('cy', 75);
    circle.setAttribute('r' , 75);
    circle.setAttribute('style', 'fill: #eb9683')

    node.appendChild(circle);

    display(div);
}
createSvg();
```

