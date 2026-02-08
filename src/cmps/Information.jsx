// src/cmps/Information.jsx
import React from "react";

export function Information({ text }) {
  return (
    <div className="information-bar">
      <p className="information-txt">{text}</p>
    </div>
  );
}
