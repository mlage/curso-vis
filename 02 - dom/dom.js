//--------------------------------------------------
// Exemplo 01 --------------------------------------
// Acesso usando a tag do elemento
//--------------------------------------------------
var x = document.getElementsByTagName("div");

for (let id = 0; id < x.length; id++) {
  x[id].innerHTML = `Novo Conteúdo do div ${id}!!`;
  x[id].style.padding = "10px";
}
//--------------------------------------------------


//--------------------------------------------------
// Exemplo 02 --------------------------------------
// Acesso usando o Id do elemento
//--------------------------------------------------
var d = document.getElementById("vis");

d.style.backgroundColor = "#bfbf";
d.style.color = "#aa";
//--------------------------------------------------



//--------------------------------------------------
// Exemplo 03 --------------------------------------
// Acesso usando a classe do elemento
//--------------------------------------------------
var c = document.getElementsByClassName("borda");

for (let id = 0; id < c.length; id++) {
  c[id].style.borderLeft = '3px solid gray';
}
//--------------------------------------------------



//--------------------------------------------------
// Exemplo 04 --------------------------------------
// Usando a função querySelector
//--------------------------------------------------
var s = document.querySelector("#vis");
s.innerHTML = "<h1>Novo Texto...</h1>";

var h = document.querySelectorAll("h1");
h[0].textContent = "Tag de título";
//--------------------------------------------------
