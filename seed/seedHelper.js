const cities = require("./cities");
const axios = require('axios');

const getData = async (url, params = {}, headers = {}) => {
    try {
        const response = await axios.get(url, {params, headers});
        return response.data;
    } catch (error) {
        console.error('Error:', error.message);
    }
}

module.exports.getName = async () => {
    const params = {
        type: 'noun',
    };
    const headers = {
        'X-Api-Key': 'iWAV3825xRHRHbSgi740og==C0v3rr0LQx7Y5wx8',
    };
    const data = await getData('https://api.api-ninjas.com/v1/randomword', params, headers);
    const name = data.word;
    return name.charAt(0).toUpperCase() + name.slice(1);
};

module.exports.getPrice = (minPrice = 10, maxPrice = 30) => {
    return minPrice + Math.floor(Math.random() * (maxPrice - minPrice));
};

module.exports.getDescription = async () => {
    const params = {
        max_length: 300,
    };
    const headers = {
        'X-Api-Key': 'iWAV3825xRHRHbSgi740og==C0v3rr0LQx7Y5wx8',
    };
    const data = await getData('https://api.api-ninjas.com/v1/loremipsum', params, headers);
    return data.text;
};

module.exports.getLocation = () => {
    const city = cities[Math.floor(Math.random() * cities.length)];
    return `${city.city}, ${city.state}`;
};

module.exports.getImage = async () => {
    const params = {
        collections: '483251',
        orientation: 'landscape',
    };
    const headers = {
        Authorization: 'Client-ID KqZWKoh6OBwzaW-5xsdpAbO8Z8c1zXrtIZ2UNLtqtbc',
    };
    const data = await getData('https://api.unsplash.com/photos/random', params, headers);
    console.log(data.urls);
    return data.urls.regular;
};