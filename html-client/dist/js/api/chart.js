// let leftChartCtx = document.getElementById("chartLeftCanva").getContext("2d");
// let rightChartCtx = document.getElementById("chartRightCanva").getContext("2d");
let predictionChartCtx = document
.getElementById("predictionChart")
.getContext("2d");
let greeneryChartCtx = document.getElementById("greeneryChart").getContext("2d");

let leftChart, rightChart, predictionChart, greeneryChart;

$(document).ready(function () {
  // Initial function call when the page loads
  handleHistoricalParamsChange();
  handleForecastDistrictChange();
  handleSmogCausesDistrictChange();

  // Attach event listeners to select inputs
  $("#district-selector").change(function () {
    handleHistoricalParamsChange();
    handleForecastDistrictChange();
  });

  $("#duration-selector").change(function () {
    handleHistoricalParamsChange();
    handleForecastDistrictChange();
  });

  $("#predition-district-selector").change(function () {
    handleSmogCausesDistrictChange();
  });
  
  $("#greenery-district-selector").change(function () {
    handleGreeneryDistrictChange();
  });
});

const getHistoricalData = (district) => {
  return fetch(`${SERVER_URL}/historical_data?district=${district}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      return plotHistoricalGraph(data);
    })
    .catch((err) => {
      console.error("Fetch error:", { err });
      return null;
    });
};

const getForecastAqi = (district) => {
  return fetch(`${SERVER_URL}/forecast_data?district=${district}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      plotPredictionGraph(data);
      return;
    })
    .catch((err) => {
      console.error("Fetch error:", err);
      return null;
    });
};

const getPredictionData = (district) => {
  const lastYearPromise = fetch(`${SERVER_URL}/last_year?district=${district}`);
  const thisYearPromise = fetch(`${SERVER_URL}/this_year?district=${district}`);
  // const thisYearPromise = fetch(`${SERVER_URL}/this_year?district=${district}`);

  return Promise.all([lastYearPromise, thisYearPromise])
    .then(([lastYearResponse, thisYearResponse]) => {
      if (!lastYearResponse.ok || !thisYearResponse.ok) {
        throw new Error("Network response was not ok");
      }
      return Promise.all([lastYearResponse.json(), thisYearResponse.json()]);
    })
    .then(([lastYearData, thisYearData]) => {
      plotSmogCausesChart({ ...lastYearData, ...thisYearData });
      return;
    })
    .catch((err) => {
      console.error("Fetch error:", err);
      return null;
    });
};

