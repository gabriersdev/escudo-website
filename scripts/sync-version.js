// TODO - verificar erro na execução do script. Não tá funcionando. Dá erro: ```npm notice run escudo-website@1.1.0 sync:version
// npm notice run git pull && node scripts/sync-version.js && git add package.json && git commit -m "build: update version"
// remote: Enumerating objects: 7, done.
// remote: Counting objects: 100% (7/7), done.
// remote: Compressing objects: 100% (4/4), done.
// remote: Total 4 (delta 3), reused 0 (delta 0), pack-reused 0 (from 0)
// Unpacking objects: 100% (4/4), 1.08 KiB | 85.00 KiB/s, done.
// From https://github.com/gabriersdev/escudo-website
//    9371602..4e8b329  master     -> origin/master
//  * [new tag]         1.3.0      -> 1.3.0
// hint: Waiting for your editor to close the file... C:\WINDOWS\notepad.exe: line 1: C:WINDOWSnotepad.exe: command not found
// error: there was a problem with the editor 'C:\WINDOWS\notepad.exe'
// Not committing merge; use 'git commit' to complete the merge.``` e o PACKAGE.JSON não é atualizado!!
import fs from "fs";
import path from "path";
import {execSync} from "child_process";
import {fileURLToPath} from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function getGitTags() {
  try {
    execSync("git pull", {encoding: "utf8"});
    const output = execSync("git tag", {encoding: "utf8"});
    return output
      .split("\n")
      .map(t => t.trim())
      .filter(Boolean)
      .filter(t => /^\d+\.\d+\.\d+$/.test(t));
  } catch (e) {
    console.warn("Failed to read git tags:", e.message);
    return [];
  }
}

function compareVersions(a, b) {
  const pa = a.split(".").map(Number);
  const pb = b.split(".").map(Number);
  
  for (let i = 0; i < 3; i++) {
    if (pa[i] > pb[i]) return 1;
    if (pa[i] < pb[i]) return -1;
  }
  
  return 0;
}

function getLatestTag(tags) {
  return tags.sort(compareVersions).pop();
}

function updatePackageJson(version) {
  const pkgPath = path.resolve(__dirname, "..", "package.json");
  const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf8"));
  
  pkg.version = version;
  
  fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + "\n");
  console.log(`File package.json version updated to ${version}`);
}

const tags = getGitTags();

if (!tags.length) {
  console.warn("No valid semver tags found. Skipping version sync.");
  // Não falha o build, apenas pula a sincronização
  process.exit(0);
}

const latest = getLatestTag(tags);
updatePackageJson(latest);
