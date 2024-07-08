let faviconUrl = "https://drive.google.com/uc?id=1aQQqYhnESMZ-ZboAs4Rdcu0x8O0ZXlvo&export=download&format=png"
let headerMap = {}
let dataMap = {}

function doGet() {
  return HtmlService.createHtmlOutputFromFile("index")
      .setFaviconUrl(faviconUrl)
      .setTitle("Stonks");
}

function fetchData(){
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let instruments = []
  let config = {}
  ss.getSheets().forEach((sheet)=>{
    let sheetName = sheet.getSheetName().toLowerCase()
    const [header, ...rows] = sheet.getDataRange().getValues();
    if(sheetName[0] === '_'){
      config[sheetName] = {
        headers: header,
        data: rows,
      }
    }
    else{
      headerMap[sheetName] = header
      dataMap[sheetName] = rows
      instruments.push(sheetName);
    }
  })
  return JSON.stringify({instruments: instruments,
    headerMap: headerMap,
    dataMap: dataMap,
    config: config,
  })
}

function getHeader(sheetName){
  if (Object.keys(headerMap).length === 0){
    fetchData();
  }
  return headerMap[sheetName];
}

function getRows(sheetName){
  if (Object.keys(dataMap).length === 0){
    fetchData();
  }
  return dataMap[sheetName];
}

function copyFormulasToLastRow(sheetName){
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var lastRow = sheet.getLastRow();
  var lastColumn = sheet.getLastColumn();

  // Get the formulas from the last row
  var lastRowRange = sheet.getRange(lastRow, 1, 1, lastColumn);
  var formulas = lastRowRange.getFormulas()[0];

  // Define the range for the new row
  var newRow = lastRow + 1;
  var newRowRange = sheet.getRange(newRow, 1, 1, lastColumn);

  // Adjust the formulas to reference the new row
  var newFormulas = formulas.map(function(formula) {
    if (formula) {
      return formula.replace(new RegExp(lastRow, 'g'), newRow);
    }
    return formula;
  });

  // Set the adjusted formulas into the new row
  newRowRange.setFormulas([newFormulas]);
}