import { Button, Modal, ModalClose, Sheet, Stack, Typography } from "@mui/joy";
import { useSesh } from "../../context/SeshContext";
import axios from "axios";
import { SESH_STATUS } from "../../common/constants";
import { useNavigate } from "react-router-dom";

interface StopSeshModalProps {
  open: boolean;
  toggleOpen: () => void;
}

const StopSeshModal = ({ open, toggleOpen }: StopSeshModalProps) => {
  const { seshState, dispatch } = useSesh();
  const navigate = useNavigate();

  const handleClickConfirm = () => {
    terminateSession();
  };

  const terminateSession = () => {
    const dataForm = {
      status: SESH_STATUS.TERMINATED,
    };
    // axios.get(`${import.meta.env.VITE_APP_API_URL}/sesh/${seshState.id}/`, {
    //   method: "PATCH",
    //   headers: {
    //     //Authorization: "Bearer " + <token>,
    //     body: JSON.stringify(dataForm),
    //     "Content-Type": "application/json",
    //     accept: "application/json",
    //   },
    // })
    axios
      .patch(
        `${import.meta.env.VITE_APP_API_URL}/sesh/${seshState.id}/`,
        dataForm, // No need for JSON.stringify
        {
          headers: {
            // Authorization: "Bearer " + <token>, // If you have an authorization token
            "Content-Type": "application/json",
          },
        }
      )
      .then((response) => {
        const data = response.data;
        const res = {
          id: data.id,
          createdAt: data.created_at,
          sessionDuration: data.session_duration,
          status: data.status,
          expiresIn: data.expires_in,
          //tasks
        };
        dispatch({ type: "UPDATE_SESSION", payload: res });
        navigate("/");
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  return (
    <Modal
      aria-labelledby="modal-title"
      aria-describedby="modal-desc"
      open={open}
      onClose={() => toggleOpen}
      sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
    >
      <Sheet
        variant="outlined"
        sx={{
          maxWidth: 500,
          borderRadius: "md",
          p: 3,
          boxShadow: "lg",
        }}
      >
        <ModalClose onClick={toggleOpen} variant="plain" sx={{ m: 1 }} />
        <Typography
          component="h2"
          id="modal-title"
          level="h4"
          textColor="inherit"
          fontWeight="lg"
          mb={1}
        >
          Stop session
        </Typography>
        <Typography id="modal-desc" textColor="text.tertiary" mb={2}>
          Are you sure you want to stop the session?
        </Typography>
        <Stack
          direction="row"
          justifyContent="left"
          alignItems="center"
          spacing={1}
        >
          <Button variant="outlined" onClick={toggleOpen}>
            Cancel
          </Button>
          <Button onClick={handleClickConfirm}>Confirm</Button>
        </Stack>
      </Sheet>
    </Modal>
  );
};

export default StopSeshModal;
