import xirr from 'xirr';

function convertToDate(input) {
    if (input instanceof Date) {
        // If input is already a Date, return it as is
        return input;
    } else if (typeof input === 'string') {
        // If input is a string in 'dd/mm/yyyy' format
        const parts = input.split('/');
        if (parts.length === 3) {
            const day = parseInt(parts[0], 10);
            const month = parseInt(parts[1], 10) - 1; // Months are 0-based in JavaScript Date
            const year = parseInt(parts[2], 10);

            // Validate the parts
            if (!isNaN(day) && !isNaN(month) && !isNaN(year) &&
                day >= 1 && day <= 31 &&
                month >= 0 && month <= 11 &&
                year > 1900) {
                const date = new Date(year, month, day);
                // Check if the date is valid
                if (date.getDate() === day && date.getMonth() === month && date.getFullYear() === year) {
                    return date;
                } else {
                    throw new Error('Invalid date string');
                }
            } else {
                throw new Error('Invalid date parts');
            }
        } else {
            throw new Error('Date string should be in the format dd/mm/yyyy');
        }
    } else {
        throw new Error('Input must be a string or a Date object');
    }
}

export function getAggregatedData(transactionsRowMap, metadata){
    const instrumentsMetadata = metadata ? metadata.instrument : {}
    let overallMap = {current: 0, invested: 0, cashflows: []}
    let instrumentsDataMap = {}
    for(let k in transactionsRowMap){
        instrumentsDataMap[k] = {current: 0, invested: 0, name: {}, category: {}, cashflows: []}
        let calculateXirr = instrumentsMetadata.filter((instrument) => instrument.Name.toLowerCase() === k.toLowerCase())[0]["CalculateXirr"]
        let instrumentTransactions = transactionsRowMap[k];
        for(let l in instrumentTransactions){
            const currentAmount = instrumentTransactions[l]["Current"];
            const investedAmount = instrumentTransactions[l]["Invested"];
            const name = instrumentTransactions[l]["Name"];
            const category = instrumentTransactions[l]["Category"];
            const date = convertToDate(instrumentTransactions[l]["Date"]);
            overallMap["current"] += currentAmount;
            overallMap["invested"] += investedAmount;
            instrumentsDataMap[k]["current"] += currentAmount;
            instrumentsDataMap[k]["invested"] += investedAmount;
            console.log("date " + date)
            if(calculateXirr){
                overallMap["cashflows"].push({amount: -investedAmount, when: date})
                instrumentsDataMap[k]["cashflows"].push({amount: -investedAmount, when: date})
            }
            if(name){
                if(!(name in instrumentsDataMap[k]["name"]))
                    instrumentsDataMap[k]["name"][name] = {current:0, invested: 0, cashflows: []};
                instrumentsDataMap[k]["name"][name]["current"] += currentAmount;
                instrumentsDataMap[k]["name"][name]["invested"] += investedAmount;
                if(calculateXirr) {
                    instrumentsDataMap[k]["name"][name]["cashflows"].push({amount: -investedAmount, when: date})
                }
            }
            if(category){
                if(!(category in instrumentsDataMap[k]["category"]))
                    instrumentsDataMap[k]["category"][category] = {current:0, invested: 0, cashflows: []};
                instrumentsDataMap[k]["category"][category]["current"] += currentAmount;
                instrumentsDataMap[k]["category"][category]["invested"] += investedAmount;
                if(calculateXirr) {
                    instrumentsDataMap[k]["category"][category]["cashflows"].push({amount: -investedAmount, when: date})
                }
            }
        }
        if(calculateXirr){
            instrumentsDataMap[k]["cashflows"].push({amount: instrumentsDataMap[k]["current"], when: new Date()})
            console.log(k)
            console.log(instrumentsDataMap[k]["cashflows"])
            instrumentsDataMap[k]["xirr"] = xirr(instrumentsDataMap[k]["cashflows"]);
            console.log(instrumentsDataMap[k]["xirr"] )
        }
    }
    if(overallMap["cashflows"].length >= 2)
        overallMap["xirr"] = xirr(overallMap["cashflows"])
    // console.log(JSON.stringify(instrumentsDataMap));
    console.log(overallMap["xirr"])
}