import React from "react";

const Loading = () => {
  return (
    <div className="loading">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 100 100"
        preserveAspectRatio="xMidYMid"
        width="200"
        height="200"
        style={{
          shapeRendering: "auto",
          display: "block",
          background: "rgba(255, 255, 255, 0)",
        }}
      >
        <g>
          <circle
            strokeDasharray="164.93361431346415 56.97787143782138"
            r="35"
            strokeWidth="10"
            stroke="#5a698f"
            fill="none"
            cy="50"
            cx="50"
          >
            <animateTransform
              keyTimes="0;1"
              values="0 50 50;360 50 50"
              dur="1s"
              repeatCount="indefinite"
              type="rotate"
              attributeName="transform"
            />
          </circle>
        </g>
      </svg>
    </div>
  );
};

export default Loading;
