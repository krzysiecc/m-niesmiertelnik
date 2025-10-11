
import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";

export const BasicLayout = () => {
  return (
    <div className="min-h-screen bg-background-primary">
      <Sidebar />
      <main className="ml-64"> 
        <Header />
        <div className="p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};