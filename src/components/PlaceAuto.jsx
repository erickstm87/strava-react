import usePlacesAutocomplete, {
    getGeocode,
    getLatLng,
  } from "use-places-autocomplete";
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';

import useOnclickOutside from "react-cool-onclickoutside";
import { v4 as uuidv4 } from 'uuid';
  
export const PlacesAutocomplete = () => {
    const {
      ready,
      value,
      suggestions: { status, data },
      setValue,
      clearSuggestions,
    } = usePlacesAutocomplete({
      requestOptions: {
        /* Define search scope here */
      },
      debounce: 300,
    });
    const ref = useOnclickOutside(() => {
      // When user clicks outside of the component, we can dismiss
      // the searched suggestions by calling this method
      clearSuggestions();
    });
  
    const handleInput = (e) => {
      // Update the keyword of the input element
      setValue(e.target.value);
    };
  
    const handleSelect =
      ({ description }) =>
      () => {
        // When user selects a place, we can replace the keyword without request data from API
        // by setting the second parameter to "false"
        setValue(description, false);
        clearSuggestions();
  
        // Get latitude and longitude via utility functions
        getGeocode({ address: description })
          .then((results) => getLatLng(results[0]))
          .then(({ lat, lng }) => {
            console.log("📍 Coordinates: ", { lat, lng });
            document.dispatchEvent(new CustomEvent('addressinput', { detail: { lat, lng } }))
          })
          .catch((error) => {
            console.log("😱 Error: ", error);
          });
      };
  
    const renderSuggestions = () =>
      data.map((suggestion) => {
        const {
          structured_formatting: { main_text, secondary_text },
        } = suggestion;
  
        return (
            <ListItem key={uuidv4()} onClick={handleSelect(suggestion)}>
                <ListItemButton>
                    <ListItemText>{main_text}, {secondary_text}</ListItemText> 
                </ListItemButton>
            </ListItem> 
        );
      });
  
    return (
      <div ref={ref}>
        <TextField
          id="outlined-basic" 
          value={value}
          onChange={handleInput}
          disabled={!ready}
          placeholder="Starting Point"
          variant="outlined"
        />
        {/* We can use the "status" to decide whether we should display the dropdown or not */}
        {status === "OK" && 
            <Box 
                key={uuidv4()} 
                sx={{
                "display": "flex",
                "flexDirection": "column",
                "alignItems": "center",
                "bgcolor": 'background.paper',
                }}>
                <List>
                    {renderSuggestions()}
                </List>
            </Box>
            }
      </div>
    );
  };