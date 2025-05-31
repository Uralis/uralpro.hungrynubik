// upload-github.js — выгрузка проекта с очисткой origin

const { execSync } = require('child_process');

const config = {
  repository: 'https://github.com/Uralis/uralpro.hungrynubik.git', // ← твой репозиторий
  branch: 'react',
};

function run(cmd) {
  console.log(`> ${cmd}`);
  execSync(cmd, { stdio: 'inherit' });
}

function isGitRepo() {
  try {
    execSync('git rev-parse --is-inside-work-tree', { stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
}

function getRemoteOrigin() {
  try {
    return execSync('git config --get remote.origin.url', { encoding: 'utf-8' }).trim();
  } catch {
    return null;
  }
}

function getCurrentBranch() {
  try {
    return execSync('git rev-parse --abbrev-ref HEAD', { encoding: 'utf-8' }).trim();
  } catch {
    return null;
  }
}

function upload() {
  if (!isGitRepo()) {
    console.log('Инициализируем git...');
    run('git init');
  }

  const remote = getRemoteOrigin();
  if (remote && remote !== config.repository) {
    console.log(`Удаляем старый origin → ${remote}`);
    run('git remote remove origin');
  }

  if (!remote || remote !== config.repository) {
    console.log(`Настраиваем origin → ${config.repository}`);
    run(`git remote add origin ${config.repository}`);
  } else {
    console.log(`origin уже настроен → ${remote}`);
  }

  console.log('Добавляем все файлы…');
  run('git add .');

  let hasChanges = false;
  try {
    execSync('git diff-index --quiet HEAD --');
    hasChanges = false;
  } catch {
    hasChanges = true;
  }

  if (hasChanges) {
    console.log('Делаем коммит…');
    run('git commit -m "Initial upload"');
  } else {
    console.log('Изменений нет, коммит пропущен.');
  }

  const currentBranch = getCurrentBranch();
  if (currentBranch !== config.branch) {
    console.log(`Переключаемся на ветку "${config.branch}"`);
    run(`git branch -M ${config.branch}`);
  }

  console.log(`Выгружаем проект на GitHub → ${config.repository}`);
  run(`git push --force -u origin ${config.branch}`);

  console.log('\n✅ Проект успешно выгружен на GitHub.');
}

upload();
