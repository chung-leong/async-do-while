# async-do-while

A simple library for Bluebird that helps you create while or do-while loops
involving asynchronous operations.

One key design goal is maintaining readability. A loop is structured as
multiple function calls so that you don't up end with awkwardly indented code.

## Usage ##

A basic do-while loop:

```javascript
var Async = require('async-do-while');

var loop = 0;
Async.do(() => {
    return Promise.delay(25).then(() => {
        loop++;
    });
});
Async.while(() => { return (loop < 10) });
return Async.end();

```
The function passed to `do()` will be called repeatedly, as long as the function passed to `while()` returns a truthy value or a promise that resolves to a truthy value. `end()` is the function that starts the loop. It returns a [Bluebird promise](http://bluebirdjs.com). .

To do a while loop (where the continuation condition is checked first), simply flip the order by which `do()` and `while()` are called:

```javascript
var loop = 0;
Async.while(() => { return (loop < 10) });
Async.do(() => {
    return Promise.delay(25).then(() => {
        loop++;
    });
});
return Async.end();
```

Use `return()` to return a value (the value that the promise returned by `end()` fulfills with):

```javascript
var loop = 0;
Async.while(() => { return (loop < 10) });
Async.do(() => {
    return Promise.delay(25).then(() => {
        loop++;
    });
});
Async.return(() => { return loop });
return Async.end();
```

If something needs to happen at the beginning of the loop, call `begin()` with a callback. Typically, you would use this only when you have nested loops.

To break out of a loop, call `break()`. It throws an exception that is then trapped and ignored by `end()`. The same *Error* object is thrown every time. It's exported from the module as `AsyncBreak`.

```javascript
var loop = 0;
Async.do(() => {
    return Promise.delay(25).then(() => {
        if (loop === 5) {
            Async.break();
        }
        loop++;
    });
});
Async.while(() => { return (loop < 10) });
return Async.end();
```
