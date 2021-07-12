const dotenv = require('dotenv');
const { queryPixabay } = require('../src/server/js/queryServices.js');

dotenv.config();

describe('Testing the Pixaby API service.', () => {
  test(`Testing if an image id is returned. There always must be returned an id. 
  If Pixabay is offline there needs to be returned a fallback image id.`, async () => {
    await expect(queryPixabay(process.env.PIXABAY_API_KEY, { city: 'Paris', countryName: 'France' })).resolves.toHaveProperty('imageId');
  });
});