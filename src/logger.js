// This is a wrapper for console logging for now, however this could be updated to ship the logs somewhere in the future
class Logger {
    log(...messages) {
        console.log(...messages);
    }

    warn(...messages) {
        console.warn(...messages);
    }

    error(...messages) {
        console.error(...messages);
    }

    info(...messages) {
        console.info(...messages);
    }
}

export default Logger;
