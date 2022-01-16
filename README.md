# Instant Blockchain Domain Search

This is a server for searching domain availability on multiple blockchain name providers.

Currently supports

- ENS : Using [custom subgraph]("https://thegraph.com/hosted-service/subgraph/saleel/domain-availability")
- Unstoppable Domains : Using [custom subgraph]("https://thegraph.com/hosted-service/subgraph/saleel/domain-availability")
- Near (account name): Using Near RPC
- .com, .io and .xyz domains : A custom NodeJS API powered by dns lookup
- Twitter username - Using Twitter API

Also integrates with OpenSea to check if registered domains are listed for sale.
