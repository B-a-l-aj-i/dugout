/**
 * Represents an error object with a message.
 */

/**
 * Determines whether a value is an Error object.
 * @param {unknown} error - The value to test.
 * @returns {boolean} True if the value is an Error object, false otherwise.
 */
function isErrorObject(error) {
  return error !== null && typeof error === "object";
}

/**
 * Determines if an object is an ErrorWithMessage.
 * @param {unknown} error - The object to check.
 * @returns {boolean} True if the object is an ErrorWithMessage, false otherwise.
 */
function isErrorWithMessage(error) {
  return (
    isErrorObject(error) &&
    "message" in error &&
    typeof error.message === "string"
  );
}

/**
 * Converts an object to an ErrorWithMessage.
 * @param {unknown} maybeError - The object to convert.
 * @returns {ErrorWithMessage} An ErrorWithMessage object.
 */
function toErrorWithMessage(maybeError) {
  if (isErrorWithMessage(maybeError)) {
    return maybeError;
  }

  try {
    return new Error(JSON.stringify(maybeError));
  } catch {
    // fallback in case there's an error stringifying the maybeError
    // like with circular references for example.
    return new Error(String(maybeError));
  }
}

/**
 * Gets the message property of an ErrorWithMessage object.
 * @param {unknown} error - The ErrorWithMessage object.
 * @returns {string} The message property of the ErrorWithMessage object.
 */
export function getErrorMessage(error) {
  return toErrorWithMessage(error).message;
}

/**
 * Adds additional error message to the existing error message.
 * @param {unknown} error - The error object.
 * @param {string} errorMessage - The additional error message to be added.
 * @returns {string} - The updated error message.
 */
export function addAdditionalErrorMessage(error, errorMessage) {
  return `${errorMessage}\n\n${getErrorMessage(error)}`;
}

/**
 * Throws an error with an additional error message.
 * @param error - The original error.
 * @param errorMessage - The additional error message.
 * @returns This function never returns as it always throws an error.
 */
export function throwErrorWithAdditionalMessage(error, errorMessage) {
  throw new Error(addAdditionalErrorMessage(error, errorMessage), {
    cause: error,
  });
}
