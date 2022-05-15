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
  const [routeId, setRouteId] = useState('');
  const [stravaToken, setStravaToken] = useState('')
  const buttonText= 'Get Directions'
  const baseURL = "https://www.strava.com"

  useEffect(() => {
      axios.post(`${baseURL}/oauth/token?client_id=${process.env.REACT_APP_CLIENT_ID}&client_secret=${process.env.REACT_APP_CLIENT_SECRET}&refresh_token=${process.env.REACT_APP_REFRESH_TOKEN}&grant_type=refresh_token`)
        .then(function(response) {            
            setStravaToken(response.data.access_token)
        }).catch((e) => {
          console.error(`sorry there was an error`)
      })
          
      if(window.location.href.includes('routeId')) {
        setRouteId(window.location.href.match(/(?<==)[\s\S]*$/g)[0])
      }
      
      document.addEventListener("addressinput", (event) => {
        handleChangeStartingAddress(event)
      })

  }, []);

  const getTheGPX = async (brandNewAccessToken) => {   
    let gpxData, startingData, latLongExtraction;
    let routeLatLong = []
    await axios.get(`${baseURL}/api/v3/routes/${routeId}/export_gpx?access_token=${brandNewAccessToken}`)
    .then((response) => {
        console.log('here is your stuff')
        gpxData = response.data
    })
    .catch((e) => {
        console.log(`there was an error with the GPX`)
    })
    
    startingData = gpxData.match(/<trkpt[^>]*/g)[0]
    latLongExtraction = [...startingData.matchAll(/="[^"]*/g)];
    routeLatLong.push(latLongExtraction[0]['0'].replace(/[^0-9-.]/g, ''))
    routeLatLong.push(latLongExtraction[1]['0'].replace(/[^0-9-.]/g, ''))
    
    window.open(`https://www.google.com/maps/dir/${startingPoint.lat},${startingPoint.lng}/${routeLatLong[0]},${routeLatLong[1]}`)

    return 
  }

  const handleChange = (event) => {
    const myUrl = new URL(window.location.href)
    const params = new URLSearchParams(myUrl.search);
    
    params.set('routeId', event.target.value)
    window.history.replaceState({}, '', `${myUrl.pathname}?${params}`);
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
          <PlacesAutocomplete
            className="addressInput"
            value={startingPoint}
          />
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
          onClick={
            handleSubmit
          }>
          {buttonText}
        </Button>
    </Box>     
    <br />
    <br />
    <Support />
    </div>
  );
}

export default App;
