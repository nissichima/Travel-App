import { formatDate } from '../src/client/js/handleSub.js';

describe('function test', () => {
    test('string ye', () => {
        const day = 1;
        const month = 2;
        const year = 2021;

        expect(typeof(formatDate(day, month, year))).toEqual('string');
        expect(formatDate(day, month, year)).toEqual('2021-02-01');
    });
});