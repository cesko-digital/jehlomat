import {styled} from "@mui/system";

const RoundButton = styled('button')({
    alignItems: "center",
    background: "white",
    border: "none",
    borderRadius: "50%",
    color: "rgba(128, 130, 133, 1)",
    cursor: "pointer",
    display: "inline-flex",
    height: 32,
    justifyContent: "center",
    outline: "none",
    width: 32,

    "&:focus": {
        outline: "none",
    },
});

export default RoundButton;
