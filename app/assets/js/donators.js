const request = require('request')
const donatorURL = 'https://api.craftingstore.net/v7/payments'
const token = 'UlokrkO40qUxNPOHKDU8yncBGheXpzmgynvRiA9Wbxe9CixIIC' 
const options = {
    url: donatorURL,
    headers: {
        'token': token
    }
}

exports.getDonators = () => {
    return new Promise((resolve, reject) => {
        request(options, (error, response, body) => {
            if (error) {
                reject(error)
            } else if (response.statusCode !== 200){
                reject(response.statusCode)
            } else {
                const json = JSON.parse(body)
                if (json.success == true) {
                    const donators = []
                    const size = 5
                    for (transaction of json.data) {
                        if (donators.length < size) {
                            donators.push({ name: transaction.inGameName, uuid: transaction.uuid, package: transaction.packageName, timestamp: transaction.timestamp })
                        } else {
                            break
                        }
                    }
                    resolve(donators)
                } else {
                    reject('api call unsuccessful')
                }
            }
        })
    })
}
