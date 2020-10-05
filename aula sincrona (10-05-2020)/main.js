import { Dados } from './dados.js'
import { Bar   } from './grafico.js'

async function main() {
  let dados = new Dados();
  await dados.loadCSV('../00 - datasets/superstore.csv');
  dados.computeBins();

  let bar = new Bar();
  bar.setData(dados.bins)
  bar.render()
}

main();