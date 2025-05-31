const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Configuration
const config = {
    repository: 'https://github.com/YourNovelsWorld/Frontend.git',
    branch: 'main',
    buildDir: path.join(__dirname, 'build')
};

// Function to check if git is initialized
function isGitInitialized() {
    try {
        execSync('git rev-parse --is-inside-work-tree', { stdio: 'ignore' });
        return true;
    } catch (error) {
        return false;
    }
}

// Function to initialize git repository
function initializeGit() {
    try {
        if (!isGitInitialized()) {
            console.log('Initializing Git repository...');
            execSync('git init', { stdio: 'inherit' });
            execSync(`git remote add origin ${config.repository}`, { stdio: 'inherit' });
            execSync('git add .', { stdio: 'inherit' });
            execSync('git commit -m "Initial commit"', { stdio: 'inherit' });
            execSync(`git branch -M ${config.branch}`, { stdio: 'inherit' });
            console.log('Git repository initialized successfully');
        }
    } catch (error) {
        console.error('Error initializing Git:', error);
        process.exit(1);
    }
}

// Function to clean the repository
function cleanRepo() {
    try {
        // Remove build directory if exists
        if (fs.existsSync(config.buildDir)) {
            fs.rmSync(config.buildDir, { recursive: true, force: true });
        }
        
        if (isGitInitialized()) {
            // Clean git repository
            execSync('git clean -fd');
            execSync('git reset --hard HEAD');
        }
        
        console.log('Repository cleaned successfully');
    } catch (error) {
        console.error('Error cleaning repository:', error);
        process.exit(1);
    }
}

// Function to build and deploy to GitHub
async function deployToGithub() {
    try {
        // Initialize Git if needed
        initializeGit();
        
        // Clean the repository first
        cleanRepo();
        
        // Build the project
        console.log('Building the project...');
        execSync('npm run build', { stdio: 'inherit' });
        
        // Git commands
        console.log('Deploying to GitHub...');
        execSync('git add build/*', { stdio: 'inherit' });
        execSync('git commit -m "Build and deploy update"', { stdio: 'inherit' });
        execSync(`git push -u origin ${config.branch}`, { stdio: 'inherit' });
        
        console.log('Successfully deployed to GitHub!');
    } catch (error) {
        console.error('Deployment failed:', error);
        process.exit(1);
    }
}

// Run the deployment
deployToGithub(); 