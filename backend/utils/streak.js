//this file contains the logic for calculating the streak by fetching the log from the DB...
function streak_calculation(logs, frequency = "daily"){
    if(!logs || logs.length === 0){
        return 0;
    }

    // ALWAYS format to 'YYYY-MM-DD' securely matching the original local time regardless of UTC offset!
    const getBucketString = (dateObj) => {
        const d = new Date(dateObj);
        if (frequency === "weekly") {
            const day = d.getDay();
            const diff = d.getDate() - day + (day === 0 ? -6 : 1); 
            d.setDate(diff); // Always pins the date object purely to Monday
        }
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const dayOfMonth = String(d.getDate()).padStart(2, '0');
        return `${year}-${month}-${dayOfMonth}`;
    };

    const dates = logs.map(log => getBucketString(new Date(log.completedDate)));

    // Remove duplicates and sort descending (newest to oldest strings)
    const unique_dates = [...new Set(dates)].sort().reverse();

    if (unique_dates.length === 0) return 0;

    let streak = 0;
    
    // Get server's absolute true today string LOCALLY
    const todayStr = getBucketString(new Date());
    
    // Helper to extract absolute UTC time from string to bypass local DST jumps entirely
    const parseDate = (dStr) => new Date(dStr + "T00:00:00Z").getTime();
    
    const todayVal = parseDate(todayStr);
    const firstVal = parseDate(unique_dates[0]);
    
    const one_day = 24 * 60 * 60 * 1000;
    
    // How many days ago was the last log bucket?
    const diffDays = Math.round((todayVal - firstVal) / one_day);

    const periodGap = frequency === "weekly" ? 7 : 1;

    if (diffDays === 0 || diffDays === periodGap) {
        streak = 1;
    } else if (diffDays < 0) {
        // Safe-guard edgecase where timezone somehow evaluated to future time
        streak = 1;
    } else {
        return 0; // They missed a period completely. Broken.
    }
   
    // Jump down the array confirming exact period separations 
    for(let i = 1 ; i < unique_dates.length; i++){
        const curr = parseDate(unique_dates[i]);
        const prev = parseDate(unique_dates[i - 1]);
        const delta = Math.round((prev - curr) / one_day);
        
        if (delta === periodGap) {
            streak++;
        } else {
            break;
        }
    }
    
    return streak;
}

module.exports = streak_calculation;