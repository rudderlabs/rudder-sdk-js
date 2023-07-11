/**
 * Get mutated error with issue prepended to error message
 * @param err Original error
 * @param issue Issue to prepend to error message
 * @returns Instance of Error with message prepended with issue
 */
declare const getMutatedError: (err: any, issue: string) => Error;
export { getMutatedError };
