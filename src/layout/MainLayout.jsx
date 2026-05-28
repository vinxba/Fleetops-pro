import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { Outlet } from "react-router-dom";

const MainLayout = () => {
  return (
    <div className="flex min-h-screen bg-[#f5f7fb]">

      <Sidebar />

      <div className="flex-1">

        <Navbar />

        <div className="p-8">
          <Outlet />
        </div>

      </div>

    </div>
  );
};

export default MainLayout;