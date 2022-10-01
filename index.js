const table = document.createElement("table");
table.id = "watchlist-table";
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
const watchlist = document.getElementById("watchlist");
watchlist.appendChild(table);

// FORM
const form = document.createElement("form");
const formTicker = document.createElement("input");
formTicker.id = "ticker";
formTicker.placeholder = "Ticker";
const formButton = document.createElement("button");
formButton.textContent = "Add Stock";
form.appendChild(formTicker);
form.appendChild(formButton);
watchlist.appendChild(form);

// DISABLE INPUT SUBMIT BUTTON IF EMPTY
form.addEventListener("input", (e) => {
  if (formTicker.value === "") {
    formButton.disabled = true;
  } else {
    formButton.disabled = false;
  }
});

// ADD STOCK TO TABLE
formButton.addEventListener("click", (e) => {
  e.preventDefault();
  const tableBody = document.querySelector("tbody");
  const tableBodyRow = document.createElement("tr");
  tableBodyRow.id = formTicker.value;
  const tableColumnTicker = document.createElement("td");
  tableColumnTicker.textContent = formTicker.value;
  const tableColumnPrice = document.createElement("td");
  const tableColumnTrend = document.createElement("td");
  const tableColumnActions = document.createElement("td");
  const deleteButton = document.createElement("button");
  deleteButton.id = "delete";
  deleteButton.textContent = "x";
  tableColumnActions.appendChild(deleteButton);
  tableBodyRow.appendChild(tableColumnTicker);
  tableBodyRow.appendChild(tableColumnPrice);
  tableBodyRow.appendChild(tableColumnTrend);
  tableBodyRow.appendChild(tableColumnActions);
  tableBody.appendChild(tableBodyRow);
  formTicker.value = "";
  formButton.disabled = true;
});

// DELETE STOCK FROM TABLE
watchlist.addEventListener("click", (e) => {
  if (e.target.id === "delete") {
    e.target.parentNode.parentNode.remove();
  }
});
