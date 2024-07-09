export function getDisplayName(instrumentsConfig, instrument) {
    try{
        const entry = instrumentsConfig.find(item => item.Name.toLowerCase() === instrument.toLowerCase());
        return entry ? entry["Display Name"] : undefined;
    }
    catch (e){
        return undefined
    }
}
