import { React, useState } from 'react';
import Snackbar from '@mui/material/Snackbar';

export default function PositionedSnackbar(props) {
    const [state, setState] = useState({
        open: props.open,
        vertical: 'bottom',
        horizontal: 'right',
    });
    const { vertical, horizontal, open } = state;

    const handleClose = () => {
        setState({ ...state, open: false });
    };

    return (
        <div>
            <Snackbar
                anchorOrigin={{ vertical, horizontal }}
                open={open}
                onClose={handleClose}
                severity={props.severity}
                message={props.message}
                key={vertical + horizontal}
            />
        </div>
    );
}