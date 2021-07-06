import { Float } from "./float";

const debounce = (func, delay = 250) => {
  let timeout = null;
  return function () {
    let context = this;
    let args = arguments;
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      func.apply(context, args);
    }, delay);
  };
};
const randomSeedList = new Array(200);
for (let i = 0, len = randomSeedList.length; i < len; i++) {
  randomSeedList[i] = 1 - 2 * Math.random();
}

const lagrangeInterpolation = (data, x) => {
  let y = 0;
  const len = data.length;
  for (let i = 0; i < len; ++i) {
    let a = 1,
      b = 1;
    for (let j = 0; j < len; ++j) {
      if (j == i) continue;
      a *= x - data[j][0];
      b *= data[i][0] - data[j][0];
    }
    y += (data[i][1] * a) / b;
  }
  return y;
};
const lineInterpolation = (data, x) => {
  if (x <= data[0][0]) {
    return data[0][1];
  }
  if (x >= data[data.length - 1][0]) {
    return data[data.length - 1][1];
  }
  for (let i = 0; i < data.length - 1; i++) {
    if (x >= data[i][0] && x < data[i + 1][0]) {
      return Float.mix(data[i][1], data[i + 1][1], Float.inverseMix(data[i][0], data[i + 1][0], x));
    }
  }
};

export { debounce, randomSeedList, lagrangeInterpolation, lineInterpolation };
