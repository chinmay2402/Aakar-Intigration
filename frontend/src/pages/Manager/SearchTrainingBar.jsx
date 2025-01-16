import { useState, useEffect } from 'react';
import { Box, TextField, InputAdornment, Autocomplete } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear'; // Import the clear icon
import axios from 'axios';
import './SearchTrainingBar.css'; // Ensure correct path

function SearchTrainingBar({ onSearch, onClear }) {
  const [input, setInput] = useState('');
  const [trainingList, setTrainingList] = useState([]);

  useEffect(() => {
    const fetchTrainingData = async () => {
      try {
        const response = await axios.get('http://localhost:3000/all-training');
        const uniqueTitles = [...new Set(response.data.map((training) => training.trainingTitle))];
        setTrainingList(uniqueTitles);
      } catch (error) {
        console.error('Error fetching training data:', error);
      }
    };

    fetchTrainingData();
  }, []);

  const handleInputChange = (event, newInputValue) => {
    setInput(newInputValue);
    if (onSearch) onSearch(newInputValue); // Pass the input value to the parent component
  };

  const handleClear = () => {
    setInput('');
    if (onClear) onClear(); // Call the clear handler if provided
  };

  return (
    <Box className="search-training-bar-container">
      <Autocomplete
        freeSolo
        options={trainingList}
        inputValue={input}
        onInputChange={handleInputChange}
        renderInput={(params) => (
          <TextField
            {...params}
            variant="outlined"
            placeholder="Search for training"
            InputProps={{
              ...params.InputProps,
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
              endAdornment: input && (
                <InputAdornment position="end">
                  <ClearIcon onClick={handleClear} style={{ cursor: 'pointer' }} />
                </InputAdornment>
              ),
              className: 'search-training-bar'
            }}
            className="search-training-bar"
          />
        )}
        sx={{ width: '250px' }}
      />
    </Box>
  );
}

export default SearchTrainingBar;