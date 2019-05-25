/**
 * Serve Karo
 *
 * Static web server
 *
 * Author:  Anshul Kharbanda
 * Created: 4 - 24 - 2017
 */
import path from 'path'

 /**
  * Returns the filepath including serving dir given the url and config
  *
  * @param config {object} servekaro config
  * @param url    {String} the url from the http request
  *
  * @return the filepath including serving dir
  */
export function filepath(config, url) {
    var file = url === '/' ? config.root : url
    return path.join(config.serving, file)
}
