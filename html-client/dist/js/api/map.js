let pollutantDistrictsMap = null;
let districtMap = null;
let rankingMap = null;

$(document).ready(function () {
  fetchPollutantDistrictsApi();

  // Attach event listeners to select inputs
  $("#pollutant-source-selector").change(function () {
    fetchPollutantDistrictsApi();
  });
});

// Helper functions for cache management
const setLocalStorageWithTimestamp = (key, value) => {
  const data = { value, timestamp: Date.now() };
  localStorage.setItem(key, JSON.stringify(data));
};

const getLocalStorageWithTimestamp = (key, maxAge = 3600000) => { // Default max age: 1 hour
  const data = JSON.parse(localStorage.getItem(key));
  if (!data || (Date.now() - data.timestamp > maxAge)) {
    return null;
  }
  return data.value;
};

// Fetch weather data from API with optional forced refresh
const getWeatherDataApi = (forceRefresh = false) => {
  if (!forceRefresh) {
    const weatherData = getLocalStorageWithTimestamp("weather_data");
    if (weatherData) {
      return Promise.resolve(weatherData);
    }
  }

  return fetch(`${SERVER_URL}/weather_data`)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      setLocalStorageWithTimestamp("weather_data", data);
      return data;
    })
    .catch((err) => {
      console.error("Fetch error:", err);
      return null;
    });
};

// Fetch weather data for a district with optional forced refresh
const getWeatherData = async (district, forceRefresh = false) => {
  const data = await getWeatherDataApi(forceRefresh);
  if (!data) {
    console.error("Weather data not available");
    return { temp: "N/A", windspeed: "N/A" };
  }
  const districtIndex = data.District.findIndex((d) => d.trim().toLowerCase() === district.trim().toLowerCase());

  if (districtIndex === -1) {
    console.error(`District not found in weather data: ${district}`);
    return { temp: "N/A", windspeed: "N/A" };
  }

  const temp = `${Math.round(data.Temperature[districtIndex])}°C`;
  const windspeed = `${Math.round(data.Wind_speed[districtIndex])} km/hr`;

  return { temp, windspeed };
};

// Fetch AQI map data
const getMapAqi = () => {
  return fetch(`${SERVER_URL}/districts_aqi_color`)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .catch((err) => {
      console.error("Fetch error:", err);
      return null;
    });
};

// Initialize AQI map
getMapAqi()
  .then((districtData) => {
    if (districtMap) {
      districtMap.remove();
    }
    districtMap = L.map("map1").setView([30.5, 72.5], 7);

    // Add Google Maps layer
    L.tileLayer("http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}", {
      maxZoom: 20,
      subdomains: ["mt0", "mt1", "mt2", "mt3"],
    }).addTo(districtMap);

    const districts = [
      {
        district: "aoi_punjab",
        aqi_name: "black",
        color_code: "#000000",
        aqi: 0,
      },
      ...districtData.districts_aqi_color,
    ];

    const weatherPromises = districts.map(async (districtInfo) => {
      const formattedDistrict = districtInfo.district.replace(/\s+/g, "_");
      const shapefilePath = `./shapefiles/${formattedDistrict}.shp`;

      const { temp, windspeed } = await getWeatherData(districtInfo.district, true);
      const popupContent = `<div class="flex gap-8" style="font-size: 15px;">
        <span><strong>District:</strong> ${districtInfo.district}</span>
        <span><strong>AQI:</strong> ${Math.round(districtInfo.aqi)}</span>
      </div>
      <div class="flex gap-8" style="font-size: 15px;">
        <span><strong>Temp:</strong> ${temp}</span>
        <span><strong>Windspeed:</strong> ${windspeed}</span>
      </div>`;

      return loadShapefile(shapefilePath, districtInfo, districtMap, popupContent);
    });

    Promise.all(weatherPromises)
      .then(() => {
        console.log("All Shapefiles loaded successfully");
      })
      .catch((error) => console.error("Error loading Shapefiles:", error));
  })
  .catch((error) => console.error("Error fetching district data:", error));

// Fetch ranking map data
const getMapRanking = () => {
  return fetch(`${SERVER_URL}/map_ranking`)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .catch((err) => {
      console.error("Fetch error:", err);
      return null;
    });
};

// Initialize ranking map
getMapRanking()
  .then((districtData) => {
    if (rankingMap) {
      rankingMap.remove();
    }
    rankingMap = L.map("map2").setView([30.5, 72.5], 7);

    L.tileLayer("http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}", {
      maxZoom: 20,
      subdomains: ["mt0", "mt1", "mt2", "mt3"],
    }).addTo(rankingMap);

    const districts = districtData.map_ranking.map((data) => {
      const districtRank = color_palette.flat().indexOf(data.color);
      return { ...data, rank: districtRank + 1 };
    });

    const mapRankingData = [
      { district: "aoi_punjab", color: "#000000", aqi: 0 },
      ...districts,
    ];

    const weatherPromises = mapRankingData.map(async (districtInfo) => {
      const formattedDistrict = districtInfo.district.replace(/\s+/g, "_");
      const shapefilePath = `./shapefiles/${formattedDistrict}.shp`;

      const { temp, windspeed } = await getWeatherData(districtInfo.district, true);
      const popupContent = `<div class="flex gap-8" style="font-size: 15px;">
        <span><strong>Rank:</strong> ${districtInfo.rank}</span>
        <span><strong>District:</strong> ${districtInfo.district}</span>
        <span><strong>AQI:</strong> ${Math.round(districtInfo.aqi)}</span>
      </div>
      <div class="flex gap-8" style="font-size: 15px;">
        <span><strong>Temp:</strong> ${temp}</span>
        <span><strong>Windspeed:</strong> ${windspeed}</span>
      </div>`;
      return loadShapefile(shapefilePath, districtInfo, rankingMap, popupContent);
    });

    Promise.all(weatherPromises)
      .then(() => {
        console.log("All Shapefiles loaded successfully");
      })
      .catch((error) => console.error("Error loading Shapefiles:", error));
  })
  .catch((error) => console.error("Error fetching district data:", error));

// Pollutant districts
const getPollutantDistricts = (source) => {
  return fetch(`${SERVER_URL}/pollutant_districts?pollutant_name=${source}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .catch((err) => {
      console.error("Fetch error:", err);
      return null;
    });
};

const fetchPollutantDistrictsApi = () => {
  const source = $("#pollutant-source-selector").val();
  getPollutantDistricts(source).then((districtData) => {
    plotPollutantDistricts(districtData, source);
  });
};
