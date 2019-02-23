const { createInterface } = require('readline');
const EventEmitter = require('events');
const { promisify } = require('util');
const fs = require('fs');
const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);

const $cacheFile = Symbol('ChachedValue Cache File');
const $name = Symbol('ChachedValue Name');
const $retrieve = Symbol('ChachedValue Retrieval Logic');
const $prompt = Symbol('ChachedValue Prompt');
const $promise = Symbol('CachedValue Promise');

class CachedValue extends EventEmitter {

    constructor(cacheFile, name) {
        super();
        this[$cacheFile] = cacheFile;
        this[$name] = name;
    }

    [$retrieve]() {

        readFile(this[$cacheFile], 'utf-8')
            .catch(() => new Promise((res) => {
                this[$prompt] = createInterface(process.stdin, process.stdout);
                this[$prompt].question(`${this[$name]}: `, res);
            }))
            .then(value => {
                this[$prompt].close();
                writeFile(this[$cacheFile], value)
                    .then(() => { this.emit('cache'); })
                    .catch(e => { this.emit('error', e); });
                this.emit('value', value);
            })
            .catch(e => { this.emit('error', e); });

        this[$promise] = new Promise((res) => { this.on('value', res); });

    }

    then(...args) {
        return this[$promise].then(...args);
    }

}

/**
 * Prompts user for a string value once, caches it in a file, returns that value for every subsequent invocation.
 * @param {string} cacheFile - Location of the cache file.
 * @param {string} valueName - Name of value that will be displayed in the terminal when prompting the user.
 * @returns {object} - Thenable event emitter. It promises the retrieval of the string value. 'value' event notifies
 *                     the value retrieval, 'error' event notifies any error that occurs during retrieval or when
 *                     caching the value after its retrieval, 'cache' event notifies successful caching.
 */
module.exports = function askOnce(cacheFile, valueName) {
    const cachedValue = new CachedValue(cacheFile, valueName);
    cachedValue[$retrieve]();
    return cachedValue;
};