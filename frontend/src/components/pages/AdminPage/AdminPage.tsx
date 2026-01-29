import { Box } from '@mui/system';
import {useNavigate} from "react-router-dom";
import {Button} from "@mui/material";
import {useContext} from "react";
import ActiveUserContext from "../../../Contexts/ActiveUserContext";

export default function AdminPage() {
    const navigate = useNavigate();
    const { logout } = useContext(ActiveUserContext);

    return (
        <><>
            <Box
                display="flex"
                alignItems="left"
                justifyContent="left"
                flexDirection="column"
                height="95vh"


                sx={{
                    background: 'linear-gradient(135deg, ' +
                        '#0E2B30, #387F8C)',
                    padding: '02rem',
                }}
            >
                <h1 style={{
                    fontFamily: 'Arial, sans-serif',
                    fontSize: '3rem',
                    color: '#fff',
                    textAlign: 'left',
                }}>
                    AdminPage
                </h1>
                <h1 style={{
                    fontFamily: 'Arial, sans-serif',
                    fontSize: '2.1rem',
                    color: '#fff',
                    textAlign: 'left',
                }}>
                    Users
                </h1>
                <Box style={{ padding: '0.5rem' }}>
                    <Button
                        variant="contained"
                        sx={{
                            mt: 1,
                            backgroundColor: '#00d4ff',
                            '&:hover': { backgroundColor: '#0f0fcf' },
                        }}
                        onClick={() => navigate('/user')}
                    >
                        Users
                    </Button>
                </Box>
                <h1 style={{
                    fontFamily: 'Arial, sans-serif',
                    fontSize: '2.1rem',
                    color: '#fff',
                    textAlign: 'left',
                }}>
                    Events
                </h1>
                <Box style={{ padding: '0.5rem' }}>
                    <Button
                        variant="contained"
                        sx={{
                            mt: 1,
                            backgroundColor: '#00d4ff',
                            '&:hover': { backgroundColor: '#0f0fcf' },
                        }}
                        onClick={() => navigate('/events')}
                    >
                        Events
                    </Button>
                </Box>
                <Box style={{ padding: '0.5rem', marginTop: 'auto' }}>
                    <Button
                        variant="contained"
                        sx={{
                            backgroundColor: '#1abab5',
                            '&:hover': { backgroundColor: '#1aba47' },
                        }}
                        onClick={() => navigate('/')}
                    >
                        homepage
                    </Button>
                </Box>

            </Box></>


        </>
    );
}
