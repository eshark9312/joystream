/**
 * Returns an object that contains a Promise and exposes its handlers, ie. resolve and reject methods
 * so it can be fulfilled 'externally'. This is a bit of a hack, but most useful application is when
 * concurrent async operations are initiated that are all waiting on the same result value.
 */
function newExternallyControlledPromise () {
    let resolve, reject

    const promise = new Promise((res, rej) => {
      resolve = res
      reject = rej
    })

    return ({ resolve, reject, promise })
}

module.exports = {
    newExternallyControlledPromise
}
