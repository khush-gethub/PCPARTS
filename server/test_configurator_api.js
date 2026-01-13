const http = require('http');

const testCategoryFetch = () => {
    return new Promise((resolve) => {
        http.get('http://localhost:4080/api/products/category/cat_cpu', (res) => {
            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => {
                try {
                    const products = JSON.parse(data);
                    console.log(`[PASS] Fetch products by category: Found ${products.length} CPUs`);
                    if (products.length > 0) {
                        const p = products[0];
                        if (p.id && p.image !== undefined && p.price !== undefined) {
                            console.log(`[PASS] Product structure verified: ${p.name}`);
                        } else {
                            console.log(`[FAIL] Product structure incomplete: ${JSON.stringify(p)}`);
                        }
                    }
                } catch (e) {
                    console.log(`[FAIL] Fetch products by category: Invalid JSON - ${data}`);
                }
                resolve();
            });
        }).on('error', (err) => {
            console.log(`[FAIL] Fetch products by category: ${err.message}`);
            resolve();
        });
    });
};

const testSaveBuild = () => {
    return new Promise((resolve) => {
        const payload = JSON.stringify({
            user_id: 'test_user_123',
            name: 'Test Build',
            total_price: 100000,
            items: [
                { product_id: 'prod_cpu_1', category_id: 'cat_cpu', variant_id: 'var_cpu_1' }
            ]
        });

        const req = http.request({
            hostname: 'localhost',
            port: 4080,
            path: '/api/pc-builds',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(payload)
            }
        }, (res) => {
            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => {
                if (res.statusCode === 201) {
                    console.log(`[PASS] Save build: ${data}`);
                } else {
                    console.log(`[FAIL] Save build: ${res.statusCode} - ${data}`);
                }
                resolve();
            });
        });

        req.on('error', (err) => {
            console.log(`[FAIL] Save build: ${err.message}`);
            resolve();
        });

        req.write(payload);
        req.end();
    });
};

const runTests = async () => {
    console.log('Starting Configurator API Verification...');
    await testCategoryFetch();
    await testSaveBuild();
};

runTests();
