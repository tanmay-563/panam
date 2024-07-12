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

function getConfig(config, name){
    return config["_"+name.toLowerCase()];
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

function getContentRowMap(data){
    return Object.keys(data).reduce((contentMap, key) => {
        if (key[0] !== '_') {
            contentMap[key] = convertToJSON(data[key]);
        }
        return contentMap;
    }, {});
}

function getConfigRowMap(data){
    return Object.keys(data).reduce((configMap, key) => {
        if (key[0] == '_') {
            configMap[key] = convertToJSON(data[key]);
        }
        return configMap;
    }, {});
}

function getContentColumnMap(data){
    console.log(data["mutualfund"])
    return Object.keys(data).reduce((contentColumnMap, key) => {
        if (key[0] != '_') {
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
            contentColumnMap[key] = columnMap
        }
        return contentColumnMap;
    }, {});
}

function getHeaderMap(data){
    return Object.keys(data).reduce((headerMap, key) => {
        if (key[0] != '_') {
            headerMap[key] = data[key][0]
        }
        return headerMap;
    }, {});
}


function getProcessedData(data){
    let contentRowMap = getContentRowMap(data)
    let config = getConfigRowMap(data)
    let contentColumnMap = getContentColumnMap(data)
    let instruments = getInstruments(contentRowMap)
    let headerMap = getHeaderMap(data)
    return {
        contentRowMap: contentRowMap,
        config: config,
        contentColumnMap: contentColumnMap,
        instruments: instruments,
        headerMap: headerMap,
    }
}

export default getProcessedData;