const getGreeneryData = (district) => {
  const data = {
'Attock': {'2016_Q1': 31.43638155, '2016_Q2': 4.038132296, '2016_Q3': 26.8825896, '2016_Q4': 3.11817384, '2017_Q1': 19.8035856, '2017_Q2': 3.060655468, '2017_Q3': 38.37758269, '2017_Q4': 6.995746239, '2018_Q1': 34.29198866, '2018_Q2': 4.336691178, '2018_Q3': 38.58273067, '2018_Q4': 13.85848902, '2019_Q1': 39.44457268, '2019_Q2': 11.09730338, '2019_Q3': 38.07704695, '2019_Q4': 28.37189263, '2020_Q1': 34.81336731, '2020_Q2': 20.3312415, '2020_Q3': 50.51324411, '2020_Q4': 17.83978226, '2021_Q1': 29.67370211, '2021_Q2': 2.92044754, '2021_Q3': 21.77210548, '2021_Q4': 8.340910193, '2022_Q1': 13.71982924, '2022_Q2': 0.078240344, '2022_Q3': 7.818732475, '2022_Q4': 2.101909243, '2023_Q1': 12.01916876, '2023_Q2': 0.599696636, '2023_Q3': 4.888803833, '2023_Q4': 1.154350081, '2024_Q1': 13.31411382, '2024_Q2': 0.635897632, '2024_Q3': 11.49220169, '2024_Q4': null},
'Bahawalnagar': {'2016_Q1': 61.50829213, '2016_Q2': 2.42356362, '2016_Q3': 53.79895428, '2016_Q4': 5.753784797, '2017_Q1': 60.97617524, '2017_Q2': 2.628418612, '2017_Q3': 54.28459688, '2017_Q4': 7.46012221, '2018_Q1': 61.16281243, '2018_Q2': 0.752667272, '2018_Q3': 48.47279279, '2018_Q4': 15.78765365, '2019_Q1': 61.35239252, '2019_Q2': 6.299310357, '2019_Q3': 53.64415814, '2019_Q4': 15.31900005, '2020_Q1': 65.08555134, '2020_Q2': 6.532328876, '2020_Q3': 56.82507115, '2020_Q4': 7.189360893, '2021_Q1': 64.85352916, '2021_Q2': 7.216282466, '2021_Q3': 50.35827031, '2021_Q4': 8.337781546, '2022_Q1': 53.26454822, '2022_Q2': 0.135321292, '2022_Q3': 29.43580294, '2022_Q4': 6.457947427, '2023_Q1': 46.69752952, '2023_Q2': 1.698064838, '2023_Q3': 31.60601122, '2023_Q4': 0.253726706, '2024_Q1': 56.06817667, '2024_Q2': 0.613318701, '2024_Q3': 36.82814026, '2024_Q4': null},
'Bahawalpur': {'2016_Q1': 19.53111891, '2016_Q2': 1.917215982, '2016_Q3': 17.38830108, '2016_Q4': 3.816053135, '2017_Q1': 18.85076049, '2017_Q2': 2.441791784, '2017_Q3': 18.13398056, '2017_Q4': 4.477779825, '2018_Q1': 19.09879049, '2018_Q2': 0.667746716, '2018_Q3': 16.2364919, '2018_Q4': 5.379614782, '2019_Q1': 19.36832872, '2019_Q2': 2.825733159, '2019_Q3': 17.48801788, '2019_Q4': 6.03669092, '2020_Q1': 20.08401743, '2020_Q2': 3.772457459, '2020_Q3': 18.1847898, '2020_Q4': 3.808474263, '2021_Q1': 20.22593743, '2021_Q2': 3.507357882, '2021_Q3': 16.13668038, '2021_Q4': 3.543973334, '2022_Q1': 15.98104453, '2022_Q2': 0.129845908, '2022_Q3': 8.652739052, '2022_Q4': 3.251111504, '2023_Q1': 11.7048794, '2023_Q2': 0.955254192, '2023_Q3': 8.109532534, '2023_Q4': 0.155164062, '2024_Q1': 18.3167912, '2024_Q2': 0.553309222, '2024_Q3': 13.60718558, '2024_Q4': null},
'Rajanpur': {'2016': 3.28, '2017': 0.55, '2018': 2.8, '2019': 4.76, '2020': 7.32, '2021': 7.29, '2022': 1.64, '2023': 5.08, '2024': 2.55},
'Okara': {'2016': 8.77, '2017': 12.38, '2018': 3.21, '2019': 21.34, '2020': 25.59, '2021': 23.82, '2022': 1.49, '2023': 6.84, '2024': 6.45},
'Kasur': {'2016': 13.61, '2017': 17.52, '2018': 11.85, '2019': 23.4, '2020': 25.53, '2021': 24.5, '2022': 1.82, '2023': 6.6, '2024': 4.96},
'Nankana': {'2016': 4.12, '2017': 6.46, '2018': 1.36, '2019': 9.23, '2020': 9.4, '2021': 9.69, '2022': 0.78, '2023': 2.0, '2024': 0.97},
'Chiniot': {'2016': 7.89, '2017': 15.57, '2018': 5.19, '2019': 24.4, '2020': 33.08, '2021': 29.96, '2022': 7.87, '2023': 8.65, '2024': 6.62},
'Sargodha': {'2016': 8.43, '2017': 11.58, '2018': 8.29, '2019': 22.67, '2020': 29.49, '2021': 24.73, '2022': 3.22, '2023': 6.84, '2024': 4.12},
'Sheikhupura': {'2016': 4.14, '2017': 8.32, '2018': 1.81, '2019': 9.82, '2020': 9.68, '2021': 7.36, '2022': 0.51, '2023': 2.02, '2024': 1.16},
'Hafizabad': {'2016': 1.87, '2017': 3.02, '2018': 1.23, '2019': 9.28, '2020': 7.82, '2021': 8.77, '2022': 0.77, '2023': 0.99, '2024': 0.52},
'Chakwal': {'2016': 0.77, '2017': 0.94, '2018': 0.27, '2019': 4.17, '2020': 16.69, '2021': 3.28, '2022': 0.04, '2023': 0.35, '2024': 0.16},
'Mianwali': {'2016': 4.08, '2017': 2.6, '2018': 1.07, '2019': 4.74, '2020': 6.19, '2021': 4.88, '2022': 0.43, '2023': 0.94, '2024': 0.59},
'Khushab': {'2016': 0.95, '2017': 1.29, '2018': 0.65, '2019': 5.46, '2020': 8.19, '2021': 4.14, '2022': 0.19, '2023': 1.08, '2024': 0.32},
'Bhakkar': {'2016': 7.59, '2017': 4.01, '2018': 4.45, '2019': 6.96, '2020': 8.31, '2021': 8.46, '2022': 1.11, '2023': 2.96, '2024': 2.85},
'Jhang': {'2016': 6.21, '2017': 11.65, '2018': 2.5, '2019': 12.97, '2020': 16.36, '2021': 18.37, '2022': 2.97, '2023': 4.13, '2024': 3.82},
'Narowal': {'2016': 1.32, '2017': 5.88, '2018': 1.75, '2019': 4.44, '2020': 12.8, '2021': 5.96, '2022': 0.05, '2023': 1.94, '2024': 0.35},
'Mandi Bahauldin': {'2016': 8.46, '2017': 5.4, '2018': 4.43, '2019': 20.57, '2020': 27.57, '2021': 24.94, '2022': 1.51, '2023': 6.56, '2024': 3.24},
'Jhelum': {'2016': 0.75, '2017': 1.12, '2018': 0.02, '2019': 6.03, '2020': 17.47, '2021': 3.72, '2022': 0.17, '2023': 1.16, '2024': 0.44},
'Gujrat': {'2016': 2.05, '2017': 6.28, '2018': 0.81, '2019': 9.69, '2020': 20.29, '2021': 13.81, '2022': 0.2, '2023': 2.69, '2024': 0.51},
'Toba Tek Singh': {'2016': 7.16, '2017': 15.21, '2018': 0.94, '2019': 15.69, '2020': 22.7, '2021': 25.96, '2022': 3.47, '2023': 6.65, '2024': 4.03},
'Sialkot': {'2016': 3.5, '2017': 8.49, '2018': 2.55, '2019': 9.24, '2020': 19.89, '2021': 10.48, '2022': 0.69, '2023': 4.57, '2024': 0.87},
'Dera Ghazi Khan': {'2016': 0.85, '2017': 1.32, '2018': 1.47, '2019': 3.18, '2020': 5.58, '2021': 3.55, '2022': 0.55, '2023': 0.95, '2024': 1.27},
'Pakpattan': {'2016': 4.49, '2017': 14.15, '2018': 2.88, '2019': 22.59, '2020': 29.85, '2021': 34.06, '2022': 3.08, '2023': 12.69, '2024': 11.36},
'Vehari': {'2016': 4.63, '2017': 15.78, '2018': 2.38, '2019': 22.61, '2020': 23.4, '2021': 32.46, '2022': 1.9, '2023': 14.27, '2024': 6.04},
'Muzaffargarh': {'2016': 9.56, '2017': 18.33, '2018': 7.49, '2019': 18.6, '2020': 22.65, '2021': 25.46, '2022': 5.6, '2023': 9.68, '2024': 8.97},
'Lodhran': {'2016': 3.07, '2017': 12.68, '2018': 2.32, '2019': 14.29, '2020': 18.01, '2021': 29.65, '2022': 1.51, '2023': 9.71, '2024': 3.47},
'Khanewal': {'2016': 10.26, '2017': 16.02, '2018': 4.07, '2019': 19.79, '2020': 22.59, '2021': 38.5, '2022': 5.06, '2023': 13.92, '2024': 8.8},
'Multan': {'2016': 11.63, '2017': 21.9, '2018': 9.79, '2019': 24.58, '2020': 25.06, '2021': 30.86, '2022': 4.8, '2023': 10.96, '2024': 7.42},
'Lahore': {'2016': 14.35, '2017': 12.49, '2018': 7.3, '2019': 15.06, '2020': 16.41, '2021': 11.7, '2022': 0.88, '2023': 6.2, '2024': 2.92},
'Gujranwala': {'2016': 3.98, '2017': 9.63, '2018': 2.84, '2019': 9.72, '2020': 14.72, '2021': 9.56, '2022': 0.68, '2023': 2.29, '2024': 1.36},
'Rawalpindi': {'2016': 0.23, '2017': 16.51, '2018': 15.14, '2019': 27.88, '2020': 50.17, '2021': 25.82, '2022': 1.29, '2023': 8.69, '2024': 3.39},
'Faisalabad': {'2016': 13.78, '2017': 16.52, '2018': 0.46, '2019': 19.51, '2020': 26.66, '2021': 28.62, '2022': 4.37, '2023': 7.02, '2024': 3.39},
'Sahiwal': {'2016': 8.02, '2017': 17.63, '2018': 3.29, '2019': 20.58, '2020': 28.67, '2021': 31.14, '2022': 3.98, '2023': 15.24, '2024': 6.29},
'Layyah': {'2016': 4.69, '2017': 4.31, '2018': 5.84, '2019': 10.94, '2020': 14.05, '2021': 14.88, '2022': 1.85, '2023': 4.41, '2024': 5.42},
'Rahim Yar Khan': {'2016': 17.79, '2017': 14.04, '2018': 12.2, '2019': 18.64, '2020': 22.06, '2021': 22.95, '2022': 6.77, '2023': 15.39, '2024': 7.56},
'Punjab': {'2016': 5.46, '2017': 8.03, '2018': 12.2, '2019': 11.57, '2020': 16.07, '2021': 15.19, '2022': 2.02, '2023': 5.51, '2024': 3.39}
  };

  plotGreeneryChart(data, district);
}

