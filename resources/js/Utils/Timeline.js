export function getTimelineFrequency(timeline) {
    let timehash = {};
    timeline.forEach((time) => {
        const { date, entryId } = time;
        timehash[date] = {
            count: (timehash[date]?.count || 0) + 1,
            entryId,
        }
    });

    return Object.keys(timehash).map(date => {
        return {
            date: new Date(date),
            count: timehash[date]?.count,
            entryId: timehash[date]?.entryId,
        };
    });
}

export function getTimelineYears(timelineFrequency) {
    const { date: timelineStart } = timelineFrequency[timelineFrequency.length - 1];
    const { date: timelineEnd } = timelineFrequency[0];
    const timelineStartYear = timelineStart.getFullYear();
    const timelineEndYear = timelineEnd.getFullYear();
    let timelineYears = [];
    for (let i=timelineStartYear; i<=timelineEndYear; i++) {
    // for (let i=timelineEndYear; i>=timelineStartYear; i--) {
        timelineYears.push(i);
    }
    return timelineYears;
}
