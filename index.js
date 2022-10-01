const table = document.createElement("table");
table.id = "watchlist";
const tableHead = document.createElement("thead");
const tableHeadRow = document.createElement("tr");
const tableHeadTicker = document.createElement("th");
tableHeadTicker.textContent = "Ticker";
const tableHeadPrice = document.createElement("th");
tableHeadPrice.textContent = "Price";
const tableHeadTrend = document.createElement("th");
tableHeadTrend.textContent = "Trend";
const tableHeadActions = document.createElement("th");
tableHeadActions.textContent = "Actions";
tableHeadRow.appendChild(tableHeadTicker);
tableHeadRow.appendChild(tableHeadPrice);
tableHeadRow.appendChild(tableHeadTrend);
tableHeadRow.appendChild(tableHeadActions);
tableHead.appendChild(tableHeadRow);
table.appendChild(tableHead);
const tableBody = document.createElement("tbody");
table.appendChild(tableBody);
const body = document.querySelector("body");
body.appendChild(table);

const form = document.createElement("form");
const formTicker = document.createElement("input");
formTicker.id = "ticker";
formTicker.placeholder = "Ticker";
const formButton = document.createElement("button");
formButton.textContent = "Add Stock";
form.appendChild(formTicker);
form.appendChild(formButton);
body.appendChild(form);

form.addEventListener("input", (e) => {
  if (formTicker.value === "") {
    formButton.disabled = true;
  } else {
    formButton.disabled = false;
  }
});

formButton.addEventListener("click", (e) => {
  e.preventDefault();
  const tableBody = document.querySelector("tbody");
  const tableBodyRow = document.createElement("tr");
  const tableBodyTicker = document.createElement("td");
  tableBodyTicker.textContent = formTicker.value;
  tableBodyRow.appendChild(tableBodyTicker);
  tableBody.appendChild(tableBodyRow);
  formTicker.value = "";
  formButton.disabled = true;
});
