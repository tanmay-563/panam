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
  ss.getSheets().forEach((sheet)=>{
    const [header, ...rows] = sheet.getDataRange().getValues();
    headerMap[sheet.getSheetName().toLowerCase()] = header
    dataMap[sheet.getSheetName().toLowerCase()] = rows
    instruments.push(sheet.getSheetName().toLowerCase());
  })
  return JSON.stringify({instruments: instruments,
    headerMap: headerMap,
    dataMap: dataMap})
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