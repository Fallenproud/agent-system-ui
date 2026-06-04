const localtunnel = require('localtunnel');
const { spawn } = require('child_process');
const path = require('path');

console.log('Starting Agent System Backend...\n');

const backend = spawn('node', ['server.js'], {
  cwd: __dirname,
  stdio: 'pipe',
});

let backendReady = false;
backend.stdout.on('data', (data) => {
  const text = data.toString();
  process.stdout.write(text);
  if (text.includes('Agent System running on')) {
    backendReady = true;
  }
});

backend.stderr.on('data', (data) => {
  process.stderr.write(data.toString());
});

backend.on('exit', (code) => {
  console.log(`Backend exited with code ${code}`);
  process.exit(code);
});

async function startTunnel() {
  try {
    const tunnel = await localtunnel({ port: 3001 });

    console.log('\n╔════════════════════════════════════════════════════════════╗');
    console.log('║  🚀 BACKEND DEPLOYED — PUBLIC URL READY                  ║');
    console.log('╠════════════════════════════════════════════════════════════╣');
    console.log(`║  Public URL:  ${tunnel.url.padEnd(47)}║`);
    console.log(`║  API Chat:    ${(tunnel.url + '/api/chat').padEnd(47)}║`);
    console.log(`║  API Health:  ${(tunnel.url + '/api/agents/health').padEnd(47)}║`);
    console.log('╚════════════════════════════════════════════════════════════╝\n');

    console.log('To connect the frontend, run in a new terminal:');
    console.log(`  cd ${path.resolve(__dirname, '..')}`);
    console.log(`  $env:VITE_API_BASE_URL="${tunnel.url}"; npm run dev\n`);

    tunnel.on('close', () => {
      console.log('\nTunnel closed. Shutting down backend...');
      backend.kill();
      process.exit(0);
    });

    tunnel.on('error', (err) => {
      console.error('Tunnel error:', err);
      backend.kill();
      process.exit(1);
    });
  } catch (err) {
    console.error('Failed to start tunnel:', err.message);
    backend.kill();
    process.exit(1);
  }
}

// Wait for backend to start, then create tunnel
const checkInterval = setInterval(() => {
  if (backendReady) {
    clearInterval(checkInterval);
    startTunnel();
  }
}, 500);

// Timeout after 10 seconds
setTimeout(() => {
  if (!backendReady) {
    console.error('Backend failed to start within 10 seconds.');
    backend.kill();
    process.exit(1);
  }
}, 10000);
