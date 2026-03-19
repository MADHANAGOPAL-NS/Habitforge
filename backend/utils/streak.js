//this file contains the logic for calculating the streak by fetching the log from the DB...
function streak_calculation(logs){
    if(!logs || logs.length === 0){
        return 0;
    }

    //Extract the date and convert to number...

    const dates = logs.map(log => {
        const date = new Date(log.completedDate);
        date.setHours(0, 0, 0, 0);
        return date.getTime();
    });

    //Remove duplicate completion

    const unique_date = [...new Set(dates)];

    //sort the dates in descending order...

    unique_date.sort((a, b) => b - a)

    //prepare today date

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    let today_time = today.getTime();

    //converting seconds to milliseconds

    const one_day = 24*60*60*1000;

    let streak = 0;

    //checking if today habit is completed or not...

   const diff = Math.floor((today_time - unique_date[0]) / one_day);

   if(diff === 0){
    streak = 1;
   }

   else if(diff === 1){
    streak = 1;
    today_time = unique_date[0];
   }

   else{
    return 0;
   }
    //looping through remaining dates...

    for(let i = 1 ; i < unique_date.length; i++){
        if(unique_date[i] === unique_date[i - 1] - one_day){
            streak++;
        }
        else{
            break;
        }
    }
    return streak;
}

module.exports = streak_calculation;