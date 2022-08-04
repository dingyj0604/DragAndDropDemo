import React, { useState, useEffect } from 'react';
import './drag.less';
import addImg from './static/icon/add.png';
import { arrayMove } from './utils/arrayMove';
import { getUID } from './utils/getUniqueID';
import { deepCopy } from './utils/deepCopy';
import Task from './task';

const Drag = () => {
  const [landing, setLanding] = useState('on'); // landing状态
  const [prepareList, setPrepareList] = useState([]);
  const [learningList, setLearningList] = useState([]);
  const [completeList, setCompleteList] = useState([]);
  const [showInput, setShowInput] = useState(false); // 是否显示新增输入框
  const [fromListName, setFromListName] = useState(''); // 当前被选中拖拽的任务来自的列表(源列表)名称

  useEffect(() => {
    // 初始化
    if (sessionStorage.getItem('landing')) {
      setLanding(sessionStorage.getItem('landing'));
    }
    if (sessionStorage.getItem('taskLists')) {
      const initLists = JSON.parse(sessionStorage.getItem('taskLists'));
      setPrepareList(initLists.prepareList || []);
      setLearningList(initLists.learningList || []);
      setCompleteList(initLists.completeList || []);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // 检测浏览器刷新,在刷新前sessionStorage
  window.onbeforeunload = () => {
    console.log('willLoad');
    sessionStorage.setItem('taskLists', JSON.stringify({ prepareList, learningList, completeList }));
  }

  // useEffect(() => {
  //   console.log('@@@prepareList：', prepareList);
  // }, [prepareList])

  useEffect(() => {
    console.log('@@@landing', typeof landing);
    console.log('@@@sessionStorage', sessionStorage.getItem('landing'));
  }, [landing])

  const addTask = (e) => {
    console.log(e.target.value);
    let curValue = e.target.value;
    if (curValue) {
      // getUID 生成该task的唯一ID
      const newTask = { id: getUID(), name: curValue }
      setPrepareList(deepCopy([...prepareList, newTask]));
    }
    e.target.value = '';
    setShowInput(false);
  }

  /**
   * 拖拽结束释放时于释放元素上触发
   * @param {*} callBack 接收当前元素释放的盒子列表setState回调
   * @param {*} e 元素释放时接触的事件
   * @param {*} dropListName 接收当前元素释放的盒子列表的名字
   */
  const handleDrop = (callBack, e, dropListName) => {
    const { dataset: { id } } = e.target;
    const curTask = JSON.parse(e.dataTransfer.getData('itemData')); // 被选中拖拽的task
    console.log('handleDrop dropListName ---', dropListName);
    console.log('handleDrop target ---', e.target.dataset, id);
    console.log('handleDrop curData ---', curTask);
    console.log('handleDrop fromTaskList ---', fromListName);

    // 如果id不存在且拖拽元素的源盒子和目标盒子又为同一个时，则不进行处理
    if (!id && dropListName === fromListName) {
      return;
    }

    // id不存在 ---> 在不同盒子之间进行拖拽 -> 在新盒子中增加 
    if (!id) {
      callBack(pre => {
        return [...pre, curTask];
      });
    } else {
      // id存在 ---> 原盒子内部拖拽 -> 原盒子交换位置
      callBack(pre => {
        const oldIndex = pre.findIndex(item => item.id === curTask.id);
        const newIndex = pre.findIndex(item => item.id === id);
        console.log(oldIndex, newIndex);
        if (oldIndex !== -1 && newIndex !== -1) {
          return [...arrayMove(pre, oldIndex, newIndex)];
        } else {
          return [...pre];
        }
      });
    }
    // 拖拽结束释放后 如果是在不同盒子之间进行拖拽 则需要删除原list内的该元素
    if (dropListName !== fromListName) {
      if (fromListName === 'prepareList') {
        setPrepareList(pre => pre.filter(item => item.id !== curTask.id));
      }
      else if (fromListName === 'learningList') {
        setLearningList(pre => pre.filter(item => item.id !== curTask.id));
      } else {
        setCompleteList(pre => pre.filter(item => item.id !== curTask.id));
      }
    }
  }

  // 拖拽元素进入目标元素时触发
  // 为目标盒子添加拖拽元素进入时高亮样式效果
  const onDragEnter = e => {
    // console.log(e.target.classList[0]);
    // 判断目标元素e.target是否为content盒子，防止误给task和子组件Task的item增加class
    if (e.target.classList[0] === 'content') {
      e.target.classList.add('highLight');
    }
  }

  // 拖拽元素离开目标元素时触发，移除目标元素样式效果
  const onDragLeave = e => {
    if (e.target.classList[0] === 'content') {
      e.target.classList.remove('highLight');
    }
  }

  return (
    <div className="main">
      {
        landing === 'on' ?
          (<div className='start'>
            <button className='button'
              onClick={() => {
                setLanding('off'); sessionStorage.setItem('landing', 'off'); // 防止页面刷新后重启到Start App
              }}>
              Start App
            </button>
          </div>) :
          (<div className='container'>
            <div className='left'>
              <div className='title'>Prepare to study</div>
              <div className='content'
                onDragEnter={onDragEnter}
                onDragLeave={onDragLeave}
                onDragOver={(e) => { e.preventDefault() }}
                onDrop={(e) => handleDrop(setPrepareList, e, "prepareList")}
              >
                {
                  prepareList?.map((item) => {
                    return (
                      <div key={item?.id} className='task'
                        draggable data-id={item?.id}
                        onDragStart={(e) => {
                          e.dataTransfer.setData('itemData', JSON.stringify(item));
                          setFromListName('prepareList');
                        }}
                      >
                        <Task taskList={prepareList} setTaskList={setPrepareList} curTask={item} />
                      </div>
                    )
                  })
                }
                <input style={{ display: showInput ? 'inline-block' : 'none' }} className='input'
                  onKeyDown={(e) => { if (e.keyCode === 13) { addTask(e) } }} />
                <div className='icon' onClick={() => { setShowInput(true) }}>
                  <img src={addImg} alt='add task' />
                </div>
              </div>
            </div>
            <div className='center'>
              <div className='title'>Learning</div>
              <div className='content'
                onDragEnter={onDragEnter}
                onDragLeave={onDragLeave}
                onDragOver={(e) => { e.preventDefault() }}
                onDrop={(e) => handleDrop(setLearningList, e, "learningList")}
              >
                {
                  learningList?.map((item) => {
                    return (
                      <div key={item?.id} className='task'
                        draggable data-id={item?.id}
                        onDragStart={(e) => {
                          e.dataTransfer.setData('itemData', JSON.stringify(item));
                          setFromListName('learningList');
                        }}
                      >
                        <Task taskList={learningList} setTaskList={setLearningList} curTask={item} />
                      </div>
                    )
                  })
                }
              </div>
            </div>
            <div className='right'>
              <div className='title'>Complete</div>
              <div className='content'
                onDragEnter={onDragEnter}
                onDragLeave={onDragLeave}
                onDragOver={(e) => { e.preventDefault() }}
                onDrop={(e) => handleDrop(setCompleteList, e, "completeList")}
              >
                {
                  completeList?.map((item) => {
                    return (
                      <div key={item?.id} className='task'
                        draggable data-id={item?.id}
                        onDragStart={(e) => {
                          e.dataTransfer.setData('itemData', JSON.stringify(item));
                          setFromListName('completeList');
                        }}
                      >
                        <Task taskList={completeList} setTaskList={setCompleteList} curTask={item} />
                      </div>
                    )
                  })
                }
              </div>
            </div>
          </div>)
      }
    </div >
  )
}

export default Drag;

