const axios = require('axios');
const cities = require('./cities');
const images = require('./images');

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
        max_length: 200,
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

module.exports.getImages = async imageCount => {
    return images.sort(() => Math.random() - Math.random()).slice(0, imageCount);
};