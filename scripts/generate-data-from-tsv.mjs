import { mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { basename, join } from 'node:path';
import ts from 'typescript';

const rootDir = process.cwd();
const tsvDir = join(rootDir, 'app', 'data', 'tsv');
const outputDir = join(rootDir, 'app', 'data', 'generated');

const expectedHeader = ['id', 'group', 'text', 'reverse'];
const expectedGroupLabelsByFile = {
  'paradox-mindset.tsv': ['tension', 'paradox'],
};

function parseCell(value) {
  return value.replace(/\\n/g, '\n');
}

function parseTsv(fileName) {
  const raw = readFileSync(join(tsvDir, fileName), 'utf8').trimEnd();
  const [headerLine, ...lines] = raw.split(/\r?\n/);
  const header = headerLine.split('\t');

  if (header.join('\t') !== expectedHeader.join('\t')) {
    throw new Error(`${fileName}: header must be ${expectedHeader.join('\t')}`);
  }

  return lines.map((line, index) => {
    const columns = line.split('\t');

    if (columns.length !== expectedHeader.length) {
      throw new Error(`${fileName}:${index + 2}: expected ${expectedHeader.length} columns, got ${columns.length}`);
    }

    const [idValue, group, textValue, reverseValue] = columns;
    const id = Number(idValue);
    const expectedId = index + 1;

    if (!Number.isInteger(id) || id !== expectedId) {
      throw new Error(`${fileName}:${index + 2}: id must be ${expectedId}`);
    }

    if (!textValue) {
      throw new Error(`${fileName}:${index + 2}: text is required`);
    }

    if (reverseValue !== '0' && reverseValue !== '1') {
      throw new Error(`${fileName}:${index + 2}: reverse must be 0 or 1`);
    }

    return {
      id,
      group: parseCell(group),
      text: parseCell(textValue),
      reverse: reverseValue === '1',
    };
  });
}

function readExportedStringArray(filePath, exportName) {
  const source = ts.createSourceFile(
    filePath,
    readFileSync(filePath, 'utf8'),
    ts.ScriptTarget.Latest,
    true,
  );
  let initializer;

  function visit(node) {
    if (
      ts.isVariableDeclaration(node)
      && ts.isIdentifier(node.name)
      && node.name.text === exportName
      && ts.isArrayLiteralExpression(node.initializer)
    ) {
      initializer = node.initializer;
      return;
    }

    ts.forEachChild(node, visit);
  }

  visit(source);

  if (!initializer) {
    return null;
  }

  return initializer.elements.map((element) => {
    if (!ts.isStringLiteral(element) && !ts.isNoSubstitutionTemplateLiteral(element)) {
      throw new Error(`${filePath}: ${exportName} must contain only string literals`);
    }

    return element.text;
  });
}

function validateGroups(fileName, rows) {
  const groupLabels = [...new Set(rows.map((row) => row.group).filter(Boolean))];

  if (groupLabels.length === 0) {
    return;
  }

  const moduleName = basename(fileName, '.tsv');
  const expectedLabels = expectedGroupLabelsByFile[fileName]
    ?? readExportedStringArray(join(rootDir, 'app', 'data', `${moduleName}.ts`), 'labels');

  if (!expectedLabels) {
    return;
  }

  if (groupLabels.join('\t') !== expectedLabels.join('\t')) {
    throw new Error(
      `${fileName}: group labels must match app/data/${moduleName}.ts labels. `
      + `Expected [${expectedLabels.join(', ')}], got [${groupLabels.join(', ')}]`,
    );
  }
}

function generateModule(rows) {
  const groupLabels = [...new Set(rows.map((row) => row.group).filter(Boolean))];
  const questionGroups = groupLabels.map((group) => rows
    .filter((row) => row.group === group)
    .map((row) => row.text));

  return `export type QuestionRow = {
  id: number;
  group: string;
  text: string;
  reverse: boolean;
};

export const questionRows: QuestionRow[] = ${JSON.stringify(rows, null, 2)};

export const questions = questionRows.map((row) => row.text);

export const reverseItems = questionRows.flatMap((row, index) => (
  row.reverse ? [index] : []
));

export const groupLabels = ${JSON.stringify(groupLabels, null, 2)};

export const questionGroups = ${JSON.stringify(questionGroups, null, 2)};
`;
}

mkdirSync(outputDir, { recursive: true });

for (const fileName of readdirSync(tsvDir).filter((file) => file.endsWith('.tsv')).sort()) {
  const outputName = `${basename(fileName, '.tsv')}.ts`;
  const rows = parseTsv(fileName);
  validateGroups(fileName, rows);
  writeFileSync(join(outputDir, outputName), generateModule(rows), 'utf8');
}
