import { Routes, Route } from "react-router-dom";
import Remote from "./Remote";
import Task from "./Task";
import Dashboard from "./DashBoard";
import { clientStore } from "../store/clientStore";
import Loader from "./Loader";
import NavBar from "./NavBar";

const MainLayout = () => {
  const { connectedSocket, menuOpened } = clientStore();

  return (
    <div className="w-full h-full overflow-hidden">
      <NavBar />
      <div className="w-full h-[calc(100%-64px)]">
        <Routes>
          <Route path="/" element={connectedSocket ? <Dashboard /> : <Loader />} />
          <Route
            path="/remote"
            element={connectedSocket ? <Remote /> : <Loader />}
          />
          <Route path="/task" element={connectedSocket ? <Task /> : <Loader />} />
          <Route
            path="/dashboard"
            element={connectedSocket ? <Dashboard /> : <Loader />}
          />
        </Routes>
      </div>
    </div>
  );
};

export default MainLayout;
