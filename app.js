// import createImageUrlBuilder from '@sanity/image-url';
import express from 'express';
import fetch from 'node-fetch';
import dotenv from 'dotenv';
// import { Client } from '@vercel/postgres';

dotenv.config();

const app = express();
const PORT = 8080;

app.use(express.json());

const projectId = process.env.SANITY_PROJECT_ID;
const dataset = process.env.SANITY_DATASET;
const token = process.env.SANITY_TOKEN;
const discordWebhookUrl = process.env.DISCORD_WEBHOOK_URL;
// const postgresConnectionString = process.env.POSTGRES_CONNECTION_STRING;

// const imageBuilder = createImageUrlBuilder({
//   projectId: projectId || '',
//   dataset: dataset || '',
// });

// const urlForImage = (source) => {
//   if (!source) return '';
//   return imageBuilder.image(source).auto('format').fit('max').url() || ''; // Ensure to return an empty string if URL is not available
// };

const baseUrl = `https://${projectId}.api.sanity.io/v1/data/mutate/${dataset}`;

app.post('/postToSanity', async (req, res) => {
  try {
    const { mutations } = req.body;
    // const { teamName } = mutations[0].createOrReplace;

    // const client = new Client({
    //   connectionString: postgresConnectionString,
    // });

    // await client.connect();

    // const query = `
    // INSERT INTO Teams (Name)
    // VALUES ($1)
    // `;

    // await client.query(query, [teamName]);
    // await client.end();

    const response = await fetch(baseUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ mutations }),
    });

    const data = await response.json();

    if (discordWebhookUrl && response.ok && data.results) {
      // const teamName = mutations?.[0]?.createOrReplace?.teamName || 'N/A';
      // const operation = data.results[0]?.operation || '';
      // if (operation === 'update') {
      //   await sendDiscordNotification(`Lag oppdatert: ${teamName}`);
      // } else if (operation === 'create') {
      //   const imageUrl = urlForImage(mutations?.[0]?.createOrReplace?.teamImage.asset._ref);
      //   await sendDiscordNotification(`Nytt lag opprettet: ${teamName}, bilde: ${imageUrl}`);
      // }

      res.status(200).json({ message: 'Data posted to Sanity successfully', data });
    } else {
      console.error('Failed to update/create Mythic Plus team:', data);
      res.status(response.status).json({ error: 'Failed to update/create Mythic Plus team', data });
    }
  } catch (error) {
    console.error('Failed to update/create Mythic Plus team:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// async function sendDiscordNotification(message) {
//   if (!discordWebhookUrl) return;
  
//   await fetch(discordWebhookUrl, {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//     },
//     body: JSON.stringify({ content: message }),
//   });
// }

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});