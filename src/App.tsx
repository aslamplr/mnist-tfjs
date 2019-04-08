import React from "react";
import MnistTrain from "./components/MnistTrain";
import VisorControl from "./components/VisorControl";
import DigitPad from "./components/DigitPad";

export default () => (
  <div>
    <VisorControl />
    <div className="center">
      <MnistTrain />
      <hr />
      <DigitPad />
    </div>
  </div>
);
