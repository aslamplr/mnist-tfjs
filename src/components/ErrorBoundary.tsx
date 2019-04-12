import React, { ErrorInfo } from "react";
import { Box, Text } from "grommet";

export default class extends React.Component {
  state = {
    hasError: false,
    errorMessage: ""
  };

  static getDerivedStateFromError(error: Error) {
    return {
      hasError: true,
      errorMessage: JSON.stringify(error, null, 2)
    };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error(error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <Box>
          <Text color="red">{this.state.errorMessage}</Text>
        </Box>
      );
    }

    return this.props.children;
  }
}
