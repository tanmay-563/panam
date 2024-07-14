const METADATA_PREFIX = '_'
const REPORTS_PREFIX = '+'

function convertToJSON(array) {
    const headers = array[0];
    const rows = array.slice(1);

    return rows.map(row => {
        let obj = {};
        row.forEach((value, index) => {
            obj[headers[index]] = value;
        });
        return obj;
    });
}

function getInstruments(content){
    return Object.keys(content);
}

function getHeaders(content){
    return content[0];
}

function getValues(content){
    return content.slice(1);
}

function getUniqueValues(jsonData, key){
    return jsonData.reduce((uniqueValues, item) => {
        if (!uniqueValues.includes(item[key])) {
            uniqueValues.push(item[key]);
        }
        return uniqueValues;
    }, []);
}

function getTransactionsRowMap(data){
    return Object.keys(data).reduce((transactionsMap, key) => {
        if (key[0] !== METADATA_PREFIX && key[0] != REPORTS_PREFIX) {
            transactionsMap[key] = convertToJSON(data[key]);
        }
        return transactionsMap;
    }, {});
}

function getTransactionsColumnMap(data){
    return Object.keys(data).reduce((transactionsMap, key) => {
        if (key[0] !== METADATA_PREFIX && key[0] != REPORTS_PREFIX) {
            const headers = data[key][0]
            let columnMap = {}
            headers.forEach((header, columnIndex) => {
                const columnValues = [];
                let sum = 0;
                for (let rowIndex = 1; rowIndex < data[key].length; rowIndex++) {
                    const value = data[key][rowIndex][columnIndex]
                    columnValues.push(value);
                    sum += (typeof value == "number")? value : 0;
                }
                columnValues.push(sum);
                columnMap[header] = columnValues;
            });
            transactionsMap[key] = columnMap
        }
        return transactionsMap;
    }, {});
}

function getMetadataRowMap(data){
    return Object.keys(data).reduce((metadataMap, key) => {
        if (key[0] == METADATA_PREFIX) {
            metadataMap[key.slice(1)] = convertToJSON(data[key]);
        }
        return metadataMap;
    }, {});
}

function getReportsRowMap(data){
    return Object.keys(data).reduce((reportsMap, key) => {
        if (key[0] == REPORTS_PREFIX) {
            reportsMap[key.slice(1)] = convertToJSON(data[key]);
        }
        return reportsMap;
    }, {});
}

function getHeaderMap(data){
    return Object.keys(data).reduce((headerMap, key) => {
        if (key[0] != METADATA_PREFIX && key[0] != REPORTS_PREFIX) {
            headerMap[key] = data[key][0]
        }
        return headerMap;
    }, {});
}


function getProcessedData(data){
    console.log(data)
    let transactionsRowMap = getTransactionsRowMap(data)
    let transactionsColumnMap = getTransactionsColumnMap(data)
    let metadata = getMetadataRowMap(data)
    let instruments = getInstruments(transactionsRowMap)
    let headerMap = getHeaderMap(data)
    let reports = getReportsRowMap(data)
    return {
        transactionsRowMap: transactionsRowMap,
        transactionsColumnMap: transactionsColumnMap,
        metadata: metadata,
        instruments: instruments,
        headerMap: headerMap,
        reports: reports,
    }
}

export default getProcessedData;