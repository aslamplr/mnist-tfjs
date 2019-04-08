import * as tf from "@tensorflow/tfjs";
import * as tfvis from "@tensorflow/tfjs-vis";
import { DataProvider } from "./types";

export async function visualizeModel(model: tf.LayersModel) {
  tfvis.show.modelSummary({ name: "Model Architecture" }, model);
}

export async function showExamples(data: DataProvider) {
  // Create a container in the visor
  const surface = tfvis
    .visor()
    .surface({ name: "Input Data Examples", tab: "Input Data" });

  // Get the examples
  const examples = data.nextTestBatch(20);
  const numExamples = examples.xs.shape[0];

  // Create a canvas element to render each example
  for (let i = 0; i < numExamples; i++) {
    const imageTensor = tf.tidy(() => {
      // Reshape the image to 28x28 px
      return examples.xs
        .slice([i, 0], [1, examples.xs.shape[1]])
        .reshape<tf.Rank.R3>([28, 28, 1]);
    });

    const canvas = document.createElement("canvas");
    canvas.width = 28;
    canvas.height = 28;
    canvas.style.margin = "4px";
    await tf.browser.toPixels(imageTensor, canvas);
    surface.drawArea.appendChild(canvas);

    imageTensor.dispose();
  }
}

export function getFitCallbacks() {
  const metrics = ["loss", "val_loss", "acc", "val_acc"];
  const container = {
    name: "Model Training",
    styles: { height: "1000px" }
  };
  return tfvis.show.fitCallbacks(container, metrics);
}

export async function showAccuracy(
  [preds, labels]: [tf.Tensor1D, tf.Tensor1D],
  data: DataProvider,
  classNames: string[]
) {
  const classAccuracy = await tfvis.metrics.perClassAccuracy(labels, preds);
  const container = { name: "Accuracy", tab: "Evaluation" };
  tfvis.show.perClassAccuracy(container, classAccuracy, classNames);
  labels.dispose();
}

export async function showConfusion(
  [preds, labels]: [tf.Tensor1D, tf.Tensor1D],
  data: DataProvider,
  classNames: string[]
) {
  const confusionMatrix = await tfvis.metrics.confusionMatrix(labels, preds);
  const container = { name: "Confusion Matrix", tab: "Evaluation" };
  tfvis.render.confusionMatrix(container, {
    values: confusionMatrix,
    tickLabels: classNames
  });

  labels.dispose();
}