const handleHistoricalParamsChange = () => {
  // Get the values from the select inputs
  const district = $("#district-selector").val();
  // Call the function with the current values
  if (district) {
    getHistoricalData(district);
    // fetchAllHistoricalData(district);
  }
};

const handleForecastDistrictChange = () => {
  const district = $("#district-selector").val();
  if (district) {
    getForecastAqi(district);
  }
};

const handleSmogCausesDistrictChange = () => {
  const district = $("#predition-district-selector").val();
  if (district) {
    getPredictionData(district);
  }
};

const handleGreeneryDistrictChange = () => {
  const district = $("#greenery-district-selector").val();
  if (district) {
    getGreeneryData(district);
  }
};

const plotHistoricalGraph = (data) => {
  const dataFor7DaysBefore = data.forecast_7d.aqi;
  const dataFor14DaysBefore = data.forecast_14d.aqi;
  const dataFor2MonthsBefore = data.historical;
  const totalLength = dataFor2MonthsBefore.aqi.length;

  try {
    const datasets = [
      {
        label: "Actual",
        data: roundNullableData(dataFor2MonthsBefore.aqi),
        borderColor: "blue",
        fill: false,
      },
      {
        label: "14 days",
        data: roundNullableData(padList([...dataFor14DaysBefore], totalLength)),
        borderColor: "yellow",
        fill: false,
      },
      {
        label: "7 days",
        data: roundNullableData(padList([...dataFor7DaysBefore], totalLength)),
        borderColor: "green",
        fill: false,
      },
    ];

    if (leftChart) {
      leftChart.destroy();
    }

    // leftChart = new Chart(leftChartCtx, {
    //   type: "line",
    //   data: {
    //     labels: dataFor2MonthsBefore.date.map(convertDateFormat),
    //     datasets,
    //   },
    //   options: {
    //     responsive: true,
    //     scales: {
    //       y: {
    //         beginAtZero: false,
    //         min: 0,
    //         max: 500,
    //       },
    //     },
    //   },
    // });
  } catch (error) {
    console.log({ error });
  }
};

