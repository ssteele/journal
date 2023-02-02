export function getTimelineFrequency(timeline = []) {
    let timehash = {};
    for (const time of timeline) {
        const { date, entryId, tagId } = time;
        timehash[date] = {
            counts: {
                [tagId]: (timehash[date]?.counts[tagId] || 0) + 1,
            },
            entryId,
        }
    };

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
        const count = timelineFrequency.reduce((acc, cur) => {
            if (cur?.date?.getFullYear() === i) {
                acc += Object.values(cur?.counts)[0];
            }
            return acc;
        }, 0);
        timelineYears.push({
            year: i,
            count: `${count}`,
        });
    }
    return timelineYears;
}

export function mergeTimelineFrequencies(timelinesFrequency) {
    // console.log('SHS timelinesFrequency:', timelinesFrequency);
    return timelinesFrequency;
}

export function mergeTimelineYearCounts(timelinesYears) {
    let timelineYears = [];
    let years = [];
    for (const timeline of timelinesYears) {
        const mtdTimeline = _.clone(timeline);
        let { count, year } = mtdTimeline;
        if (years.includes(year)) {
            const element = timelineYears.find(tl => tl.year === year);
            element.count.push(count);
        } else {
            mtdTimeline.count = [count];
            timelineYears.push(mtdTimeline);
            years.push(year);
        }
    }
    return timelineYears;
}
