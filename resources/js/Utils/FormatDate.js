const defaultLocale = 'en-US';

function getDateOffset(date) {
    return new Date(date.getTime() - date.getTimezoneOffset() * -60000);
}

function getDate(dateString = '') {
    return getDateOffset(new Date(dateString));
}

export function FormatDateForInputField(dateString = '') {
    const date = getDate(dateString);
    return date.toLocaleDateString(defaultLocale, {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
    });
}

export function FormatDateForTitle(dateString = '') {
    const date = getDate(dateString);
    return date.toLocaleDateString(defaultLocale, {
        year: 'numeric',
        month: 'long',
        day: '2-digit',
    });
}

export function FormatDateWeekdayLong(dateString = '') {
    const date = getDate(dateString);
    return date.toLocaleDateString(defaultLocale, {
        weekday: 'long',
        // year: 'numeric',
        // month: '2-digit',
        // day: '2-digit',
    });
}
