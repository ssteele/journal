export default function FormatDate(date = '') {
    const dateObj = new Date(date);
    const offsetDateObj = new Date(dateObj.getTime() - dateObj.getTimezoneOffset() * -60000);
    return offsetDateObj.toLocaleDateString();
}
