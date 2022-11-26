export function getTimelineFrequency(timeline) {
    let timehash = {};
    timeline.forEach((time) => {
        const { date, entryId, tagId } = time;
        timehash[date] = {
            counts: {
                [tagId]: (timehash[date]?.count[tagId] || 0) + 1,
            },
            entryId,
        }
    });

    return Object.keys(timehash).map(date => {
        return {
            date: new Date(date),
            counts: timehash[date]?.counts,
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
    for (let i=timelineEndYear; i>=timelineStartYear; i--) {
        timelineYears.push(i);
    }
    return timelineYears;
}
