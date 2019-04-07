import * as React from "react";
import { loadData, createModel, startTraining, showMatrics } from "./training";

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
const CREATE_MODEL_CLICKED = "CREATE_MODEL_CLICKED";
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
      } else if (action.type === CREATE_MODEL_CLICKED) {
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
    loadData();
  };

  const _createModel = () => {
    dispatch({ type: CREATE_MODEL_CLICKED });
    createModel();
  };

  const _startTraining = () => {
    dispatch({ type: START_TRAINING_CLICKED });
    startTraining(state.epochs);
  };

  const _showMatrics = () => {
    dispatch({ type: SHOW_MATRICS_CLICKED });
    showMatrics();
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
      <hr/>
      <div>
        <button onClick={_loadData} disabled={state.isDataLoaded}>
          Load data
        </button>
      </div>
      <hr/>
      <div>
        <button onClick={_createModel} disabled={state.isModelCreated}>
          Create Model
        </button>
      </div>
      <hr/>
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
      <hr/>
      <div>
        <button onClick={_showMatrics}>Show Matrices</button>
      </div>
    </div>
  );
};
