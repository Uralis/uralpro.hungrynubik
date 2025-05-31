/**
 * upload-github.js
 *
 * Скрипт для автоматической «заливки» всего локального проекта
 * в удалённый репозиторий GitHub (ветка main).
 *
 * Обновлённая логика:
 * 1. Проверяет, инициализирован ли Git. Если нет — делает `git init`.
 * 2. Проверяет/настраивает remote “origin”.
 * 3. Переименовывает или создаёт ветку `main`.
 * 4. Добавляет все файлы в индекс и коммитит, если есть изменения.
 * 5. Делает `git pull --rebase` из origin/main, чтобы подтянуть удалённые изменения.
 * 6. Пушит локальную ветку main в origin.
 */

const { execSync } = require('child_process');
const fs = require('fs');

// ─── НАСТРОЙКИ ───────────────────────────────────────────────────────────
// Укажите сюда URL своего репозитория (HTTPS или SSH) на GitHub:
const config = {
  repository: 'https://github.com/YourNovelsWorld/Frontend.git',
  branch: 'main', // ветка, в которую будем пушить
};

// Утилита для выполнения команд в консоли (stdout/stderr в консоль):
function run(cmd) {
  console.log(`> ${cmd}`);
  execSync(cmd, { stdio: 'inherit' });
}

// Проверить, инициализирован ли Git в текущей папке:
function isGitInitialized() {
  try {
    execSync('git rev-parse --is-inside-work-tree', { stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
}

// Получить URL для remote “origin” (если настроен):
function getCurrentRemoteUrl() {
  try {
    const url = execSync('git config --get remote.origin.url', { encoding: 'utf-8' }).trim();
    return url;
  } catch {
    return null;
  }
}

// Основная функция
function uploadProjectToGithub() {
  // 1) Инициализируем Git, если ещё не было
  if (!isGitInitialized()) {
    console.log('Git не инициализирован. Выполняем git init…');
    run('git init');
  } else {
    console.log('Git уже инициализирован.');
  }

  // 2) Настраиваем remote “origin”
  const existingRemote = getCurrentRemoteUrl();
  if (!existingRemote) {
    console.log(`Remote "origin" не настроен. Добавляем origin → ${config.repository}`);
    run(`git remote add origin ${config.repository}`);
  } else if (existingRemote !== config.repository) {
    console.log(
      `Remote "origin" установлен (${existingRemote}), но отличается от желаемого (${config.repository}).`
    );
    console.log('Удаляем старый origin и настраиваем новый:');
    run('git remote remove origin');
    run(`git remote add origin ${config.repository}`);
  } else {
    console.log(`Remote "origin" уже указывает на ${existingRemote}`);
  }

  // 3) Переключаемся на ветку config.branch (main)
  const branchName = config.branch;
  try {
    const currentBranch = execSync('git rev-parse --abbrev-ref HEAD', { encoding: 'utf-8' }).trim();
    if (currentBranch !== branchName) {
      console.log(`Сейчас ветка "${currentBranch}", переименовываем/переключаем на "${branchName}"…`);
      run(`git branch -M ${branchName}`);
    } else {
      console.log(`Текущая ветка уже "${branchName}".`);
    }
  } catch {
    // Если нет ни одного коммита, создаём ветку:
    console.log(`Не удалось определить текущую ветку: создаём ветку "${branchName}"…`);
    run(`git checkout -b ${branchName}`);
  }

  // 4) Добавляем все файлы в индекс
  console.log('Добавляем все файлы в git индекс:');
  run('git add .');

  // 5) Проверяем, есть ли изменения для коммита
  let needCommit = true;
  try {
    execSync('git diff-index --quiet HEAD --'); // если нет изменений, вернёт 0
    needCommit = false;
  } catch {
    needCommit = true;
  }

  if (needCommit) {
    console.log('Есть новые изменения — создаём новый коммит:');
    run(`git commit -m "Initial commit"`);
  } else {
    console.log('Изменений нет, новый коммит не нужен.');
  }

  // 6) Подтягиваем (pull) из origin/main с --rebase
  // Если ветка ещё не существует на удалённом, pull вернёт ошибку — игнорируем её.
  console.log(`Подтягиваем удалённые изменения: git pull --rebase origin ${branchName}`);
  try {
    run(`git pull --rebase origin ${branchName}`);
  } catch (err) {
    console.log(
      ` > Не удалось подтянуть из origin/${branchName} (возможно, ветка не существует). Продолжаем.`
    );
  }

  // 7) Пушим в origin/main
  console.log(`Пушим ветку "${branchName}" в origin…`);
  try {
    run(`git push -u origin ${branchName}`);
    console.log('\n✅ Проект успешно загружен в репозиторий GitHub!');
  } catch (err) {
    console.error(
      `Ошибка при пуше в origin/${branchName}. Возможно, потребуется ручная команда:\n` +
        `  git push --force origin ${branchName}`
    );
    process.exit(1);
  }
}

// Запускаем скрипт
uploadProjectToGithub();
