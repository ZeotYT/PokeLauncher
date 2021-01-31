const builder = require('electron-builder')
const Platform = builder.Platform

function getCurrentPlatform(){
    switch(process.platform){
        case 'win32':
            return Platform.WINDOWS
        case 'darwin':
            return Platform.MAC
        case 'linux':
            return Platform.linux
        default:
            console.error('Cannot resolve current platform!')
            return undefined
    }
}

builder.build({
    targets: (process.argv[2] != null && Platform[process.argv[2]] != null ? Platform[process.argv[2]] : getCurrentPlatform()).createTarget(),
    config: {
        afterSign: "notarize.js",
        appId: 'com.zeot.pokeresortlauncher',
        productName: 'PokeLauncher',
        artifactName: 'PokeLauncherSetup-${version}.${ext}',
        copyright: 'Copyright Zeot Ltd',
        directories: {
            buildResources: 'build',
            output: 'dist'
        },
        win: {
            target: [
                {
                    target: 'nsis',
                    arch: 'x64'
                }
            ]
        },
        nsis: {
            oneClick: false,
            perMachine: false,
            allowElevation: true,
            allowToChangeInstallationDirectory: true
        },
        mac: {
            target: 'dmg',
            category: 'public.app-category.games',
            hardenedRuntime: true,
            gatekeeperAssess: false,
            entitlements: "build/entitlements.mac.plist",
            entitlementsInherit: "build/entitlements.mac.plist"
        },
        linux: {
            target: 'AppImage',
            maintainer: 'Zeot Ltd',
            vendor: 'Zeot Ltd',
            synopsis: 'PokéLauncher',
            description: 'PokéLauncher Installer',
            category: 'Game'
        },
        compression: 'maximum',
        files: [
            '!{dist,.gitignore,.vscode,docs,dev-app-update.yml,.travis.yml,.nvmrc,.eslintrc.json,build.js,.DS_Store,README.md}'
        ],
        extraResources: [
            'libraries'
        ],
        asar: true
    }
}).then(() => {
    console.log('Build complete!')
}).catch(err => {
    console.error('Error during build!', err)
})
