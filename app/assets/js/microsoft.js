const request = require('request')
// https://github.com/PrismarineJS/node-minecraft-protocol/
const { MsAuthFlow } = require('minecraft-protocol/src/client/authFlow.js')

const profileURI ='https://api.minecraftservices.com/minecraft/profile'

function requestPromise(uri, options) {
    return new Promise((resolve, reject) => {
        request(uri, options, (error, response, body) => {
            if (error) {
                reject(error)
            } else if (response.statusCode !== 200){
                reject([response.statusCode, response.statusMessage, response])
            } else {
                resolve(response)
            }
        })
    })
}

exports.getMCProfile = MCAccessToken => {
    return new Promise((resolve, reject) => {
        const options = {
            method: 'get',
            headers: {
                Authorization: `Bearer ${MCAccessToken}`
            }
        }
        requestPromise(profileURI, options).then(response => {
            const body = JSON.parse(response.body)

            resolve(body)
        }).catch(error => {
            reject(error)
        })
    })
} 

exports.authMinecraft = flowCallback => {
    return new Promise(async (resolve, reject) => {
        const sysRoot = process.env.APPDATA || (process.platform == 'darwin' ? process.env.HOME + '/Library/Application Support' : process.env.HOME)
        const pokeLauncherPath = path.join(sysRoot, 'PokeLauncher')

        const flow = new MsAuthFlow(null, pokeLauncherPath, flowCallback)
        const MCToken = await flow.getMinecraftToken()

        resolve(MCToken)   
        }).catch(error => {
            reject(error)
        })
}

exports.clearTokens = () => {
    console.log("CLEAR TOKENS")
    const sysRoot = process.env.APPDATA || (process.platform == 'darwin' ? process.env.HOME + '/Library/Application Support' : process.env.HOME)
    const pokeLauncherPath = path.join(sysRoot, 'PokeLauncher')
    MsAuthFlow.resetTokenCaches(pokeLauncherPath)
}
