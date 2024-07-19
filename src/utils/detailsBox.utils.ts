export function getInstrumentDetailsData(aggregatedData, dataSource, sortValue){
    try{
        console.log(sortValue)
        const [_, instrumentsData] = aggregatedData
        let data = instrumentsData
        if(dataSource.toLowerCase() != "overall")
            data = instrumentsData[dataSource]["name"]
        const entries = Object.entries(data);
        entries.sort(([, a], [, b]) => b[sortValue] - a[sortValue]);
        return Object.fromEntries(entries);
    }
    catch (e){
        console.error(e)
        return {}
    }
}