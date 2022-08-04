/**
 * 数组中某一元素拖拽移动位置后，对数组的数据进行交换
 * @param {*} items 数组 
 * @param {*} oldIndex 该元素原位置
 * @param {*} newIndex 该元素新位置
 * @returns 
 */
export const arrayMove = (items, oldIndex, newIndex) => {
  const temp = items[oldIndex];
  const tempList = [...items];
  tempList.splice(oldIndex, 1);
  tempList.splice(newIndex, 0, temp);
  return tempList;
}