declare global {
  var defaultLogger: Logger | undefined;
}

type LoggerFunction = (
  message: object | (() => string) | string,
  ...optionalParams: unknown[]
) => void;

export interface Logger {
  trace: LoggerFunction;
  debug: LoggerFunction;
  info: LoggerFunction;
  warn: LoggerFunction;
  error: LoggerFunction;
}

const LEVEL_PADDINGS: Record<string, string> = {
  TRACE: "    ",
  DEBUG: "    ",
  INFO: "     ",
  WARN: "     ",
  ERROR: "    ",
};

export const debugEnabled = (() => {
  // In a node-like environment, check for the environment variable.
  if (typeof globalThis.process !== "undefined" && globalThis.process.env) {
    return globalThis.process.env["MPEG_SDL_PARSER_DEBUG"] !== undefined;
  }

  // In a browser-like environment, check for the local storage item.
  if (typeof localStorage !== "undefined") {
    try {
      return localStorage.getItem("MPEG_SDL_PARSER_DEBUG") !== null;
    } catch {
      // Ignore SecurityError if localStorage is disabled.
      return false;
    }
  }
  return false;
})();

let maxLoggerNameLength = 0;

const LOGGER_NAME_PADDINGS: Record<string, string> = {};

function getDefaultLogger(): Logger {
  return {
    trace: () => {},
    debug: (message, ...optionalParams) => {
      console.debug(message, ...optionalParams);
    },
    info: (message, ...optionalParams) => {
      console.info(message, ...optionalParams);
    },
    warn: (message, ...optionalParams) => {
      console.warn(message, ...optionalParams);
    },
    error: (message, ...optionalParams) => {
      console.error(message, ...optionalParams);
    },
  };
}

function wrapDefaultLogger(
  loggerName: string,
  levelPadding: string,
  loggerFunction: LoggerFunction,
): LoggerFunction {
  return (message, ...optionalParams) => {
    if (message instanceof Function) {
      loggerFunction(
        `${levelPadding} [${loggerName}]${LOGGER_NAME_PADDINGS[loggerName]} ${message()}`,
        ...optionalParams,
      );
      return;
    }
    if (message instanceof Object) {
      loggerFunction(
        `${levelPadding} [${loggerName}]${LOGGER_NAME_PADDINGS[loggerName]} ${JSON.stringify(
          message,
        )}`,
        ...optionalParams,
      );
      return;
    }
    loggerFunction(
      `${levelPadding} [${loggerName}]${LOGGER_NAME_PADDINGS[loggerName]} ${message}`,
      ...optionalParams,
    );
  };
}

/**
 * Retrieves a logger instance with the specified name. If the name length exceeds the current maximum logger name length,
 * it updates the padding for all existing logger names to ensure consistent formatting.
 *
 * @param loggerName The name of the logger to retrieve.
 * @returns A logger instance with the specified name.
 */
export default function getLogger(loggerName: string): Logger {
  if (globalThis.defaultLogger === undefined) {
    globalThis.defaultLogger = getDefaultLogger();
  }

  if (loggerName.length > maxLoggerNameLength) {
    maxLoggerNameLength = loggerName.length;

    for (const key of Object.keys(LOGGER_NAME_PADDINGS)) {
      LOGGER_NAME_PADDINGS[key] = " ".repeat(maxLoggerNameLength - key.length);
    }

    LOGGER_NAME_PADDINGS[loggerName] = "";
  } else if (LOGGER_NAME_PADDINGS[loggerName] === undefined) {
    LOGGER_NAME_PADDINGS[loggerName] = " ".repeat(maxLoggerNameLength - loggerName.length);
  }

  if (debugEnabled) {
    return {
      trace: wrapDefaultLogger(loggerName, LEVEL_PADDINGS.TRACE, globalThis.defaultLogger.trace),
      debug: wrapDefaultLogger(loggerName, LEVEL_PADDINGS.DEBUG, globalThis.defaultLogger.debug),
      info: wrapDefaultLogger(loggerName, LEVEL_PADDINGS.INFO, globalThis.defaultLogger.info),
      warn: wrapDefaultLogger(loggerName, LEVEL_PADDINGS.WARN, globalThis.defaultLogger.warn),
      error: wrapDefaultLogger(loggerName, LEVEL_PADDINGS.ERROR, globalThis.defaultLogger.error),
    };
  }
  return {
    trace: () => {},
    debug: () => {},
    info: () => {},
    warn: () => {},
    error: wrapDefaultLogger(loggerName, LEVEL_PADDINGS.ERROR, globalThis.defaultLogger.error),
  };
}
