
import moment from "moment/moment";

export function getDisplayName(instrumentsMetadata, instrument) {
    try{
        const entry = instrumentsMetadata.find(item => item.Name.toLowerCase() === instrument.toLowerCase());
        return entry ? entry["Label"] : instrument;
    }
    catch (e){
        return instrument
    }
}

export function convertToJson(dataArray){
    return dataArray && Object.keys(dataArray).length ? dataArray.reduce((acc, item) => {
        const { Name, ...rest } = item;
        acc[Name] = rest;
        return acc;
    }, {}) : {};
}

const truncateNumber = (number, decimalCount = 2) => {
    if (number < 1000) return number.toString();
    if (number < 100000) return `${(number / 1000).toFixed(decimalCount)}K`;
    if (number < 10000000) return `${(number / 100000).toFixed(decimalCount)}L`;
    return `${(number / 10000000).toFixed(decimalCount)}Cr`;
};

function formatNumberWithLocale(number, symbol = '', decimalCount = 2){
    try{
        const fixedNumber = number.toFixed(decimalCount);
        const parts = fixedNumber.split('.');
        const integerPart = Number(parts[0]).toLocaleString('en-IN');
        const decimalPart = parts[1];

        return `${symbol}${integerPart}${decimalCount > 0 ? '.'+decimalPart : ''}`;
    }
    catch (e){
        return 0;
    }
}

export function formatToIndianCurrency(number, decimalCount = 2, truncate = true) {
    const symbol = '₹';
    let value = number
    try{
        value = truncate
            ? `${symbol}${truncateNumber(number, decimalCount)}`
            : `${formatNumberWithLocale(number, symbol, decimalCount)}`;
    }
    catch (e){
        return 0;
    }
    return value;
}

export function formatPercentage(number){
    try {
        return (100 * number).toFixed(1) + '%'
    }
    catch (e){
        return 0 + '%';
    }
}

export function getMainBoxData(instrumentsAggregatedData, itemLimit){
    try{
        const sortedInstruments = Object.keys(instrumentsAggregatedData).map((instrument) => {
            const current = instrumentsAggregatedData[instrument]["current"];
            const invested = instrumentsAggregatedData[instrument]["invested"];
            const difference = instrumentsAggregatedData[instrument]["difference"];

            return {
                instrument,
                invested,
                current,
                difference,
            };
        }).sort((a, b) => b.current - a.current);

        const others = sortedInstruments.slice(itemLimit-1).reduce((acc, instrument) => {
            acc.current += instrument.current;
            acc.invested += instrument.invested;
            acc.difference += instrument.difference;
            return acc;
        }, { instrument: 'Others', current: 0, invested: 0, difference: 0 });

        if(sortedInstruments.length > itemLimit){
            sortedInstruments.splice(itemLimit-1)
            sortedInstruments.push(others);
        }

        return sortedInstruments
    }
    catch (e){
        console.error(e)
        return []
    }
}

export function dateReviver(key, value) {
    if (typeof value === 'string' && moment(value, moment.ISO_8601, true).isValid()) {
        return moment(value).toDate();
    }
    return value;
}

export function capitalizeFirstLetter(label){
    return label.charAt(0).toUpperCase() + label.slice(1);
}

export function getDataTypeMap(columnMetadata){
    return columnMetadata.reduce((acc, item)=>{
        acc[item.Column] = item.DataType
        return acc;
    }, {});
}