const axios = require('axios')
const { API_URL } = require('../constants')

describe('General test cases', () => {

    it('Should return 404 status code on GET /nonexisting endpoint', async () => {
        const response = await axios.get(`${API_URL}/nonexisting`)
        expect(response.status).toBe(404)
    })

    it('Should return 404 status code on POST /nonexisting endpoint', async () => {
        const response = await axios.post(`${API_URL}/nonexisting`)
        expect(response.status).toBe(404)
    })
})
