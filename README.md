# OpenSea Mass Listing

This repository contains the sources of [https://opensea-masslist.beyondnft.io](https://opensea-masslist.beyondnft.io)

This website allows anyone to go through their collections of NFTs, do a mass selection, and then do mass listing by signing as much orders as there are items selected.


# Testnets

There is a testnet version live: [https://testnets-opensea-masslist.beyondnft.io](https://testnets-opensea-masslist.beyondnft.io)

You have to be connected on Rinekby with your wallet


# Installation

Clone this repository

Copy .env.SAMPLE into .env

Uncomment the Rinkeby or the Mainnet section

1) `npm run build-opensea-js`

-> because of a bug in keccak [https://github.com/cryptocoinjs/keccak/pull/22](https://github.com/cryptocoinjs/keccak/pull/22) that doesn't use read-streams, opensea-js direct import does not work with Vite, so I have been forced to build it prior, and then import it as a umd module

2) `npm run dev`

start the dev. you should be able to open `http://localhost:3000` and have the website working

3) `npm run build`

will build the app as a static website in `build` you can then copy the content and run it in a docker with nginx or similar.

License:

Do whatever you want with this, but if you make money, think about giving a bit to your favorites [Gitcoin grants](https://gitcoin.co/grants/).

Open Source & public goods is what makes us have so much fun in this space.