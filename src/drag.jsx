import React, { useState, useEffect } from 'react';
import './drag.less';

const Drag = () => {
  const [landing, setLanding] = useState(true); // landing状态
  const [prepareList, setPrepareList] = useState([]);
  const [learningList, setLearningList] = useState([]);
  const [completeList, setCompleteList] = useState([]);
  const [showDel, setShowDel] = useState(false); // 是否显示删除按钮
  const [currentTask, setCurrentTask] = useState({}); // 当前选中的任务

  useEffect(() => {

  }, [])

  //鼠标华划过接受拖拽元素的事件
  const handleDrop = (callBack, e, arrow) => {
    const { dataset: { id } } = e.target
    const curData = JSON.parse(e.dataTransfer.getData('itemData'))
    callBack(prevData => {
      const diffData = prevData.filter(item => item.uid !== curData.uid)
      // id 不存在是在不同盒子内拖拽  存在则是在本身盒子内拖拽
      if (!id) return [...diffData, curData]
      // 找到鼠标划过的目标元素的其盒子内的位置
      const index = diffData.findIndex(item => item.uid === id)
      //把拖拽元素放置在鼠标划过元素的上方
      diffData.splice(index, 0, curData)
      return diffData

    })
    //朝左拖拽
    if (arrow === 'left') {
      // setRightList(prvData => prvData.filter(item => item.uid !== curData.uid))
    }
    // 朝右拖拽
    else {
      // setLeftList(prvData => prvData.filter(item => item.uid !== curData.uid))
    }
  }
  // 拖拽元素进入目标元素时触发事件-为目标元素添加拖拽元素进入时的样式效果
  const handleDragEnter = e => e.target.classList.add('over')

  // 拖拽元素离开目标元素时触发事件-移除目标元素的样式效果
  const handleDragLeave = e => e.target.classList.remove('over')

  return (
    <div className='main'>
      {
        landing ? (<div className='start'>
          <button className='button'>Start App</button>
        </div>) : (
          <div>111</div>
        )
      }
    </div>
  )
}

export default Drag

