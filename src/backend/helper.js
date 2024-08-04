const updateDailyTracker = () =>{
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let currentTotal = 0, investedTotal =  0;
    ss.getSheets().forEach((sheet)=>{
        let sheetName = sheet.getSheetName().toLowerCase()
        if(sheetName[0] !== METADATA_PREFIX && sheetName[0] !== REPORTS_PREFIX && sheetName[0] !== IGNORE_PREFIX){
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

function updateInstrumentMetadata(data, sheet){
    try{
        let headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];

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

function updateColumnMetadata(data, columnSheet){
    try{
        let lastRow = columnSheet.getLastRow();
        columnSheet.appendRow([lastRow++, "id", data.name, true, "int"])
        columnSheet.appendRow([lastRow++, "Name", data.name, false, "text"])
        columnSheet.appendRow([lastRow++, "Date", data.name, false, "date"])
        columnSheet.appendRow([lastRow++, "Invested", data.name, false, "currency"])
        columnSheet.appendRow([lastRow++, "Current", data.name, true, "currency"])

        if(data.hasOwnProperty("fields")){
            data.fields.forEach((field)=>{
                if(field.name !== ""){
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

function addInstrumentSheet(data){
    try{
        let ss = SpreadsheetApp.getActiveSpreadsheet();
        let newSheet = ss.insertSheet();
        newSheet.setName(data.name)

        let headerRow = ["id", "Name", "Date", "Invested"]
        if(data.fields){
            headerRow.push(...data.fields
                .map(item => item.name)
                .filter(name => name && name.trim() !== ""));
        }
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

function checkValueExistsInColumn(sheet, headerName, valueToCheck) {
    let data = sheet.getDataRange().getValues();

    let headerRow = data[0];
    let columnIndex = headerRow.indexOf(headerName);
    if (columnIndex === -1) {
        throw new Error("Header not found: " + headerName);
    }

    for (let i = 1; i < data.length; i++) {
        if (data[i][columnIndex] === valueToCheck) {
            return true;
        }
    }

    return false;
}

function deleteRowsWithValue(sheet, headerName, valueToDelete) {
    if (!sheet) {
        return;
    }

    let dataRange = sheet.getDataRange();
    let data = dataRange.getValues();

    let headerRow = data[0];
    let columnIndex = headerRow.indexOf(headerName);

    if (columnIndex === -1) {
        Logger.log('Header not found: ' + headerName);
        return;
    }

    let rowsToDelete = [];

    for (let i = 1; i < data.length; i++) {
        if (data[i][columnIndex] === valueToDelete) {
            rowsToDelete.push(i + 1);
        }
    }

    for (let j = rowsToDelete.length - 1; j >= 0; j--) {
        sheet.deleteRow(rowsToDelete[j]);
    }
}

function getSheetUrl(spreadsheet, sheet) {
    let sheetId = sheet? sheet.getSheetId() : "";
    return spreadsheet.getUrl() + '#gid=' + (sheetId ? sheetId : "");
}
