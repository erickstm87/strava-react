import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

const Support = () => {
    return(
        <div>
            <Box sx={{
                "inlineSize": "400px",
                "marginLeft": "auto",
                "marginRight": "auto"
            }}>
                <Typography variant="body1" gutterBottom>
                If you enjoy the tool and want to send coffee/beer money my way anything is appreciated! Hope you enjoy the tool and if you have any questions feel free to send me a message.
                </Typography>
            </Box>
            <br />
            {/* eslint-disable-next-line */}
            <a href="https://venmo.com/code?user_id=2108231941881856600&created=1650510753" target="_blank">Buy Me A Coffee</a>
            <br /><br />
            {/* eslint-disable-next-line */}
            <a href="mailto:developer@terickson.io" target="_blank">Email Me</a>
        </div>
    )
}

export default Support