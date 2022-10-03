import { APCAAPIKEYID, APCAAPISECRETKEY } from "./config.js";

const watchlist = document.getElementById("watchlist");
const formTicker = document.getElementById("tickerInput");
const formButton = document.getElementById("addStock");
addStock("f");

// DISABLE INPUT SUBMIT BUTTON IF EMPTY
formTicker.addEventListener("input", (e) => {
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

// DELETE STOCK FROM TABLE
watchlist.addEventListener("click", (e) => {
  if (e.target.className === "delete") {
    e.target.parentNode.parentNode.remove();
  }
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
    .then((data) => {
      if (data === undefined || data === null) {
        const error = document.getElementById("error");
        error.style.display = "block";
      }
      const selectedData = data.reverse().slice(0, 6);
      const lastPrice = selectedData[0]["c"];
      let priceTrends = {
        fiveDay: getChangePercent(selectedData, 5),
        threeDay: getChangePercent(selectedData, 3),
        oneDay: getChangePercent(selectedData, 1),
      };
      tableColumnPrice.textContent = lastPrice;
      tableColumn5day.textContent = priceTrends.fiveDay + "%";
      tableColumn3day.textContent = priceTrends.threeDay + "%";
      tableColumn1day.textContent = priceTrends.oneDay + "%";
      if (priceTrends.fiveDay > 0) {
        tableColumn5day.style.color = "green";
      } else {
        tableColumn5day.style.color = "red";
      }
      if (priceTrends.threeDay > 0) {
        tableColumn3day.style.color = "green";
      } else {
        tableColumn3day.style.color = "red";
      }
      if (priceTrends.oneDay > 0) {
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

function getChangePercent(data, days) {
  const usedData = data.slice(0, days + 1);
  const recentPrice = usedData[0]["c"];
  const earlierPrice = usedData[usedData.length - 1]["c"];
  const change = recentPrice - earlierPrice;
  const changePercent = (change / earlierPrice) * 100;
  return parseFloat(changePercent.toFixed(2));
}
