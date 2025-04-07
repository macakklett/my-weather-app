import { useState } from 'react';
import { fetchWeather } from './entities/gateways';
import type { Weather } from './entities/types';
import {
  Container,
  TextField,
  Button,
  Typography,
  Card,
  CardContent,
  CircularProgress,
} from '@mui/material';

const App = () => {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState<Weather | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await fetchWeather(city);
      setWeather(data);
      setCity('');
    } catch (err) {
      console.error(err);
      setError('Failed to load data. Please check the city name');
      setWeather(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" style={{ marginTop: '2rem' }}>
      <Typography variant="h4" gutterBottom align="center">
        Weather
      </Typography>
      <TextField
        fullWidth
        label="Enter city name..."
        value={city}
        onChange={(e) => setCity(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') handleSearch();
        }}
      />
      <Button
        variant="contained"
        fullWidth
        style={{ marginTop: '1rem' }}
        onClick={handleSearch}
        disabled={loading || !city.trim()}
      >
        Search
      </Button>

      {loading && (
        <div style={{ marginTop: '2rem', textAlign: 'center' }}>
          <CircularProgress />
        </div>
      )}

      {error && (
        <Typography color="error" align="center" style={{ marginTop: '1rem' }}>
          {error}
        </Typography>
      )}

      {weather && !loading && (
        <Card style={{ marginTop: '2rem' }}>
          <CardContent>
            <Typography variant="h5">{weather.name}</Typography>
            <Typography variant="h6">{weather.temp.toFixed(1)}°C</Typography>
            <Typography variant="body1">{weather.description}</Typography>
            <img
              src={`https://openweathermap.org/img/wn/${weather.icon}@2x.png`}
              alt={weather.description}
              style={{ width: 80, height: 80 }}
            />
            <Typography variant="caption">
              Last update {weather.lastUpdated}
            </Typography>
          </CardContent>
        </Card>
      )}
    </Container>
  );
};

export default App;