const plotPredictionGraph = (data) => {
  const { firstSection, secondSection, thirdSection } = divideArray(data.aqi);

  let groupedDatasets = [
    {
      label: "7 days",
      data: roundNullableData(firstSection),
      borderColor: "#06402b",
      fill: false,
    },
    {
      label: "Next 7 days",
      data: roundNullableData(secondSection),
      backgroundColor: "transparent",
      borderColor: "#008000",
      fill: false,
    },
    {
      label: "Next 45 days",
      data: roundNullableData(thirdSection),
      backgroundColor: "transparent",
      borderColor: "#90EE90",
      fill: false,
    },
  ];

  // if (rightChart) {
  //   rightChart.destroy();
  // }

  // rightChart = new Chart(rightChartCtx, {
  //   type: "line",
  //   data: {
  //     labels: data.date.map(convertDateFormat),
  //     datasets: groupedDatasets,
  //   },
  //   options: {
  //     responsive: true,
  //     // plugins: {
  //     // title: {
  //     //   display: true,
  //     //   text: (ctx) => "Prediction Data",
  //     // },
  //     // legend: {
  //     //   display: false,
  //     // },
  //     // },
  //     scales: {
  //       y: {
  //         beginAtZero: false,
  //         min: 0,
  //         max: 500,
  //       },
  //       x: {
  //         beginAtZero: false,
  //       },
  //     },
  //   },
  // });
};

