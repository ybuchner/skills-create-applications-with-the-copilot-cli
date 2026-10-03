#!/usr/bin/env node

const operations = {
  '+': (left, right) => left + right,
  '-': (left, right) => left - right,
  '*': (left, right) => left * right,
  '/': (left, right) => left / right,
  '%': (left, right) => left % right,
  '**': (left, right) => left ** right,
};

// Supports addition (+), subtraction (-), multiplication (*), division (/),
// modulo (%), exponentiation (**), and square root (sqrt).
function calculate(left, operator, right) {
  if (!Number.isFinite(left) || !Number.isFinite(right)) {
    throw new Error('Both operands must be finite numbers.');
  }

  if (!Object.hasOwn(operations, operator)) {
    throw new Error(`Unsupported operation "${operator}". Use +, -, *, /, %, or **.`);
  }

  if ((operator === '/' || operator === '%') && right === 0) {
    throw new Error(operator === '/' ? 'Cannot divide by zero.' : 'Cannot calculate modulo by zero.');
  }

  return operations[operator](left, right);
}

function modulo(a, b) {
  return calculate(a, '%', b);
}

function power(base, exponent) {
  return calculate(base, '**', exponent);
}

function squareRoot(n) {
  if (!Number.isFinite(n)) {
    throw new Error('The operand must be a finite number.');
  }

  if (n < 0) {
    throw new Error('Cannot calculate the square root of a negative number.');
  }

  return Math.sqrt(n);
}

function main(args) {
  if (args.length === 2 && args[0] === 'sqrt') {
    try {
      console.log(squareRoot(Number(args[1])));
    } catch (error) {
      console.error(error.message);
      process.exitCode = 1;
    }
    return;
  }

  if (args.length !== 3) {
    console.error('Usage: node src/calculator.js <number> <+|-|*|/|%|**> <number> | sqrt <number>');
    process.exitCode = 1;
    return;
  }

  const [leftInput, operator, rightInput] = args;
  const left = Number(leftInput);
  const right = Number(rightInput);

  try {
    console.log(calculate(left, operator, right));
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}

if (require.main === module) {
  main(process.argv.slice(2));
}

module.exports = { calculate, modulo, power, squareRoot };
