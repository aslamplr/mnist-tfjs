import { Tensor2D } from "@tensorflow/tfjs";

export interface DataSet {
  xs: Tensor2D;
  labels: Tensor2D;
}

export interface DataProvider {
  nextTrainBatch(batchSize: number): DataSet;
  nextTestBatch(batchSize: number): DataSet;
}

export interface DataLoader {
  load(): Promise<void>;
}
