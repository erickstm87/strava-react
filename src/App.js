import React, { useState, useEffect } from 'react';

import { PlacesAutocomplete } from './components/PlaceAuto';
import axios from 'axios';
import './App.css';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Support from './components/Support'

function App() {
  const [startingPoint, setStartingPoint] = useState({})
  const [searchUrl, setSearchUrl] = useState('')
  const [routeId, setRouteId] = useState('');
  const [stravaToken, setStravaToken] = useState('')

  useEffect(async () => {

    const res = await axios.get('/stravatoken')
    setStravaToken(res.data)
    if(window.location.href.includes('routeId')) {
      setRouteId(window.location.href.match(/(?<==)[\s\S]*$/g)[0])
    }
    
    document.addEventListener("addressinput", (event) => {
      handleChangeStartingAddress(event)
    })

  }, []);

  const getTheGPX = async (brandNewAccessToken) => {
    
    let res = await axios.post('/downloadGPX', `message=${routeId}&accessToken=${brandNewAccessToken}`, 
    { 
      'Accept': '*/*',
    })
    
    window.location.href = searchUrl
    window.open(`https://www.google.com/maps/dir/${startingPoint.lat},${startingPoint.lng}/${res.data[0]},${res.data[1]}`)
    return res.data
  }

  const handleChange = (event) => {
    const myUrl = new URL(window.location.href)
    let params = new URLSearchParams(myUrl.search)
    if(params) {
      myUrl.searchParams.delete('routeId')
    }
    myUrl.searchParams.append('routeId', event.target.value)

    setSearchUrl(myUrl)
    setRouteId(event.target.value);
  }

  const handleChangeStartingAddress = (event) => {
    setStartingPoint(event.detail)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    getTheGPX(stravaToken)
  }
  
  return (
    <div className="App">
      <h1>Driving Directions</h1>
      <Box
        component="form"
        sx={{
          '& > :not(style)': { m: 1, width: '25ch' },
        }}
        noValidate
        autoComplete="off"
      >
      <label>
          <PlacesAutocomplete/>
          <br />
          <br />
          <TextField 
            id="outlined-basic" 
            placeholder="Strava Route ID" 
            variant="outlined" 
            type="text" 
            sx={{"left": "4px"}}
            value={routeId} 
            onChange={handleChange}/>
          
      </label> 
      <br />
        <br />
        <Button 
          type="submit" 
          value="Submit" 
          variant="contained" 
          onClick={handleSubmit}>
          Submit
        </Button>
    </Box>     
    <br />
    <br />
    <Support />
    </div>
  );
}

export default App;
