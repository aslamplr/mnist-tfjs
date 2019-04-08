import React from "react";
import MnistTraining from "../mnist/training";

const mnistTraining = new MnistTraining();

interface IState {
  isDataLoaded: boolean;
  isModelCreated: boolean;
  epochs: number;
}

interface IAction {
  type: string;
  payload?: number;
}

const LOAD_DATA_CLICKED = "LOAD_DATA_CLICKED";
const VISUALIZE_MODEL_CLICKED = "VISUALIZE_MODEL_CLICKED";
const START_TRAINING_CLICKED = "START_TRAINING_CLICKED";
const SHOW_MATRICS_CLICKED = "SHOW_MATRICS_CLICKED";
const CHANGE_EPOCHS = "CHANGE_EPOCHS";

const initialState = {
  isDataLoaded: false,
  isModelCreated: false,
  epochs: 1
};

export default () => {
  const [state, dispatch] = React.useReducer(
    (_state: IState, action: IAction) => {
      if (action.type === LOAD_DATA_CLICKED) {
        return {
          ..._state,
          isDataLoaded: true
        };
      } else if (action.type === VISUALIZE_MODEL_CLICKED) {
        return {
          ..._state,
          isModelCreated: true
        };
      } else if (action.type === CHANGE_EPOCHS) {
        return {
          ..._state,
          epochs: action.payload!
        };
      }
      return _state;
    },
    initialState
  );

  const _loadData = () => {
    dispatch({ type: LOAD_DATA_CLICKED });
    mnistTraining.loadData();
  };

  const _createModel = () => {
    dispatch({ type: VISUALIZE_MODEL_CLICKED });
    mnistTraining.visualizeModel();
  };

  const _startTraining = () => {
    dispatch({ type: START_TRAINING_CLICKED });
    mnistTraining.startTraining(state.epochs);
  };

  const _showMatrics = () => {
    dispatch({ type: SHOW_MATRICS_CLICKED });
    mnistTraining.showMatrics();
  };

  const _changeEpochs = (evt: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = evt.target;
    dispatch({
      type: CHANGE_EPOCHS,
      payload: parseInt(value, 10)
    });
  };

  return (
    <div className="center">
      <div>Type "`" to show/hide the tfjs vis</div>
      <hr />
      <div>
        <button onClick={_loadData} disabled={state.isDataLoaded}>
          Load data
        </button>
      </div>
      <hr />
      <div>
        <button onClick={_createModel} disabled={state.isModelCreated}>
          Visualize Model
        </button>
      </div>
      <hr />
      <div>
        <div>
          <label htmlFor="epochs">Epochs:</label>
          <input
            id="epochs"
            type="number"
            value={state.epochs}
            onChange={_changeEpochs}
          />
        </div>
        <button onClick={_startTraining}>Start Training</button>
      </div>
      <hr />
      <div>
        <button onClick={_showMatrics}>Show Matrices</button>
      </div>
    </div>
  );
};
