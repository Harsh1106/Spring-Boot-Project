import { Container, Typography, Box, TextField, FormControl, InputLabel, Select, MenuItem, Button, CircularProgress } from '@mui/material'
import './App.css'
import { useState } from 'react'
import axios from 'axios'

function App() {
  const [emailContent, setEmailContent] = useState('');
  const [tone, setTone] = useState('');
  const [generatedReply, setGeneratedReply] = useState('');
  const [loading, setLoading] = useState(false);
  
  const handleSubmit = async () => {
    if (!emailContent.trim()) return;
    
    setLoading(true);
    try {
      const response = await axios.post("http://localhost:8080/api/email/generate", {
        emailContent,
        tone
      });
      setGeneratedReply(typeof response.data === 'string' ? 
        response.data : JSON.stringify(response.data)
      );
    } catch(error) {
      console.error('Error generating reply:', error);
      setGeneratedReply('Sorry, there was an error generating the reply. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generatedReply);
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
    }
  };
  
  return (
    <Container maxWidth="md" sx={{py:4}}>
      <Typography variant='h3' component='h1' gutterBottom>
        Email Reply Generator
      </Typography>

      <Box sx={{mx:3, display: 'flex', flexDirection: 'column', gap: 2}}>
        <TextField
          fullWidth
          multiline
          rows={6}
          variant='outlined'
          label="Original Email Content"
          value={emailContent}
          onChange={(e) => setEmailContent(e.target.value)}
          sx={{ mb:2 }}
        />
        
        <FormControl fullWidth sx={{ mb:2 }}>
          <InputLabel>Tone (Optional)</InputLabel>
          <Select
            value={tone}
            label="Tone (Optional)"
            onChange={(e) => setTone(e.target.value)}
          >
            <MenuItem value="">None</MenuItem>
            <MenuItem value="professional">Professional</MenuItem>
            <MenuItem value="casual">Casual</MenuItem>
            <MenuItem value="friendly">Friendly</MenuItem>
          </Select>
        </FormControl>

        <Button 
          variant='contained' 
          sx={{ mb:2 }} 
          onClick={handleSubmit} 
          disabled={!emailContent.trim() || loading}
          startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
        >
          {loading ? 'Generating...' : 'Generate Reply'}
        </Button>
      </Box>

      <Box sx={{mx:3, display: 'flex', flexDirection: 'column', gap: 2}}>
        <Typography variant='h6' component='h2'>
          Generated Reply:
        </Typography>
        
        <TextField
          fullWidth
          multiline
          rows={6}
          variant='outlined'
          value={generatedReply}
          inputProps={{ readOnly: true }}
          sx={{ mb:2 }}
        />

        <Button 
          variant='outlined' 
          onClick={handleCopyToClipboard}
          disabled={!generatedReply}
        >
          Copy to Clipboard 
        </Button>
      </Box>
    </Container>
  )
}

export default App
