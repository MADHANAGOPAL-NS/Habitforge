//this file contains the logic for level up
function calculateLevel(xp){
    // Guaranteed to increase rapidly: +1 level for every 20 XP, base is level 1
    return 1 + Math.floor((xp || 0) / 20);
}

module.exports = calculateLevel;