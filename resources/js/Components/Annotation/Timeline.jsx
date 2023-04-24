import { TimelineAnnotationColors } from '@/Constants/MarkerColorMap';
import { FormatDateForRouteModelBinding, FormatDateForTitle, FormatDateWeekdayLong } from '@/Utils/FormatDate';
import CalendarHeatmap from 'react-calendar-heatmap';
import React from 'react';
import { isMobile } from 'react-device-detect';
import 'react-calendar-heatmap/dist/styles.css';
import '@/../css/react-calendar-heatmap.css';

export default function Timeline({ annotationMap, handleDayClick = null, timelineFrequency, timelineYears }) {
    return (
        <>
            {
                timelineYears.map((timelineYear, i) => {
                    return (
                        <div className="mt-3 sm:mt-4 md:mt-6" key={i}>
                            <span className="text-sm sm:text-base lg:text-lg">
                                {timelineYear?.year}
                            </span>
                            <span className="text-xs font-thin">(
                                {(timelineYear?.count?.constructor === Array)
                                    ? timelineYear?.count?.join('/')
                                    : timelineYear?.count
                                }
                            )
                            </span>

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
                                        if (!isMobile && !!handleDayClick) {
                                            handleDayClick(day);
                                        } else {
                                            window.location.href = route('entries.show', FormatDateForRouteModelBinding(day?.date))
                                        }
                                    }
                                }}
                                classForValue={(day) => {
                                    if (!day) {
                                        return 'color-empty';
                                    }

                                    const { counts: entryCounts } = day;
                                    const entryIds = Object.keys(entryCounts);
                                    const entryColors = entryIds.map(e => {
                                        const entryId = parseInt(e);
                                        const color = TimelineAnnotationColors[annotationMap.indexOf(entryId)];
                                        const count = entryCounts[entryId];
                                        return `${color}-${count}`;
                                    });

                                    const sortedEntryColors = entryColors.sort((a, b) => a.startsWith(TimelineAnnotationColors[0]) ? -1 : 1);
                                    return sortedEntryColors.join('-');   // eg: 'red-1' or 'red-2-blue-5'
                                }}
                            />
                        </div>
                    )
                })
            }
        </>
    )
}
