const http = require('http');

const endpoints = [
    '/users',
    '/addresses',
    '/categories',
    '/brands',
    '/products',
    '/variants',
    '/compatibility',
    '/readymade-pcs',
    '/coupons',
    '/user-coupons',
    '/orders',
    '/pdfs'
];

const checkEndpoint = (path) => {
    return new Promise((resolve) => {
        http.get(`http://localhost:4080${path}`, (res) => {
            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => {
                try {
                    const json = JSON.parse(data);
                    const count = Array.isArray(json) ? json.length : (json.error ? 'ERROR' : 1);
                    console.log(`[${res.statusCode === 200 ? 'PASS' : 'FAIL'}] ${path}: ${res.statusCode} (Items: ${count})`);
                    if (res.statusCode !== 200) console.error('   Error:', json);
                    resolve();
                } catch (e) {
                    console.log(`[FAIL] ${path}: Invalid JSON`);
                    resolve();
                }
            });
        }).on('error', (err) => {
            console.log(`[FAIL] ${path}: ${err.message}`);
            resolve();
        });
    });
};

const runTests = async () => {
    console.log('Starting API Verification...');
    for (const ep of endpoints) {
        await checkEndpoint(ep);
    }
};

runTests();
