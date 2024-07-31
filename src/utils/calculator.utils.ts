export function getCapitalGainsData(transactionsRowMap, instrument){
    if(instrument in transactionsRowMap){
        console.log(transactionsRowMap[instrument])
    }
}