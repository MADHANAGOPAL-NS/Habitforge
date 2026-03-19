//this file contains the logic for level up
function calculateLevel(xp){
    return Math.floor(Math.sqrt(xp / 10));
}

module.exports = calculateLevel;