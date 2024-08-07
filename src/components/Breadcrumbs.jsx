import React from "react";

function Breadcrumbs({ items }) {
  return (
    <div className="w-full mb-2 bg-stone-200 px-8 shadow-md">
      <div className="text-sm breadcrumbs">
        <ul>
          {items.map((item, index) => (
            <li key={index}>
                <a href={item.link}>{item.name}</a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Breadcrumbs;
