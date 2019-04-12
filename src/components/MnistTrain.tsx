import React from "react";
import mnistTraining from "../mnist/training";
import { Box, Button, Text, TextInput, Heading, FormField } from "grommet";

const RowBox = (props: any) => <Box pad="medium" direction="row" {...props} />;

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
    <Box direction="column" align="center" pad="medium">
      <RowBox>
        <Text>Visualization pane will open from the right hand side</Text>
      </RowBox>
      <RowBox>
        <Button
          label="Load data"
          onClick={_loadData}
          disabled={state.isDataLoaded}
        />
      </RowBox>
      <RowBox>
        <Button
          label="Model Summary"
          onClick={_createModel}
          disabled={state.isModelCreated}
        />
      </RowBox>
      <RowBox>
        <Text>Model summary would be displayed in the vis pane</Text>
      </RowBox>
      <RowBox>
        <FormField label="Number of epochs to train">
          <TextInput
            placeholder="Enter number of epochs"
            type="number"
            size="small"
            value={state.epochs}
            onChange={_changeEpochs}
          />
        </FormField>
      </RowBox>
      <RowBox>
        <Button label="Start Training" onClick={_startTraining} />
      </RowBox>
      <RowBox>
        <Button label="Show Matrices" onClick={_showMatrics} />
      </RowBox>
      <Heading level="5">Type "`" to show/hide the tfjs vis</Heading>
    </Box>
  );
};
