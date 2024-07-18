import {getAggregatedData} from "./aggregator";
import getXirr from 'xirr';

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

function processRowWise(data){
    let headerMap = {}
    let transactionsRowMap = Object.keys(data).reduce((transactionsMap, key) => {
        if (key[0] !== METADATA_PREFIX && key[0] != REPORTS_PREFIX) {
            const headers = data[key][0];
            const rows = data[key].slice(1);
            headerMap[key] = headers
            headerMap[key].push("xirr")

            transactionsMap[key] = rows.map(row => {
                let obj = {};
                row.forEach((value, index) => {
                    obj[headers[index]] = value;
                });
                let cashFlows = [
                    { amount: -obj.Invested, when: obj.Date },
                    { amount: obj.Current, when: new Date() }
                ];
                try{
                    obj["xirr"] = getXirr(cashFlows)
                }
                catch (e){
                    obj["xirr"] = 0.0
                }
                return obj;
            });
        }
        return transactionsMap;
    }, {});

    return [transactionsRowMap, headerMap];
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
    let [transactionsRowMap, headerMap] = processRowWise(data)
    let transactionsColumnMap = getTransactionsColumnMap(data)
    let metadata = getMetadataRowMap(data)
    let instruments = getInstruments(transactionsRowMap)
    let reports = getReportsRowMap(data)
    let aggregatedData = getAggregatedData(transactionsRowMap, metadata)
    return {
        transactionsRowMap: transactionsRowMap,
        transactionsColumnMap: transactionsColumnMap,
        metadata: metadata,
        instruments: instruments,
        headerMap: headerMap,
        reports: reports,
        aggregatedData: aggregatedData,
    }
}

export default getProcessedData;