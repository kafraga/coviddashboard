const totalConfirmadoInput = document.querySelector("#confirmed");
const previousConfirmedInput = document.querySelector("#tconfirmed");

const totalMortesInput = document.querySelector("#death");
const previousDeathsInput = document.querySelector("#tdeath");

const totalRecuperadosInput = document.querySelector("#recovered");
const previousRecoveredInput = document.querySelector("#trecovered");

const totalAtivosInput = document.querySelector("#active");
const previousActiveInput = document.querySelector("#tactive");

const comboCountries = document.querySelector("#combo");
const inputDate = document.querySelector("#today");

inputDate.max = new Date().toISOString().split("T")[0];

window.addEventListener("load", () => {
  renderSummary();
  renderCountries();
  inputDateHandler();
  comboCountriesHandler();
});

function renderSummary() {
  fetch("https://api.covid19api.com/summary")
    .then((res) => res.json())
    .then((res) => {
      totalConfirmadoInput.innerHTML = res.Global.TotalConfirmed;
      totalMortesInput.innerHTML = res.Global.TotalDeaths;
      totalRecuperadosInput.innerHTML = res.Global.TotalRecovered;
      totalAtivosInput.innerHTML = res.Global.Date;
    });
}

function renderCountries() {
  fetch("https://api.covid19api.com/countries")
    .then((res) => res.json())
    .then((res) => {
      res.forEach((country) => {
        var opt = document.createElement("option");
        opt.value = country.Slug;
        opt.innerHTML = country.Country;
        comboCountries.appendChild(opt);
      });
    });
}

function inputDateHandler() {
  inputDate.addEventListener("change", (event) =>
    render(event.target.value, comboCountries.value)
  );
}

function comboCountriesHandler() {
  comboCountries.addEventListener("change", (event) =>
    render(inputDate.value, event.target.value)
  );
}

function render(date, country) {
  if (country == "Global") {
    renderSummary();
  } else {
    if (date == "") {
      const summaryURL = "https://api.covid19api.com/summary";
      fetch(summaryURL)
        .then((res) => res.json())
        .then((res) => {
          const currentCountry = res.Countries.find(
            (findCountry) => country == findCountry.Slug
          );
          totalConfirmadoInput.innerHTML = currentCountry.TotalConfirmed;
          totalMortesInput.innerHTML = currentCountry.TotalDeaths;
          totalRecuperadosInput.innerHTML = currentCountry.TotalRecovered;
          totalAtivosInput.innerHTML = currentCountry.Date;
        });
    } else {
      const previousDate = new Date(date);
      previousDate.setDate(previousDate.getDate() - 2);
      fetch(
        `https://api.covid19api.com/country/${country}?from=${previousDate}T00:00:00Z&to=${date}T23:59:59Z`
      )
        .then((res) => res.json())
        .then((res) => {
          totalConfirmadoInput.innerHTML = res[2].Confirmed;
          totalMortesInput.innerHTML = res[2].Deaths;
          totalRecuperadosInput.innerHTML = res[2].Recovered;
          totalAtivosInput.innerHTML = res[2].Active;

          const previousConfirmed = res[2].Confirmed - res[1].Confirmed;
          const previousDeaths = res[2].Deaths - res[1].Deaths;
          const previousRecovered = res[2].Recovered - res[1].Recovered;
          const previousActives = res[2].Active - res[1].Active;

          const previouspreviousConfirmed = res[1].Confirmed - res[0].Confirmed;
          const previouspreviousDeaths = res[1].Deaths - res[0].Deaths;
          const previouspreviousRecovered = res[1].Recovered - res[0].Recovered;
          const previouspreviousActives = res[1].Active - res[0].Active;

          previousConfirmedInput.innerHTML = previousConfirmed;
          var img = document.createElement("img");
          if (previousConfirmed > previouspreviousConfirmed) {
            img.setAttribute("src", "./assets/img/up.png");
          } else {
            img.setAttribute("src", "./assets/img/down.png");
          }
          previousConfirmedInput.appendChild(img);

          previousDeathsInput.innerHTML = previousDeaths;
          var img = document.createElement("img");
          if (previousDeaths > previouspreviousDeaths) {
            img.setAttribute("src", "./assets/img/up.png");
          } else {
            img.setAttribute("src", "./assets/img/down.png");
          }
          previousDeathsInput.appendChild(img);

          previousRecoveredInput.innerHTML = previousRecovered;
          var img = document.createElement("img");
          if (previousRecovered > previouspreviousRecovered) {
            img.setAttribute("src", "./assets/img/up.png");
          } else {
            img.setAttribute("src", "./assets/img/down.png");
          }
          previousRecoveredInput.appendChild(img);

          previousActiveInput.innerHTML = previousActives;
          var img = document.createElement("img");
          if (previousActives > previouspreviousActives) {
            img.setAttribute("src", "./assets/img/up.png");
          } else {
            img.setAttribute("src", "./assets/img/down.png");
          }
          previousActiveInput.appendChild(img);
        });
    }
  }
}
