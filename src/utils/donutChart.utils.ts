function convertToDountChartData(aggregatedData, column, itemLimit) {
    try {
        let [_, instrumentsData] = aggregatedData
        let sortedData = Object.keys(instrumentsData).map((key) => {
            const name = key;
            const value = instrumentsData[key][column]

            return {name, value}
        }).sort((a, b) => b.value - a.value)

        const others = sortedData.slice(itemLimit - 1).reduce((acc, instrument) => {
            acc.value += instrument.value;
            return acc;
        }, {name: 'Others', value: 0});

        if (sortedData.length > itemLimit) {
            sortedData.splice(itemLimit - 1)
            sortedData.push(others);
        }

        return sortedData
    }
    catch(e){
        console.error(e);
        return []
    }
}

export default convertToDountChartData;