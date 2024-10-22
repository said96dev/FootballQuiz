import Navbar from "@/components/SharedLayout/Navbar";
import SidebarApp from "@/components/SharedLayout/Sidebar";
import React from "react";

const DashboardWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex min-h-screen w-full">
      <main className={`flex w-full flex-col md:pl-64`}>
        <Navbar />
        {children}
      </main>
    </div>
  );
};

export default DashboardWrapper;
