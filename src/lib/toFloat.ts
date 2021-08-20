function toFloat(num: number|string) {
  let fetchAmount;
  let result: number = 0;
  if (typeof num !== 'number') {
    fetchAmount = num.split('.');
    result = Number(num);
  } else {
    fetchAmount = String(num).split('.');
    result = num;
  }

  if (fetchAmount.length < 2 || fetchAmount[fetchAmount.length - 1].length <= 2) {

    return result.toFixed(2) || result;
    // return出去是字符串
  } else {
    return String(result);
  }
}

export default toFloat;


