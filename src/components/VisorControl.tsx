import React from "react";
import { openVis } from "../mnist/vis";

export default () => (
  <div className="visor-control">
    <span>TFVis control</span>
    <button onClick={openVis}>Open</button>
  </div>
);
