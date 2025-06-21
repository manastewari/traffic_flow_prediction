import React from "react";

export default function Result({ prediction }) {
  if (!prediction) return null;

  let color = "gray";
  if (prediction === "Low") color = "green";
  else if (prediction === "Medium") color = "orange";
  else if (prediction === "High") color = "red";

  return (
    <div style={{
      backgroundColor: "#1e293b",
      padding: "1rem",
      borderRadius: "0.75rem",
      textAlign: "center",
      color: color,
      fontSize: "1.5rem",
      fontWeight: "bold"
    }}>
      Predicted Traffic Level: <span style={{ color }}>{prediction}</span>
    </div>
  );
}