const plotSmogCausesChart = (data) => {
  const last_year_next_two_months = data["last_year_data"]["next_two_months"];
  const last_year_past_two_months = data["last_year_data"]["past_two_months"];

  const this_year_next_two_months = data["this_year_data"]["next_two_months"];
  const this_year_past_two_months = data["this_year_data"]["past_two_months"];

  // Get the current date and generate the range of dates from two months ago to two months in the future
  const currentDate = new Date();
  const startDate = new Date(currentDate);
  startDate.setMonth(currentDate.getMonth() - 2);

  // const endDate = new Date(currentDate);
  const endDate = new Date('14-Dec-2024');
  endDate.setMonth(currentDate.getMonth() + 2);

  const dateRange = [];
  for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
    dateRange.push(new Date(d)); // Add 4-day steps
  }

  // Map AQI data for last year
  const lastYearData = dateRange.map((date) => {
    const formattedDate = convertDateFormat(date, false);
    const pastIndex = last_year_past_two_months.date.findIndex(
      (d) => convertDateFormat(d, false) === formattedDate
    );
    const nextIndex = last_year_next_two_months.date.findIndex(
      (d) => convertDateFormat(d, false) === formattedDate
    );

    if (pastIndex !== -1) {
      return last_year_past_two_months.aqi[pastIndex];
    } else if (nextIndex !== -1) {
      return last_year_next_two_months.aqi[nextIndex];
    } else {
      return null; // No data for this date
    }
  });

  // Map AQI data for this year
  const thisYearData = dateRange.map((date) => {
    const formattedDate = convertDateFormat(date, false);
    const pastIndex = this_year_past_two_months.date.findIndex(
      (d) => convertDateFormat(d, false) === formattedDate
    );
    const nextIndex = this_year_next_two_months.date.findIndex(
      (d) => convertDateFormat(d, false) === formattedDate
    );

    if (pastIndex !== -1) {
      return this_year_past_two_months.aqi[pastIndex];
    } else if (nextIndex !== -1) {
      return this_year_next_two_months.aqi[nextIndex];
    } else {
      return null; // No data for this date
    }
  });

  const skipped = (ctx, value) => ctx.p0.skip || ctx.p1.skip ? value : undefined;
  const down = (ctx, value) => ctx.p0.parsed.y > ctx.p1.parsed.y ? value : undefined;

  // Datasets for plotting
  const datasets = [
    {
      label: "Previous Year",
      data: lastYearData,
      backgroundColor: "#808080", // Gray color for last year
      borderColor: "#808080", // Gray color for last year
      fill: false,
      // pointStyle: 'circle',
      pointStyle: false,
      tension: 0.1,
      // pointRadius: 0,
    },
    {
      label: "Current Year",
      data: thisYearData,
      segment: {
        borderColor: function(context) {
          const index = context.p0DataIndex;
          const label = context.chart.data.labels[index];
          if (!label) return '#000000'; // Default color if label is undefined
  
          const currentDate = new Date(`${label}-2024`); // Assuming 2024 as the year
          const today = new Date();
          const diffInDays = (currentDate - today) / (1000 * 60 * 60 * 24);
  
          // Color logic based on date difference
          if (diffInDays <= 7 && diffInDays > 0) {
            return '#8B0000'; // Next 7 days
          } else if (diffInDays <= 14 && diffInDays > 7) {
            return '#ff0000'; // Next 14 days
          } else if (diffInDays > 14) {
            return '#FF7F7F'; // Beyond 14 days
          } else {
            return '#000000'; // Default for past dates
          }
        }
      },
      // backgroundColor: "#000000", // Black color for current year
      // borderColor: "#000000", // Black color for current year
      // segment: {
      //   borderColor: ctx => skipped(ctx, 'rgb(0,0,0,0.2)') || down(ctx, 'rgb(192,75,75)'),
      //   borderDash: ctx => skipped(ctx, [6, 6]),
      // },
      fill: false,
      pointStyle: false,
      tension: 0.1,
      spanGaps: true,
    },
    {
      label: "Next 7 days",
      data: roundNullableData(
        padListWithNull(
          this_year_next_two_months.aqi.slice(0, 7),
          last_year_past_two_months.date.length +
            last_year_next_two_months.date.length +
            this_year_past_two_months.date.length
        )
      ),
      backgroundColor: "#8B0000", // Dark red for future 7 days
      borderColor: "#8B0000", // Dark red for future 7 days
      fill: false,
      // pointStyle: false,
      tension: 0.1
      // pointRadius: 0,
    },
    {
      label: "Next 14 days",
      data: roundNullableData(
        padListWithNull(
          this_year_next_two_months.aqi.slice(7, 14),
          last_year_past_two_months.date.length +
            last_year_next_two_months.date.length +
            this_year_past_two_months.date.length +
            7
        )
      ),
      backgroundColor: "#ff0000", // Red for next 7 days
      borderColor: "#ff0000", // Red for next 7 days
      fill: false,
      // pointStyle: false,
      tension: 0.1
      // pointRadius: 0,
    },
    {
      label: "After 14 days",
      data: roundNullableData(
        padListWithNull(
          this_year_next_two_months.aqi.slice(14),
          last_year_past_two_months.date.length +
            last_year_next_two_months.date.length +
            this_year_past_two_months.date.length +
            14
        )
      ),
      backgroundColor: "#FF7F7F", // Light red for next 45 days
      borderColor: "#FF7F7F", // Light red for next 45 days
      fill: false,
      // pointStyle: false,
      tension: 0.1
      // pointRadius: 0,
    },
  ];

  // Destroy the previous chart if it exists
  if (predictionChart) {
    predictionChart.destroy();
  }

  // Create the chart
  predictionChart = new Chart(predictionChartCtx, {
    type: "line",
    data: {
      labels: dateRange.map((date) => convertDateFormat(date, false)), // Use the generated dateRange for the x-axis
      datasets: datasets, // Aligned data for both years
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: false,
          min: 0,
          max: 800,
        },
        x: {
          type: "category", // Category scale to ensure the dates are displayed correctly
          title: {
            display: true,
            text: "Date",
          },
        },
      },
      interaction: {
        intersect: true,
        mode: 'index',
      },
    },
  });
};

