import React from "react";
import { BeatLoader } from "react-spinners";

export default function loading() {
  return (
    <>
      <div className="h-screen flex items-center justify-center">
        <BeatLoader />
      </div>
    </>
  );
}