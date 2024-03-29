const axios = require('axios');
require('dotenv').config();

async function searchWord(word) {
  try {
    const response = await axios.get(`https://wordsapiv1.p.rapidapi.com/words/${word}`, {
      headers: {
        // 'x-rapidapi-host': 'wordsapiv1.p.rapidapi.com',
        // 'x-rapidapi-key': process.env.RAPIDAPI_KEY

        'X-RapidAPI-Key': '836ad99037msh42a44f59e933cacp1c93d7jsnd91822c1701f',
        'X-RapidAPI-Host': 'wordsapiv1.p.rapidapi.com'
      }
    });

    return response.data.results[0].definition;
  } catch (error) {
    throw new Error('Failed to fetch word definition:', error);
  }
}

module.exports = {
  searchWord
};
