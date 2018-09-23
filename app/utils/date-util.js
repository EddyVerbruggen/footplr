export function getYearsSince(date) {
    var ageDifMs = Date.now() - date.getTime();
    var ageDate = new Date(ageDifMs); // miliseconds from epoch
    return Math.abs(ageDate.getUTCFullYear() - 1970);
}

export function getMonthsSince(date) {
    const dayCompensation = new Date().getDate() > date.getDate() ? 0 : 1;
    const monthsElapsedThisYear = new Date().getMonth();
    if (monthsElapsedThisYear > date.getMonth()) {
        return monthsElapsedThisYear - date.getMonth() - dayCompensation;
    } else {
        return monthsElapsedThisYear + (12 - date.getMonth()) - dayCompensation;
    }
}