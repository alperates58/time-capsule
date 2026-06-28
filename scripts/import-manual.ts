import fs from 'fs';
import path from 'path';
import { runManualImport } from '../src/lib/import/import-runner';
import { ImportPayload } from '../src/lib/import/types';

async function main() {
  const filePath = process.argv[2];
  if (!filePath) {
    console.error("Usage: npm run import:manual -- <path-to-json>");
    process.exit(1);
  }

  const absolutePath = path.resolve(process.cwd(), filePath);
  
  if (!fs.existsSync(absolutePath)) {
    console.error(`File not found: ${absolutePath}`);
    process.exit(1);
  }

  console.log(`Reading import file: ${absolutePath}...`);
  const fileContent = fs.readFileSync(absolutePath, 'utf-8');
  let payload: ImportPayload;

  try {
    payload = JSON.parse(fileContent);
  } catch (err: any) {
    console.error(`Invalid JSON format: ${err.message}`);
    process.exit(1);
  }

  console.log(`Executing manual import...`);
  const result = await runManualImport("MANUAL", payload);

  console.log("\n==================================");
  console.log("          IMPORT SUMMARY          ");
  console.log("==================================");
  console.log(`Success:             ${result.success ? "✅ Yes" : "❌ Partial/Failed"}`);
  console.log(`Entities Imported:   ${result.importedEntities}`);
  console.log(`Relations Imported:  ${result.importedRelations}`);
  console.log(`Categories Imported: ${result.importedCategories}`);
  
  if (result.errors.length > 0) {
    console.log("\nErrors/Warnings encountered:");
    result.errors.forEach(e => console.log(`- ${e}`));
  }
  
  console.log("==================================\n");

  if (!result.success) {
    process.exit(1);
  }
}

main().catch(err => {
  console.error("Fatal Error during import:", err);
  process.exit(1);
});
