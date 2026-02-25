import React from "react";
import Sidebar from "./Sidebar";
import "./layout.css";


export default function Layout({ children }) {
  return (
    <div className="layout">
      <div className="sidebar-container">
        <Sidebar />
      </div>
      <div className="content">{children}</div>
    </div>
  );
}
