const pollutantsData = {
  PM10: {
    predictedValue: 13.75,
    sources: {
      Vehicles: "30-30",
      Industry: "25-25",
      Construction: "15-15",
      Agriculture: "23-23",
      ResidentialHeat: "5-5",
      Miscellaneous: "2-2",
    },
  },
  "PM2.5": {
    predictedValue: 9.5,
    sources: {
      Vehicles: "30-30",
      Industry: "25-25",
      Construction: "15-15",
      Agriculture: "23-23",
      ResidentialHeat: "5-5",
      Miscellenious: "2-2",
    },
  },
  NO2: {
    predictedValue: 10.2,
    sources: {
      Vehicles: "50-50",
      Industry: "35-35",
      Construction: "0",
      Agriculture: "10-10",
      ResidentialHeat: "3-3",
      Miscellaneous: "2-2",
    },
  },
  CO: {
    predictedValue: 136,
    sources: {
      Vehicles: "50-50",
      Industry: "35-35",
      Construction: "0",
      Agriculture: "10-10",
      ResidentialHeat: "5-5",
      Miscellaneous: "0",
    },
  },
  O3: {
    predictedValue: 1.7,
    sources: {
      Vehicles: "50-50",
      Industry: "35-35",
      Construction: "0",
      Agriculture: "10-10",
      ResidentialHeat: "3-3",
      Miscellaneous: "2-2",
    },
  },
  SO2: {
    predictedValue: 1.4,
    sources: {
      Vehicles: "0",
      Industry: "50-50",
      Construction: "0",
      Agriculture: "20-20",
      ResidentialHeat: "0-0",
      Miscellaneous: "30-30",
    },
  },
  Dust: {
    predictedValue: 50,
    sources: {
      Vehicles: "0",
      Industry: "0",
      Construction: "35-35",
      Agriculture: "50-50",
      ResidentialHeat: "0-0",
      Miscellaneous: "15-15",
    },
  },
};

const pollutantsValues = {
  PM10: 13.75,
  "PM2.5" : 9.5,
  NO2: 10.2,
  CO: 136,
  O3: 1.7,
  SO2: 1.4,
  Dust: 50,
};

const pollutantsSources = [
  "Vehicles",
  "Industry",
  "Construction",
  "Agriculture",
  "ResidentialHeat",
  "Miscellaneous",
];

const pollutantsKeys = Object.keys(pollutantsValues);

const pollutantsUnits = {
  Carbon_monoxide: "CO",
  Dust: "Dust",
  Nitrogen_dioxide: "NO2",
  Ozone: "O3",
  Pm_10: "PM10",
  Pm_25: "PM2.5",
  Sulphur_dioxide: "SO2",
};

const pollutantsUnitsKeys = Object.keys(pollutantsUnits);
