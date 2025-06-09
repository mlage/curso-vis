import { Taxi } from "./taxi";

function createTableWithInnerHTML(data) {
    let tableHTML = '<table border="1"><tr>';

    Object.keys(data[0]).forEach(key => {
        tableHTML += `<th>${key}</th>`;
    });

    tableHTML += '</tr>';

    data.forEach( (item) => {
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
    const data = await taxi.test(limit);

    createTableWithInnerHTML(data);

    console.log('teste');
};