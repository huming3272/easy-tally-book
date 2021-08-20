function formatTsNum(tsNum: string|number, numType: 'num'|'tsNum'|null= 'num') {

  if (typeof tsNum === 'string') {
    let num = tsNum;
    if (num.indexOf(',')) {
      num = num.replace(/,/g, '');
      return num;
    } else {
      return num;
    }
  } else {
    if (numType === 'tsNum') {
    return tsNum.toLocaleString();
  } else if (numType === 'num' || !numType) {
      return tsNum;
    } else {
      return tsNum;
    }
  }


}
export default formatTsNum;
