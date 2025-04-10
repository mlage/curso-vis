import { Taxi } from "./taxi";

declare global {
    interface BigInt {
        toJSON(): Number;
    }
}
BigInt.prototype.toJSON = function () { return Number(this) }

function createTableWithInnerHTML(data: any[]) {
    let tableHTML = '<table border="1"><tr>';

    Object.keys(data[0]).forEach(key => {
        tableHTML += `<th>${key}</th>`;
    });

    tableHTML += '</tr>';

    data.forEach( (item: any) => {
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
    const months = 12;
    const limit = 50;

    const taxi = new Taxi();

    await taxi.init();
    await taxi.loadTaxi(months);
    const data = await taxi.test(limit);

    console.log("data");
    console.log(JSON.stringify(data));

    createTableWithInnerHTML(data);

    console.log(await taxi.groupByMonth());
};