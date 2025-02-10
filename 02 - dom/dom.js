//--------------------------------------------------
// Exemplo 01 --------------------------------------
// Acesso usando a tag do elemento
//--------------------------------------------------
let x = document.getElementsByTagName("div");
console.log(x);

for (let id = 0; id < x.length; id++) {
  x[id].innerHTML = `Novo Conteúdo do div ${id}!!`;
  
  x[id].style.padding = "15px";
  x[id].style.border = "2px solid";
  x[id].style.margin = "5px";
}
//--------------------------------------------------


//--------------------------------------------------
// Exemplo 02 --------------------------------------
// Acesso usando o Id do elemento
//--------------------------------------------------
let d = document.getElementById("vis");

d.style.backgroundColor = "#bfbf";
d.style.color = "#aaa";
//--------------------------------------------------


//--------------------------------------------------
// Exemplo 03 --------------------------------------
// Acesso usando a classe do elemento
//--------------------------------------------------
let c = document.getElementsByClassName("borda");

for (let id = 0; id < c.length; id++) {
  c[id].style.borderLeft = '15px solid #27ba4e';
}
//--------------------------------------------------


//--------------------------------------------------
// Exemplo 04 --------------------------------------
// Usando a função querySelector
//--------------------------------------------------
let s = document.querySelector("#vis");
s.innerHTML = "<h1>Novo Texto...</h1>";

let h = document.querySelectorAll("h1");
h[0].textContent = "Tag de título";

//--------------------------------------------------
