function checkBadges(user, streak){
    let newBadges = [];

    if(streak >= 3 && !user.badges.includes("3_day")){
        newBadges.push("3_day");
    }

    if(streak >= 7 && !user.badges.includes("7_day")){
        newBadges.push("7_day");
    }

    if(streak >= 30 && !user.badges.includes("30_day")){
        newBadges.push("30_day");
    }

    return newBadges;
}

module.exports = checkBadges;