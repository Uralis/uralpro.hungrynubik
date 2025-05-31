/**
 * upload-github.js
 *
 * Очень простой скрипт: 
 * — добавляет все файлы в индекс, 
 * — делает коммит (если есть изменения), 
 * — подтягивает (pull --rebase) из origin/react, 
 * — пушит в origin/react. 
 *
 * Перед запуском обязательно укажите свой URL репозитория в config.repository.
 */

const { execSync } = require('child_process');

const config = {
  repository: 'https://github.com/YourGitHubUsername/Frontend.git', // <-- ваш репозиторий
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

function uploadProject() {
  // 1) git init, если нужно
  if (!isGitRepo()) {
    console.log('Git-репозиторий не найден, выполняем git init…');
    run('git init');
  } else {
    console.log('Git уже инициализирован.');
  }

  // 2) Настраиваем remote origin
  const existing = getRemoteOrigin();
  if (!existing) {
    console.log(`Добавляем remote origin → ${config.repository}`);
    run(`git remote add origin ${config.repository}`);
  } else if (existing !== config.repository) {
    console.log(`Remote origin был ${existing}, заменяем на ${config.repository}`);
    run('git remote remove origin');
    run(`git remote add origin ${config.repository}`);
  } else {
    console.log(`Remote origin уже указывает на ${existing}`);
  }

  // 3) Переключаемся (или переименовываем) ветку в react
  try {
    const cur = execSync('git rev-parse --abbrev-ref HEAD', { encoding: 'utf-8' }).trim();
    if (cur !== config.branch) {
      console.log(`Меняем ветку "${cur}" → "${config.branch}"`);
      run(`git branch -M ${config.branch}`);
    } else {
      console.log(`Текущая ветка уже "${config.branch}"`);
    }
  } catch {
    console.log(`Нет ветки, создаём "${config.branch}"`);
    run(`git checkout -b ${config.branch}`);
  }

  // 4) git add . и git commit, если есть изменения
  run('git add .');
  let hasChanges = false;
  try {
    execSync('git diff-index --quiet HEAD --'); // если нет изменений, не выбросит ошибку
    hasChanges = false;
  } catch {
    hasChanges = true;
  }

  if (hasChanges) {
    console.log('Есть новые изменения, создаём коммит.');
    run(`git commit -m "Project update"`);
  } else {
    console.log('Изменений нет, коммит пропускаем.');
  }

  // 5) git pull --rebase (если есть удалённые коммиты)
  console.log(`Пытаемся подтянуть изменения: git pull --rebase origin ${config.branch}`);
  try {
    run(`git pull --rebase origin ${config.branch}`);
  } catch (err) {
    console.log('Не удалось сделать pull --rebase (ветка могла не существовать), продолжаем.');
  }

  // 6) git push
  console.log(`Пушим: git push -u origin ${config.branch}`);
  try {
    run(`git push -u origin ${config.branch}`);
    console.log('✅ Пуш прошёл успешно.');
  } catch (err) {
    console.log(
      '⚠️ Ошибка при обычном push. Возможно, удаленная ветка впереди. Выполняем принудительный пуш…'
    );
    run(`git push --force origin ${config.branch}`);
    console.log('✅ Force-push прошёл успешно.');
  }
}

uploadProject();
