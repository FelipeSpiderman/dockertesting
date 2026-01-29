import React, { useContext } from 'react';
import { Box, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import '../../index.css';
import logo from '../../logo1.png';
import ActiveUserContext from '../../Contexts/ActiveUserContext';

const Header: React.FC = () => {
    const navigate = useNavigate();
    const { user, logout, checkRole } = useContext(ActiveUserContext);

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <Box component="header" className="header">
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                {user && checkRole('ADMIN') && (
                    <Button
                        variant="contained"
                        sx={{
                            mt: 2,
                            backgroundColor: '#00d4ff',
                            '&:hover': { backgroundColor: '#1aba47' },
                        }}
                        onClick={() => navigate('/admin')}
                    >
                        Admin
                    </Button>
                )}

                {user ? (
                    <Button
                        variant="contained"
                        sx={{
                            mt: 2,
                            backgroundColor: '#ba1a37',
                            '&:hover': { backgroundColor: '#1aba47' },
                        }}
                        onClick={handleLogout}
                    >
                        Logout
                    </Button>
                ) : (
                    <Button
                        variant="contained"
                        sx={{
                            mt: 2,
                            backgroundColor: '#00d4ff',
                            '&:hover': { backgroundColor: '#1aba47' },
                        }}
                        onClick={() => navigate('/login')}
                    >
                        Login
                    </Button>
                )}
            </Box>

            <Box
                component="img"
                src={logo}
                alt="logo"
                sx={{
                    maxWidth: '4rem',
                    transition: 'transform 0.3s ease-in-out',
                    '&:hover': {
                        transform: 'scale(1.1)',
                    },
                }}
            />
        </Box>
    );
};

export default Header;
