type ErrorWithMessage = {
  message: string
};

function isErrorWithMessage(error: unknown): error is ErrorWithMessage {
  return (
    typeof error === 'object' &&
    error !== null &&
    'message' in error &&
    typeof (error as Record<string, unknown>).message === 'string'
  );
}

function toErrorWithMessage(errorMaybe: unknown): ErrorWithMessage {
  if (isErrorWithMessage(errorMaybe)) return errorMaybe;

  try {
    return new Error(JSON.stringify(errorMaybe));
  } catch {
    return new Error(String(errorMaybe));
  }
}

export function getErrorMessage(error: unknown) {
  return toErrorWithMessage(error).message;
}

