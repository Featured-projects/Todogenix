import React, { useState, useEffect, useContext } from "react";
import "./Dialog.css";
import ListItem from "../../components/ListItem/ListItem";
import firebase from "../../firebase";
import { PracticeContext } from "../../context/contextPractice";

const Dialog = ({ type, currentUserId }) => {
  const [click, setClick] = useState(false);
  const [field, setField] = useState("");
  const [TodoList, setTodoList] = useState([]);
  const [isEdit,setIsEdit ] = useState(false);
  const [editTaskId,setEditTaskId] =useState(null);
  const [editTaskTitle,setEditTaskTitle] =useState(null);

  const {addOrEdit} = useContext(PracticeContext);

 

  const handleSubmit = (event) => {
    event.preventDefault();
    if(isEdit){
      console.log("hilo",field)
      const todoRef = firebase.database().ref(currentUserId).child("Task").child(editTaskId);
      todoRef.update({
        title:field,
       });
    }else{
      setField(event.target[0].value);
    if (type === "explorer") {
      addOrEdit(event.target[0].value,type);
    }else{
      addOrEdit(event.target[0].value,type,event.target[1].value,event.target[2].value,event.target[3].value);
    }

    setField("");
    }
  };

  // const update = (todoRef, title) => {
  //   todoRef.update({
  //     title:title,
  //    });
  // }

  const handleChange = (event) => {
    setField(event.target.value);
  };

  const onClick = () => {
    setClick(false);
  };
  const handleCancel = () => {
    setClick(false);
    if (click === true) setField("");
  };

  useEffect(() => {
    const todoRef = firebase
      .database()
      .ref(currentUserId)
      .child("Task");
    todoRef.on("value", (snap) => {
      const todos = snap.val();
      const todoList = [];
      for (let id in todos) {
    
        if(type === todos[id].type){
          todoList.push({ id, ...todos[id] });
        }      
      }
      setTodoList(todoList);
    });
  }, []);

  

  return (
    <div style={{ overflow: "hidden" }}>
      <div className="add-item">
        {TodoList.length !== 0 ? (
          TodoList.slice(0)
            .reverse()
            .map((ele, index) => {
              return ele.title || ele.todotask ? (
                <ListItem key={index} setEditTaskTitle={setEditTaskTitle} setEditTaskId={setEditTaskId} setIsEdit={setIsEdit} setField={setField} setClick={setClick} type={type} currentUserId={currentUserId} todoNum={index} todo={ele} />
              ) : null;
            })
        ) : (
          <h2 className="empty-list">Add something in your to do list.</h2>
        )}
        <button
          className="open-button"
          onClick={() => (click ? setClick(false) : setClick(true))}
        >
          +
        </button>
        <div
          style={{
            transform: `${
              click ? "translate(420px,52px)" :type==='explorer'? "translate(790px,352px)":"translate(900px,500px)"
            }`,
          }}
          className={`add-item-container ${type === 'explorer'?'add-item-container-explore':null}`}
        >
          <form onSubmit={handleSubmit}>
            <h2 className="form-h2">Add a task</h2>
            <p className="form-para">
              Add something to start a new task sbsj hskkk hvhb.
            </p>
            <input
              className="authInput  auth-input--modify"
              value={field}
              onChange={handleChange}
              type="text"
              placeholder="Add Task"
            />
            {
              type !== "explorer"?(
                <>
                <input className="authInput" type="date" id="start" name="trip-start" />
                <input style={{margin:' 0 10px'}} className="authInput" type="time" id="appt" name="appt" />
                <input style={{width:'90%'}} className="authInput" type="text"  placeholder="Duration" />
                </>
              ):null
            }
            <div
              className="form-button form-div"
              onClick={() => handleCancel()}
            >
              cancel
            </div>
            <button
            style={{padding:'10px'}}
              className="form-button"
              onClick={() => onClick()}
              type="submit"
            >
              Add
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Dialog;
