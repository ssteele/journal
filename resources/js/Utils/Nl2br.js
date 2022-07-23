export default function Nl2br(text = '') {
    const breakTag = '<br />';
    return (text + '').replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1' + breakTag + '$2');
}
