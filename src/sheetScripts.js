// const METADATA_PREFIX = '_'
// const REPORTS_PREFIX = '+'
//
// const updateDailyTracker = () =>{
//     const ss = SpreadsheetApp.getActiveSpreadsheet();
//     let currentTotal = 0, investedTotal =  0;
//     ss.getSheets().forEach((sheet)=>{
//         let sheetName = sheet.getSheetName().toLowerCase()
//         if(sheetName[0] !== METADATA_PREFIX && sheetName[0] !== REPORTS_PREFIX){
//             const data  = sheet.getDataRange().getValues();
//             const headers = data[0];
//             const rows = data.slice(1);
//             let instrumentCurrentTotal = 0.0, instrumentInvestedTotal = 0.0;
//
//             rows.forEach(row => {
//                 row.forEach((value, index) => {
//                     const header = headers[index].toLowerCase();
//                     if (header === "current") instrumentCurrentTotal += value;
//                     if (header === "invested") instrumentInvestedTotal += value;
//                 });
//             });
//
//             currentTotal += instrumentCurrentTotal
//             investedTotal += instrumentInvestedTotal
//         }
//     })
//
//     var outputSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("+dailytracker");
//     var lastRow = outputSheet.getLastRow();
//     outputSheet.getRange(lastRow + 1, 1).setValue(new Date());
//     outputSheet.getRange(lastRow + 1, 2).setValue(investedTotal);
//     outputSheet.getRange(lastRow + 1, 3).setValue(currentTotal);
// }