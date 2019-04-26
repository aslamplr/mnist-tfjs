import React from "react";
import { DIGIT_PAD_WIDTH, DIGIT_PAD_HEIGHT } from "../constants";
import { getOffsetSum } from "../helpers/dom";
import {
  getMousePos,
  runWIthCanvasContext,
  recognizeDigit
} from "../helpers/canvas";
import mnistTraining from "../mnist/training";
import { Box, Text, Button } from "grommet";

interface Coordinates {
  x: number;
  y: number;
}

let touchend: NodeJS.Timeout;

export default () => {
  const [isDrawing, setDrawing] = React.useState(false);
  const [isRecognized, setRecognized] = React.useState(false);
  const [prediction, setPrediction] = React.useState("");
  const canvasRef = React.useRef<HTMLCanvasElement>(null);

  const zoom = 10;
  const footprint = {
    width: 28,
    height: 28
  };

  const clearer = (context: CanvasRenderingContext2D) => {
    context.clearRect(0, 0, footprint.width * zoom, footprint.height * zoom);
    setRecognized(false);
  };

  React.useEffect(() => {
    return runWIthCanvasContext(canvasRef)((canvas, context) => {
      clearer(context);
      const handler = (event: TouchEvent) => {
        event.preventDefault();
      };
      // prevent elastic scrolling
      canvas.addEventListener("touchmove", handler, false);
      canvas.addEventListener("touchcancel", handler, false);
      return () => {
        canvas.removeEventListener("touchmove", handler, false);
        canvas.removeEventListener("touchcancel", handler, false);
      };
    });
  }, []);

  // create a drawer which tracks touch movements
  const getDrawer = () => {
    return runWIthCanvasContext(canvasRef)((canvas, context) => ({
      touchstart(coors: Coordinates) {
        context.beginPath();
        context.lineWidth = 20;
        context.lineCap = "round";
        const { x, y } = getMousePos(canvas, coors.x, coors.y);
        context.moveTo(x, y);
        setDrawing(true);
      },
      touchmove(coors: Coordinates) {
        if (isDrawing) {
          try {
            clearTimeout(touchend);
          } catch (e) {}
          if (isRecognized) {
            clearer(context);
          }
          const { x, y } = getMousePos(canvas, coors.x, coors.y);
          context.lineTo(x, y);
          context.stroke();
        }
      },
      touchend(coors: Coordinates) {
        if (isDrawing) {
          this.touchmove(coors);
          setDrawing(false);
        }

        touchend = setTimeout(async () => {
          const predict = await recognizeDigit(context);
          setPrediction(predict);
          setRecognized(true);
          clearer(context);
        }, 1200);
      }
    }));
  };

  // create a function to pass touch events and coordinates to drawer
  const draw = (
    event:
      | React.TouchEvent<HTMLCanvasElement>
      | React.MouseEvent<HTMLCanvasElement>
  ) => {
    event.preventDefault();
    let type: "touchstart" | "touchmove" | "touchend" | null = null;
    // map mouse events to touch events
    switch (event.type) {
      case "mousedown":
        type = "touchstart";
        break;
      case "mousemove":
        type = "touchmove";
        break;
      case "mouseup":
        type = "touchend";
        break;
      case "touchstart":
      case "touchmove":
      case "touchend":
        type = event.type;
        break;
    }

    // touchend clear the touches[0], so we need to use changedTouches[0]
    let coors;
    if ("changedTouches" in event) {
      if (event.type === "touchend") {
        coors = {
          x: event.changedTouches[0].clientX,
          y: event.changedTouches[0].clientY
        };
      } else {
        // get the touch coordinates
        coors = {
          x: event.touches[0].clientX,
          y: event.touches[0].clientY
        };
      }
    } else {
      coors = {
        x: event.clientX,
        y: event.clientY
      };
    }

    // pass the coordinates to the appropriate handler
    const drawer = getDrawer();
    drawer && drawer[type!](coors);
  };

  return (
    <Box direction="column" align="center" pad="medium">
      <Button
        label="Load trained model"
        onClick={() => mnistTraining.loadTrainedModel()}
      />
      <Text>Draw here</Text>
      <Box
        border={{ color: "brand", size: "large" }}
        height={`${DIGIT_PAD_HEIGHT + 12}px`}
        width={`${DIGIT_PAD_WIDTH + 12}px`}
      >
        <canvas
          ref={canvasRef}
          width={DIGIT_PAD_WIDTH}
          height={DIGIT_PAD_HEIGHT}
          onTouchStart={draw}
          onTouchMove={draw}
          onTouchEnd={draw}
          onMouseDown={draw}
          onMouseMove={draw}
          onMouseUp={draw}
        />
      </Box>
      <Box>
        <Text>Prediction</Text>
        <Text size="160px" weight="bold">
          {prediction}
        </Text>
      </Box>
    </Box>
  );
};
