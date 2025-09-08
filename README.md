# HAR mock server


[![JSR](https://jsr.io/badges/@jersou/har-mock-server)](https://jsr.io/@jersou/har-mock-server)
[![JSR Score](https://jsr.io/badges/@jersou/har-mock-server/score)](https://jsr.io/@jersou/har-mock-server)

Mock server from an HAR file.

From Chrome/Firefox, open the dev tools, record queries, and export it :

- `Export HAR` buton on Chrome
- `Save All As HAR` on Firefox by right click on queries.

And replay the queries with this mock server : it returns responses for requests matching the requested path (ignoring the hostname).

## Run / Installation

- From source :
    - Run directly : `./har-mock-server.ts examples/jsonplaceholder_simplified.har`
    - Install :
      `deno install --name har-mock-server -f -g -NR ./har-mock-server.ts` → then use with `har-mock-server file.har`
- Run from [jsr](https://jsr.io/) :
    - Run directly :
      `deno run -NR jsr:@jersou/har-mock-server@0.1.1 examples/jsonplaceholder_simplified.har`
    - Install :
      `deno install --name har-mock-server -f -g -NR jsr:@jersou/har-mock-server@0.1.1` → then use with
      `har-mock-server file.har`

## Usage

```
$ ./har-mock-server.ts --help
Run a mock server based on queries from an HAR file

Usage: har-mock-server.ts [Options] <HAR file>

Options:
 -h, --help Show this help    [default: false]
 -p, --port Port of the server [default: 8080]
```

## Exemple

```shell
./har-mock-server.ts examples/jsonplaceholder_simplified.har
```

The `examples/jsonplaceholder_simplified.har` file contains 3 queries :

```json
{ "log": { "entries": [
      { "request": { "url": "https://jsonplaceholder.typicode.com/todos/2", ... },
      { "request": { "url": "https://jsonplaceholder.typicode.com/todos/10?param=5", ... },
      { "request": { "url": "https://jsonplaceholder.typicode.com/todos/10?param=9", ... }
] } }
```

A query found in the HAR file :

```
$ curl "http://localhost:8080/todos/10?param=5"
{ "userId": 1, ... }%
```

A missing query from the HAR file :

```
$ curl "http://localhost:8080/todos/10?param=8"
Mock not found%
```

The server logs :

```
$ ./har-mock-server.ts examples/jsonplaceholder_simplified.har
Listening on http://0.0.0.0:8080/ (http://localhost:8080/)
[200] GET http://localhost:8080/todos/10?param=5
[404] entry not found : GET http://localhost:8080/todos/10?param=8
```

## Simplify HAR file

To reduce HAR size to keep the minimum :

```shell
./har-simplify.ts ./http1.har
```

→ ./http1_simplified.har is created.
