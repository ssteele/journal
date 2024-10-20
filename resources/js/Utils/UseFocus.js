import { useRef } from 'react';

export default function UseFocus() {
  const htmlElRef = useRef(null);
  const setFocus = (position = null) => {
    const { current } = htmlElRef;
    if (current) {
      current.focus();
      if (position) {
        current.setSelectionRange(position, position);
      }
    }
  };
  return [htmlElRef, setFocus];
}
