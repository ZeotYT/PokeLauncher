const request = require('request')
const newsURL = 'https://pokeresort.com/pokelauncher-news.json'

exports.getNews = () => {
    return new Promise((resolve, reject) => {
        request(newsURL, (error, response, body) => {
            if (error) {
                reject(error)
            } else if (response.statusCode !== 200){
                reject(response.statusCode)
            } else {
                resolve(body)
            }
        })
    })
}
