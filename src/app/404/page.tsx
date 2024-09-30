"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Head from "next/head";

const NotFound: React.FC = () => {
  const router = useRouter();
  const [key, setKey] = useState(0);

  const handleBackToHome = () => {
    router.push("/");
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setKey((prevKey) => prevKey + 1);
    }, 5500); // 3.5s typing + 2s delay

    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className="w-screen h-screen flex flex-col justify-center items-center bg-black text-green-500"
      style={{ fontFamily: "'Press Start 2P', cursive" }}
    >
      <div className="flex flex-col justify-between items-center h-1/2">
        <div
          className="text-9xl"
          style={{ textShadow: "0px 0px 10px #54FE55" }}
        >
          404
        </div>
        <div key={key} className="typewriter text-5xl">
          <h1>THE PAGE YOU REQUESTED WAS NOT FOUND</h1>
        </div>
        <button
          onClick={handleBackToHome}
          className="px-4 py-2 bg-green-500 text-black text-sm font-bold uppercase rounded"
        >
          Back to Home
        </button>
      </div>
    </div>
  );
};

export default NotFound;
