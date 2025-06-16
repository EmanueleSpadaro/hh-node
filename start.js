const { spawn } = require("child_process");

function msleep(n) {
  Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, n);
}

const hardhat = spawn("npx", ["hardhat", "node", "--port", "8888"], {
  stdio: "inherit",
});

msleep(2000);

require("./express.js");