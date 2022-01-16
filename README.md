# Instant Blockchain Domain Search

This is a server for searching domain availability on multiple blockchain name providers.

### Demo: [https://blockchain-domain.netlify.app/](https://blockchain-domain.netlify.app/)


### Currently supports

- ENS : Using [custom subgraph]("https://thegraph.com/hosted-service/subgraph/saleel/domain-availability")
- Unstoppable Domains : Using [custom subgraph]("https://thegraph.com/hosted-service/subgraph/saleel/domain-availability")
- Near (account name): Using Near RPC
- .com, .io and .xyz domains : A custom NodeJS API powered by dns lookup
- Twitter username - Using Twitter API

Also integrates with OpenSea to check if registered domains are listed for sale.


- [Demo Video](https://youtu.be/ZuWDUsIi5oc)
- [Presentation Slides](https://docs.google.com/presentation/d/15Myjt9zmrUgAP8NxinrY4kKFOuKpVh9Wh4lAlOjWD24/edit?usp=sharing)


Note: The ABI for Unstoppable Domain UNS is taken from [here](https://github.com/unstoppable-domains-integrations/dot-crypto-subgraph/blob/master/abis/UNSRegistry.json)
