//this file contains the logic for calculating the XP for gamification

function calculateXP(streak){
    let xp = 10;

    if(streak >= 10) {
        xp += 20;
    }

    else if(streak >= 5){
        xp+= 10;
    }

    else if(streak >= 3){
        xp += 5;
    }

    return xp;
}

module.exports = calculateXP;