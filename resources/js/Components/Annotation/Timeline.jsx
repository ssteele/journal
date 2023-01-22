import { FormatDateForTitle, FormatDateWeekdayLong } from '@/Utils/FormatDate';
import CalendarHeatmap from 'react-calendar-heatmap';
import React from 'react';
import 'react-calendar-heatmap/dist/styles.css';
import '@/../css/react-calendar-heatmap.css';

export default function Timeline({ annotationMap, timelineFrequency, timelineYears }) {
    return (
        <>
            {
                timelineYears.map((timelineYear, i) => {
                    return (
                        <div className="mt-3 sm:mt-4 md:mt-6" key={i}>
                            <span className="text-sm sm:text-base lg:text-lg">
                                {timelineYear?.year}
                            </span>
                            <span className="text-xs font-thin"> ({timelineYear?.count})</span>

                            <CalendarHeatmap
                                startDate={new Date(`${timelineYear?.year - 1}-12-31`)}
                                endDate={new Date(`${timelineYear?.year}-12-31`)}
                                horizontal={true}
                                showMonthLabels={timelineYear?.year === timelineYears[0]?.year}
                                showWeekdayLabels={false}
                                titleForValue={(day) => {
                                    if (day) {
                                        return `${FormatDateWeekdayLong(day?.date)}, ${FormatDateForTitle(day?.date)}`;
                                    }
                                }}
                                values={timelineFrequency}
                                onClick={(day) => {
                                    if (day) {
                                        window.location.href = route('entries.show', day?.entryId)
                                    }
                                }}
                                classForValue={(day) => {
                                    if (!day) {
                                        return 'color-empty';
                                    }
                                    const { counts } = day;
                                    const keys = Object.keys(counts);
                                    let color;
                                    let count;
                                    if (1 === keys.length) {
                                        const key = parseInt(keys[0]);
                                        color = annotationMap.indexOf(key);
                                        count = counts[key];
                                    }
                                    return `color-${color}-scale-${count}`;
                                }}
                            />
                        </div>
                    )
                })
            }
        </>
    )
}
