import { Taxi } from "./taxi";

function createTableWithInnerHTML(data) {
    let tableHTML = '<table border="1"><tr>';

    Object.keys(data[0]).forEach(key => {
        tableHTML += `<th>${key}</th>`;
    });

    tableHTML += '</tr>';

    data.forEach( item => {
        tableHTML += '<tr>';
        Object.values(item).forEach(value => {
            tableHTML += `<td>${value}</td>`;
        });
        tableHTML += '</tr>';
    });
    tableHTML += '</table>';

    const div = document.querySelector("#table");
    if(div) {
        div.innerHTML += tableHTML;
    }
}

window.onload = async () => {
    const months = 6;
    const limit = 50;

    const taxi = new Taxi();

    await taxi.init();
    await taxi.loadTaxi(months);

    const select = await taxi.select(limit);
    const filter = await taxi.filter(limit);
    const group = await taxi.groupBy(limit);
    const bins = await taxi.binning(limit);
    const norm = await taxi.normalize(limit);
    const derive = await taxi.derive(limit);

    createTableWithInnerHTML(derive);
};