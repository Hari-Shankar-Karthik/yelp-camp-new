const cities = require("./cities");
const fetch = require('node-fetch');

const fetchData = async (apiUrl, apiKey) => {
    try {
        const response = await fetch(apiUrl, {
            headers: {
                'X-Api-Key': apiKey
            }
        });
        if (!response.ok) {
            throw new Error(`Request failed with status ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Error:', error.message);
    }
};

module.exports.getName = async () => {
    const apiUrl = 'https://api.api-ninjas.com/v1/randomword?type=noun';
    const apiKey = 'iWAV3825xRHRHbSgi740og==C0v3rr0LQx7Y5wx8';
    const name = (await fetchData(apiUrl, apiKey)).word;
    return name.charAt(0).toUpperCase() + name.slice(1);
};

module.exports.getPrice = (minPrice = 10, maxPrice = 30) => {
    return minPrice + Math.floor(Math.random() * (maxPrice - minPrice));
};

module.exports.getDescription = async () => {
    const apiUrl = 'https://api.api-ninjas.com/v1/loremipsum?max_length=100';
    const apiKey = 'iWAV3825xRHRHbSgi740og==C0v3rr0LQx7Y5wx8';
    return (await fetchData(apiUrl, apiKey)).text;
};

module.exports.getLocation = () => {
    const city = cities[Math.floor(Math.random() * cities.length)];
    return `${city.city}, ${city.state}`;
};