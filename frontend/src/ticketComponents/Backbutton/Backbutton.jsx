import React from 'react';
import { IconButton, Typography, Breadcrumbs, Link } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';

const BackButton = ({ title = "Ticket details" }) => {
  const navigate = useNavigate();

  const handleBackClick = () => {
    navigate(-1); // This will navigate to the previous page
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <IconButton onClick={handleBackClick} style={{ padding: 0 }}>
        <ArrowBackIcon color="primary" />
      </IconButton>
      <Breadcrumbs aria-label="breadcrumb" style={{ marginLeft: 8 }}>
        <Link color="inherit" href="/" onClick={handleBackClick} style={{ textDecoration: 'none' }}>
          <Typography color="textSecondary">Dashboard</Typography>
        </Link>
        <Typography color="textPrimary">{title}</Typography>
      </Breadcrumbs>
    </div>
  );
};

export default BackButton;
