export function getInstrumentDetailsData(aggregatedData, dataSource){
    try{
        const [_, instrumentsData] = aggregatedData
        let data = instrumentsData
        if(dataSource.toLowerCase() != "overall")
            data = instrumentsData[dataSource]["name"]
        const entries = Object.entries(data);
        entries.sort(([, a], [, b]) => b.current - a.current);
        return Object.fromEntries(entries);
    }
    catch (e){
        console.error(e)
        return {}
    }
}