# BetterStreets Crossings

## Development

### Setup

- Generate certificates using [mkcert](https://github.com/FiloSottile/mkcert):

      cd traefik/certs
      mkcert -cert-file dev.cert -key-file dev.pem "betterstreets.localhost" "*.betterstreets.localhost"
      
- Create a `.env` file using the `example.env` template:

      cp example.env .env

- Download and build docker image dependencies:

      INFRA=dev make pull
      INFRA=dev make build

- Launch application:

      INFRA=dev make up
      
The infrastructure should now be running at `betterstreets.localhost`, make sure that
this resolves to `127.0.0.1`!

## API

The api can be found at betterstreets.localhost/api/docs



