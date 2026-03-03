const ctx = document.getElementById('humidityChart').getContext('2d');

let humidityChart = new Chart(ctx, {
  type: 'line',
  data: {
    labels: [],
    datasets: [{
      label: 'air humidity (%)',
      data: [],
      borderColor: '#00bcd4',
      fill: false
    }]
  }
});

document.getElementById("btnGet").addEventListener("click", () => {
  const city = document.getElementById("cityInput").value;
  if (!city) return alert("Please enter the city");

  getCityCoordinates(city);
});

function getCityCoordinates(city) {
  fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${city}`)
    .then(res => res.json())
    .then(data => {

      if (!data.results) {
        alert("Can't find the city");
        return;
      }

      const lat = data.results[0].latitude;
      const lon = data.results[0].longitude;

      fetchHumidity(lat, lon);
    });
}

function fetchHumidity(lat, lon) {
  fetch(
    `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&hourly=relative_humidity_2m`
  )
    .then(res => res.json())
    .then(data => {

      const times = data.hourly.time.slice(0, 24);
      const humidity = data.hourly.relative_humidity_2m.slice(0, 24);

      updateChart(times, humidity);
    });
}

function updateChart(times, humidity) {

  humidityChart.data.labels = times.map(t => t.split("T")[1]);
  humidityChart.data.datasets[0].data = humidity;

  humidityChart.update();

  document.getElementById("humidityStatus").innerText =
    "Current humidity: " + humidity[0] + " %";
}