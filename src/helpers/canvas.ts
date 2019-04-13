import * as tf from "@tensorflow/tfjs";
import {
  imageDataToGrayscale,
  getBoundingRectangle,
  centerImage
} from "./image";
import { DIGIT_PAD_WIDTH, DIGIT_PAD_HEIGHT } from "../constants";
import mnistTraining from "../mnist/training";

// Source: https://codepen.io/arguiot/pen/xPYRKZ?editors=1100
// Number recognizer // TODO: cleanup
export async function recognizeDigit(context: CanvasRenderingContext2D) {
  return new Promise<string>(async (resolve, reject) => {
    let imgData = context.getImageData(0, 0, DIGIT_PAD_WIDTH, DIGIT_PAD_HEIGHT);

    let grayscaleImg = imageDataToGrayscale(imgData);
    const boundingRectangle = getBoundingRectangle(grayscaleImg, 0.01);
    const trans = centerImage(grayscaleImg); // [dX, dY] to center of mass

    // copy image to hidden canvas, translate to center-of-mass, then
    // scale to fit into a 200x200 box (see MNIST calibration notes on
    // Yann LeCun's website)
    const canvasCopy = document.createElement("canvas");
    canvasCopy.width = imgData.width;
    canvasCopy.height = imgData.height;
    const copyCtx = canvasCopy.getContext("2d")!;
    const brW = boundingRectangle.maxX + 1 - boundingRectangle.minX;
    const brH = boundingRectangle.maxY + 1 - boundingRectangle.minY;
    const scaling = 190 / (brW > brH ? brW : brH);
    // scale
    copyCtx.translate(DIGIT_PAD_WIDTH / 2, DIGIT_PAD_HEIGHT / 2);
    copyCtx.scale(scaling, scaling);
    copyCtx.translate(-DIGIT_PAD_WIDTH / 2, -DIGIT_PAD_HEIGHT / 2);
    // translate to center of mass
    copyCtx.translate(trans.transX, trans.transY);

    copyCtx.drawImage(context.canvas, 0, 0);

    // now bin image into 10x10 blocks (giving a 28x28 image)
    imgData = copyCtx.getImageData(0, 0, DIGIT_PAD_WIDTH, DIGIT_PAD_HEIGHT);
    grayscaleImg = imageDataToGrayscale(imgData);

    const nnInput = new Array(784);
    const nnInput2 = [];
    for (let y = 0; y < 28; y++) {
      for (let x = 0; x < 28; x++) {
        let mean = 0;
        for (let v = 0; v < 10; v++) {
          for (let h = 0; h < 10; h++) {
            mean += grayscaleImg[y * 10 + v][x * 10 + h];
          }
        }
        mean = 1 - mean / 100; // average and invert
        nnInput[x * 28 + y] = (mean - 0.5) / 0.5;
      }
    }

    // for visualization/debugging: paint the input to the neural net.
    //if (document.getElementById('preprocessing').checked == true) {
    if (true) {
      context.clearRect(0, 0, DIGIT_PAD_WIDTH, DIGIT_PAD_HEIGHT);
      context.drawImage(copyCtx.canvas, 0, 0);
      for (let y = 0; y < 28; y++) {
        for (let x = 0; x < 28; x++) {
          const block = context.getImageData(x * 10, y * 10, 10, 10);
          const newVal = 255 * (0.5 - nnInput[x * 28 + y] / 2);
          nnInput2.push(Math.round(((255 - newVal) / 255) * 100) / 100);
          for (let i = 0; i < 4 * 10 * 10; i += 4) {
            block.data[i] = newVal;
            block.data[i + 1] = newVal;
            block.data[i + 2] = newVal;
            block.data[i + 3] = 255;
          }
          context.putImageData(block, x * 10, y * 10);
        }
      }
    }

    const output = await mnistTraining.predict(tf.tensor1d(nnInput2));
    resolve(output);
  });
}

export function getMousePos(
  canvas: HTMLCanvasElement,
  clientX: number,
  clientY: number
) {
  var rect = canvas.getBoundingClientRect();
  return {
    x: ((clientX - rect.left) / (rect.right - rect.left)) * canvas.width,
    y: ((clientY - rect.top) / (rect.bottom - rect.top)) * canvas.height
  };
}

export const runWIthCanvasContext = (
  ref: React.RefObject<HTMLCanvasElement>
) => <_, ReturnTypeT>(
  callback: (
    canvas: HTMLCanvasElement,
    context: CanvasRenderingContext2D
  ) => ReturnTypeT
) => {
  if (ref.current) {
    const canvas = ref.current;
    const context = canvas.getContext("2d");
    if (context) {
      return callback(canvas, context);
    }
  }
};
