const express = require('express');
const http = require('http');
const fs = require('fs');
const fsPromises = require('node:fs/promises');
const app = express();
const port = 8545;

app.use(express.json());

function forwardTo(req) {
    const body = typeof req.body === 'string'
        ? req.body
        : JSON.stringify(req.body);

    const targetOptions = {
        hostname: 'localhost',
        port: 8888,
        path: '/',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(body)
        }
    };

    return new Promise((resolve, reject) => {
        const proxyReq = http.request(targetOptions, proxyRes => {
            let data = [];
            proxyRes.on('data', chunk => data.push(chunk));
            proxyRes.on('end', () => {
                resolve({
                    statusCode: proxyRes.statusCode,
                    headers: proxyRes.headers,
                    body: Buffer.concat(data),
                });
            });
        });

        proxyReq.on('error', reject);
        proxyReq.write(body);
        proxyReq.end();
    });
}

app.post('/', async (req, res) => {
    try {
        if (req.body.method === "eth_sendTransaction") {
            const fileHandle = await fsPromises.open("transactions.jsonl", "a");
            fileHandle.writeFile(JSON.stringify(req.body) + "\n");
            fileHandle.close();
        }

        const response = await forwardTo(req);
        res.writeHead(response.statusCode, response.headers);
        res.end(response.body);
    } catch (error) {
        console.error('Proxy error:', error);
        res.status(500).send('Proxy error');
    }
});


if (fs.existsSync('transactions.jsonl')) {
    const data = fs.readFileSync('transactions.jsonl', 'utf8');
    const previousTransactions = data.split("\n");

    // -1 cuz the last one is empty && async wrapper
    (async () => {
        for (let i = 0; i < previousTransactions.length - 1; i++) {
            const req = { body: previousTransactions[i] };
            await forwardTo(req);
        }
    })();
}

app.listen(port, () => {
    console.log(`Proxy server listening on port ${port}`);
});


