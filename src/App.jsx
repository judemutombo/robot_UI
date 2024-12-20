import react, { useEffect } from "react";
import SideBar from "./components/sideBar";
import "./css/main.css";
import { BrowserRouter } from 'react-router-dom';
import MainLayout from "./components/MainLayout";
import { clientStore } from "./store/clientStore";
import Loarder from "./components/Loader";


function App() {
  const {initializeSocket, initializeRos, connectedSocket, connectedRos}= clientStore()
  useEffect(function(){
    initializeSocket()
    initializeRos()
  },[initializeSocket, initializeRos])

  if(!(connectedSocket && connectedRos )){
    return <Loarder/>
  }

  return (
    <BrowserRouter>
    <div className="flex flex-row w-full h-full">
        <SideBar />
        <MainLayout />
    </div>
    </BrowserRouter>
  );
}

export default App;
