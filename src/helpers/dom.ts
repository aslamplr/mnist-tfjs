export function getOffsetSum(elem: HTMLElement | null) {
  let top = 0;
  let left = 0;
  while (elem) {
    top = top + elem.offsetTop;
    left = left + elem.offsetLeft;
    elem = elem.offsetParent as HTMLElement;
  }

  return { top, left };
}
