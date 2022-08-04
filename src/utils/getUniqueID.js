/**
 * 引入时间戳 + 随机数前置36进制 + 随机数长度控制
 * 生成一个不重复的ID
 * @param { Number } randomLength 
 */
export const getUID = (randomLength = 12) => {
  return Number(Math.random().toString().substr(2, randomLength) + Date.now()).toString(36)
}