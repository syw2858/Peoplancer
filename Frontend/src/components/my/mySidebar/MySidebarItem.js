import React from "react";

function MySidebarItem({ tab, isActive }) {
  return (
    <div className={isActive ? "black" : ""}>
      <p>{tab.name}</p>
    </div>
  );
}

export default MySidebarItem;
