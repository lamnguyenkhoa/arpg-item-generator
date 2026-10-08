// Validates the game data in src/data. Run with `npm run check:data`.
import { formatIssues, validateData } from '../src/lib/validateData.ts';

const issues = validateData();
const errors = issues.filter((i) => i.severity === 'error').length;
const warnings = issues.length - errors;

if (issues.length) console.log(formatIssues(issues) + '\n');
console.log(`Data check: ${errors} error(s), ${warnings} warning(s).`);
if (errors) process.exitCode = 1;
