#!/usr/bin/env node

const operations = {
  '+': (left, right) => left + right,
  '-': (left, right) => left - right,
  '*': (left, right) => left * right,
  '/': (left, right) => left / right,
};

// Supports addition (+), subtraction (-), multiplication (*), and division (/).
function calculate(left, operator, right) {
  if (!Number.isFinite(left) || !Number.isFinite(right)) {
    throw new Error('Both operands must be finite numbers.');
  }

  if (!Object.hasOwn(operations, operator)) {
    throw new Error(`Unsupported operation "${operator}". Use +, -, *, or /.`);
  }

  if (operator === '/' && right === 0) {
    throw new Error('Cannot divide by zero.');
  }

  return operations[operator](left, right);
}

function main(args) {
  if (args.length !== 3) {
    console.error('Usage: node src/calculator.js <number> <+|-|*|/> <number>');
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

module.exports = { calculate };