const plotGreeneryChart = (data, district) => {
  // Destroy the previous chart if it exists
  if (greeneryChart) {
    greeneryChart.destroy();
  }
  
  const years = Object.keys(data[district]);
  const values = Object.values(data[district]);

  // Create the chart
  greeneryChart = new Chart(greeneryChartCtx, {
    type: 'line',
    data: {
      labels: years,
      datasets: [{
        label: 'Percentage Cover',
        data: values,
        backgroundColor: '#70AD46',  // Bar fill color
        borderColor: '#70AD46',        // Bar border color
        borderWidth: 1,                               // Border width
        pointStyle: false
      }]
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,  // Ensures the y-axis starts at 0
          title: {
            display: true,
            text: 'Percentage'  // Label for y-axis
          }
        },
        x: {
          title: {
            display: true,
            text: 'Year'  // Label for x-axis
          }
        }
      },
      responsive: true,
      plugins: {
        legend: {
          display: true,
          position: 'top', // Position of the legend
        },
        tooltip: {
          enabled: true,   // Enable tooltips on hover
        }
      }
    }
  });
  
}

/*
const plotSmogCausesChart = (data) => {
  const last_year_next_two_months = data["last_year_data"]["next_two_months"];
  const last_year_past_two_months = data["last_year_data"]["past_two_months"];

  const this_year_next_two_months = data["this_year_data"]["next_two_months"];
  const this_year_past_two_months = data["this_year_data"]["past_two_months"];

  // Generate labels with only day and month
  let labels = [
    ...last_year_past_two_months.date,
    ...last_year_next_two_months.date,
    ...this_year_past_two_months.date,
    ...this_year_next_two_months.date,
  ].map((dateStr) => convertDateFormat(dateStr, false));  // Keeping the same date format without year

  // Create datasets
  let datasets = [
    {
      label: "Last year",
      data: roundNullableData([
        ...last_year_past_two_months.aqi,
        ...last_year_next_two_months.aqi,
      ]),
      borderColor: "#808080",
      fill: false,
    },
    {
      label: "Current year last 2 months",
      data: roundNullableData(
        padListWithNull(
          this_year_past_two_months.aqi,
          last_year_past_two_months.date.length +
            last_year_next_two_months.date.length
        )
      ),
      borderColor: "#000000",
      fill: false,
    },
    {
      label: "Current year future 7 days",
      data: roundNullableData(
        padListWithNull(
          this_year_next_two_months.aqi.slice(0, 7),
          last_year_past_two_months.date.length +
            last_year_next_two_months.date.length +
            this_year_past_two_months.date.length
        )
      ),
      borderColor: "#8B0000",
      fill: false,
    },
    {
      label: "Current year next 7 days",
      data: roundNullableData(
        padListWithNull(
          this_year_next_two_months.aqi.slice(7, 14),
          last_year_past_two_months.date.length +
            last_year_next_two_months.date.length +
            this_year_past_two_months.date.length +
            7
        )
      ),
      borderColor: "#ff0000",
      fill: false,
    },
    {
      label: "Current year next 45 days",
      data: roundNullableData(
        padListWithNull(
          this_year_next_two_months.aqi.slice(14),
          last_year_past_two_months.date.length +
            last_year_next_two_months.date.length +
            this_year_past_two_months.date.length +
            14
        )
      ),
      borderColor: "#FF7F7F",
      fill: false,
    },
  ];

  // Destroy the previous chart if it exists
  if (predictionChart) {
    predictionChart.destroy();
  }

  // Create the new chart
  predictionChart = new Chart(predictionChartCtx, {
    type: "line",
    data: {
      labels,  // Use the day/month labels
      datasets,
    },
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: false,
          min: 0,
          max: 500,
        },
        x: {
          type: 'category',  // Use category scale for x-axis
          labels: labels.map(label => {
            const [day, month] = label.split('-');  // Extract day and month only
            return `${day}-${month}`;  // Display only day and month
          }),
        },
      },
    },
  });
};
*/

