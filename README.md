# Serve Karo

_Ap ek application ho, to serve karo!_

Serve Karo is a configurable static web server that you can deploy to production environments! With Serve Karo, you don't have to write your own webserver, simply install the package, write a `servekaro.json` file ([see below](###configuring-the-serve-karo)) and type:

    $ servekaro

That's it!

## Usage

First, install the package.

    $ npm install --save servekaro

Usually, you'd use Serve Karo in a production environment, so use `--save` instead of `--save-dev`.

### Configuring Serve Karo

Serve Karo is configured by a `servekaro.json` file in the project directory.

```json
{
    "port": "80",
    "host": "0.0.0.0",
    "serving": "public",
    "root": "index.html",
    "notFound": "404.html"
}
```

The properties that can be set are as follows:

| Property | Description                                         | Default    |
|:---------|:----------------------------------------------------|:-----------|
| port     | The port to serve on                                | 80         |
| host     | The host (or IP address) to serve on                | 0.0.0.0    |
| serving  | The directory being served                          | public     |
| root     | The file to serve when the root url is requested    | index.html |
| notFound | The file to serve when url is not found (see below) | null       |

#### The 'notFound' property

Specifying a filename for the `notFound` property will serve the given file with a status of 404.

```json
{
    "notFound": "404.html"
}
```

You can also specify an object for the `notFound` property containing a `file` property (the filename to send) and a `status` property (the status of the object). For example (if you have an app which handles routing on client-side) you can configure the `notFound` property like so:

```json
{
    "notFound": {
        "file": "index.html",
        "status": "200"
    }
}
```

If the `notFound` property is not set, the server will return the default 404 `File not found!` message.

### Starting the server

Simply type

    $ servekaro

And your website will serve the configured serving directory on the configured host and port.

--------------------------------------------------------------------------------

_Anshul Kharbanda 2018_
