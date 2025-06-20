import React from "react";
import {Routes,Route} from "react-router-dom"

// Components
import MyNavBar from "./components/Navbar";

// Pages
import RegisterPage from "./pages/Register"; 
import LoginPage from "./pages/Login";
import AddNewBook from "./pages/List";
import HomePage from "./pages/Home";


function App(){
  return(
    <div>
      <MyNavBar/>
      <Routes>
        <Route path="/" element={<HomePage/>}/>
        <Route path="/login" element={<LoginPage/>}/>
        <Route path="/register" element={<RegisterPage/>}/>
        <Route path="/book/list" element = {<AddNewBook/>}></Route>
      </Routes>
    </div>
  )
}

export default App;