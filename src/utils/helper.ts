export function getDisplayName(config, instrument) {
    try{
        const entry = config.find(item => item.Name.toLowerCase() === instrument.toLowerCase());
        return entry ? entry["Display Name"] : undefined;
    }
    catch (e){
        return undefined
    }
}
