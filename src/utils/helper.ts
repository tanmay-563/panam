import exp from "constants";
import {useCallback, useRef} from "react";

export function getDisplayName(instrumentsConfig, instrument) {
    try{
        const entry = instrumentsConfig.find(item => item.Name.toLowerCase() === instrument.toLowerCase());
        return entry ? entry["Display Name"] : instrument;
    }
    catch (e){
        return instrument
    }
}

export function formatToIndianCurrency(number) {
    const symbol = '₹'
    if (number < 1000) {
        return symbol + number.toString();
    }

    if (number >= 1000 && number < 100000) {
        return symbol + (number / 1000).toFixed(1) + 'K';
    }

    if (number >= 100000 && number < 10000000) {
        return symbol + (number / 100000).toFixed(1) + 'L';
    }

    return symbol + (number / 10000000).toFixed(1) + 'Cr';
}

export function formatPercentage(number){
    return (100*number).toFixed(1)+'%'
}

export function getMainBoxContent(contentColumnMap, instruments, itemLimit){
    let totalInvested = 0;
    let totalCurrent = 0;
    instruments.forEach((instrument)=>{
        totalInvested += contentColumnMap[instrument]["Invested"].slice(-1)[0]
        totalCurrent += contentColumnMap[instrument]["Current"].slice(-1)[0]
    })
    const overallData = {
        current: totalCurrent,
        difference: totalCurrent-totalInvested,
    }

    const sortedInstruments = instruments.map((instrument) => {
        const invested = contentColumnMap[instrument]["Invested"].slice(-1)[0];
        const current = contentColumnMap[instrument]["Current"].slice(-1)[0];
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
