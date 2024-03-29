export function minifyJsonSnippet(snippet,) {
    let formatted = snippet;
    try {
        formatted = JSON.stringify(JSON.parse(snippet));
    } catch (error) {
        console.warn('Syntax error:', error);
        return;
    }
    return formatted;
}

export function expandJsonSnippet(snippet) {
    let formatted = snippet;
    try {
        formatted = JSON.stringify(JSON.parse(snippet), null, 4) || '';
    } catch (error) {
        console.warn('Syntax error:', error);
        return;
    }
    return formatted;
}

export function removeHashes(snippet) {
    return snippet.replaceAll('#', '');
}
