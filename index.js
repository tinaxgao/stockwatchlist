import { APCAAPIKEYID, APCAAPISECRETKEY } from "./config.js";

const watchlist = document.getElementById("watchlist");

// FORM
const form = document.createElement("form");
const formTicker = document.createElement("input");
formTicker.id = "tickerInput";
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
  const input = formTicker.value;
  addStock(input);
});

function addStock(ticker) {
  const tableBody = document.querySelector("tbody");
  const tableBodyRow = document.createElement("tr");
  tableBodyRow.className = ticker;
  const tableColumnTicker = document.createElement("td");
  tableColumnTicker.textContent = ticker.toUpperCase();
  const tableColumnPrice = document.createElement("td");
  const tableColumn5day = document.createElement("td");
  const tableColumn3day = document.createElement("td");
  const tableColumn1day = document.createElement("td");
  const tableColumnActions = document.createElement("td");
  const deleteButton = document.createElement("button");
  deleteButton.className = "delete";
  deleteButton.textContent = "x";
  const promisedData = Promise.resolve(fetchStockData(ticker));
  promisedData
    .catch((error) => {
      alert("Invalid ticker symbol");
    })
    .then((data) => {
      const lastPrice = data[data.length - 1]["c"];

      // copy and split the data array, only keep the last 5 values
      const fiveDayData = data.reverse().slice(0, 6);
      const threeDayData = data.reverse().slice(0, 4);
      const oneDayData = data.reverse().slice(0, 2);
      console.log(
        data,
        "fiveDayData",
        fiveDayData,
        "threeDayData",
        threeDayData,
        "oneDayData",
        oneDayData
      );
      const changePercent5 = getChangePercent(fiveDayData);
      const changePercent3 = getChangePercent(threeDayData);
      const changePercent1 = getChangePercent(oneDayData);
      tableColumnPrice.textContent = lastPrice;
      tableColumn5day.textContent = changePercent5;
      if (changePercent5 > 0) {
        tableColumn5day.style.color = "green";
      } else {
        tableColumn5day.style.color = "red";
      }
      tableColumn3day.textContent = changePercent3;
      if (changePercent3 > 0) {
        tableColumn3day.style.color = "green";
      } else {
        tableColumn3day.style.color = "red";
      }
      tableColumn1day.textContent = changePercent1;
      if (changePercent1 > 0) {
        tableColumn1day.style.color = "green";
      } else {
        tableColumn1day.style.color = "red";
      }
    })
    .then(() => {
      tableColumnActions.appendChild(deleteButton);
      tableBodyRow.appendChild(tableColumnTicker);
      tableBodyRow.appendChild(tableColumnPrice);
      tableBodyRow.appendChild(tableColumn5day);
      tableBodyRow.appendChild(tableColumn3day);
      tableBodyRow.appendChild(tableColumn1day);
      tableBodyRow.appendChild(tableColumnActions);
      tableBody.appendChild(tableBodyRow);
      formTicker.value = "";
      formButton.disabled = true;
    })
    .catch((error) => {
      console.log(error);
    });
}

async function fetchStockData(ticker) {
  let startDaysAgo = 10;
  const start = getDaysAgo(startDaysAgo);
  const end = getDaysAgo(1);
  const url = `https://data.alpaca.markets/v2/stocks/${ticker}/bars?start=${start}&end=${end}&timeframe=1Day`;

  let response = await fetch(url, {
    method: "GET",
    headers: {
      "APCA-API-KEY-ID": APCAAPIKEYID,
      "APCA-API-SECRET-KEY": APCAAPISECRETKEY,
    },
  });
  let data = await response.json();
  return data.bars;
}

function getDaysAgo(days) {
  const today = new Date();
  const daysAgo = new Date(today);
  daysAgo.setDate(daysAgo.getDate() - days);
  return daysAgo.toISOString();
}

function getChangePercent(data) {
  const firstPrice = data[0]["c"];
  const lastPrice = data[data.length - 1]["c"];
  const change = firstPrice - lastPrice;
  const changePercent = (change / lastPrice) * 100;
  return changePercent.toFixed(2) + "%";
}

// DELETE STOCK FROM TABLE
watchlist.addEventListener("click", (e) => {
  if (e.target.className === "delete") {
    e.target.parentNode.parentNode.remove();
  }
});
