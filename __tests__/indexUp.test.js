
import { handleSubmit } from "../src/client/js/indexUp";

describe('Testing the existence of function "handleSubmit()"' , () => {
    test('Should return true', async () => {
        expect(handleSubmit).toBeDefined();
    });
});