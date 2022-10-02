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
  const tableColumnTrend = document.createElement("td");
  const tableColumnActions = document.createElement("td");
  const deleteButton = document.createElement("button");
  deleteButton.className = "delete";
  deleteButton.textContent = "x";
  const promisedData = Promise.resolve(fetchStockData(ticker));
  promisedData
    .then((data) => {
      const lastPrice = data[data.length - 1]["c"];
      const changePercent = getChangePercent(data);
      tableColumnPrice.textContent = lastPrice;
      tableColumnTrend.textContent = changePercent.toFixed(2) + "%";
      if (changePercent > 0) {
        tableColumnTrend.style.color = "green";
      } else {
        tableColumnTrend.style.color = "red";
      }
    })
    .then(() => {
      tableColumnActions.appendChild(deleteButton);
      tableBodyRow.appendChild(tableColumnTicker);
      tableBodyRow.appendChild(tableColumnPrice);
      tableBodyRow.appendChild(tableColumnTrend);
      tableBodyRow.appendChild(tableColumnActions);
      tableBody.appendChild(tableBodyRow);
      formTicker.value = "";
      formButton.disabled = true;
    })
    .catch((error) => {
      alert("Invalid ticker");
    });
}

async function fetchStockData(ticker) {
  const start = getDaysAgo(4);
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
  const change = lastPrice - firstPrice;
  const changePercent = (change / firstPrice) * 100;
  return changePercent;
}

// DELETE STOCK FROM TABLE
watchlist.addEventListener("click", (e) => {
  if (e.target.className === "delete") {
    e.target.parentNode.parentNode.remove();
  }
});
