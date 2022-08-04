// 深拷贝
export const deepCopy = (obj) => {
  if (obj instanceof Array) {
    const arr = [];
    for (const item of obj) {
      arr.push(deepCopy(item));
    }
    return arr;
  }
  if (typeof obj === 'object') {
    const temp = {};
    for (const i in obj) temp[i] = deepCopy(obj[i]);
    return temp;
  }
  return obj;
};

export default deepCopy;
