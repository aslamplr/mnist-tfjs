import React, { Component } from "react";
import {
  Grommet,
  ResponsiveContext,
  Box,
  Heading,
  Button,
  Collapsible,
  Layer
} from "grommet";
import { grommet } from "grommet/themes";
import { FormClose, Menu } from "grommet-icons";
import MnistTrain from "./components/MnistTrain";
import DigitPad from "./components/DigitPad";
import VisorControl from "./components/VisorControl";
import ErrorBoundary from "./components/ErrorBoundary";

const AppBar = (props: any) => (
  <Box
    tag="header"
    direction="row"
    align="center"
    justify="between"
    background="brand"
    pad={{ left: "medium", right: "small", vertical: "small" }}
    elevation="medium"
    style={{ zIndex: "1" }}
    {...props}
  />
);

const SideBarContent = () => <VisorControl />;

export default () => {
  const [showSidebar, setShowSidebar] = React.useState(false);

  return (
    <Grommet theme={grommet} full>
      <ErrorBoundary>
        <ResponsiveContext.Consumer>
          {size => (
            <Box fill>
              <AppBar>
                <Heading level="3" margin="none">
                  <Button
                    icon={<Menu />}
                    onClick={() => setShowSidebar(!showSidebar)}
                  />{" "}
                  MNIST-tfjs
                </Heading>
              </AppBar>
              <Box direction="row" flex overflow={{ horizontal: "hidden" }}>
                {!showSidebar || size !== "small" ? (
                  <Collapsible direction="horizontal" open={showSidebar}>
                    <Box
                      flex
                      width="medium"
                      background="light-2"
                      elevation="small"
                      align="center"
                      justify="center"
                    >
                      <SideBarContent />
                    </Box>
                  </Collapsible>
                ) : (
                  <Layer>
                    <Box
                      background="light-2"
                      tag="header"
                      justify="end"
                      align="center"
                      direction="row"
                    >
                      <Button
                        icon={<FormClose />}
                        onClick={() => setShowSidebar(false)}
                      />
                    </Box>
                    <Box
                      fill
                      background="light-2"
                      align="center"
                      justify="center"
                    >
                      <SideBarContent />
                    </Box>
                  </Layer>
                )}
                <Box
                  flex
                  align="center"
                  justify="center"
                  height="1600px"
                  overflow={{ vertical: "scroll" }}
                >
                  <DigitPad />
                  <MnistTrain />
                </Box>
              </Box>
            </Box>
          )}
        </ResponsiveContext.Consumer>
      </ErrorBoundary>
    </Grommet>
  );
};
