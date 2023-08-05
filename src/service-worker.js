importScripts('./ngsw-worker.js');

// self.addEventListener('sync', (event) => {
//     if (event.tag === 'sample-post') {
//         event.waitUntil(postData('', ''));
//     }
// });

// function postData(url, method, options = {}) {
//     fetch(url, {
//         method,
//         headers: options.headers,
//         body: options.data
//     }).then(() => Promise.resolve()).catch(() => Promise.reject());
// }