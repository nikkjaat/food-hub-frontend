import React, { useContext, useState } from "react";
import styles from "./AlertBox.module.css";
import Alert from "@mui/material/Alert";
import Stack from "@mui/material/Stack";
import AuthContext from "../../context/AuthContext";

export default function AlertBox(props) {
  const authCtx = useContext(AuthContext);
  //   const [displayPopup, setDisplayPopup] = useState(true);
  return (
    <>
      <Stack
        sx={{ width: "100%", display: "flex", justifyContent: "center" }}
        spacing={2}>
        <Alert
          sx={{ display: "flex", justifyContent: "center" }}
          className={styles.alertBox}
          variant="filled"
          severity="success">
          {authCtx.alertBoxText}
        </Alert>
        {/* <Alert variant="filled" severity="info">
          This is a filled info Alert.
        </Alert>
        <Alert variant="filled" severity="warning">
          This is a filled warning Alert.
        </Alert>
        <Alert variant="filled" severity="error">
          This is a filled error Alert.
        </Alert> */}
      </Stack>
    </>
  );
}
