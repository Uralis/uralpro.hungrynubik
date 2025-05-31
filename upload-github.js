/**
 * upload-github.js
 *
 * Скрипт для автоматической «заливки» всего локального проекта
 * в удалённый репозиторий GitHub (ветка main).
 *
 * Как работает:
 * 1. Проверяет, инициализирован ли уже Git в корне проекта. Если нет — делает `git init`.
 * 2. Проверяет наличие remote “origin”. Если его нет или он отличается — привязывает указанный URL.
 * 3. Ставит все файлы (кроме тех, что в .gitignore) в индекс и создаёт коммит “Initial commit” (или обновлённый).
 * 4. Пушит локальную ветку (по умолчанию main) в origin.
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// ─── НАСТРОЙКИ ───────────────────────────────────────────────────────────
// Укажите сюда URL своего репозитория (HTTPS или SSH) на GitHub:
const config = {
  repository: 'https://github.com/YourNovelsWorld/Frontend.git',
  branch: 'main',       // ветка, в которую будем пушить (обычно main или master)
};

// Полезная обёртка для выполнения команд в консоли:
function run(cmd) {
  console.log(`> ${cmd}`);
  execSync(cmd, { stdio: 'inherit' });
}

// Проверить, инициализирован ли Git в текущей папке:
function isGitInitialized() {
  try {
    execSync('git rev-parse --is-inside-work-tree', { stdio: 'ignore' });
    return true;
  } catch (err) {
    return false;
  }
}

// Получить текущий URL для remote “origin”, если он задан:
function getCurrentRemoteUrl() {
  try {
    const url = execSync('git config --get remote.origin.url', { encoding: 'utf-8' }).trim();
    return url;
  } catch {
    return null;
  }
}

// Основная функция:
function uploadProjectToGithub() {
  // 1) Инициализируем репозиторий Git, если ещё не было
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

  // 3) Гарантируем, что текущая ветка называется так, как в config.branch
  const branchName = config.branch;
  try {
    const currentBranch = execSync('git rev-parse --abbrev-ref HEAD', { encoding: 'utf-8' }).trim();
    if (currentBranch !== branchName) {
      // Переименуем (или создадим) ветку:
      console.log(`Сейчас ветка "${currentBranch}", переименовываем/переключаем на "${branchName}"…`);
      run(`git branch -M ${branchName}`);
    } else {
      console.log(`Текущая ветка уже "${branchName}".`);
    }
  } catch (err) {
    // Если нет ни одной ветки (пустой репозиторий), создаём ветку:
    console.log(`Не удалось определить текущую ветку: создаём ветку "${branchName}"…`);
    run(`git checkout -b ${branchName}`);
  }

  // 4) Добавим все файлы (кроме тех, что в .gitignore) в индекс
  console.log('Добавляем все файлы в git индекс:');
  run('git add .');

  // 5) Создаём коммит
  // Попытаемся получить сообщение последнего коммита, чтобы понять, нужен ли новый коммит
  let needCommit = true;
  try {
    // Если изменений нет, то git diff-index вернёт код 0, а вывод будет пуст.
    execSync('git diff-index --quiet HEAD --');
    // Код возврата 0 означает: нет изменений → не нужен новый коммит
    needCommit = false;
  } catch {
    // Код возврата 1 означает: есть изменения → нужно делать коммит
    needCommit = true;
  }

  if (needCommit) {
    console.log('Есть новые изменения — создаём новый коммит:');
    run(`git commit -m "Initial commit"`);
  } else {
    console.log('Изменений нет, новый коммит не нужен.');
  }

  // 6) Пушим в origin
  console.log(`Пушим ветку "${branchName}" в origin…`);
  run(`git push -u origin ${branchName}`);

  console.log('\n✅ Проект успешно загружен в репозиторий GitHub!');
}

// Запускаем скрипт
uploadProjectToGithub();
