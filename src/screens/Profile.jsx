import * as React from "react";
import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Tooltip from "@mui/material/Tooltip";
import ConnectWithoutContactIcon from "@mui/icons-material/ConnectWithoutContact";
import PersonAdd from "@mui/icons-material/PersonAdd";
import { Settings } from "@mui/icons-material";
import Logout from "@mui/icons-material/Logout";
import styles from "./Profile.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faGear,
  faRightFromBracket,
  faUserPlus,
} from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";

export default function Profile({ setDisplay, user, logoutHandler }) {
  const [firstLetterOfName, setfirstLetterOfName] = React.useState("");
  const [dp, setDp] = React.useState("");
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  // console.log(user);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
    setDisplay(false);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  React.useEffect(() => {
    if (user) {
      setfirstLetterOfName(user.name[0]);
      setDp(user.profilePicture);
    }
  }, [user]);
  return (
    <React.Fragment>
      <Box sx={{ display: "flex", alignItems: "center", textAlign: "center" }}>
        {/* <Typography sx={{ minWidth: 80 }}>Contact</Typography> */}
        {/* <Typography sx={{ minWidth: 100 }}>Profile</Typography> */}
        <Tooltip followCursor title="Account settings">
          {dp ? (
            <img
              style={{
                width: "2.5em",
                height: "2.5em",
                margin: "1em",
                borderRadius: "50%",
                cursor: "pointer",
              }}
              onClick={handleClick}
              src={`${import.meta.env.VITE_ASSET_URL}${dp}`}
              alt=""
            />
          ) : (
            <IconButton
              onClick={handleClick}
              size="small"
              sx={{ m: 1 }}
              aria-controls={open ? "account-menu" : undefined}
              aria-haspopup="true"
              aria-expanded={open ? "true" : undefined}>
              <Avatar sx={{ width: 32, height: 32 }}>
                {firstLetterOfName}
              </Avatar>
            </IconButton>
          )}
        </Tooltip>
      </Box>
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        PaperProps={{
          elevation: 0,
          sx: {
            backgroundColor: "var(---mainColor)",
            overflow: "visible",
            filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
            mt: 1.5,
            "& .MuiAvatar-root": {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
            "&::before": {
              content: '""',
              display: "block",
              position: "absolute",
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: "var(---mainColor)",
              transform: "translateY(-50%) rotate(45deg)",
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}>
        <MenuItem
          sx={fontStyle}
          onClick={() => {
            setDisplay(true);
            handleClose();
          }}>
          {dp ? (
            <img
              style={{
                width: "2.5em",
                height: "2.5em",
                marginRight: "1em",
                borderRadius: "50%",
              }}
              src={`${import.meta.env.VITE_ASSET_URL}${dp}`}
              alt=""
            />
          ) : (
            <Avatar />
          )}{" "}
          Profile
        </MenuItem>
        {/* <MenuItem sx={fontStyle} onClick={handleClose}>
          <Avatar /> My account
        </MenuItem> */}
        <Divider />
        <MenuItem sx={fontStyle} onClick={handleClose}>
          <ListItemIcon>
            <PersonAdd />
          </ListItemIcon>
          Add another account
        </MenuItem>
        <MenuItem
          sx={fontStyle}
          onClick={() => {
            setDisplay(true);
            handleClose();
          }}>
          <ListItemIcon>
            <Settings />
          </ListItemIcon>
          Settings
        </MenuItem>
        <MenuItem sx={fontStyle} onClick={handleClose}>
          <ListItemIcon>
            <ConnectWithoutContactIcon />
          </ListItemIcon>
          <Link
            style={{ color: "white" }}
            target="blank"
            to={"https://wa.me/+919760258097"}>
            Contact
          </Link>
        </MenuItem>
        <MenuItem
          style={{ background: "var(---secMainColor)" }}
          sx={fontStyle}
          onClick={() => {
            logoutHandler();
            handleClose();
          }}>
          <ListItemIcon>
            <Logout />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>
    </React.Fragment>
  );
}

const fontStyle = {
  color: "white",
  fontWeight: "500",
};
