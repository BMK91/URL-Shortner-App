import { Container, Grid, Stack } from "@mui/material";

import UrlForm from "./components/UrlForm";
import UrlHistory from "./components/UrlHistory";
import { useRef } from "react";

const Dashboard = () => {
  const historyRef = useRef(null);

  return (
    <>
      <Container>
        <Stack>
          <UrlForm historyRef={historyRef} />

          <UrlHistory ref={historyRef} />
        </Stack>
      </Container>
    </>
  );
};

export default Dashboard;
