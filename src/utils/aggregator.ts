import getXirr from 'xirr';

/**
 * Adds cashflows to the specified map and updates the current and invested amounts.
 * @param {Object} map - The map to update.
 * @param {number} currentAmount - The current amount to addTransactions.
 * @param {number} investedAmount - The invested amount to addTransactions.
 * @param {Date} date - The date of the transaction.
 * @param {boolean} calculateXirr - Whether to calculate XIRR.
 */
function updateMap(map, currentAmount, investedAmount, date, calculateXirr) {
    map.current += currentAmount ? currentAmount : 0;
    map.invested += investedAmount ? investedAmount : 0;
    map.returns += (currentAmount-investedAmount)
    if (calculateXirr) {
        map.cashflows.push({ amount: -investedAmount, when: date });
    }
}

/**
 * Adds current cashflows and difference b/w current and invested to the specified map.
 * @param {Object} map - The map to update.
 * @param {string} key - The key to check.
 * @param {number} currentAmount - The current amount to addTransactions.
 * @param {number} investedAmount - The investedAmount.
 * @param {boolean} calculateXirr - Whether to calculate XIRR.
 */
function finalizeCashflows(map, key, currentAmount, investedAmount, calculateXirr) {
    if (calculateXirr) {
        map.cashflows.push({ amount: currentAmount, when: new Date() });
        if (map.cashflows.length >= 2) {
            try {
                map.xirr = getXirr(map.cashflows);
            } catch {
                map.xirr = 0;
            }
            delete map.cashflows
        }
    }
    map.difference = currentAmount-investedAmount
}

/**
 * Processes transactions and updates the provided data maps.
 * @param {Object} transactionsRowMap - The transactions to process.
 * @param {Object} metadata - Metadata about the instruments.
 * @returns {Array} The overall and instruments data maps.
 */
export function getAggregatedData(transactionsRowMap, metadata) {
    try {
        const instrumentsMetadata = metadata ? metadata.instrument : {};
        const overallMap = { current: 0, invested: 0, returns: 0, cashflows: [] };
        const instrumentsDataMap = {};

        for (const k in transactionsRowMap) {
            instrumentsDataMap[k] = { current: 0, invested: 0, returns: 0, name: {}, category: {}, cashflows: [] };
            const calculateXirr = instrumentsMetadata.find(
                (instrument) => instrument.Name.toLowerCase() === k.toLowerCase()
            )?.CalculateXirr;

            for (const transaction of transactionsRowMap[k]) {
                const { Current: currentAmount, Invested: investedAmount, Name: name, Category: category, Date: date } = transaction;
                updateMap(overallMap, currentAmount, investedAmount, date, calculateXirr);
                updateMap(instrumentsDataMap[k], currentAmount, investedAmount, date, calculateXirr);

                if (name) {
                    if (!(name in instrumentsDataMap[k].name)) {
                        instrumentsDataMap[k].name[name] = { current: 0, invested: 0, returns: 0, cashflows: [] };
                    }
                    updateMap(instrumentsDataMap[k].name[name], currentAmount, investedAmount, date, calculateXirr);
                }

                if (category) {
                    if (!(category in instrumentsDataMap[k].category)) {
                        instrumentsDataMap[k].category[category] = { current: 0, invested: 0, returns: 0, cashflows: [] };
                    }
                    updateMap(instrumentsDataMap[k].category[category], currentAmount, investedAmount, date, calculateXirr);
                }
            }

            if(instrumentsDataMap[k].current > 1){
                finalizeCashflows(instrumentsDataMap[k], k, instrumentsDataMap[k].current, instrumentsDataMap[k].invested, calculateXirr);
                for (const nameKey in instrumentsDataMap[k].name) {
                    if(instrumentsDataMap[k].name[nameKey].current > 1)
                        finalizeCashflows(instrumentsDataMap[k].name[nameKey], nameKey, instrumentsDataMap[k].name[nameKey].current, instrumentsDataMap[k].name[nameKey].invested, calculateXirr);
                    else
                        delete instrumentsDataMap[k].name[nameKey]
                }
                for (const categoryKey in instrumentsDataMap[k].category) {
                    if(instrumentsDataMap[k].category[categoryKey].current > 1)
                        finalizeCashflows(instrumentsDataMap[k].category[categoryKey], categoryKey, instrumentsDataMap[k].category[categoryKey].current, instrumentsDataMap[k].category[categoryKey].invested, calculateXirr);
                    else
                        delete instrumentsDataMap[k].category[categoryKey]
                }
            }
            else
                delete instrumentsDataMap[k]
        }

        finalizeCashflows(overallMap, 'overall', overallMap.current, overallMap.invested, true);

        return [overallMap, instrumentsDataMap];
    } catch (error) {
        console.error(error);
        return [{}, {}];
    }
}
