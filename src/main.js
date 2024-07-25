let faviconUrl = "https://drive.google.com/uc?id=1aQQqYhnESMZ-ZboAs4Rdcu0x8O0ZXlvo&export=download&format=png"
const DAILY_CRON_HOUR = 6
const METADATA_PREFIX = '_'
const REPORTS_PREFIX = '+'

function setupTriggers(){
  setupDailyCronTrigger()
}

function doGet() {
  return HtmlService.createHtmlOutputFromFile("index")
      .setFaviconUrl(faviconUrl)
      .setTitle("Panam")
      .addMetaTag('viewport', 'width=device-width, initial-scale=1')
      .addMetaTag('apple-mobile-web-app-capable', 'yes')
      .addMetaTag('mobile-web-app-capable', 'yes');
}

function fetchData(){
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let data = {}
  ss.getSheets().forEach((sheet)=>{
    let sheetName = sheet.getSheetName().toLowerCase()
    data[sheetName]  = sheet.getDataRange().getValues();
    if(sheetName === "_sheet"){
      data[sheetName].push(["sheetUrl", getSheetUrl(ss, sheet)]);
    }
  })
  return JSON.stringify(data)
}

function addRow(sheetName, rowMap){
  let sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);

  let headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  let newRowData = headers.map(header => {
    if (rowMap.hasOwnProperty(header)) {
      return rowMap[header];
    } else {
      let lastRow = sheet.getLastRow();
      let formula = sheet.getRange(lastRow, headers.indexOf(header) + 1).getFormula();
      return formula.replace(new RegExp(lastRow, 'g'), lastRow+1).replace(new RegExp(lastRow-1, 'g'), lastRow);
    }
  });

  sheet.appendRow(newRowData);
}

function setupDailyCronTrigger() {
  deleteTriggers();

  ScriptApp.newTrigger('dailyCron')
      .timeBased()
      .everyDays(1)
      .atHour(DAILY_CRON_HOUR)
      .create();

  Logger.log('Daily trigger set for ' + DAILY_CRON_HOUR + ' hour');
}

function deleteTriggers() {
  var triggers = ScriptApp.getProjectTriggers();

  for (var i = 0; i < triggers.length; i++) {
    if (triggers[i].getHandlerFunction() === 'dailyCron') {
      ScriptApp.deleteTrigger(triggers[i]);
    }
  }
}

function dailyCron(){
  updateDailyTracker();
}

const updateDailyTracker = () =>{
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let currentTotal = 0, investedTotal =  0;
  ss.getSheets().forEach((sheet)=>{
    let sheetName = sheet.getSheetName().toLowerCase()
    if(sheetName[0] !== METADATA_PREFIX && sheetName[0] !== REPORTS_PREFIX){
      const data  = sheet.getDataRange().getValues();
      const headers = data[0];
      const rows = data.slice(1);
      let instrumentCurrentTotal = 0.0, instrumentInvestedTotal = 0.0;

      rows.forEach(row => {
        row.forEach((value, index) => {
          const header = headers[index].toLowerCase();
          if (header === "current") instrumentCurrentTotal += value;
          if (header === "invested") instrumentInvestedTotal += value;
        });
      });

      currentTotal += instrumentCurrentTotal
      investedTotal += instrumentInvestedTotal
    }
  })

  let outputSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("+dailytracker");
  let lastRow = outputSheet.getLastRow();
  outputSheet.getRange(lastRow + 1, 1).setValue(new Date());
  outputSheet.getRange(lastRow + 1, 2).setValue(investedTotal);
  outputSheet.getRange(lastRow + 1, 3).setValue(currentTotal);
}

function getSheetUrl(spreadsheet, sheet) {
  let sheetId = sheet.getSheetId();
  return spreadsheet.getUrl() + '#gid=' + sheetId;
}