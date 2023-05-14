const defaultLocale = 'en-US';

export function getDateOffset(date = new Date()) {
    return new Date(date.getTime() - date.getTimezoneOffset() * -60000);
}

function zeroPadTens(n) {
    return n < 10 ? `0${n}` : n;
}

export function GetDate(dateString = '') {
    return getDateOffset(new Date(dateString));
}

export function FormatDateForRouteModelBinding(dateString = '') {
    const date = GetDate(dateString);
    return `${date.getFullYear()}-${zeroPadTens(date.getMonth() + 1)}-${zeroPadTens(date.getDate())}`
}

export function FormatDateForInputField(dateString = '') {
    const date = GetDate(dateString);
    return date.toLocaleDateString(defaultLocale, {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
    });
}

export function FormatDateForTitle(dateString = '') {
    const date = GetDate(dateString);
    return date.toLocaleDateString(defaultLocale, {
        year: 'numeric',
        month: 'long',
        day: '2-digit',
    });
}

export function FormatDateWeekdayLong(dateString = '') {
    const date = GetDate(dateString);
    return date.toLocaleDateString(defaultLocale, {
        weekday: 'long',
        // year: 'numeric',
        // month: '2-digit',
        // day: '2-digit',
    });
}
