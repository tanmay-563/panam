let faviconUrl = "https://drive.google.com/uc?id=1aQQqYhnESMZ-ZboAs4Rdcu0x8O0ZXlvo&export=download&format=png"

function doGet() {
  return HtmlService.createHtmlOutputFromFile("index")
      .setFaviconUrl(faviconUrl)
      .setTitle("Panam");
}

function fetchData(){
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let data = {}
  ss.getSheets().forEach((sheet)=>{
    let sheetName = sheet.getSheetName().toLowerCase()
    data[sheetName]  = sheet.getDataRange().getValues();
  })
  return JSON.stringify(data)
}


function copyFormulasToLastRow(sheet){
  var lastRow = sheet.getLastRow();
  var lastColumn = sheet.getLastColumn();

  var lastRowRange = sheet.getRange(lastRow, 1, 1, lastColumn);
  var formulas = lastRowRange.getFormulas()[0];

  var newRow = lastRow + 1;
  var newRowRange = sheet.getRange(newRow, 1, 1, lastColumn);

  var newFormulas = formulas.map(function(formula) {
    if (formula) {
      return formula.replace(new RegExp(lastRow, 'g'), newRow);
    }
    return formula;
  });

  newRowRange.setFormulas([newFormulas]);
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