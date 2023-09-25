const axios = require('axios')
const { API_URL } = require('../constants')

describe('Positive test cases: POST triangle', () => {

    it.each([
        {"a": 10, "b": 10, "c": 10},
        {"a": 50000, "b": 50000, "c": 50000},
        {"a": 987654321098765432109876543210, "b": 987654321098765432109876543210, "c": 987654321098765432109876543210},
        {"a": 987654321098765432109876543210987654321098765432109876543210, "b": 987654321098765432109876543210987654321098765432109876543210, "c": 987654321098765432109876543210987654321098765432109876543210},
        {"a": 0.000000000789, "b": 0.000000000789, "c": 0.000000000789},
    ])('Should correctly identify an equilateral triangle, test case: %s:',
        async (testCase) => {
            const response = await axios.post(API_URL, testCase)
            expect(response.status).toBe(200)
            expect(response.data.result).toBe('This is equilateral triangle')
            expect(response.headers['content-type']).toBe('application/json; charset=utf-8')
    })

    it.each([
        {"a": 8, "b": 8, "c": 10},
        {"a": 8, "b": 10, "c": 8},
        {"a": 10, "b": 8, "c": 8},
        {"a": 9000000900000090000009000000, "b": 9000000900000090000009000000, "c": 9000000100},
        {"a": 0.000000000789, "b": 0.000000000789, "c": 0.000000000089},
    ])('Should correctly identify an isosceles triangle, test case: %s:',
        async (testCase) => {
            const response = await axios.post(API_URL, testCase)
            expect(response.status).toBe(200) // and code 201, statusText: 'Created'
            expect(response.data.result).toBe('This is isosceles triangle')
            expect(response.headers['content-type']).toBe('application/json; charset=utf-8')
    })

    it.each([
        {"a": 8, "b": 9, "c": 10},
        {"a": 8000, "b": 9000, "c": 10000},
        {"a": 900000000000000000000000000210, "b": 900000000000000000000000000211, "c": 900000000000000000000000000212}, // ! small difference
        {"a": 0.000000000789, "b": 0.000000000788, "c": 0.000000000787},
    ])('Should correctly identify an isosceles triangle, test case: %s:',
        async (testCase) => {
            const response = await axios.post(API_URL, testCase)
            expect(response.status).toBe(200)
            expect(response.data.result).toBe('This is versatile triangle')
            expect(response.headers['content-type']).toBe('application/json; charset=utf-8')
        })
})

describe('Negative test cases: POST triangle', () => {

    it.each([
        {"a": 10},
        {"b": 10},
        {"c": 10},
        {"a": 10, "b": 9},
        {"b": 9, "c": 10},
        {"b": 9, "c": 10, "x": 10},
        {"a": 10, "b": 9, "c": 10, "d":11},
        {"a": 8, "b": 9, "c": 10, "a": 8},
    ])('Should return a status code of 422 for an invalid request with missing or extra side lengths, test case: %s:',
        async (testCase) => {
            try {
                await axios.post(API_URL, testCase)
            } catch (error) {
                expect(error.response.status).toBe(422)
                expect(error.response.data).toEqual({ error: 'Triangle should have 3 side' })
            }
        })

    it.each([
        {"a": 0, "b": 0, "c": 0},
        {"a": -1, "b": -1, "c": -1},
        {"a": 6, "b": 7, "c": "a"},
        {"a": "8", "b": 9, "c": 10},
    ])('Should return a status code of 422 for an invalid request with incorrect side lengths, test case: %s:',
        async (testCase) => {
            try {
                await axios.post(API_URL, testCase)
            } catch (error) {
                expect(error.response.status).toBe(422)
            }
        })

    it.each([
        {"a": null, "b": null, "c": null},
        {"a": undefined, "b": undefined, "c": undefined},
        {"a": -0, "b": -0, "c": -0},
        {"a": Infinity, "b": Infinity, "c": Infinity},
    ])('Should return a status code of 422 for an invalid request with undefined side lengths, test case: %s:',
        async (testCase) => {
            try {
                await axios.post(API_URL, testCase)
            } catch (error) {
                expect(error.response.status).toBe(422)
            }
        })

    it('Should return 415 status code for invalid content type (text/plain)', async () => {
        const requestBody = {"a": 8, "b": 8, "c": 10}
        try {
            await axios.post(API_URL, requestBody, {
                headers: {
                    'Content-Type': 'text/plain',
                },
            })
        } catch (error) {
            console.log(error.response)
            expect(error.response.status).toBe(415)
            expect(error.response.data).toEqual({ error: 'Unsupported Media Type' })
        }
    })

    it('Should return 400 status code for invalid JSON format (string)', async () => {
        const requestBody = 'This is not valid JSON'
        try {
            await axios.post(API_URL, requestBody, {
                headers: {
                    'Content-Type': 'application/json',
                },
            })
        } catch (error) {
            expect(error.response.status).toBe(400)
            expect(error.response.data).toEqual({ error: 'Bad Request' })
        }
    })
})

describe('Simple performance test: POST triangle', () => {

    it('Should keep returning the correct type of triangle during 50 requests in a row', async () => {
        let successCount = 0
        let errorCount = 0

        // Create an array of promises for the requests
        const requests = Array.from({ length: 50 }, async () => {
            try {
                const response = await axios.post(API_URL, {"a": 8, "b": 9, "c": 10})
                expect(response.status).toBe(200)
                expect(response.data.result).toBe('This is versatile triangle')
                successCount++
            } catch (error) {
                errorCount++
            }
        })

        await Promise.all(requests)
        console.log('Successful requests count: ', successCount)
        console.log('Failed requests count: ', errorCount)
        // test failed if there are any errors
        expect(errorCount).toBe(0)
    })
})
