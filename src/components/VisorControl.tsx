import React from "react";
import { Box, Text, Button } from "grommet";

import { openVis } from "../mnist/vis";
import { Sidebar } from "grommet-icons";

export default () => (
  <Box direction="row" align="center" justify="between" pad="medium">
    <Text margin={{ right: "10px" }}>TFVis control</Text>
    <Button icon={<Sidebar />} label="Open" onClick={openVis} />
  </Box>
);
