import "./App.css";
import { useState, useEffect, useContext } from "react";
import { Route, Routes } from "react-router-dom";
import Home from "./Pages/Home/Home";
import ToDo from "./Pages/ToDo/ToDo";
import alanBtn from "@alan-ai/alan-sdk-web";
import firebase from "./firebase";
import wordsToNumbers from "words-to-numbers";
import Timer from "./Pages/Timer/Timer";
import Auth from "./Pages/Authentication/Auth";
import { SettingContext } from "./context/settingContext";
import { PracticeContext } from "./context/contextPractice";
import ContextPractice from "./context/contextPractice";

function App() {
  const alanKey =
    "a3cc6f51ecf67f5aa246c0e8b0fbcf7d2e956eca572e1d8b807a3e2338fdd0dc/stage";

    const {handleDelete, handleUpdate, handleType} = useContext(PracticeContext);

  const { setCurrentTimer, startTimer, pauseTimer } =
    useContext(SettingContext);


  const currentUserId = localStorage.getItem("userUid");



  useEffect(() => {
    alanBtn({
      key: alanKey,
      onCommand: ({ command, deletetask, completed,title, userDate, userTime, duration }) => {
        if (command === "open_todo") {
          window.location = `${window.location.origin}/todo`;
        }
        if (command === "start_timer") {
          startTimer();
        }
        if (command === "pause_timer") {
          pauseTimer();
        }
        if (command === "short_break") {
          setCurrentTimer("short");
        }
        if (command === "long_break") {
          setCurrentTimer("long");
        }
        if (command === "work") {
          setCurrentTimer("work");
        }
        if (command === "open_timer") {
          window.location = `${window.location.origin}/timer`;
        }
        if (command === "go_back") {
          window.history.back();
        }
        if (command === "log_out") {
          window.location = window.location.origin;
        }
        if (command === "deleteatask") {
          const todoRef = firebase.database().ref(currentUserId).child("Task");
          todoRef.on("value", (snap) => {
            const todos = snap.val();
            const todoList = [];
            for (let id in todos) {
              // if(type === todos[id].type){
              todoList.unshift({ id, ...todos[id] });
              // }
            }
            let itemId = todoList[wordsToNumbers(deletetask) - 1]
              ? todoList[wordsToNumbers(deletetask) - 1].id
              : null;
              handleDelete(currentUserId,itemId);
          });
        }
        if (command === "completetask") {
          const todoRef = firebase.database().ref(currentUserId).child("Task");
          todoRef.on("value", (snap) => {
            const todos = snap.val();
            const todoList = [];
            for (let id in todos) {
              // if(type === todos[id].type){
              todoList.unshift({ id, ...todos[id] });
              // }
            }
            let itemId = todoList[wordsToNumbers(completed) - 1]
              ? todoList[wordsToNumbers(completed) - 1].id
              : null;
              handleUpdate(currentUserId,itemId,false);
          });
        }
        if(command === "gotoFlexible"){
          handleType("flexible");
        }if(command === "gotoStrict"){
          handleType("strict");
        }if(command === "addExplorer"){
          const todoRef = firebase.database().ref(currentUserId).child("Task");
          const todo = {
            title,
            completed: false,
            type: "explorer",
          };
          todoRef.push(todo);
        }if(command === "addFlexible"){
          const todoRef = firebase.database().ref(currentUserId).child("Task");
          const todo = {
            title,
            completed: false,
            type:"flexible",
            date:userDate,
            time:userTime,
            duration,
            timestamp: Date.now(),
          };
          todoRef.push(todo);
        }if(command === "addStrict"){
          const todoRef = firebase.database().ref(currentUserId).child("Task");
          const todo = {
            title,
            completed: false,
            type:"strict",
            date:userDate,
            time:userTime,
            duration,
            timestamp: Date.now(),
          };
          todoRef.push(todo);
        }
      },
    });
  }, []);
  return (
    <div className="App">
      <ContextPractice>
        <Routes>
          <Route path="/home" element={<Home />} />
          <Route path="/" element={<Auth />} />
          <Route
            path="/todo"
            element={<ToDo currentUserId={currentUserId} />}
          />
          <Route path="/timer" element={<Timer />} />
        </Routes>
      </ContextPractice>
    </div>
  );
}

export default App;
