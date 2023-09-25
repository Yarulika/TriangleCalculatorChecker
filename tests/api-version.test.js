const axios = require('axios')
const { isValidVersionString } = require('../utils')
const { API_URL } = require('../constants')

describe('Positive test cases: GET /version endpoint', () => {

    it('Should return the API valid version with a 200 status code', async () => {
        const response = await axios.get(`${API_URL}/version`)
        expect(response.status).toBe(200)
        expect(typeof response.data).toBe('string')
        expect(isValidVersionString(response.data)).toBe(true)
    })
})

describe('Simple performance test: GET /version endpoint', () => {

    it('Should keep returning the API valid version during 50 requests in a row', async () => {
        let successCount = 0
        let errorCount = 0

        // Create an array of promises for the requests
        const requests = Array.from({ length: 50 }, async () => {
            try {
                const response = await axios.get(`${API_URL}/version`)
                expect(response.status).toBe(200)
                expect(typeof response.data).toBe('string')
                expect(isValidVersionString(response.data)).toBe(true)
                successCount++
            } catch (error) {
                errorCount++
            }
        })

        await Promise.all(requests)
        console.log('Successful API Version Requests Count: ', successCount)
        console.log('Failed API Version Requests Count: ', errorCount)
        // test failed if there are any errors
        expect(errorCount).toBe(0)
    })
})
