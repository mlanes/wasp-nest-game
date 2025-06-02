// Test utilities
function assertEqual(actual, expected, message) {
  const result = {
    pass: JSON.stringify(actual) === JSON.stringify(expected),
    message: message
  };

  if (!result.pass) {
    result.message += `\nExpected: ${JSON.stringify(expected)}\nActual: ${JSON.stringify(actual)}`;
  }

  return result;
}

function assertNotEqual(actual, expected, message) {
  const result = {
    pass: JSON.stringify(actual) !== JSON.stringify(expected),
    message: message
  };

  if (!result.pass) {
    result.message += `\nExpected not to equal: ${JSON.stringify(expected)}\nActual: ${JSON.stringify(actual)}`;
  }

  return result;
}

function assertTrue(condition, message) {
  return {
    pass: condition === true,
    message: message
  };
}

function assertFalse(condition, message) {
  return {
    pass: condition === false,
    message: message
  };
}

function assertAllEqual(actual, expected, message) {
  const diffs = [];
  let pass = true;

  for (const key in expected) {
    if (JSON.stringify(actual[key]) !== JSON.stringify(expected[key])) {
      pass = false;
      diffs.push(`${key}: expected ${JSON.stringify(expected[key])}, got ${JSON.stringify(actual[key])}`);
    }
  }

  const result = {
    pass,
    message
  };

  if (!result.pass) {
    result.message += '\nDifferences:\n' + diffs.join('\n');
  }

  return result;
}

function displayTestResult(result) {
  const div = document.createElement('div');
  div.className = `test-result ${result.pass ? 'pass' : 'fail'}`;
  div.innerHTML = `
        <strong>Test:</strong> ${result.message}
        <br/>
        <strong>Result:</strong> ${result.pass ? '✅ PASS' : `❌ FAIL`}
        ${!result.pass && result.message.includes('Differences:') ?
      `<pre>${result.message.split('Differences:')[1]}</pre>` : ''}
    `;
  document.getElementById('test-results').appendChild(div);
}

function runTestSuite(suiteName, tests) {
  const suiteDiv = document.createElement('div');
  suiteDiv.className = 'test-suite';
  suiteDiv.innerHTML = `<h2>${suiteName}</h2>`;
  document.getElementById('test-results').appendChild(suiteDiv);

  const results = {
    total: tests.length,
    passed: 0,
    failed: 0
  };

  tests.forEach(test => {
    try {
      const result = test();
      if (result) {
        results[result.pass ? 'passed' : 'failed']++;
        displayTestResult(result);
      }
    } catch (error) {
      results.failed++;
      displayTestResult({
        pass: false,
        message: `Test failed with error: ${error.message}\n${error.stack}`
      });
    }
  });

  const summaryDiv = document.createElement('div');
  summaryDiv.className = 'test-summary';
  summaryDiv.innerHTML = `
        <h3>Summary</h3>
        <p>Total: ${results.total}</p>
        <p class="pass">Passed: ${results.passed}</p>
        <p class="fail">Failed: ${results.failed}</p>
    `;
  suiteDiv.appendChild(summaryDiv);
}