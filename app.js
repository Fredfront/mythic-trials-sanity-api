const express = require('express');
const fetch = require('node-fetch');
require('dotenv').config()


// app.use(cors(corsOption));
const app = express();
const PORT = 8080;
const cors = require('cors');

// const corsOption = {
//   origin: 'https://trials.nl-wow.no/',
// };
// app.use(express.json());

const projectId = process.env.SANITY_PROJECT_ID;
const dataset = process.env.SANITY_DATASET;
const token = process.env.SANITY_TOKEN;

const baseUrl = `https://${projectId}.api.sanity.io/v${new Date().toISOString().slice(0, 10)}/data/mutate/${dataset}`;

// app.use((req, res, next) => {
//   const origin = req.get('origin') || req.get('referer'); // Check Origin or Referer header
//   if (origin === 'https://trials.nl-wow.no/') {
//     res.setHeader('Access-Control-Allow-Origin', origin);
//     next();
//   } else {
//     res.status(403).send('Forbidden');
//   }
// });


app.post('/postToSanity', async (req, res) => {
  try {
    const { mutations } = req.body;

    const response = await fetch(baseUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
        
      },
      body: JSON.stringify({ mutations }),
    });

    const data = await response.json();

    if (response.ok && data.results && (data.results[0].operation === 'update' || data.results[0].operation === 'create')) {
      res.status(200).json({ message: 'Data posted to Sanity successfully', data });
    } else {
      console.error('Failed to create Mythic Plus team:', data);
      res.status(response.status).json({ error: `Failed to create Mythic Plus team`, data });
    }
  } catch (error) {
    console.error('Failed to create Mythic Plus team:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});



app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});