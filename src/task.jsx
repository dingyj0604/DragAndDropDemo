import React, { useState } from 'react';
import './task.less';
import delImg from './static/icon/delete.png';

const Task = (props) => {
  // console.log('task', props);
  const { taskList, setTaskList, curTask } = props;
  const [showDel, setShowDel] = useState(false); // 是否显示删除按钮

  // 鼠标进入task触发显示delete图标
  const openDelete = () => {
    setShowDel((pre) => true);
  }
  //鼠标移出task触发隐藏delete图标
  const closeDelete = () => {
    setShowDel((pre) => false);
  }

  const deleteTask = () => {
    // eslint-disable-next-line no-restricted-globals
    if (confirm(`确认删除任务 ${curTask?.name} 吗？`)) {
      console.log('删除', curTask);
      const temp = [...taskList].filter((item) => item.id !== curTask.id);
      console.log(temp);
      setTaskList([...temp]);
    }
  }

  return (
    <div className="item" key={curTask?.id}
      onMouseEnter={openDelete}
      onMouseLeave={closeDelete}
    >
      {curTask?.name}
      <img className='delIcon' style={{ display: showDel ? 'inline-block' : 'none' }} src={delImg} alt='delete'
        onClick={() => deleteTask()}
      />
    </div >
  )
}

export default Task;

