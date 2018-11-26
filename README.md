## Installation

If you want to install the app from a pre-built version on the [release page](https://github.com/sero-cash/wallet/releases),
you can simply run the executeable after download.

For updating simply download the new version and copy it over the old one (keep a backup of the old one if you want to be sure).

#### Config folder
The data folder for Wallet is stored in other places:

- Windows `%APPDATA%\Wallet`
- macOS `~/Library/Application\ Support/Wallet`
- Linux `~/.config/Wallet`


## Development

For development, a Meteor server will need to be started to assist with live reload and CSS injection.
Once a Wallet version is released the Meteor frontend part is bundled using the `meteor-build-client` npm package to create pure static files.

### Dependencies

To run wallet in development you need:

- [Node.js](https://nodejs.org) `v7.x` (use the prefered installation method for your OS)
- [Meteor](https://www.meteor.com/install) javascript app framework
- [Yarn](https://yarnpkg.com/) package manager
- [Electron](http://electron.atom.io/) `v1.7.9` cross platform desktop app framework
- [Gulp](http://gulpjs.com/) build and automation system

Install the latter ones via:

    $ curl https://install.meteor.com/ | sh
    $ curl -o- -L https://yarnpkg.com/install.sh | bash
    $ yarn global add electron@1.7.9
    $ yarn global add gulp

### Initialisation

Now you're ready to initialise Wallet for development:

    $ git clone https://github.com/sero-cash/wallet.git
    $ cd wallet
    $ yarn

To update Wallet in the future, run:

    $ cd wallet
    $ git pull
    $ yarn

### Run the Wallet

Start the wallet app for development, *in a separate terminal window:*

    $ cd wallet/interface && meteor --no-release-check

    // and in another terminal

    $ cd my/path/meteor-dapp-wallet/app && meteor --port 3050

In the original window you can then start Wallet using wallet mode:

    $ cd wallet
    $ yarn dev:electron --mode wallet


### Connecting to node via HTTP instead of IPC

This is useful if you have a node running on another machine, though note that
it's less secure than using the default IPC method.

```bash
$ yarn dev:electron --rpc http://localhost:8545
```


### Passing options to Gero

You can pass command-line options directly to Gero by prefixing them with `--node-` in
the command-line invocation:

```bash
$ yarn dev:electron --mode wallet --node-rpcport 19343 --node-networkid 2
```

The `--rpc` Wallet option is a special case. If you set this to an IPC socket file
path then the `--ipcpath` option automatically gets set, i.e.:

```bash
$ yarn dev:electron --rpc /my/gero.ipc
```

...is the same as doing...


```bash
$ yarn dev:electron --rpc /my/gero.ipc --node-ipcpath /my/gero.ipc
```

### Creating a local private net

See this guide to quickly set up a local private network on your computer:
https://gist.github.com/evertonfraga/9d65a9f3ea399ac138b3e40641accf23


### Using Wallet with a privatenet

To run a private network you will need to set the IPC path, network id and data
folder:

```bash
$ yarn dev:electron --rpc ~/Library/Sero/gero.ipc --node-networkid 1234 --node-datadir ~/Library/Sero/privatenet
```

_NOTE: since `ipcpath` is also a Wallet option you do not need to also include a
`--node-ipcpath` option._

You can also launch `gero` separately with the same options prior starting
Wallet.


### Deployment

Our build system relies on [gulp](http://gulpjs.com/) and [electron-builder](https://github.com/electron-userland/electron-builder/).

#### Dependencies

[meteor-build-client](https://github.com/frozeman/meteor-build-client) bundles the [meteor](https://www.meteor.com/)-based interface. Install it via:

    $ npm install -g meteor-build-client

Furthermore cross-platform builds require additional [`electron-builder` dependencies](https://github.com/electron-userland/electron-builder/wiki/Multi-Platform-Build#linux). On macOS those are:

    // windows deps
    $ brew install wine --without-x11 mono makensis

    // linux deps
    $ brew install gnu-tar libicns graphicsmagick xz

#### Generate packages

To generate the binaries for Wallet run:

    $ gulp
    $ gulp --wallet

The generated binaries will be under `dist_wallet/release` or `dist_wallet/release`.


#### Options

##### platform

To build binaries for specific platforms (default: all available) use the following flags:

    // on mac
    $ gulp --win --linux --mac

    // on linux
    $ gulp --win --linux

    // on win
    $ gulp --win

##### walletSource

With the `walletSource` you can specify the wallet branch to use, default is `master`:

    $ gulp --wallet --walletSource develop


Options are:

- `master`
- `develop`
- `local` Will try to build the wallet from [wallet/]../meteor-dapp-wallet/app

*Note: applicable only when combined with `--wallet`*

#### skipTasks

When building a binary, you can optionally skip some tasks — generally for testing purposes.

  $ gulp --mac --skipTasks=bundling-interface,release-dist

#### Checksums

Spits out the MD5 checksums of distributables.

It expects installer/zip files to be in the generated folders e.g. `dist_wallet/release`

    $ gulp checksums [--wallet]

