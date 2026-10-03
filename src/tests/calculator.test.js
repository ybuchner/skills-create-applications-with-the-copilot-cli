const assert = require('node:assert/strict');
const { spawnSync } = require('node:child_process');
const path = require('node:path');
const test = require('node:test');
const { calculate, modulo, power, squareRoot } = require('../calculator');

const calculatorPath = path.join(__dirname, '..', 'calculator.js');

test('addition returns the sum, including the example operation', () => {
  assert.equal(calculate(2, '+', 3), 5);
  assert.equal(calculate(-2, '+', 3), 1);
  assert.equal(calculate(0, '+', 0), 0);
});

test('subtraction returns the difference, including the example operation', () => {
  assert.equal(calculate(10, '-', 4), 6);
  assert.equal(calculate(4, '-', 10), -6);
  assert.equal(calculate(5, '-', 5), 0);
});

test('multiplication returns the product, including the example operation', () => {
  assert.equal(calculate(45, '*', 2), 90);
  assert.equal(calculate(-3, '*', 4), -12);
  assert.equal(calculate(7, '*', 0), 0);
});

test('division returns the quotient, including the example operation', () => {
  assert.equal(calculate(20, '/', 5), 4);
  assert.equal(calculate(7, '/', 2), 3.5);
  assert.equal(calculate(-8, '/', 2), -4);
});

test('modulo returns the remainder', () => {
  assert.equal(modulo(5, 2), 1);
  assert.equal(modulo(10, 3), 1);
  assert.equal(modulo(-10, 3), -1);
  assert.equal(modulo(4, 2), 0);
  assert.equal(calculate(10, '%', 3), 1);
});

test('modulo by zero throws a clear error', () => {
  assert.throws(() => modulo(10, 0), /Cannot calculate modulo by zero/);
  assert.throws(() => calculate(10, '%', -0), /Cannot calculate modulo by zero/);
});

test('power raises a base to an exponent', () => {
  assert.equal(power(2, 3), 8);
  assert.equal(power(5, 0), 1);
  assert.equal(power(2, -2), 0.25);
  assert.equal(power(-2, 3), -8);
  assert.equal(calculate(2, '**', 3), 8);
});

test('square root returns the non-negative square root', () => {
  assert.equal(squareRoot(16), 4);
  assert.equal(squareRoot(9), 3);
  assert.equal(squareRoot(2), Math.sqrt(2));
  assert.equal(squareRoot(0), 0);
});

test('square root rejects negative and non-finite operands', () => {
  assert.throws(() => squareRoot(-1), /square root of a negative number/);
  assert.throws(() => squareRoot(NaN), /finite number/);
  assert.throws(() => squareRoot(Infinity), /finite number/);
});

test('division by positive or negative zero throws a clear error', () => {
  assert.throws(() => calculate(1, '/', 0), /Cannot divide by zero/);
  assert.throws(() => calculate(1, '/', -0), /Cannot divide by zero/);
});

test('non-finite operands are rejected', () => {
  for (const operand of [NaN, Infinity, -Infinity]) {
    assert.throws(
      () => calculate(operand, '+', 1),
      /Both operands must be finite numbers/,
    );
    assert.throws(
      () => calculate(1, '+', operand),
      /Both operands must be finite numbers/,
    );
  }
});

test('unsupported operators are rejected', () => {
  for (const operator of ['^', '']) {
    assert.throws(
      () => calculate(1, operator, 2),
      /Unsupported operation/,
    );
  }
});

test('CLI prints results for each supported operation', () => {
  const examples = [
    ['2', '+', '3', '5'],
    ['10', '-', '4', '6'],
    ['45', '*', '2', '90'],
    ['20', '/', '5', '4'],
    ['5', '%', '2', '1'],
    ['2', '**', '3', '8'],
  ];

  for (const [left, operator, right, expected] of examples) {
    const result = spawnSync(
      process.execPath,
      [calculatorPath, left, operator, right],
      { encoding: 'utf8' },
    );

    assert.equal(result.status, 0, result.stderr);
    assert.equal(result.stdout.trim(), expected);
    assert.equal(result.stderr, '');
  }
});

test('CLI prints the square root result', () => {
  const result = spawnSync(process.execPath, [calculatorPath, 'sqrt', '16'], {
    encoding: 'utf8',
  });

  assert.equal(result.status, 0, result.stderr);
  assert.equal(result.stdout.trim(), '4');
  assert.equal(result.stderr, '');
});

test('CLI reports usage and exits unsuccessfully when arguments are missing', () => {
  const result = spawnSync(process.execPath, [calculatorPath], {
    encoding: 'utf8',
  });

  assert.equal(result.status, 1);
  assert.match(result.stderr, /Usage:/);
  assert.equal(result.stdout, '');
});

test('CLI reports invalid operands and unsupported operations', () => {
  for (const args of [
    ['not-a-number', '+', '1'],
    ['1', '^', '2'],
    ['1', '/', '0'],
    ['1', '%', '0'],
    ['sqrt', '-1'],
    ['sqrt', 'not-a-number'],
  ]) {
    const result = spawnSync(process.execPath, [calculatorPath, ...args], {
      encoding: 'utf8',
    });

    assert.equal(result.status, 1);
    assert.notEqual(result.stderr.trim(), '');
    assert.equal(result.stdout, '');
  }
});
