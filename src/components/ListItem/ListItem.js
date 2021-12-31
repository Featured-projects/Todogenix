import React, {useState, useContext } from "react";
import "./ListItem.css";
import Checkbox from "@mui/material/Checkbox";
import DeleteIcon from '@mui/icons-material/Delete';
import firebase from '../../firebase';
import EditIcon from '@mui/icons-material/Edit';
import { PracticeContext } from "../../context/contextPractice";

const ListItem = (props) => {


  
   const {handleUpdate, handleDelete} = useContext(PracticeContext);
   const currentUserId = localStorage.getItem('userUid');
   const editTask = (edit) => {
    props.setClick(edit);
   const todoRef = firebase.database().ref(currentUserId).child("Task").child(props.todo.id);
   todoRef.on("value", (snap) => {
    const todos = snap.val();
     const title = todos.title;
    props.setField(title);
    props.setIsEdit(true);
    props.setEditTaskId(props.todo.id);
    props.setEditTaskTitle(title);
    // props.setEditId();
    // update(todoRef,title);
  });
  };

  // const update = (todoRef, title) => {
  //   todoRef.update({
  //     title:title,
  //    });
  // }

  function Capitalize(str){
    return str.charAt(0).toUpperCase() + str.slice(1);
    };
  

  return (
    <div  className="list-item--container">
      <Checkbox
        style = {{width:'65px',marginRight:"20px"}}
        checked={props.todo.completed}
        onChange={() => handleUpdate(props.currentUserId, props.todo.id,props.todo.completed )}
        inputProps={{ "aria-label": "controlled" }}
      />
      <div className="todo-list-div">
      <h3 style={{textDecoration:`${props.todo.completed?'line-through':''}`,textDecorationThickness:'3px'}} >{parseInt(props.todoNum) +1}. {Capitalize(props.todo.title || props.todo.todotask)}</h3>
      {
        props.type !== 'explorer'? <p>Due: {props.todo.time} {props.todo.date} {props.todo.duration} hr</p>:null
      }
      </div>
      <div>
        <div className="icon-div" onClick={() => handleDelete(props.currentUserId, props.todo.id)}><DeleteIcon /></div>  
        {
          props.type !== 'strict'?(
                   <div className="icon-div" onClick={() => editTask(true)}><EditIcon /></div>
          ):null
        }
            
      </div>
    </div>
  );
};

export default ListItem;
