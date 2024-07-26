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

function updateInstrumentMetadata(data, sheet){
  try{
    let headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];

    if(checkValueExistsInColumn(sheet, "Name", data.name) || SpreadsheetApp.getActiveSpreadsheet().getSheetByName(data.name)){
      return {
        statusCode: 400,
        status: "Instrument with same name already exists",
      }
    }
    if(checkValueExistsInColumn(sheet, "Label", data.label)){
      return {
        statusCode: 400,
        status: "Instrument with same label already exists",
      }
    }

    let newInstrumentRow = headers.map(header => {
      let key = Object.keys(data).find(key => key.toLowerCase() === header.toLowerCase())
      if (key) {
        return data[key]
      }
      else if(header.toLowerCase() === "id"){
        return sheet.getLastRow();
      }
    });

    sheet.appendRow(newInstrumentRow);

    return {
      statusCode: 200,
      status: "Success",
    }
  }
  catch(e){
    return {
      statusCode: 400,
      status: "Error while updating instrument metadata: " + e,
    }
  }
}

function updateColumnMetadata(data, columnSheet, instrumentSheet){
  try{
    let lastRow = columnSheet.getLastRow();
    columnSheet.appendRow([lastRow++, "id", data.name, true, "int"])
    columnSheet.appendRow([lastRow++, "Name", data.name, false, "text"])
    columnSheet.appendRow([lastRow++, "Invested", data.name, false, "currency"])
    columnSheet.appendRow([lastRow++, "Current", data.name, true, "currency"])

    if(data.hasOwnProperty("fields")){
      data.fields.forEach((field)=>{
        if(field.name != ""){
          columnSheet.appendRow([lastRow++, field.name, data.name, field.isAutomated, field.dataType])
        }
      })
    }

    return {
      statusCode: 200,
      status: "Success",
    }
  }
  catch(e){
    return {
      statusCode: 400,
      status: "Error while updating column metadata: " + e,
    }
  }
}

function addInstrumentSheet(data, columnSheet, instrumentSheet){
  try{
    let ss = SpreadsheetApp.getActiveSpreadsheet();
    let newSheet = ss.insertSheet();
    newSheet.setName(data.name)

    let headerRow = ["id", "Name", "Invested"]
    headerRow.push(...data.fields.map(item => item.name));
    headerRow.push("Current")

    newSheet.appendRow(headerRow);
    return {
      statusCode: 200,
      status: "Success",
    }
  }
  catch(e){
    return {
      statusCode: 400,
      status: "Error while adding instrument sheet: " + e,
    }
  }
}

function addInstrument(data){
  if(!data.hasOwnProperty("name") || !data.hasOwnProperty("label")){
    return {
      statusCode: 400,
      status: "Mandatory data missing."
    }
  }

  let instrumentMetadataSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("_instrument");
  let columnMetadataSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("_column");

  let resp = updateInstrumentMetadata(data, instrumentMetadataSheet);
  if(resp.statusCode !== 200){
    return resp;
  }
  resp = updateColumnMetadata(data, columnMetadataSheet, instrumentMetadataSheet);
  if(resp.statusCode !== 200){
    return resp;
  }
  resp = addInstrumentSheet(data, columnMetadataSheet, instrumentMetadataSheet);
  if(resp.statusCode !== 200){
    return resp;
  }

  return{
    statusCode: 200,
    status: "Success",
  }
}

function test(){
  data = {
    "name": "test",
    "label": "Test",
    "calculateXirr": true,
    "iconUrl": "",
    "fields": [
      {
        "name": "when",
        "dataType": "date",
        "isAutomated": false
      }
    ]
  }
  addInstrument(data);
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

function checkValueExistsInColumn(sheet, headerName, valueToCheck) {
  var data = sheet.getDataRange().getValues();

  var headerRow = data[0];
  var columnIndex = headerRow.indexOf(headerName);
  if (columnIndex === -1) {
    throw new Error("Header not found: " + headerName);
  }

  for (var i = 1; i < data.length; i++) {
    if (data[i][columnIndex] == valueToCheck) {
      return true;
    }
  }

  return false;
}