/*
const plotSmogCausesChart = (data) => {
  const last_year_next_two_months = data["last_year_data"]["next_two_months"];
  const last_year_past_two_months = data["last_year_data"]["past_two_months"];

  const this_year_next_two_months = data["this_year_data"]["next_two_months"];
  const this_year_past_two_months = data["this_year_data"]["past_two_months"];

  let labels = [
    ...last_year_past_two_months.date,
    ...last_year_next_two_months.date,
    ...this_year_past_two_months.date,
    ...this_year_next_two_months.date,
  ].map((dateStr) => convertDateFormat(dateStr, false));

  let datasets = [
    {
      label: "Last year",
      data: roundNullableData([
        ...last_year_past_two_months.aqi,
        ...last_year_next_two_months.aqi,
      ]),
      borderColor: "#808080",
      fill: false,
    },
    {
      label: "Current year last 2 months",
      data: roundNullableData(
        padListWithNull(
          this_year_past_two_months.aqi,
          last_year_past_two_months.date.length +
            last_year_next_two_months.date.length
        )
      ),
      borderColor: "#000000",
      fill: false,
    },
    {
      label: "Current year future 7 days",
      data: roundNullableData(
        padListWithNull(
          this_year_next_two_months.aqi.slice(0, 7),
          last_year_past_two_months.date.length +
            last_year_next_two_months.date.length +
            this_year_past_two_months.date.length
        )
      ),
      borderColor: "#8B0000",
      fill: false,
    },
    {
      label: "Current year next 7 days",
      data: roundNullableData(
        padListWithNull(
          this_year_next_two_months.aqi.slice(7, 14),
          last_year_past_two_months.date.length +
            last_year_next_two_months.date.length +
            this_year_past_two_months.date.length +
            7
        )
      ),
      borderColor: "#ff0000",
      fill: false,
    },
    {
      label: "Current year next 45 days",
      data: roundNullableData(
        padListWithNull(
          this_year_next_two_months.aqi.slice(14),
          last_year_past_two_months.date.length +
            last_year_next_two_months.date.length +
            this_year_past_two_months.date.length +
            14
        )
      ),
      borderColor: "#FF7F7F",
      fill: false,
    },
  ];

  if (predictionChart) {
    predictionChart.destroy();
  }

  predictionChart = new Chart(predictionChartCtx, {
    type: "line",
    data: {
      labels,
      datasets,
    },
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: false,
          min: 0,
          max: 500,
        },
        x: {
          beginAtZero: false,
        },
      },
    },
  });
};
*/
const convertDateFormat = (dateStr, shouldIncludeYear = true) => {
  const date = new Date(dateStr);

  const day = date.getDate();
  const year = shouldIncludeYear ? date.getFullYear().toString().slice(-2) : "";

  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "June",
    "July",
    "Aug",
    "Sept",
    "Oct",
    "Nov",
    "Dec",
  ];
  const month = monthNames[date.getMonth()];

  return `${day}-${month}${year ? `-${year}` : ""}`;
};

const padList = (list, targetLength) => {
  if (list.length >= targetLength) {
    return list;
  }
  const padding = new Array(targetLength - list.length).fill(null);
  return [...padding, ...list];
};

const padListWithNull = (list, paddingLength) => {
  const padding = new Array(paddingLength).fill(null);
  return [...padding, ...list];
};

const roundNullableData = (data) => {
  return data.map((d) => {
    if (!d) return d;
    else return Math.round(d);
  });
};
