export function getDisplayName(instrumentsConfig, instrument) {
    try{
        const entry = instrumentsConfig.find(item => item.Name.toLowerCase() === instrument.toLowerCase());
        return entry ? entry["Display Name"] : undefined;
    }
    catch (e){
        return undefined
    }
}

export function formatToIndianCurrency(number) {
    if (number < 1000) {
        return number.toString();
    }

    if (number >= 1000 && number < 100000) {
        return (number / 1000).toFixed(1) + 'K';
    }

    if (number >= 100000 && number < 10000000) {
        return (number / 100000).toFixed(1) + 'L';
    }

    return (number / 10000000).toFixed(1) + 'Cr';
}
