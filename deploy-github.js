const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// ─── CONFIGURATION ─────────────────────────────────────────────────────
const config = {
  repository: 'https://github.com/YourNovelsWorld/Frontend.git', // ← Update this to your repo URL
  deployBranch: 'gh-pages',
  buildDir: path.join(__dirname, 'build'),
  tempDir: path.join(__dirname, 'temp_deploy'),
};

// ─── UTILITIES ──────────────────────────────────────────────────────────
// Run a shell command and inherit stdio (so you see the output in the console)
function run(cmd, opts = {}) {
  console.log(`> ${cmd}`);
  execSync(cmd, { stdio: 'inherit', ...opts });
}

// Recursively delete a folder (cross‐platform)
function deleteFolderRecursive(folderPath) {
  if (fs.existsSync(folderPath)) {
    fs.rmSync(folderPath, { recursive: true, force: true });
  }
}

// Recursively copy contents of srcDir into destDir
function copyFolderContents(srcDir, destDir) {
  // Ensure destDir exists
  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
  }

  const entries = fs.readdirSync(srcDir, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(srcDir, entry.name);
    const destPath = path.join(destDir, entry.name);

    if (entry.isDirectory()) {
      // Copy sub‐directory
      copyFolderContents(srcPath, destPath);
    } else if (entry.isFile()) {
      // Copy file
      fs.copyFileSync(srcPath, destPath);
    }
    // (You can ignore symlinks for a typical CRA build.)
  }
}

// Check if the remote branch exists on origin
function remoteBranchExists(branch) {
  try {
    // `--heads origin <branch>` returns status 0 if it exists
    execSync(`git ls-remote --exit-code --heads origin ${branch}`, { stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
}

// ─── MAIN DEPLOY FUNCTION ───────────────────────────────────────────────
async function deployToGhPages() {
  // 1) Run `npm run build` in the local project root
  console.log('\n1) Building the project…\n');
  run('npm run build');

  // 2) Remove any existing tempDir, then clone the repo into it
  console.log('\n2) Cloning repository into temp_deploy…\n');
  deleteFolderRecursive(config.tempDir);
  run(`git clone ${config.repository} ${config.tempDir}`);

  // 3) Inside temp_deploy, checkout (or create) gh‐pages
  process.chdir(config.tempDir);
  console.log(`\n3) Checking out branch "${config.deployBranch}"…\n`);
  if (remoteBranchExists(config.deployBranch)) {
    run(`git checkout ${config.deployBranch}`);
    run('git pull'); // Make sure it’s up to date
  } else {
    // Create an orphan branch (no history)
    run(`git checkout --orphan ${config.deployBranch}`);
  }

  // 4) Delete everything in temp_deploy except the .git folder
  console.log('\n4) Clearing out old files (keeping only .git)…\n');
  const allEntries = fs.readdirSync(process.cwd());
  for (const name of allEntries) {
    if (name === '.git') continue;
    const curPath = path.join(process.cwd(), name);
    fs.rmSync(curPath, { recursive: true, force: true });
  }

  // 5) Copy all built files from local buildDir → temp_deploy
  console.log('\n5) Copying build/ contents into temp_deploy…\n');
  copyFolderContents(config.buildDir, process.cwd());

  // 6) Commit & force‐push to origin/gh‐pages
  console.log('\n6) Committing and pushing to gh-pages…\n');
  run('git add .');
  run(`git commit -m "Deploy to gh-pages"`);
  run(`git push origin ${config.deployBranch} --force`);

  console.log('\n✅ Deployment to gh-pages complete! 🎉\n');
  process.exit(0);
}

// Run it
deployToGhPages().catch(err => {
  console.error('Deployment script failed:', err);
  process.exit(1);
});
