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
    'Punjab': {'2016': 5.46, '2017': 8.03, '2018': 12.20, '2019': 11.57, '2020': 16.07, '2021': 15.19, '2022': 2.02, '2023': 5.51, '2024': 3.39},
    'Attock': {'2016': 1.82, '2017': 0.30, '2018': 1.73, '2019': 5.74, '2020': 17.22, '2021': 2.76, '2022': 0.12, '2023': 0.51, '2024': 0.37},
    'Bahawalnagar': {'2016': 1.87, '2017': 4.81, '2018': 0.92, '2019': 6.74, '2020': 8.61, '2021': 18.98, '2022': 1.11, '2023': 6.05, '2024': 3.99},
    'Bahawalpur': {'2016': 1.64, '2017': 3.70, '2018': 0.80, '2019': 2.90, '2020': 3.86, '2021': 5.91, '2022': 0.71, '2023': 2.18, '2024': 1.22},
    'Bhakar': {'2016': 7.59, '2017': 4.01, '2018': 4.45, '2019': 6.96, '2020': 8.31, '2021': 8.46, '2022': 1.11, '2023': 2.96, '2024': 2.85},
    'Chakwal': {'2016': 0.77, '2017': 0.94, '2018': 0.27, '2019': 4.17, '2020': 16.69, '2021': 3.28, '2022': 0.04, '2023': 0.35, '2024': 0.16},
    'Chiniot': {'2016': 7.89, '2017': 15.57, '2018': 5.19, '2019': 24.40, '2020': 33.08, '2021': 29.96, '2022': 7.87, '2023': 8.65, '2024': 6.62},
    'D G Khan': {'2016': 0.85, '2017': 1.32, '2018': 1.47, '2019': 3.18, '2020': 5.58, '2021': 3.55, '2022': 0.55, '2023': 0.95, '2024': 1.27},
    'Faisalabad': {'2016': 13.78, '2017': 16.52, '2018': 12.46, '2019': 17.82, '2020': 22.30, '2021': 24.37, '2022': 11.67, '2023': 16.99, '2024': 7.29},
    'Gujranwala': {'2016': 5.29, '2017': 11.57, '2018': 4.52, '2019': 14.27, '2020': 15.77, '2021': 17.42, '2022': 1.60, '2023': 5.08, '2024': 2.55},
    'Gujrat': {'2016': 3.43, '2017': 6.11, '2018': 2.14, '2019': 8.92, '2020': 11.43, '2021': 7.76, '2022': 0.81, '2023': 4.22, '2024': 1.91},
    'Hafizabad': {'2016': 5.16, '2017': 12.74, '2018': 5.58, '2019': 11.32, '2020': 18.24, '2021': 12.97, '2022': 0.89, '2023': 4.75, '2024': 2.31},
    'Jhang': {'2016': 6.57, '2017': 8.13, '2018': 4.69, '2019': 10.99, '2020': 12.94, '2021': 11.56, '2022': 2.12, '2023': 5.36, '2024': 3.67},
    'Jhelum': {'2016': 0.23, '2017': 16.51, '2018': 15.14, '2019': 27.88, '2020': 50.17, '2021': 25.82, '2022': 1.29, '2023': 8.69, '2024': 3.39},
    'Kasur': {'2016': 13.61, '2017': 13.65, '2018': 13.70, '2019': 13.75, '2020': 13.80, '2021': 13.85, '2022': 13.90, '2023': 13.95, '2024': 14.00},
    'Khanewal': {'2016': 4.76, '2017': 8.11, '2018': 3.97, '2019': 9.81, '2020': 12.31, '2021': 11.58, '2022': 2.05, '2023': 6.19, '2024': 4.12},
    'Khushab': {'2016': 1.76, '2017': 2.33, '2018': 1.02, '2019': 5.11, '2020': 8.27, '2021': 3.42, '2022': 0.31, '2023': 0.78, '2024': 0.54},
    'Lahore': {'2016': 6.43, '2017': 13.21, '2018': 5.89, '2019': 14.73, '2020': 16.71, '2021': 19.56, '2022': 1.54, '2023': 6.89, '2024': 4.33},
    'Layyah': {'2016': 3.78, '2017': 4.82, '2018': 2.83, '2019': 7.34, '2020': 8.47, '2021': 9.26, '2022': 1.08, '2023': 3.57, '2024': 2.41},
    'Lodhran': {'2016': 6.41, '2017': 11.97, '2018': 7.66, '2019': 14.68, '2020': 17.29, '2021': 16.03, '2022': 2.67, '2023': 7.36, '2024': 4.89},
    'Mandi Bahauldin': {'2016': 5.18, '2017': 7.64, '2018': 4.67, '2019': 10.58, '2020': 13.94, '2021': 15.06, '2022': 2.36, '2023': 6.29, '2024': 3.92},
    'Mianwali': {'2016': 1.92, '2017': 2.15, '2018': 1.20, '2019': 6.15, '2020': 9.86, '2021': 4.64, '2022': 0.43, '2023': 1.24, '2024': 0.89},
    'Multan': {'2016': 9.32, '2017': 14.36, '2018': 10.48, '2019': 15.96, '2020': 18.94, '2021': 22.57, '2022': 1.78, '2023': 8.37, '2024': 5.02},
    'Muzaffargarh': {'2016': 8.57, '2017': 9.15, '2018': 8.99, '2019': 9.24, '2020': 8.75, '2021': 9.85, '2022': 4.56, '2023': 7.12, '2024': 5.33},
     'Nankana': {'2016': 4.12, '2017': 6.46, '2018': 1.36, '2019': 9.23, '2020': 9.40, '2021': 9.69, '2022': 0.78, '2023': 2.00, '2024': 0.97},
    'Narowal': {'2016': 3.79, '2017': 7.44, '2018': 2.59, '2019': 8.55, '2020': 17.35, '2021': 7.75, '2022': 0.67, '2023': 3.74, '2024': 1.15},
    'Okara': {'2016': 8.77, '2017': 8.80, '2018': 8.85, '2019': 8.90, '2020': 8.95, '2021': 9.00, '2022': 9.05, '2023': 9.10, '2024': 9.15},
    'Pakpattan': {'2016': 6.15, '2017': 5.88, '2018': 3.18, '2019': 10.53, '2020': 14.79, '2021': 9.71, '2022': 0.88, '2023': 5.45, '2024': 3.02},
    'Rahim Yar Khan': {'2016': 8.42, '2017': 6.94, '2018': 5.84, '2019': 13.85, '2020': 22.57, '2021': 17.25, '2022': 2.05, '2023': 11.85, '2024': 6.96},
    'Rajanpur': {'2016': 3.28, '2017': 3.35, '2018': 3.42, '2019': 3.50, '2020': 3.60, '2021': 3.65, '2022': 3.75, '2023': 3.80, '2024': 3.85},
    'Rawalpindi': {'2016': 0.23, '2017': 16.51, '2018': 15.14, '2019': 27.88, '2020': 50.17, '2021': 25.82, '2022': 1.29, '2023': 8.69, '2024': 3.39},
    'Sahiwal': {'2016': 8.02, '2017': 17.63, '2018': 3.29, '2019': 20.58, '2020': 28.67, '2021': 31.14, '2022': 3.98, '2023': 15.24, '2024': 6.29},
    'Sargodha': {'2016': 8.43, '2017': 11.58, '2018': 8.29, '2019': 22.67, '2020': 29.49, '2021': 24.73, '2022': 3.22, '2023': 6.84, '2024': 4.12},
    'Sheikhupura': {'2016': 4.14, '2017': 8.32, '2018': 1.81, '2019': 9.82, '2020': 9.68, '2021': 7.36, '2022': 0.51, '2023': 2.02, '2024': 1.16},
    'Sialkot': {'2016': 3.50, '2017': 8.49, '2018': 2.55, '2019': 9.24, '2020': 19.89, '2021': 10.48, '2022': 0.69, '2023': 4.57, '2024': 0.87},
    'Toba Tek Singh': {'2016': 7.16, '2017': 15.21, '2018': 0.94, '2019': 15.69, '2020': 22.70, '2021': 25.96, '2022': 3.47, '2023': 6.65, '2024': 4.03},
    'Vehari': {'2016': 4.63, '2017': 15.78, '2018': 2.38, '2019': 22.61, '2020': 23.40, '2021': 32.46, '2022': 1.90, '2023': 14.27, '2024': 6.04}
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
