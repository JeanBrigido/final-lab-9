import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, 
  Button, TextField, Typography, Box 
} from '@mui/material';

function App() {
  const [puppies, setPuppies] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    breed: '',
    age_est: '',
    current_kennel_number: '',
  });
  const [editingId, setEditingId] = useState(null);

  // Fetch all puppies from the backend
  const fetchPuppies = async () => {
    try {
      const response = await axios.get('http://localhost:5000/puppies');
      setPuppies(response.data);
    } catch (error) {
      console.error('Error fetching puppies:', error);
    }
  };

  useEffect(() => {
    fetchPuppies();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Add a new puppy
  const handleAddPuppy = async () => {
    try {
      const response = await axios.post('http://localhost:5000/puppies', formData);
      setPuppies([...puppies, response.data]);
      setFormData({ name: '', breed: '', age_est: '', current_kennel_number: '' });
    } catch (error) {
      console.error('Error adding puppy:', error);
    }
  };

  // Update a puppy
  const handleUpdatePuppy = async () => {
    try {
      await axios.put(`http://localhost:5000/puppies/${editingId}`, formData);
      // Update the local state with the updated puppy information
      setPuppies(puppies.map(p => p.pet_id === editingId ? { ...p, ...formData } : p));
      setEditingId(null);
      setFormData({ name: '', breed: '', age_est: '', current_kennel_number: '' });
    } catch (error) {
      console.error('Error updating puppy:', error);
    }
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingId) {
      handleUpdatePuppy();
    } else {
      handleAddPuppy();
    }
  };

  // Prepare the form to update a puppy
  const handleEditPuppy = (puppy) => {
    setEditingId(puppy.pet_id);
    setFormData({
      name: puppy.name,
      breed: puppy.breed,
      age_est: puppy.age_est,
      current_kennel_number: puppy.current_kennel_number,
    });
  };

  // Delete a puppy
  const handleDeletePuppy = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/puppies/${id}`);
      setPuppies(puppies.filter(p => p.pet_id !== id));
    } catch (error) {
      console.error('Error deleting puppy:', error);
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px', minHeight: '100vh' }}>
      <Typography variant="h4" gutterBottom align="center">
        Puppy Management
      </Typography>

      {/* Form */}
      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '10px', marginBottom: '20px', width: '100%', maxWidth: '800px' }}>
        <TextField 
          label="Name" 
          variant="outlined" 
          name="name" 
          value={formData.name} 
          onChange={handleChange} 
          required 
          fullWidth
        />
        <TextField 
          label="Breed" 
          variant="outlined" 
          name="breed" 
          value={formData.breed} 
          onChange={handleChange} 
          fullWidth
        />
        <TextField 
          label="Age" 
          type="number" 
          variant="outlined" 
          name="age_est" 
          value={formData.age_est} 
          onChange={handleChange} 
          fullWidth
        />
        <TextField 
          label="Kennel #" 
          type="number" 
          variant="outlined" 
          name="current_kennel_number" 
          value={formData.current_kennel_number} 
          onChange={handleChange} 
          fullWidth
        />
        <Button type="submit" variant="contained" color="primary">
          {editingId ? 'Update Puppy' : 'Add Puppy'}
        </Button>
      </form>

      {/* Table */}
      <TableContainer component={Paper} elevation={3} sx={{ width: '100%', maxWidth: '1200px' }}>
        <Table>
          <TableHead>
            <TableRow style={{ backgroundColor: '#2E7D32' }}> {/* Green Header */}
              <TableCell style={{ color: 'white', fontWeight: 'bold' }}>ID</TableCell>
              <TableCell style={{ color: 'white', fontWeight: 'bold' }}>Name</TableCell>
              <TableCell style={{ color: 'white', fontWeight: 'bold' }}>Breed</TableCell>
              <TableCell style={{ color: 'white', fontWeight: 'bold' }}>Age</TableCell>
              <TableCell style={{ color: 'white', fontWeight: 'bold' }}>Kennel #</TableCell>
              <TableCell style={{ color: 'white', fontWeight: 'bold' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {puppies.map((puppy) => (
              <TableRow key={puppy.pet_id}>
                <TableCell>{puppy.pet_id}</TableCell>
                <TableCell>{puppy.name}</TableCell>
                <TableCell>{puppy.breed}</TableCell>
                <TableCell>{puppy.age_est}</TableCell>
                <TableCell>{puppy.current_kennel_number}</TableCell>
                <TableCell>
                  <Button 
                    variant="contained" 
                    color="primary" 
                    onClick={() => handleEditPuppy(puppy)}
                  >
                    Edit
                  </Button>
                  <Button 
                    variant="contained" 
                    color="secondary" 
                    onClick={() => handleDeletePuppy(puppy.pet_id)}
                    style={{ marginLeft: '10px' }}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

export default App;