import * as React from 'react';
import { useParams } from "react-router-dom";
import { useNavigate } from 'react-router-dom';
import { useState, useContext, useEffect } from "react";
import { Grid, Modal, TextField, Typography, Box, Button } from '@mui/material'
import Alert from '@mui/material/Alert';
import AuthContext from '../../auth/auth';


export default function ResetPassword() {
    const navigate = useNavigate();
    const { auth } = useContext(AuthContext);
    const { id, token } = useParams();

    const [openErrorModal, setOpenErrorModal] = useState(auth.errorMessage !== null)

    useEffect(() => {
        console.log(auth.errorMessage)
        setOpenErrorModal(auth.errorMessage !== null)
    }, [auth]);

    const handleErrorModalClose = () => {
        auth.resetMessage();
        setOpenErrorModal(false);
    };

    const handleResetPassword = (event) => {
        event.preventDefault();

        const formData = new FormData(event.currentTarget);
        auth.resetPassword({
            id: id,
            token: token,
            password: formData.get('password'),
            repeatPassword: formData.get('repeatPassword')
        });
    };

    return (
        <div style={{width: '100vw', height: '100vh', backgroundColor: '#1f293a'}}>
            <Box
                borderRadius='10px' padding='20px' bgcolor='#11182a' position='absolute' width='40%' top='20%' left='30%'
                sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', color: "white" }}
            >

                <Typography component="h1" variant="h5">
                    Reset Password
                        </Typography>
                <Box component="form" onSubmit={handleResetPassword} noValidate sx={{ mt: 1 }}>
                    <TextField
                        style={{ color: "white" }}
                        margin="normal"
                        required
                        fullWidth
                        type="password"
                        id="password"
                        label="New Password"
                        name="password"
                        autoComplete="new-password"
                        autoFocus
                        InputLabelProps={{ style: { color: "white" } }}
                        sx={{ "& .MuiOutlinedInput-notchedOutline": { borderColor: "azure" }, "& .MuiInputBase-root": { color: "azure" } }}
                    />

                    <TextField
                        style={{ color: "white" }}
                        margin="normal"
                        required
                        fullWidth
                        type="password"
                        id="repeatPassword"
                        label="Verify New Password"
                        name="repeatPassword"
                        autoComplete="new-password"
                        InputLabelProps={{ style: { color: "white" } }}
                        sx={{ "& .MuiOutlinedInput-notchedOutline": { borderColor: "azure" }, "& .MuiInputBase-root": { color: "azure" } }}
                    />

                    <Button d
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                    >
                        Reset Password
                    </Button>
                </Box>
            </Box>

            <Modal
                hideBackdrop
                open={openErrorModal}
                aria-labelledby="child-modal-title"
                aria-describedby="child-modal-description"
            >
                <Box sx={{
                    position: 'absolute', top: '50%',
                    left: '50%', transform: 'translate(-50%, -50%)',
                    width: 400, bgcolor: 'white',
                    border: '2px solid #000', borderRadius: '10px',
                    boxShadow: 24, pt: 2,
                    px: 4, pb: 3
                }}
                >
                    <Grid
                        container
                        spacing={0}
                        direction="column"
                        alignItems="center"
                        justifyContent="center"
                    >
                        <Alert severity="error">{auth.errorMessage}</Alert>
                        <Button onClick={handleErrorModalClose}>OK</Button>
                    </Grid>
                </Box>
            </Modal>
        </div>

    )
}