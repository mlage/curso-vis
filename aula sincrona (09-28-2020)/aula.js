class Loading {
  getDiv() {
    let div = document.querySelector('#main');
    console.log(div);
  }
  
  run(chamada) {
    console.log(`chamou: ${chamada}`)
    this.getDiv();
  }
}


window.onload = () => {
  let obj1 = new Loading();
  obj1.run('onload');
};


function main() {
  let obj2 = new Loading();
  obj2.run('main');
}
main();
