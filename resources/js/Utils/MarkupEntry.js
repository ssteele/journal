function nl2br(text = '') {
  const breakTag = '<br />';
  return (text).replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1' + breakTag + '$2');
}

function renderMarkers(text = '') {
  let output = text;
  output = (output).replace(/</g, '&lt;');
  output = (output).replace(/>/g, '&gt;');
  return output;
}

export default function MarkupEntry(text = '') {
  let output = text + '';
  output = renderMarkers(output);
  output = nl2br(output);
  return output;
}
