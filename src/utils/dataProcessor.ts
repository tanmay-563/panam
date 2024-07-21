import {getAggregatedData} from "./aggregator";
import getXirr from 'xirr';

const METADATA_PREFIX = '_'
const REPORTS_PREFIX = '+'

/**
 * Processes data and extracts various maps and instruments.
 *
 * @param {Object} data - The data to be processed.
 * @returns {Array} An array containing transactionsMap, reportsMap, metadataMap, headerMap, and instruments.
 */
function processData(data){
    try{
        let headerMap = {}
        let transactionsMap = {}
        let metadataMap = {}
        let reportsMap = {}
        let instruments = []

        Object.keys(data).forEach((key) => {
            if (key[0] == REPORTS_PREFIX) {
                reportsMap[key.slice(1)] = convertToJSON(data[key]);
            }
            else if (key[0] == METADATA_PREFIX) {
                metadataMap[key.slice(1)] = convertToJSON(data[key]);
            }
            else {
                instruments.push(key)
                const headers = data[key][0];
                const rows = data[key].slice(1);
                headerMap[key] = headers
                headerMap[key].push("XIRR")

                transactionsMap[key] = rows.map(row => {
                    let obj = {};
                    row.forEach((value, index) => {
                        obj[headers[index]] = value;
                    });
                    let cashFlows = [
                        { amount: -obj["Invested"], when: obj["Date"] },
                        { amount: obj["Current"], when: new Date() }
                    ];
                    try{
                        obj["XIRR"] = getXirr(cashFlows)
                    }
                    catch (e){
                        obj["XIRR"] = 0.0
                    }
                    return obj;
                });
            }
        });

        return [transactionsMap, reportsMap, metadataMap, headerMap, instruments];
    }
    catch (e){
        console.error(e)
        return [{}, {}];
    }
}

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

function getProcessedData(data){
    let [transactionsRowMap, reports, metadata, headerMap, instruments] = processData(data)
    let aggregatedData = getAggregatedData(transactionsRowMap, metadata)

    return {
        transactionsRowMap: transactionsRowMap,
        metadata: metadata,
        instruments: instruments,
        headerMap: headerMap,
        reports: reports,
        aggregatedData: aggregatedData,
    }
}

export default getProcessedData;