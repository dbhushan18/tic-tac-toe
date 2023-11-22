import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/home.jsx";
import Game from "./pages/game.jsx";
import './App.scss'
import React, { StrictMode } from "react";


function App() {


  return (
    <StrictMode>
    <BrowserRouter>
      <Routes>
          <Route index element={<Home />} />
          <Route path= "/game" element={<Game />} />     
      </Routes>
    </BrowserRouter>
    </StrictMode>
  )
}

export default App
