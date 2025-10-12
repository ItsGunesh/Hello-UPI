import React from 'react';

const TickAnimation = () => {
  return (
    <div className="flex items-center justify-center h-full w-full">
      <svg
        className="w-20 h-20 text-green-500"
        viewBox="0 0 52 52"
      >
        <circle
          className="stroke-current text-green-300"
          cx="26"
          cy="26"
          r="25"
          fill="none"
          strokeWidth="2"
        />
        <path
          className="tick stroke-current"
          fill="none"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M14 27l7 7 16-16"
        />
      </svg>

      <style jsx>{`
        .tick {
          stroke-dasharray: 48;
          stroke-dashoffset: 48;
          animation: draw 0.5s ease forwards 0.3s;
        }

        @keyframes draw {
          to {
            stroke-dashoffset: 0;
          }
        }
      `}</style>
    </div>
  );
};

export default TickAnimation;
