import 'regenerator-runtime/runtime'
const app = require('../src/server/index.mjs');
const supertest = require('supertest');
const request = supertest(app);

// Example from URL above to check if this is working
describe('Test the test Endpoint', () => {
    it('Gets the test endpoint', async () => {
        const res = await request.get('/test');

        expect(res.status).toEqual(200)
        expect(res.body.message).toBe('done');
        //done()
    })
})