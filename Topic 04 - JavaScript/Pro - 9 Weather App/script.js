const searchBtn = document.getElementById("searchBtn");
const searchInput = document.getElementById("searchInput");
const weatherDisplay = document.getElementById("weatherDisplay");

// Create suggestions dropdown dynamically
const dropdown = document.createElement("div");
dropdown.id = "suggestions-dropdown";
dropdown.className = "suggestions-list";
searchInput.parentNode.appendChild(dropdown);

const apiKey = "ff8acb48131348f390d140625262503";

const updateElement = (id, text) => {
  const el = document.getElementById(id);
  if (el) el.textContent = text;
};

// --- NEW: AUTOCOMPLETE LOGIC ---
async function fetchSuggestions(query) {
  if (query.length < 3) {
    dropdown.innerHTML = "";
    return;
  }

  try {
    const res = await fetch(
      `https://api.weatherapi.com/v1/search.json?key=${apiKey}&q=${query}`,
    );
    const cities = await res.json();

    dropdown.innerHTML = "";
    cities.forEach((city) => {
      const div = document.createElement("div");
      div.className = "suggestion-item";
      div.textContent = `${city.name}, ${city.country}`;
      div.onclick = () => {
        searchInput.value = city.name;
        dropdown.innerHTML = "";
        getWeather();
      };
      dropdown.appendChild(div);
    });
  } catch (err) {
    console.error("Autocomplete error:", err);
  }
}

searchInput.addEventListener("input", (e) => {
  fetchSuggestions(e.target.value);
});

// Close dropdown when clicking outside
document.addEventListener("click", (e) => {
  if (e.target !== searchInput) dropdown.innerHTML = "";
});
// -------------------------------

async function getWeather() {
  const city = searchInput.value.trim();
  if (!city) return;

  const url = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${encodeURIComponent(city)}&aqi=yes`;

  try {
    searchBtn.disabled = true;
    searchBtn.textContent = "...";
    dropdown.innerHTML = ""; // Clear suggestions on search

    const response = await fetch(url);
    if (!response.ok) throw new Error("City not found.");

    const data = await response.json();
    const { location, current } = data;
    const aq = current.air_quality;

    weatherDisplay.classList.remove("hidden");

    updateElement("cityName", `${location.name}, ${location.country}`);
    updateElement(
      "localTime",
      new Date(location.localtime).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      }),
    );
    updateElement("temperature", `${Math.round(current.temp_c)}°C`);
    updateElement("conditionText", current.condition.text);

    const icon = document.getElementById("conditionImg");
    icon.src = `https:${current.condition.icon}`;

    updateElement("humidity", `${current.humidity}%`);
    updateElement("feelsLike", `${Math.round(current.feelslike_c)}°C`);
    updateElement("pressure", `${current.pressure_mb} hPa`);
    updateElement("visibility", `${current.vis_km} km`);
    updateElement("windSpeed", `${current.wind_kph} km/h`);
    updateElement("windDirection", current.wind_dir);

    const aqi = aq["us-epa-index"];
    const aqiLevels = [
      "-",
      "Good",
      "Moderate",
      "Unhealthy (Sensitive)",
      "Unhealthy",
      "Very Unhealthy",
      "Hazardous",
    ];
    updateElement("aqiValue", `${aqi} (${aqiLevels[aqi] || "N/A"})`);

    updateElement("co", `${aq.co.toFixed(1)}`);
    updateElement("no2", `${aq.no2.toFixed(1)}`);
    updateElement("o3", `${aq.o3.toFixed(1)}`);
    updateElement("so2", `${aq.so2.toFixed(1)}`);
    updateElement("pm25", `${aq.pm2_5.toFixed(1)}`);
    updateElement("pm10", `${aq.pm10.toFixed(1)}`);
  } catch (error) {
    alert(error.message);
  } finally {
    searchBtn.disabled = false;
    searchBtn.textContent = "Search";
  }
}

searchBtn.addEventListener("click", getWeather);
searchInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") getWeather();
});
