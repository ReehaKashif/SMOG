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

  const endDate = new Date(currentDate);
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

// Destroy the previous chart if it exists
if (greeneryChart) {
  greeneryChart.destroy();
}


// Create the chart
greeneryChart = new Chart(greeneryChartCtx, {
  type: 'line',
  data: {
    labels: ["2016", "2017", "2018", "2019", "2020", "2021", "2022", "2023", "2024"],
    datasets: [{
      label: 'Percentage Cover',
      data: [
        20.54446988, 20.28532671, 19.10027766, 11.81231699, 
        12.18350891, 10.05296627, 4.832342497, 11.42906997, 12.2439588
      ],
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
