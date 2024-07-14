import exp from "constants";
import {useCallback, useRef} from "react";
import moment from "moment/moment";

export function getDisplayName(instrumentsMetadata, instrument) {
    try{
        const entry = instrumentsMetadata.find(item => item.Name.toLowerCase() === instrument.toLowerCase());
        return entry ? entry["Display Name"] : instrument;
    }
    catch (e){
        return instrument
    }
}

const truncateNumber = (number, decimalCount = 2) => {
    if (number < 1000) return number.toString();
    if (number < 100000) return `${(number / 1000).toFixed(decimalCount)}K`;
    if (number < 10000000) return `${(number / 100000).toFixed(decimalCount)}L`;
    return `${(number / 10000000).toFixed(decimalCount)}Cr`;
};

export function formatToIndianCurrency(number, decimalCount = 2, truncate = true) {
    const symbol = '₹';
    let value = number
    try{
        value = truncate
            ? `${symbol}${truncateNumber(number, decimalCount)}`
            : `${symbol}${Number(number.toFixed(decimalCount)).toLocaleString('en-IN')}`;
    }
    catch (e){
        return value;
    }
    return value;
}

export function formatPercentage(number){
    return (100*number).toFixed(1)+'%'
}

export function getMainBoxContent(transactionsColumnMap, instruments, itemLimit){
    let totalInvested = 0;
    let totalCurrent = 0;
    instruments.forEach((instrument)=>{
        totalInvested += transactionsColumnMap[instrument]["Invested"].slice(-1)[0]
        totalCurrent += transactionsColumnMap[instrument]["Current"].slice(-1)[0]
    })
    const overallData = {
        current: totalCurrent,
        difference: totalCurrent-totalInvested,
    }

    const sortedInstruments = instruments.map((instrument) => {
        const invested = transactionsColumnMap[instrument]["Invested"].slice(-1)[0];
        const current = transactionsColumnMap[instrument]["Current"].slice(-1)[0];
        const difference = current - invested;

        return {
            instrument,
            current,
            difference,
        };
    }).sort((a, b) => b.current - a.current);

    const others = sortedInstruments.slice(itemLimit-1).reduce((acc, instrument) => {
        acc.current += instrument.current;
        acc.difference += instrument.difference;
        return acc;
    }, { instrument: 'Others', current: 0, difference: 0 });

    if(sortedInstruments.length > itemLimit){
        sortedInstruments.splice(itemLimit-1)
        sortedInstruments.push(others);
    }

    return [ overallData, sortedInstruments]
}

export function useInMemoryCache() {
    const cache = useRef(new Map());

    const set = useCallback((key, value) => {
        cache.current.set(key, value);
    }, []);

    const get = useCallback((key) => {
        return cache.current.get(key);
    }, []);

    const has = useCallback((key) => {
        return cache.current.has(key);
    }, []);

    const remove = useCallback((key) => {
        cache.current.delete(key);
    }, []);

    const clear = useCallback(() => {
        cache.current.clear();
    }, []);

    return {set, get, has, remove, clear}
}

export function dateReviver(key, value) {
    if (typeof value === 'string' && moment(value, moment.ISO_8601, true).isValid()) {
        return moment(value).toDate();
    }
    return value;
}

export function capitalizeFirstLetter(label){
    return label.charAt(0).toUpperCase() + label.slice(1);
};