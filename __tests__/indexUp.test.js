import 'regenerator-runtime/runtime'
const app = require('../src/server/index.mjs');
const supertest = require('supertest');
const request = supertest(app);

// Example from URL above to check if this is working
describe('end test', () => {
    it('get end', async () => {
        const res = await request.get('/test');

        expect(res.status).toEqual(200)
        expect(res.body.message).toBe('yayaya');
    })
})