import { FormatDateForTitle, FormatDateWeekdayLong } from '@/Utils/FormatDate';
import CalendarHeatmap from 'react-calendar-heatmap';
import React from 'react';
import 'react-calendar-heatmap/dist/styles.css';
import '@/../css/react-calendar-heatmap.css';

export default function Timeline({ timelineFrequency, timelineYears }) {
    return (
        <>
            {
                timelineYears.map((year, i) => {
                    return (
                        <div className="mt-3 sm:mt-4 md:mt-6" key={i}>
                            <span className="text-sm sm:text-base lg:text-lg">
                                {year}
                            </span>

                            <CalendarHeatmap
                                startDate={new Date(`${year - 1}-12-31`)}
                                endDate={new Date(`${year}-12-31`)}
                                horizontal={true}
                                showMonthLabels={year === timelineYears[0]}
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
                                    return `color-scale-${day.count}`;
                                }}
                            />
                        </div>
                    )
                })
            }
        </>
    )
}