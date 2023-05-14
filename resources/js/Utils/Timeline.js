import { getDateOffset } from "./FormatDate";

function getRemainingDatesForYear() {
    const today = new Date();
    const date = getDateOffset(new Date(`${today.getFullYear()}-12-31`));
    let remainingDates = [];
    while (date > today) {
        remainingDates.push(new Date(date));
        date.setDate(date.getDate() - 1);
    }
    return remainingDates;
}

function getTimelineFuture(dates) {
    return dates.map(date => {
        return {
            date,
            counts: null,
            entryId: null,
        }
    });
}

export function getTimelineFrequency(timeline = []) {
    let timehash = {};
    for (const time of timeline) {
        const { date, entryId, annotationId } = time;
        timehash[date] = {
            counts: {
                [annotationId]: (timehash[date]?.counts[annotationId] || 0) + 1,
            },
            entryId,
        }
    };

    const timelineFrequency = Object.keys(timehash).map(date => {
        return {
            date: new Date(date),
            counts: timehash[date]?.counts,
            entryId: timehash[date]?.entryId,
        };
    });

    const datesRemainingThisYear = getRemainingDatesForYear(new Date());
    const timelineFuture = getTimelineFuture(datesRemainingThisYear);

    return [
        ...timelineFuture,
        ...timelineFrequency,
    ];
}

export function getTimelineYears(timelineFrequency) {
    const { date: timelineStart } = timelineFrequency[timelineFrequency.length - 1];
    const { date: timelineEnd } = timelineFrequency[0];
    const timelineStartYear = timelineStart.getFullYear();
    const timelineEndYear = timelineEnd.getFullYear();
    let timelineYears = [];
    for (let i=timelineEndYear; i>=timelineStartYear; i--) {
        const count = timelineFrequency.reduce((acc, cur) => {
            if (cur?.counts && cur?.date?.getFullYear() === i) {
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
    let timelineFrequency = [];
    let days = [];
    for (const timeline of timelinesFrequency) {
        const mtdTimeline = _.clone(timeline);
        let { counts, entryId } = mtdTimeline;
        if (days.includes(entryId) && !!counts) {
            const element = timelineFrequency.find(tl => tl.entryId === entryId);
            element.counts = {...element?.counts, ...counts};
        } else {
            mtdTimeline.counts = counts;
            timelineFrequency.push(mtdTimeline);
            days.push(entryId);
        }
    }
    return timelineFrequency;
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
