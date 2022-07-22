export default function FormatDate(date = '') {
    const dateObj = new Date(date);
    const offsetDateObj = new Date(dateObj.getTime() - dateObj.getTimezoneOffset() * -60000);
    return offsetDateObj.toLocaleDateString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
    });
}
