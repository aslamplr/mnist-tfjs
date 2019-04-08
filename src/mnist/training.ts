import * as tf from "@tensorflow/tfjs";

import { MnistData } from "./data";
import {
  showExamples,
  showAccuracy,
  showConfusion,
  visualizeModel,
  getFitCallbacks
} from "./vis";

function getModel() {
  const model = tf.sequential();

  const IMAGE_WIDTH = 28;
  const IMAGE_HEIGHT = 28;
  const IMAGE_CHANNELS = 1;

  // In the first layer of out convolutional neural network we have
  // to specify the input shape. Then we specify some paramaters for
  // the convolution operation that takes place in this layer.
  model.add(
    tf.layers.conv2d({
      inputShape: [IMAGE_WIDTH, IMAGE_HEIGHT, IMAGE_CHANNELS],
      kernelSize: 5,
      filters: 8,
      strides: 1,
      activation: "relu",
      kernelInitializer: "varianceScaling"
    })
  );

  // The MaxPooling layer acts as a sort of downsampling using max values
  // in a region instead of averaging.
  model.add(tf.layers.maxPooling2d({ poolSize: [2, 2], strides: [2, 2] }));

  // Repeat another conv2d + maxPooling stack.
  // Note that we have more filters in the convolution.
  model.add(
    tf.layers.conv2d({
      kernelSize: 5,
      filters: 16,
      strides: 1,
      activation: "relu",
      kernelInitializer: "varianceScaling"
    })
  );
  model.add(tf.layers.maxPooling2d({ poolSize: [2, 2], strides: [2, 2] }));

  // Now we flatten the output from the 2D filters into a 1D vector to prepare
  // it for input into our last layer. This is common practice when feeding
  // higher dimensional data to a final classification output layer.
  model.add(tf.layers.flatten());

  // Our last layer is a dense layer which has 10 output units, one for each
  // output class (i.e. 0, 1, 2, 3, 4, 5, 6, 7, 8, 9).
  const NUM_OUTPUT_CLASSES = 10;
  model.add(
    tf.layers.dense({
      units: NUM_OUTPUT_CLASSES,
      kernelInitializer: "varianceScaling",
      activation: "softmax"
    })
  );

  // Choose an optimizer, loss function and accuracy metric,
  // then compile and return the model
  const optimizer = tf.train.adam();
  model.compile({
    optimizer: optimizer,
    loss: "categoricalCrossentropy",
    metrics: ["accuracy"]
  });

  return model;
}

async function train(model: tf.LayersModel, data: MnistData, epochs: number) {
  const BATCH_SIZE = 512;
  const TRAIN_DATA_SIZE = 5500;
  const TEST_DATA_SIZE = 1000;

  const [trainXs, trainYs] = tf.tidy(() => {
    const d = data.nextTrainBatch(TRAIN_DATA_SIZE);
    return [d.xs.reshape([TRAIN_DATA_SIZE, 28, 28, 1]), d.labels];
  });

  const [testXs, testYs] = tf.tidy(() => {
    const d = data.nextTestBatch(TEST_DATA_SIZE);
    return [d.xs.reshape([TEST_DATA_SIZE, 28, 28, 1]), d.labels];
  });

  return model.fit(trainXs, trainYs, {
    batchSize: BATCH_SIZE,
    validationData: [testXs, testYs],
    epochs,
    shuffle: true,
    callbacks: getFitCallbacks()
  });
}

const classNames = [
  "Zero",
  "One",
  "Two",
  "Three",
  "Four",
  "Five",
  "Six",
  "Seven",
  "Eight",
  "Nine"
];

function doPrediction(
  model: tf.LayersModel,
  data: MnistData,
  testDataSize = 500
): [tf.Tensor1D, tf.Tensor1D] {
  const IMAGE_WIDTH = 28;
  const IMAGE_HEIGHT = 28;
  const testData = data.nextTestBatch(testDataSize);
  const testxs = testData.xs.reshape<tf.Rank.R4>([
    testDataSize,
    IMAGE_WIDTH,
    IMAGE_HEIGHT,
    1
  ]);
  const labels = testData.labels.argMax(-1) as tf.Tensor1D;
  const preds = (model.predict(testxs) as tf.Tensor2D).argMax(
    -1
  ) as tf.Tensor1D;

  testxs.dispose();
  return [preds, labels];
}

export default class MnistTraining {
  private model: tf.LayersModel;
  private data: MnistData;

  constructor() {
    this.data = new MnistData();
    this.model = getModel();
  }

  public async loadData() {
    await this.data.load();
    await showExamples(this.data);
  }

  public async visualizeModel() {
    visualizeModel(this.model);
  }

  public async startTraining(epochs: number) {
    await train(this.model, this.data, epochs);
  }

  public async showMatrics() {
    const predictions = doPrediction(this.model, this.data);
    await showAccuracy(predictions, this.data, classNames);
    await showConfusion(predictions, this.data, classNames);
  }
}
