import { getDaysUntilTrip } from '../src/client/js/handleSub';

const moment = require('moment');

moment().format();

describe('Testing the response functionality for the calculation of days.', () => {
  const inFiveDays = moment().add(5, 'days');
  test('Testing a date that is five days in the future.', () => {
    expect(getDaysUntilTrip(inFiveDays)).toBe(5);
  });
});