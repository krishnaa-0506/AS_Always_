// Simple worker module for Next.js build compatibility
// This file resolves the missing worker.js module error

const { parentPort, workerData } = require('worker_threads');

// Basic worker functionality
if (parentPort) {
  parentPort.on('message', (data) => {
    try {
      // Process the data
      const result = processData(data);
      parentPort.postMessage({ success: true, result });
    } catch (error) {
      parentPort.postMessage({ success: false, error: error.message });
    }
  });
}

function processData(data) {
  // Basic data processing
  return { processed: true, data };
}

module.exports = {
  processData
};