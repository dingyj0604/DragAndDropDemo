import React, { useState, useEffect } from 'react';
import './drag.less';
import addImg from './static/icon/add.png';
import delImg from './static/icon/delete.png';

const Drag = () => {
  const [landing, setLanding] = useState(true); // landing状态
  const [prepareList, setPrepareList] = useState([]);
  const [learningList, setLearningList] = useState([]);
  const [completeList, setCompleteList] = useState([]);
  const [showInput, setShowInput] = useState(false); // 是否显示新增输入框
  const [showDel, setShowDel] = useState(false); // 是否显示删除按钮
  const [currentTask, setCurrentTask] = useState({}); // 当前选中的任务

  useEffect(() => {
    console.log('prepareList：', prepareList);
  }, [prepareList])

  const addTask = (e) => {
    console.log(e.target.value);
    let curValue = e.target.value;
    if (curValue) {
      setPrepareList([...prepareList, curValue])
    }
    setShowInput(false);
  }

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
    <div className="main">
      {
        landing ?
          (<div className='start'>
            <button className='button' onClick={() => { console.log('点击start'); setLanding(false) }}>Start App</button>
          </div>) :
          (<div className='container'>
            <div className='left'>
              <div className='title'>Prepare to study</div>
              <div className='content'>
                <div>prepareList</div>
                <input style={{ display: showInput ? 'inline-block' : 'none' }} onKeyDown={(e) => { if (e.keyCode === 13) { addTask(e) } }}></input>
                <div className='icon' onClick={() => { setShowInput(true) }}><img src={addImg} alt='add task' /></div>
              </div>
            </div>
            <div className='center'>
              <div className='title'>Learning</div>
              <div className='content'>prepareList</div>
            </div>
            <div className='right'>
              <div className='title'>Complete</div>
              <div className='content'>prepareList</div>
            </div>
          </div>)
      }
    </div>
  )
}

export default Drag

