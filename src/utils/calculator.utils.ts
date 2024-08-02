export function getCapitalGainsData(transactionsRowMap, instrument, name,
                                    unitsField, navField,
                                    shortTermPeriod, shortTermTax, longTermTax){
    if(transactionsRowMap && instrument in transactionsRowMap && unitsField != '' && navField != ''){
        let totalUnits = 0, longtermUnits = 0, shortTermUnits = 0, withdrawnUnits = 0, nav = 0;

        transactionsRowMap[instrument].forEach((transaction) => {
            if(transaction.Name === name){
                const today = new Date()
                let thresholdDate = today.setMonth(today.getMonth() - shortTermPeriod);
                nav = transaction[navField]
                if(transaction[unitsField] < 0){
                    withdrawnUnits += -transaction[unitsField];
                }
                else{
                    totalUnits += transaction[unitsField];
                    if(transaction.Date.getTime() < thresholdDate){
                        longtermUnits += transaction[unitsField];
                    }
                    else{
                        shortTermUnits += transaction[unitsField];
                    }
                }
            }
        })

        if(name === "HDFC Corporate Bond"){
            console.log(totalUnits)
            console.log(longtermUnits)
            console.log(shortTermUnits)
            console.log(withdrawnUnits)
        }
        let withdrawnUnitCopy = withdrawnUnits

        if(longtermUnits > withdrawnUnitCopy){
            longtermUnits -= withdrawnUnitCopy;
        }
        else{
            withdrawnUnitCopy -= longtermUnits;
            longtermUnits = 0;
            shortTermUnits -= withdrawnUnitCopy;
        }
        const totalValue = totalUnits * nav;
        const longTermValue = longtermUnits * nav;
        const shortTermValue = shortTermUnits * nav;
        const withdrawnValue = withdrawnUnits * nav;

        return [totalValue, longTermValue, shortTermValue, withdrawnValue]
    }
    else{
        return [0, 0, 0, 0]
    }
}