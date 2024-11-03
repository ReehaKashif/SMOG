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
 'Attock': {'Jan - Mar, 2016': 31.43638154669785, 'Jul - Sep, 2016': 26.882589595451044, 'Jan -Mar, 2017': 19.80358559817544, 'Jul -Sep, 2017': 38.37758269156532, 'Jan - Mar, 2018': 34.29198866244362, 'Jul -Sep, 2018': 38.582730673818695, 'Jan - Mar, 2019': 39.44457268210449, 'Jul - Sep, 2019': 38.0770469514804, 'Jan - Mar, 2020': 34.8133673055833, 'Jul - Sep, 2020': 50.51324411057255, 'Jan - Mar, 2021': 29.673702109645824, 'Jul - Sep, 2021': 21.772105483661452, 'Jan - Mar, 2022': 13.719829241214779, 'Jul - Sep, 2022': 7.8187324752207825, 'Jan -Mar, 2023': 12.019168758756251, 'Jul - Sep, 2023': 4.8888038334793515, 'Jan -Mar, 2024': 13.31411381741753, 'Jul -Sep, 2024': 11.492201690871148},
'Bahawalnagar': {'Jan - Mar, 2016': 61.50829213402034, 'Jul - Sep, 2016': 53.7989542805526, 'Jan -Mar, 2017': 60.97617523842461, 'Jul -Sep, 2017': 54.28459687882378, 'Jan - Mar, 2018': 61.16281242928441, 'Jul -Sep, 2018': 48.472792787682515, 'Jan - Mar, 2019': 61.35239252210114, 'Jul - Sep, 2019': 53.644158140166084, 'Jan - Mar, 2020': 65.08555134445861, 'Jul - Sep, 2020': 56.82507115020405, 'Jan - Mar, 2021': 64.85352916248347, 'Jul - Sep, 2021': 50.35827031072567, 'Jan - Mar, 2022': 53.26454822259639, 'Jul - Sep, 2022': 29.43580293681036, 'Jan -Mar, 2023': 46.697529523577195, 'Jul - Sep, 2023': 31.60601121811295, 'Jan -Mar, 2024': 56.06817666799171, 'Jul -Sep, 2024': 36.82814026152049},
'Bahawalpur': {'Jan - Mar, 2016': 19.531118907792237, 'Jul - Sep, 2016': 17.388301077539953, 'Jan -Mar, 2017': 18.850760494056683, 'Jul -Sep, 2017': 18.133980557034565, 'Jan - Mar, 2018': 19.098790485245498, 'Jul -Sep, 2018': 16.23649189728118, 'Jan - Mar, 2019': 19.368328724107737, 'Jul - Sep, 2019': 17.488017884505528, 'Jan - Mar, 2020': 20.084017432439143, 'Jul - Sep, 2020': 18.1847897982244, 'Jan - Mar, 2021': 20.22593742609187, 'Jul - Sep, 2021': 16.13668037575551, 'Jan - Mar, 2022': 15.981044534085251, 'Jul - Sep, 2022': 8.6527390520657, 'Jan -Mar, 2023': 11.704879402208006, 'Jul - Sep, 2023': 8.109532534048473, 'Jan -Mar, 2024': 18.316791200039862, 'Jul -Sep, 2024': 13.607185579492464},
'Bhakar': {'Jan - Mar, 2016': 31.645242112858107, 'Jul - Sep, 2016': 19.57708636968064, 'Jan -Mar, 2017': 34.67451966896268, 'Jul -Sep, 2017': 13.661373014176585, 'Jan - Mar, 2018': 34.52829504616244, 'Jul -Sep, 2018': 7.76480482255505, 'Jan - Mar, 2019': 47.2092156340205, 'Jul - Sep, 2019': 16.96993765493065, 'Jan - Mar, 2020': 52.32750881516729, 'Jul - Sep, 2020': 16.31751696002369, 'Jan - Mar, 2021': 32.3645185611833, 'Jul - Sep, 2021': 12.319734369053691, 'Jan - Mar, 2022': 20.07935199474061, 'Jul - Sep, 2022': 5.08341395432743, 'Jan -Mar, 2023': 24.592349044568746, 'Jul - Sep, 2023': 4.720606967422859, 'Jan -Mar, 2024': 24.505363577895483, 'Jul -Sep, 2024': 6.782526732093008},
'Chakwal': {'Jan - Mar, 2016': 28.322184687573724, 'Jul - Sep, 2016': 36.09409486567018, 'Jan -Mar, 2017': 15.937146545142964, 'Jul -Sep, 2017': 45.66697702023819, 'Jan - Mar, 2018': 26.279542368962776, 'Jul -Sep, 2018': 37.11442836505604, 'Jan - Mar, 2019': 32.7512006639824, 'Jul - Sep, 2019': 44.89962927356438, 'Jan - Mar, 2020': 29.99170378692671, 'Jul - Sep, 2020': 57.83861185240821, 'Jan - Mar, 2021': 23.43961990089452, 'Jul - Sep, 2021': 33.22103386442952, 'Jan - Mar, 2022': 10.931897069227192, 'Jul - Sep, 2022': 15.06402055681654, 'Jan -Mar, 2023': 11.063633222065837, 'Jul - Sep, 2023': 6.922152353647462, 'Jan -Mar, 2024': 12.345010091467103, 'Jul -Sep, 2024': 14.716826013642741},
'Chiniot': {'Jan - Mar, 2016': 57.59340641001439, 'Jul - Sep, 2016': 55.81496108451189, 'Jan -Mar, 2017': 68.35167825904426, 'Jul -Sep, 2017': 61.86556051897446, 'Jan - Mar, 2018': 65.50551095779181, 'Jul -Sep, 2018': 54.885071584690806, 'Jan - Mar, 2019': 66.09023412424285, 'Jul - Sep, 2019': 61.94009839856989, 'Jan - Mar, 2020': 67.38604256318749, 'Jul - Sep, 2020': 71.89985170616363, 'Jan - Mar, 2021': 64.72817106881588, 'Jul - Sep, 2021': 73.00832561218775, 'Jan - Mar, 2022': 43.708954962499135, 'Jul - Sep, 2022': 43.84670087780261, 'Jan -Mar, 2023': 46.14229836646065, 'Jul - Sep, 2023': 34.82923104035208, 'Jan -Mar, 2024': 48.59920177221965, 'Jul -Sep, 2024': 44.27455814095051},
'D G Khan': {'Jan - Mar, 2016': 24.69235716071996, 'Jul - Sep, 2016': 18.15772817189407, 'Jan -Mar, 2017': 28.015377622675302, 'Jul -Sep, 2017': 17.690282291653585, 'Jan - Mar, 2018': 28.653218894674975, 'Jul -Sep, 2018': 14.559411941978695, 'Jan - Mar, 2019': 29.868509931934412, 'Jul - Sep, 2019': 24.177722953281968, 'Jan - Mar, 2020': 30.112060180414414, 'Jul - Sep, 2020': 22.045147087321137, 'Jan - Mar, 2021': 28.987854508681316, 'Jul - Sep, 2021': 17.340532334923235, 'Jan - Mar, 2022': 20.399504686413664, 'Jul - Sep, 2022': 7.8602942422609, 'Jan -Mar, 2023': 21.450710502709626, 'Jul - Sep, 2023': 7.034537168702386, 'Jan -Mar, 2024': 25.270880192255774, 'Jul -Sep, 2024': 9.524155753009895},
'Faisalabad': {'Jan - Mar, 2016': 67.67055821165837, 'Jul - Sep, 2016': 60.15238782496537, 'Jan -Mar, 2017': 64.4155497910448, 'Jul -Sep, 2017': 53.37113536810069, 'Jan - Mar, 2018': 68.46011756205918, 'Jul -Sep, 2018': 50.05715564875912, 'Jan - Mar, 2019': 71.81691030077566, 'Jul - Sep, 2019': 54.579589105844704, 'Jan - Mar, 2020': 72.87623523549836, 'Jul - Sep, 2020': 68.11000841601607, 'Jan - Mar, 2021': 70.61957073140917, 'Jul - Sep, 2021': 59.6957603224518, 'Jan - Mar, 2022': 47.45049344798423, 'Jul - Sep, 2022': 25.877326618869418, 'Jan -Mar, 2023': 47.62995167421185, 'Jul - Sep, 2023': 19.4783874192387, 'Jan -Mar, 2024': 55.05717962610657, 'Jul -Sep, 2024': 27.88496431121431},
'Gujranwala': {'Jan - Mar, 2016': 83.17807651621837, 'Jul - Sep, 2016': 83.86906915908658, 'Jan -Mar, 2017': 85.13958908614443, 'Jul -Sep, 2017': 85.05629085395134, 'Jan - Mar, 2018': 82.85355155810653, 'Jul -Sep, 2018': 86.18770681631683, 'Jan - Mar, 2019': 85.51977305453168, 'Jul - Sep, 2019': 85.9947181706649, 'Jan - Mar, 2020': 83.6054080097241, 'Jul - Sep, 2020': 85.69422458719264, 'Jan - Mar, 2021': 81.60092540713116, 'Jul - Sep, 2021': 84.83073419693812, 'Jan - Mar, 2022': 71.85084630552738, 'Jul - Sep, 2022': 65.72051915001576, 'Jan -Mar, 2023': 72.80919880798005, 'Jul - Sep, 2023': 69.02846440723155, 'Jan -Mar, 2024': 73.60277136487842, 'Jul -Sep, 2024': 69.02591469328317},
'Gujrat': {'Jan - Mar, 2016': 58.88989723385719, 'Jul - Sep, 2016': 63.21016552794493, 'Jan -Mar, 2017': 56.238269677590615, 'Jul -Sep, 2017': 63.67631324419126, 'Jan - Mar, 2018': 61.43568122472739, 'Jul -Sep, 2018': 68.58619110339738, 'Jan - Mar, 2019': 66.16103776666507, 'Jul - Sep, 2019': 77.43845556893552, 'Jan - Mar, 2020': 66.95318708935709, 'Jul - Sep, 2020': 68.40683191719457, 'Jan - Mar, 2021': 65.9740176664618, 'Jul - Sep, 2021': 65.35663444915376, 'Jan - Mar, 2022': 40.583100527614796, 'Jul - Sep, 2022': 34.49134455363983, 'Jan -Mar, 2023': 40.0745524033881, 'Jul - Sep, 2023': 27.243259413749882, 'Jan -Mar, 2024': 38.38650217588373, 'Jul -Sep, 2024': 41.09112663439069},
'Hafizabad': {'Jan - Mar, 2016': 74.60237255464544, 'Jul - Sep, 2016': 79.50449448583011, 'Jan -Mar, 2017': 84.5488166858591, 'Jul -Sep, 2017': 83.94156403674647, 'Jan - Mar, 2018': 83.77304175008307, 'Jul -Sep, 2018': 83.9287723522526, 'Jan - Mar, 2019': 85.56255553988927, 'Jul - Sep, 2019': 86.26708392264082, 'Jan - Mar, 2020': 83.5892081109866, 'Jul - Sep, 2020': 86.87947496690607, 'Jan - Mar, 2021': 84.41294388961471, 'Jul - Sep, 2021': 86.95252451970273, 'Jan - Mar, 2022': 77.15796399682866, 'Jul - Sep, 2022': 68.41905420009805, 'Jan -Mar, 2023': 79.05424942011257, 'Jul - Sep, 2023': 64.67463504701288, 'Jan -Mar, 2024': 79.48944696537723, 'Jul -Sep, 2024': 69.37675219689824},
'Jhang': {'Jan - Mar, 2016': 60.30736081286623, 'Jul - Sep, 2016': 49.47327137607281, 'Jan -Mar, 2017': 61.37211460531796, 'Jul -Sep, 2017': 52.7958826815452, 'Jan - Mar, 2018': 63.52661247525302, 'Jul -Sep, 2018': 45.79630556424948, 'Jan - Mar, 2019': 65.55737499540305, 'Jul - Sep, 2019': 52.67594351848769, 'Jan - Mar, 2020': 72.79234600501066, 'Jul - Sep, 2020': 58.09441207428782, 'Jan - Mar, 2021': 61.8781410677917, 'Jul - Sep, 2021': 57.877705642810206, 'Jan - Mar, 2022': 46.35158166084604, 'Jul - Sep, 2022': 33.032146181116424, 'Jan -Mar, 2023': 48.95644306575342, 'Jul - Sep, 2023': 28.007461096304446, 'Jan -Mar, 2024': 50.70632903091419, 'Jul -Sep, 2024': 33.973693809083606},
'Jhelum': {'Jan - Mar, 2016': 26.74032696170956, 'Jul - Sep, 2016': 50.05259178303562, 'Jan -Mar, 2017': 13.67828447138738, 'Jul -Sep, 2017': 54.599793448778286, 'Jan - Mar, 2018': 24.34073092000504, 'Jul -Sep, 2018': 39.18501215598896, 'Jan - Mar, 2019': 29.075240648006044, 'Jul - Sep, 2019': 54.4553633558545, 'Jan - Mar, 2020': 27.73007841825094, 'Jul - Sep, 2020': 60.497621897463326, 'Jan - Mar, 2021': 26.32617532587683, 'Jul - Sep, 2021': 45.7094259384469, 'Jan - Mar, 2022': 14.23499227885941, 'Jul - Sep, 2022': 26.60338348034393, 'Jan -Mar, 2023': 11.76350597873141, 'Jul - Sep, 2023': 10.28661958847245, 'Jan -Mar, 2024': 13.053844372289348, 'Jul -Sep, 2024': 28.66094742582065},
'Kasur': {'Jan - Mar, 2016': 61.6171206873103, 'Jul - Sep, 2016': 70.04813902623422, 'Jan -Mar, 2017': 66.43833623813535, 'Jul -Sep, 2017': 69.00839980881125, 'Jan - Mar, 2018': 67.27925854243504, 'Jul -Sep, 2018': 68.65483623873924, 'Jan - Mar, 2019': 67.61951520526794, 'Jul - Sep, 2019': 70.2173414531922, 'Jan - Mar, 2020': 68.33805471199781, 'Jul - Sep, 2020': 75.69841119030302, 'Jan - Mar, 2021': 67.06492722528226, 'Jul - Sep, 2021': 73.3436612089386, 'Jan - Mar, 2022': 46.40764582630224, 'Jul - Sep, 2022': 40.16949805662664, 'Jan -Mar, 2023': 41.32723101863957, 'Jul - Sep, 2023': 35.72070076122344, 'Jan -Mar, 2024': 50.01647302038962, 'Jul -Sep, 2024': 42.59265607463017},
'Khanewal': {'Jan - Mar, 2016': 81.4258971572003, 'Jul - Sep, 2016': 72.5257072930511, 'Jan -Mar, 2017': 80.38576637988191, 'Jul -Sep, 2017': 75.54408973284005, 'Jan - Mar, 2018': 81.94263479205284, 'Jul -Sep, 2018': 72.4046624292802, 'Jan - Mar, 2019': 80.94060030263691, 'Jul - Sep, 2019': 75.44584976013566, 'Jan - Mar, 2020': 79.91264803414742, 'Jul - Sep, 2020': 75.3735146558404, 'Jan - Mar, 2021': 79.3365751367972, 'Jul - Sep, 2021': 68.36347673956884, 'Jan - Mar, 2022': 62.33822754875078, 'Jul - Sep, 2022': 27.814667604337306, 'Jan -Mar, 2023': 56.042218685695076, 'Jul - Sep, 2023': 29.772157794934877, 'Jan -Mar, 2024': 64.1791174727562, 'Jul -Sep, 2024': 36.35954505240711},
'Khushab': {'Jan - Mar, 2016': 26.683225132829385, 'Jul - Sep, 2016': 33.90255060203604, 'Jan -Mar, 2017': 30.48719814587751, 'Jul -Sep, 2017': 34.43616907822228, 'Jan - Mar, 2018': 28.883719616857533, 'Jul -Sep, 2018': 20.625933417370923, 'Jan - Mar, 2019': 46.70935009079672, 'Jul - Sep, 2019': 29.63602746754612, 'Jan - Mar, 2020': 38.97749806810565, 'Jul - Sep, 2020': 37.4590946570864, 'Jan - Mar, 2021': 27.11755058940795, 'Jul - Sep, 2021': 30.60145060625353, 'Jan - Mar, 2022': 15.968519537740193, 'Jul - Sep, 2022': 10.687746171755224, 'Jan -Mar, 2023': 15.739347996119463, 'Jul - Sep, 2023': 3.4280754560296915, 'Jan -Mar, 2024': 15.963383894789024, 'Jul -Sep, 2024': 9.478560880079199},
'Lahore': {'Jan - Mar, 2016': 48.52802942518677, 'Jul - Sep, 2016': 48.056144063301275, 'Jan -Mar, 2017': 52.73577750387092, 'Jul -Sep, 2017': 46.9114374203574, 'Jan - Mar, 2018': 49.39087612425258, 'Jul -Sep, 2018': 46.44231201104089, 'Jan - Mar, 2019': 53.6881928404487, 'Jul - Sep, 2019': 45.18622950347688, 'Jan - Mar, 2020': 53.13882161818846, 'Jul - Sep, 2020': 51.81006802206861, 'Jan - Mar, 2021': 48.00973126856854, 'Jul - Sep, 2021': 49.9269007175653, 'Jan - Mar, 2022': 36.55910317296945, 'Jul - Sep, 2022': 16.637819398938515, 'Jan -Mar, 2023': 33.743327468645894, 'Jul - Sep, 2023': 17.66056269751984, 'Jan -Mar, 2024': 35.704997177701465, 'Jul -Sep, 2024': 19.903455107926458},
'Layyah': {'Jan - Mar, 2016': 49.98865236432163, 'Jul - Sep, 2016': 31.810655249455294, 'Jan -Mar, 2017': 50.027394968211766, 'Jul -Sep, 2017': 30.741976750015464, 'Jan - Mar, 2018': 52.92924839232912, 'Jul -Sep, 2018': 21.56717498418764, 'Jan - Mar, 2019': 53.53973281636969, 'Jul - Sep, 2019': 34.969318520561075, 'Jan - Mar, 2020': 64.74316996553992, 'Jul - Sep, 2020': 30.12017709381975, 'Jan - Mar, 2021': 49.856810136518945, 'Jul - Sep, 2021': 27.5455523943264, 'Jan - Mar, 2022': 35.36296862033203, 'Jul - Sep, 2022': 10.203842336123095, 'Jan -Mar, 2023': 38.8860251738118, 'Jul - Sep, 2023': 8.33530841638151, 'Jan -Mar, 2024': 41.488200345387796, 'Jul -Sep, 2024': 11.881490100953283},
'Lodhran': {'Jan - Mar, 2016': 82.90378929137547, 'Jul - Sep, 2016': 76.27853119738585, 'Jan -Mar, 2017': 83.59080709838567, 'Jul -Sep, 2017': 84.34111572236903, 'Jan - Mar, 2018': 85.30922691797095, 'Jul -Sep, 2018': 82.45710034995494, 'Jan - Mar, 2019': 82.64444707955133, 'Jul - Sep, 2019': 82.54876540129177, 'Jan - Mar, 2020': 79.22765291746013, 'Jul - Sep, 2020': 81.80179391538215, 'Jan - Mar, 2021': 79.88252072740899, 'Jul - Sep, 2021': 70.65118423517663, 'Jan - Mar, 2022': 65.68801486245749, 'Jul - Sep, 2022': 46.76372080174661, 'Jan -Mar, 2023': 59.031445654367246, 'Jul - Sep, 2023': 35.566464621585695, 'Jan -Mar, 2024': 69.48986400298531, 'Jul -Sep, 2024': 44.72020757617649},
'Mandi Bahauldin': {'Jan - Mar, 2016': 76.79941414116378, 'Jul - Sep, 2016': 77.3677407359082, 'Jan -Mar, 2017': 75.93312727019826, 'Jul -Sep, 2017': 77.1283575317586, 'Jan - Mar, 2018': 79.23522626786372, 'Jul -Sep, 2018': 80.36874827534784, 'Jan - Mar, 2019': 83.16119439900397, 'Jul - Sep, 2019': 83.54781019330753, 'Jan - Mar, 2020': 81.61437883309671, 'Jul - Sep, 2020': 83.37049206618339, 'Jan - Mar, 2021': 81.45173721867062, 'Jul - Sep, 2021': 81.53089297349906, 'Jan - Mar, 2022': 63.4356297475948, 'Jul - Sep, 2022': 49.42253464199709, 'Jan -Mar, 2023': 64.92232443965696, 'Jul - Sep, 2023': 33.97782832134791, 'Jan -Mar, 2024': 61.291693787542634, 'Jul -Sep, 2024': 48.165915874976626},
'Mianwali': {'Jan - Mar, 2016': 38.76329998240691, 'Jul - Sep, 2016': 36.43826588522444, 'Jan -Mar, 2017': 38.706114874041596, 'Jul -Sep, 2017': 41.8989473427577, 'Jan - Mar, 2018': 39.72500905411907, 'Jul -Sep, 2018': 22.80284435258572, 'Jan - Mar, 2019': 46.32325211309109, 'Jul - Sep, 2019': 29.393171290782348, 'Jan - Mar, 2020': 44.198595911980036, 'Jul - Sep, 2020': 39.56929843753129, 'Jan - Mar, 2021': 40.5858313791118, 'Jul - Sep, 2021': 33.2018702939156, 'Jan - Mar, 2022': 33.873680641173905, 'Jul - Sep, 2022': 7.963716436029923, 'Jan -Mar, 2023': 34.66941480705655, 'Jul - Sep, 2023': 6.238081888410651, 'Jan -Mar, 2024': 34.78313889944968, 'Jul -Sep, 2024': 12.452203105071566},
'Multan': {'Jan - Mar, 2016': 75.26321725094304, 'Jul - Sep, 2016': 63.64398545760134, 'Jan -Mar, 2017': 74.31241235783705, 'Jul -Sep, 2017': 68.67053173068633, 'Jan - Mar, 2018': 75.5383310821954, 'Jul -Sep, 2018': 61.733858174540856, 'Jan - Mar, 2019': 75.00634430567817, 'Jul - Sep, 2019': 68.10803984698495, 'Jan - Mar, 2020': 73.79784852546746, 'Jul - Sep, 2020': 67.53855238037663, 'Jan - Mar, 2021': 72.53693061661181, 'Jul - Sep, 2021': 60.699726925887056, 'Jan - Mar, 2022': 53.12142898460218, 'Jul - Sep, 2022': 33.510812330481485, 'Jan -Mar, 2023': 52.56637185389881, 'Jul - Sep, 2023': 23.16300721303542, 'Jan -Mar, 2024': 58.49555283187532, 'Jul -Sep, 2024': 36.43031625240481},
'Muzaffargarh': {'Jan - Mar, 2016': 53.12439361047918, 'Jul - Sep, 2016': 50.73376247041285, 'Jan -Mar, 2017': 56.60795677915643, 'Jul -Sep, 2017': 51.00698764768759, 'Jan - Mar, 2018': 55.96136958132975, 'Jul -Sep, 2018': 41.807113556208705, 'Jan - Mar, 2019': 59.415380875319414, 'Jul - Sep, 2019': 50.83401740331406, 'Jan - Mar, 2020': 60.39192823673396, 'Jul - Sep, 2020': 49.307752507682615, 'Jan - Mar, 2021': 57.24695749445298, 'Jul - Sep, 2021': 45.94092965766917, 'Jan - Mar, 2022': 37.32106514071153, 'Jul - Sep, 2022': 25.755774927216873, 'Jan -Mar, 2023': 39.50492355649762, 'Jul - Sep, 2023': 20.623163723037973, 'Jan -Mar, 2024': 48.013461344167986, 'Jul -Sep, 2024': 25.04228775699281},
'Nankana': {'Jan - Mar, 2016': 76.20815520418898, 'Jul - Sep, 2016': 75.14751314478248, 'Jan -Mar, 2017': 82.1357035739074, 'Jul -Sep, 2017': 73.68048325112113, 'Jan - Mar, 2018': 82.92225336185902, 'Jul -Sep, 2018': 73.21555380065247, 'Jan - Mar, 2019': 85.49997632626827, 'Jul - Sep, 2019': 76.450163705246, 'Jan - Mar, 2020': 86.00627263418006, 'Jul - Sep, 2020': 83.41228754295675, 'Jan - Mar, 2021': 85.16762642181362, 'Jul - Sep, 2021': 78.76245158207679, 'Jan - Mar, 2022': 73.01437016782805, 'Jul - Sep, 2022': 55.163853359198775, 'Jan -Mar, 2023': 72.6568702681076, 'Jul - Sep, 2023': 53.18794356808855, 'Jan -Mar, 2024': 76.45770502773559, 'Jul -Sep, 2024': 62.90670770123587},
'Narowal': {'Jan - Mar, 2016': 79.9743396189022, 'Jul - Sep, 2016': 85.86693324458825, 'Jan -Mar, 2017': 86.21807630336863, 'Jul -Sep, 2017': 84.18022000834843, 'Jan - Mar, 2018': 89.20269888573269, 'Jul -Sep, 2018': 89.17887768577451, 'Jan - Mar, 2019': 89.53373777658237, 'Jul - Sep, 2019': 84.30230927903334, 'Jan - Mar, 2020': 85.5727430490252, 'Jul - Sep, 2020': 84.14221999627411, 'Jan - Mar, 2021': 89.18565288594948, 'Jul - Sep, 2021': 82.99692615218855, 'Jan - Mar, 2022': 67.50289189038, 'Jul - Sep, 2022': 45.22389310122013, 'Jan -Mar, 2023': 69.44154058674215, 'Jul - Sep, 2023': 70.16365403256816, 'Jan -Mar, 2024': 65.37247070540242, 'Jul -Sep, 2024': 65.41046176519278},
'Okara': {'Jan - Mar, 2016': 66.98456145822864, 'Jul - Sep, 2016': 76.30926879522106, 'Jan -Mar, 2017': 66.67491911503295, 'Jul -Sep, 2017': 71.11961778920465, 'Jan - Mar, 2018': 67.82428300863914, 'Jul -Sep, 2018': 69.80696208205455, 'Jan - Mar, 2019': 62.44079608814089, 'Jul - Sep, 2019': 73.86132657808771, 'Jan - Mar, 2020': 68.14450347372146, 'Jul - Sep, 2020': 80.81693777872546, 'Jan - Mar, 2021': 66.7177151915489, 'Jul - Sep, 2021': 73.33401362475878, 'Jan - Mar, 2022': 46.435082446590044, 'Jul - Sep, 2022': 50.591463077425246, 'Jan -Mar, 2023': 43.11283694913644, 'Jul - Sep, 2023': 38.85166166596817, 'Jan -Mar, 2024': 51.3504059244242, 'Jul -Sep, 2024': 46.860496993650216},
'Pakpattan': {'Jan - Mar, 2016': 77.19133696259223, 'Jul - Sep, 2016': 78.54735292358428, 'Jan -Mar, 2017': 78.11679974193004, 'Jul -Sep, 2017': 74.83806687510642, 'Jan - Mar, 2018': 77.11812990816635, 'Jul -Sep, 2018': 76.37734579533954, 'Jan - Mar, 2019': 67.05754923242748, 'Jul - Sep, 2019': 79.21411340822732, 'Jan - Mar, 2020': 70.0657928261331, 'Jul - Sep, 2020': 82.00671619501807, 'Jan - Mar, 2021': 74.40397846324903, 'Jul - Sep, 2021': 67.99823437627371, 'Jan - Mar, 2022': 48.52307937867348, 'Jul - Sep, 2022': 50.3803391789712, 'Jan -Mar, 2023': 48.17577381934511, 'Jul - Sep, 2023': 31.84357456605147, 'Jan -Mar, 2024': 57.315401445333706, 'Jul -Sep, 2024': 43.534427587959954},
'Rahim Yar Khan': {'Jan - Mar, 2016': 33.008531836601826, 'Jul - Sep, 2016': 44.97194442569783, 'Jan -Mar, 2017': 32.71212754561411, 'Jul -Sep, 2017': 43.917931791570595, 'Jan - Mar, 2018': 30.56034335775809, 'Jul -Sep, 2018': 39.92731784748534, 'Jan - Mar, 2019': 34.58886562734004, 'Jul - Sep, 2019': 44.62984350808094, 'Jan - Mar, 2020': 35.96605509408845, 'Jul - Sep, 2020': 44.99889635340671, 'Jan - Mar, 2021': 34.62220566921671, 'Jul - Sep, 2021': 42.70574608998472, 'Jan - Mar, 2022': 21.120515116799954, 'Jul - Sep, 2022': 34.19154784617483, 'Jan -Mar, 2023': 15.608326961256708, 'Jul - Sep, 2023': 31.985789512158426, 'Jan -Mar, 2024': 26.6360441461902, 'Jul -Sep, 2024': 36.061990354392904},
'Rajanpur': {'Jan - Mar, 2016': 22.223873058964795, 'Jul - Sep, 2016': 20.568294476697815, 'Jan -Mar, 2017': 23.874033838327215, 'Jul -Sep, 2017': 20.17051041728873, 'Jan - Mar, 2018': 23.61130257638285, 'Jul -Sep, 2018': 18.871279878031867, 'Jan - Mar, 2019': 24.796073733939913, 'Jul - Sep, 2019': 21.858309423474836, 'Jan - Mar, 2020': 24.954001311502687, 'Jul - Sep, 2020': 20.9895680543151, 'Jan - Mar, 2021': 24.854208614075805, 'Jul - Sep, 2021': 16.870452724906702, 'Jan - Mar, 2022': 15.003285977575983, 'Jul - Sep, 2022': 7.580015291805893, 'Jan -Mar, 2023': 15.816022243312707, 'Jul - Sep, 2023': 7.925215881534182, 'Jan -Mar, 2024': 20.362957156443866, 'Jul -Sep, 2024': 10.34806038253761},
'Rawalpindi': {'Jan - Mar, 2016': 47.54814250658903, 'Jul - Sep, 2016': 65.27437858359401, 'Jan -Mar, 2017': 38.15538637364354, 'Jul -Sep, 2017': 70.96331433821365, 'Jan - Mar, 2018': 54.4191311318406, 'Jul -Sep, 2018': 67.96266529985935, 'Jan - Mar, 2019': 53.235591060441614, 'Jul - Sep, 2019': 67.54352667364927, 'Jan - Mar, 2020': 52.628581703764176, 'Jul - Sep, 2020': 73.08750964476151, 'Jan - Mar, 2021': 48.7644317237096, 'Jul - Sep, 2021': 60.538502218027986, 'Jan - Mar, 2022': 21.299691210281733, 'Jul - Sep, 2022': 34.68800459357521, 'Jan -Mar, 2023': 19.810350251587987, 'Jul - Sep, 2023': 31.139100171186744, 'Jan -Mar, 2024': 15.731896597342871, 'Jul -Sep, 2024': 44.12513058288792},
'Sahiwal': {'Jan - Mar, 2016': 77.00482204555449, 'Jul - Sep, 2016': 70.02080250621506, 'Jan -Mar, 2017': 73.42662466967896, 'Jul -Sep, 2017': 61.44314322928961, 'Jan - Mar, 2018': 72.7700314228972, 'Jul -Sep, 2018': 64.0937991028145, 'Jan - Mar, 2019': 69.91354863078169, 'Jul - Sep, 2019': 70.69975922243765, 'Jan - Mar, 2020': 71.86326024085513, 'Jul - Sep, 2020': 73.62267056260512, 'Jan - Mar, 2021': 71.3136938746039, 'Jul - Sep, 2021': 57.666588349703595, 'Jan - Mar, 2022': 50.20230261794285, 'Jul - Sep, 2022': 31.71705837645848, 'Jan -Mar, 2023': 48.070839033739546, 'Jul - Sep, 2023': 23.003329078222347, 'Jan -Mar, 2024': 55.83036363954952, 'Jul -Sep, 2024': 34.64117363794767},
'Sargodha': {'Jan - Mar, 2016': 70.10085713799361, 'Jul - Sep, 2016': 54.37646147422722, 'Jan -Mar, 2017': 69.85212677565127, 'Jul -Sep, 2017': 57.28684789531046, 'Jan - Mar, 2018': 72.62873823375297, 'Jul -Sep, 2018': 44.121401854046624, 'Jan - Mar, 2019': 75.80811561660197, 'Jul - Sep, 2019': 49.55921343116356, 'Jan - Mar, 2020': 76.11257958405182, 'Jul - Sep, 2020': 64.73210364272114, 'Jan - Mar, 2021': 72.19572542956297, 'Jul - Sep, 2021': 57.70867865475752, 'Jan - Mar, 2022': 51.50170743325766, 'Jul - Sep, 2022': 24.029574922287257, 'Jan -Mar, 2023': 52.11104315153365, 'Jul - Sep, 2023': 17.920343396146745, 'Jan -Mar, 2024': 51.16587037618594, 'Jul -Sep, 2024': 25.682920790722036},
'Sheikhupura': {'Jan - Mar, 2016': 79.78848167526357, 'Jul - Sep, 2016': 80.79660923357314, 'Jan -Mar, 2017': 83.66165914213745, 'Jul -Sep, 2017': 80.37747071829924, 'Jan - Mar, 2018': 81.8603505747072, 'Jul -Sep, 2018': 77.49982348469732, 'Jan - Mar, 2019': 83.80677255150714, 'Jul - Sep, 2019': 80.66481450129727, 'Jan - Mar, 2020': 83.33408544279284, 'Jul - Sep, 2020': 83.96263796141156, 'Jan - Mar, 2021': 81.62053194115745, 'Jul - Sep, 2021': 81.28593647096054, 'Jan - Mar, 2022': 70.21061291076889, 'Jul - Sep, 2022': 54.483888846395615, 'Jan -Mar, 2023': 71.40042736410473, 'Jul - Sep, 2023': 61.30430624828804, 'Jan -Mar, 2024': 70.12868387275002, 'Jul -Sep, 2024': 60.7591906360578},
'Sialkot': {'Jan - Mar, 2016': 79.55028614331277, 'Jul - Sep, 2016': 83.55264813063059, 'Jan -Mar, 2017': 86.60152892963924, 'Jul -Sep, 2017': 79.75289067079653, 'Jan - Mar, 2018': 85.73191641050116, 'Jul -Sep, 2018': 87.18532848782414, 'Jan - Mar, 2019': 87.69659858274734, 'Jul - Sep, 2019': 85.20895936633835, 'Jan - Mar, 2020': 79.15409473256426, 'Jul - Sep, 2020': 85.49571221326427, 'Jan - Mar, 2021': 85.18873255956268, 'Jul - Sep, 2021': 83.95244538331195, 'Jan - Mar, 2022': 67.39762314572931, 'Jul - Sep, 2022': 54.11048149132331, 'Jan -Mar, 2023': 69.27989122705893, 'Jul - Sep, 2023': 66.07483384589584, 'Jan -Mar, 2024': 60.30224456470522, 'Jul -Sep, 2024': 65.05205018259193},
'Toba Tek Singh': {'Jan - Mar, 2016': 75.5503099842834, 'Jul - Sep, 2016': 64.82744693329505, 'Jan -Mar, 2017': 68.83611616701855, 'Jul -Sep, 2017': 59.928283038960615, 'Jan - Mar, 2018': 73.8157147616048, 'Jul -Sep, 2018': 57.60114887301283, 'Jan - Mar, 2019': 73.17193166578978, 'Jul - Sep, 2019': 63.337451912123896, 'Jan - Mar, 2020': 76.19992714708826, 'Jul - Sep, 2020': 69.05709779473732, 'Jan - Mar, 2021': 73.40536463746095, 'Jul - Sep, 2021': 60.36854285360206, 'Jan - Mar, 2022': 51.349954387896425, 'Jul - Sep, 2022': 31.929374924462685, 'Jan -Mar, 2023': 50.11636513622809, 'Jul - Sep, 2023': 28.39290635589537, 'Jan -Mar, 2024': 56.7897781244017, 'Jul -Sep, 2024': 37.805978579172816},
'Vehari': {'Jan - Mar, 2016': 76.84650519450278, 'Jul - Sep, 2016': 71.41721117700956, 'Jan -Mar, 2017': 78.28025263795485, 'Jul -Sep, 2017': 79.03767954960426, 'Jan - Mar, 2018': 80.64214318191482, 'Jul -Sep, 2018': 75.59217180611535, 'Jan - Mar, 2019': 72.08088127767938, 'Jul - Sep, 2019': 75.60381955043323, 'Jan - Mar, 2020': 69.07361613737926, 'Jul - Sep, 2020': 76.34680004228069, 'Jan - Mar, 2021': 70.90270898423668, 'Jul - Sep, 2021': 61.80152586426957, 'Jan - Mar, 2022': 48.960988627438134, 'Jul - Sep, 2022': 37.498490403913024, 'Jan -Mar, 2023': 45.59298660454132, 'Jul - Sep, 2023': 23.666568102036713, 'Jan -Mar, 2024': 56.70395182939075, 'Jul -Sep, 2024': 31.12432642588079},
'Punjab': {'Jan - Mar, 2016': 47.64609238749387, 'Jul - Sep, 2016': 46.052689511532144, 'Jan -Mar, 2017': 47.39796624258402, 'Jul -Sep, 2017': 46.9530568198243, 'Jan - Mar, 2018': 49.27103395214157, 'Jul -Sep, 2018': 42.66949535385585, 'Jan - Mar, 2019': 51.583974104803346, 'Jul - Sep, 2019': 47.47792997752221, 'Jan - Mar, 2020': 52.05833910955828, 'Jul - Sep, 2020': 50.50942799050646, 'Jan - Mar, 2021': 48.96999604259855, 'Jul - Sep, 2021': 44.03848296831123, 'Jan - Mar, 2022': 34.88032086805956, 'Jul - Sep, 2022': 24.800686521653763, 'Jan -Mar, 2023': 33.82830247040193, 'Jul - Sep, 2023': 21.64814155332488, 'Jan -Mar, 2024': 38.02339583140361, 'Jul -Sep, 2024': 27.62903372083271},
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

  // Get the current date and generate the range of dates from two months ago to December 26, 2024
  const currentDate = new Date();
  const startDate = new Date(currentDate);
  startDate.setMonth(currentDate.getMonth() - 2);
  const endDate = new Date('26-Dec-2024'); // Set end date to December 26, 2024

  const dateRange = [];
  for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
      dateRange.push(new Date(d)); // Add 1-day steps
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

  // Prepare last 7 days data from the current year's past two months
  const last7DaysCombinedData = [];

  // Collect the last 7 days of AQI data and map them to the corresponding dates in the dateRange
  for (let i = 0; i < 7; i++) {
      const pastDate = new Date();
      pastDate.setDate(pastDate.getDate() - i); // Go back one day at a time
      const formattedPastDate = pastDate.toISOString().split('T')[0];

      // Find the index for the past date in the current year's past two months
      const indexPast = this_year_past_two_months.date.indexOf(formattedPastDate);

      // Collect the data for the last 7 days
      const aqiValue = indexPast !== -1 ? this_year_past_two_months.aqi[indexPast] : null;

      // Replace null with 50 for testing purposes, or just leave it as is
      const adjustedAqiValue = aqiValue !== null ? aqiValue : 50;

      // Map this value to the corresponding position in the dateRange
      const dateIndex = dateRange.findIndex(date => date.toISOString().split('T')[0] === formattedPastDate);
      if (dateIndex !== -1) {
          last7DaysCombinedData[dateIndex] = adjustedAqiValue; // Place the AQI value in the corresponding position
      }
  }

  // Fill in null for any dates not covered by the last 7 days
  last7DaysCombinedData.fill(null, 0, dateRange.length); // Initialize with null
  for (let i = 0; i < last7DaysCombinedData.length; i++) {
      if (last7DaysCombinedData[i] === undefined) {
          last7DaysCombinedData[i] = null; // Set undefined to null
      }
  }

  // Datasets for plotting
  const datasets = [
      {
          label: "Previous Year",
          data: lastYearData,
          backgroundColor: "#808080", // Gray color for last year
          borderColor: "#808080", // Gray color for last year
          fill: false,
          pointStyle: false,
          tension: 0.1,
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
          tension: 0.1,
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
          backgroundColor: "#ff0000", // Red for next 14 days
          borderColor: "#ff0000", // Red for next 14 days
          fill: false,
          tension: 0.1,
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
          tension: 0.1,
      },
      {
          label: "Last 7 days",
          data: last7DaysCombinedData, // The AQI data for the last 7 days, aligned with dateRange
          backgroundColor: "#008000", // Green for last 7 days
          borderColor: "#008000", // Green for last 7 days
          fill: false,
          tension: 0.1,
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
