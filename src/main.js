let faviconUrl = "https://drive.google.com/uc?id=1aQQqYhnESMZ-ZboAs4Rdcu0x8O0ZXlvo&export=download&format=png"

function doGet() {
  return HtmlService.createHtmlOutputFromFile("index")
      .setFaviconUrl(faviconUrl)
      .setTitle("Stonks");
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