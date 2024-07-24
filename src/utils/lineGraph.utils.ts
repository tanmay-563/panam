
const parseData = (data) => {
    return data.map(d => ({
        ...d,
        date: new Date(d.date),
    }));
};

const groupData = (data, granularity) => {
    const groupBy = {
        daily: d => d.date.toISOString().substring(0, 10),
        weekly: d => {
            const date = new Date(d.date);
            const yearStart = new Date(date.getFullYear(), 0, 1);
            const weekNumber = Math.floor((Math.ceil(Math.abs(date.getTime() - yearStart.getTime()) / (1000 * 3600 * 24))+ yearStart.getDay() + 1) / 7);
            return `${date.getFullYear()}-W${weekNumber}`;
        },
        monthly: d => d.date.toISOString().substring(0, 7),
        yearly: d => d.date.toISOString().substring(0, 4),
    }[granularity];

    return data.reduce((acc, item) => {
        const key = groupBy(item);
        if (!acc[key]) {
            acc[key] = [];
        }
        acc[key].push(item);
        return acc;
    }, {});
};

const filterByEntriesCount = (groupedData: {string: any[]}, threshold) => {
    const result = [];
    for (const [_, entries] of Object.entries(groupedData)) {
        if (entries.length > threshold) {
            result.push(entries.slice(-1)[0]);
        } else {
            result.push(...entries);
        }
    }
    return result;
};

const formatDataForRecharts = (data) => {
    return data.map(d => ({
        ...d,
        date: d.date.getTime() // Format date as 'YYYY-MM-DD'
    }));
};

const findMaxEntry = (data, key) => {
    return data.reduce((maxEntry, currentEntry) => {
        return currentEntry[key] > (maxEntry[key] || 0) ? currentEntry : maxEntry;
    }, {});
};


export function getFilteredData(dailyTracker, granularity, startDate, endDate){
    try{
        const formattedReport = dailyTracker
            .filter(d => d.Date >= startDate && d.Date <= endDate)
            .map(d => ({
            date: d.Date.getTime(),
            current: d.Current,
            invested: d.Invested,
        }));
        const maxCurrentEntry = findMaxEntry(formattedReport, 'current');

        const parsedData = parseData(formattedReport);
        const groupedData = groupData(parsedData, granularity);
        const threshold = 1;
        let filteredData = filterByEntriesCount(groupedData, threshold);
        let formattedData = formatDataForRecharts(filteredData);

        return [formattedData, maxCurrentEntry];
    }
    catch (e){
        console.error(e)
        return []
    }
}