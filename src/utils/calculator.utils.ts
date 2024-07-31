export function getCapitalGainsData(transactionsRowMap, instrument, shortTermPeriod){
    if(instrument in transactionsRowMap){
        const today = new Date()
        let thresholdDate = today.setMonth(today.getMonth() - shortTermPeriod);

        let currentTotal = 0, longTermTotal = 0, shortTermTotal = 0, withdrawals = 0;

        transactionsRowMap[instrument].forEach((transaction) => {
            currentTotal += transaction.Current;
            if(transaction.Date < thresholdDate){
                longTermTotal += transaction.Current;
            }
            else{
                shortTermTotal += transaction.Current;
            }

        })

        console.log([currentTotal, longTermTotal, shortTermTotal])
    }
}