function setupDailyCronTrigger() {
    deleteTriggers();

    ScriptApp.newTrigger('dailyCron')
        .timeBased()
        .everyDays(1)
        .atHour(DAILY_CRON_HOUR)
        .create();

    Logger.log('Daily trigger set for ' + DAILY_CRON_HOUR + ' hour');
}

function deleteTriggers() {
    let triggers = ScriptApp.getProjectTriggers();

    for (let i = 0; i < triggers.length; i++) {
        if (triggers[i].getHandlerFunction() === 'dailyCron') {
            ScriptApp.deleteTrigger(triggers[i]);
        }
    }
}

function dailyCron(){
    updateDailyTracker();
}
