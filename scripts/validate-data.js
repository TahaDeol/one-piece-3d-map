import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import Ajv from 'ajv';
import { arcOrder } from '../src/config.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');

const schema = JSON.parse(readFileSync(path.join(root, 'data/locations.schema.json'), 'utf8'));
const locations = JSON.parse(readFileSync(path.join(root, 'data/locations.json'), 'utf8'));

const ajv = new Ajv({ allErrors: true });
const validateSchema = ajv.compile(schema);

const knownArcs = new Set([...arcOrder, 'Filler']);
const seenIds = new Set();
let errorCount = 0;

function report(label, message) {
    errorCount++;
    console.error(`${label}: ${message}`);
}

if (!Array.isArray(locations)) {
    console.error('locations.json must be an array of location objects.');
    process.exit(1);
}

locations.forEach((location, index) => {
    const label = `#${index} (${location?.name ?? 'unnamed'})`;

    if (!validateSchema(location)) {
        for (const err of validateSchema.errors) {
            report(label, `${err.instancePath || '/'} ${err.message}`);
        }
    }

    if (location?.id !== undefined) {
        if (seenIds.has(location.id)) {
            report(label, `duplicate id ${location.id}`);
        }
        seenIds.add(location.id);
    }

    if (typeof location?.arc === 'string' && !knownArcs.has(location.arc)) {
        report(label, `unknown arc "${location.arc}" — not in arcOrder (src/config.js) or "Filler"`);
    }
});

if (errorCount > 0) {
    console.error(`\n${errorCount} issue(s) found across ${locations.length} locations.`);
    process.exit(1);
}

console.log(`OK — ${locations.length} locations validated against locations.schema.json, 0 issues.`);
