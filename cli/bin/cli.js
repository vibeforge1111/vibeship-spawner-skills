#!/usr/bin/env node

const { execSync, spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');


const YES_MODE = process.argv.includes("--yes") || process.argv.includes("-y");
const REPO_URL = 'https://github.com/vibeforge1111/vibeship-spawner-skills.git';
const SKILLS_DIR = path.join(os.homedir(), '.spawner', 'skills');
const SPAWNER_DIR = path.join(os.homedir(), '.spawner');
const MCP_ENDPOINT = 'https://mcp.vibeship.co';

const COLORS = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  red: '\x1b[31m',
  dim: '\x1b[2m',
};

// Terminal hyperlink (OSC 8) - makes text clickable in supported terminals
function hyperlink(url, text) {
  // Check if terminal supports hyperlinks (most modern terminals do)
  const supportsHyperlinks = process.env.TERM_PROGRAM || process.env.WT_SESSION || process.env.COLORTERM;
  if (supportsHyperlinks) {
    return `\x1b]8;;${url}\x1b\\${text}\x1b]8;;\x1b\\`;
  }
  return text;
}

// Convert file path to file:// URL
function fileUrl(filePath) {
  // Handle Windows paths
  const normalizedPath = filePath.replace(/\\/g, '/');
  return `file://${normalizedPath.startsWith('/') ? '' : '/'}${normalizedPath}`;
}

function log(msg, color = '') {
  console.log(`${color}${msg}${COLORS.reset}`);
}

function logStep(step, msg) {
  log(`\n${COLORS.cyan}[${step}]${COLORS.reset} ${msg}`);
}

function logSuccess(msg) {
  log(`${COLORS.green}✓${COLORS.reset} ${msg}`);
}

function logError(msg) {
  log(`${COLORS.red}✗${COLORS.reset} ${msg}`);
}

function logInfo(msg) {
  log(`${COLORS.blue}ℹ${COLORS.reset} ${msg}`);
}

function logWarning(msg) {
  log(`${COLORS.yellow}⚠${COLORS.reset} ${msg}`);
}

function checkGitInstalled() {
  try {
    execSync('git --version', { stdio: 'pipe' });
    return true;
  } catch {
    return false;
  }
}

function skillsExist() {
  return fs.existsSync(SKILLS_DIR) && fs.existsSync(path.join(SKILLS_DIR, '.git'));
}

function countSkills() {
  if (!fs.existsSync(SKILLS_DIR)) return 0;

  let count = 0;
  const categories = fs.readdirSync(SKILLS_DIR).filter(f => {
    const fullPath = path.join(SKILLS_DIR, f);
    return fs.statSync(fullPath).isDirectory() && !f.startsWith('.') && f !== 'scripts' && f !== 'cli' && f !== 'dist';
  });

  for (const category of categories) {
    const categoryPath = path.join(SKILLS_DIR, category);
    const skills = fs.readdirSync(categoryPath).filter(f => {
      const skillPath = path.join(categoryPath, f);
      return fs.statSync(skillPath).isDirectory();
    });
    count += skills.length;
  }

  return count;
}

function printBanner() {
  console.log(`
${COLORS.magenta}┌─────────────────────────────────────────────────────────┐${COLORS.reset}
${COLORS.magenta}│${COLORS.reset}                                                         ${COLORS.magenta}│${COLORS.reset}
${COLORS.magenta}│${COLORS.reset}   ${COLORS.bright}VIBESHIP SPAWNER SKILLS${COLORS.reset}                              ${COLORS.magenta}│${COLORS.reset}
${COLORS.magenta}│${COLORS.reset}   ${COLORS.cyan}Specialist Skills for AI-Powered Product Building${COLORS.reset}     ${COLORS.magenta}│${COLORS.reset}
${COLORS.magenta}│${COLORS.reset}                                                         ${COLORS.magenta}│${COLORS.reset}
${COLORS.magenta}└─────────────────────────────────────────────────────────┘${COLORS.reset}
`);
}

function printUsage() {
  console.log(`
${COLORS.bright}Usage:${COLORS.reset}
  npx github:vibeforge1111/vibeship-spawner-skills <command> [options]

${COLORS.bright}Commands:${COLORS.reset}
  install [--mcp]      Install skills (add --mcp to also configure MCP server)
  update               Update skills to latest version
  setup-mcp            Configure Spawner MCP server for Claude
  status               Check installation and MCP status
  list                 List installed skill categories
  list <category>      List all skills in a category
  list --all           List all skills
  help                 Show this help message

${COLORS.bright}Options:${COLORS.reset}
  --mcp                Also configure Spawner MCP server (with install command)

${COLORS.bright}Examples:${COLORS.reset}
  npx github:vibeforge1111/vibeship-spawner-skills install --mcp   # Full setup
  npx github:vibeforge1111/vibeship-spawner-skills setup-mcp       # Just add MCP
  npx github:vibeforge1111/vibeship-spawner-skills list development

${COLORS.bright}MCP Server Features:${COLORS.reset}
  The MCP server (mcp.vibeship.co) provides additional tools:
  • spawner_validate    - Code validation and guardrails
  • spawner_remember    - Persistent project memory
  • spawner_watch_out   - Sharp edge detection
  • spawner_unstick     - Escape hatch when stuck
  • spawner_skills      - Skill search and retrieval

${COLORS.bright}After Installation:${COLORS.reset}
  Skills are available at: ~/.spawner/skills/

  Load skills in Claude:
    Read: ~/.spawner/skills/development/backend/skill.yaml
    Read: ~/.spawner/skills/development/backend/sharp-edges.yaml

${COLORS.bright}Documentation:${COLORS.reset}
  https://github.com/vibeforge1111/vibeship-spawner-skills
`);
}

// ==================== MCP Configuration ====================

function getClaudeDesktopConfigPath() {
  const platform = os.platform();

  if (platform === 'darwin') {
    // macOS
    return path.join(os.homedir(), 'Library', 'Application Support', 'Claude', 'claude_desktop_config.json');
  } else if (platform === 'win32') {
    // Windows
    return path.join(process.env.APPDATA || path.join(os.homedir(), 'AppData', 'Roaming'), 'Claude', 'claude_desktop_config.json');
  } else {
    // Linux
    return path.join(os.homedir(), '.config', 'Claude', 'claude_desktop_config.json');
  }
}

function getClaudeCodeConfigPath() {
  // Claude Code uses .mcp.json in the current directory or home directory
  const localConfig = path.join(process.cwd(), '.mcp.json');
  const homeConfig = path.join(os.homedir(), '.mcp.json');

  // Return local if it exists, otherwise home
  if (fs.existsSync(localConfig)) {
    return localConfig;
  }
  return homeConfig;
}

function detectClaudeEnvironment() {
  const environments = [];

  // Check for Claude Desktop
  const desktopPath = getClaudeDesktopConfigPath();
  const desktopDir = path.dirname(desktopPath);
  if (fs.existsSync(desktopDir)) {
    environments.push({ type: 'desktop', path: desktopPath, name: 'Claude Desktop' });
  }

  // Check for Claude Code (check if .mcp.json exists or if we're in a git repo)
  const localMcp = path.join(process.cwd(), '.mcp.json');
  const homeMcp = path.join(os.homedir(), '.mcp.json');

  if (fs.existsSync(localMcp)) {
    environments.push({ type: 'code-local', path: localMcp, name: 'Claude Code (project)' });
  }
  if (fs.existsSync(homeMcp)) {
    environments.push({ type: 'code-home', path: homeMcp, name: 'Claude Code (global)' });
  }

  // Always offer Claude Code global as an option
  if (!environments.find(e => e.type === 'code-home')) {
    environments.push({ type: 'code-home', path: homeMcp, name: 'Claude Code (global)', exists: false });
  }

  return environments;
}

function getMcpServerConfig() {
  return {
    spawner: {
      command: 'npx',
      args: ['-y', 'mcp-remote', MCP_ENDPOINT],
      description: 'Spawner V2 - Project memory, validation, skills, sharp edges'
    }
  };
}

function readJsonConfig(configPath) {
  try {
    if (fs.existsSync(configPath)) {
      const content = fs.readFileSync(configPath, 'utf8');
      return JSON.parse(content);
    }
  } catch (error) {
    // File exists but isn't valid JSON
    logWarning(`Config file exists but couldn't be parsed: ${configPath}`);
  }
  return null;
}

function writeJsonConfig(configPath, config) {
  const dir = path.dirname(configPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(configPath, JSON.stringify(config, null, 2) + '\n');
}

function mcpIsConfigured(configPath) {
  const config = readJsonConfig(configPath);
  if (!config) return false;

  return config.mcpServers && config.mcpServers.spawner;
}

async function setupMcp(targetEnv = null) {
  logStep('1/3', 'Detecting Claude environments...');

  const environments = detectClaudeEnvironment();

  if (environments.length === 0) {
    logError('No Claude environments detected.');
    logInfo('Install Claude Desktop or use Claude Code first.');
    process.exit(1);
  }

  // Show detected environments
  console.log('');
  log('Detected Claude environments:', COLORS.bright);
  environments.forEach((env, i) => {
    const status = mcpIsConfigured(env.path)
      ? `${COLORS.green}(MCP configured)${COLORS.reset}`
      : env.exists === false
        ? `${COLORS.dim}(will create)${COLORS.reset}`
        : `${COLORS.yellow}(MCP not configured)${COLORS.reset}`;
    console.log(`  ${i + 1}. ${env.name} ${status}`);
    console.log(`     ${COLORS.dim}${env.path}${COLORS.reset}`);
  });
  console.log('');

  // Configure each environment
  logStep('2/3', 'Configuring MCP server...');

  let configured = 0;
  const mcpConfig = getMcpServerConfig();

  for (const env of environments) {
    if (mcpIsConfigured(env.path)) {
      logInfo(`${env.name}: Already configured, skipping`);
      continue;
    }

    try {
      let config = readJsonConfig(env.path) || {};

      // Ensure mcpServers object exists
      if (!config.mcpServers) {
        config.mcpServers = {};
      }

      // Add spawner MCP
      config.mcpServers.spawner = mcpConfig.spawner;

      writeJsonConfig(env.path, config);
      logSuccess(`${env.name}: MCP configured`);
      configured++;
    } catch (error) {
      logError(`${env.name}: Failed to configure - ${error.message}`);
    }
  }

  logStep('3/3', 'Verifying configuration...');

  if (configured > 0) {
    console.log('');
    logSuccess(`MCP server configured for ${configured} environment(s)`);
    console.log(`
${COLORS.bright}MCP Endpoint:${COLORS.reset} ${MCP_ENDPOINT}

${COLORS.bright}Available Tools:${COLORS.reset}
  ${COLORS.cyan}spawner_orchestrate${COLORS.reset}  - Auto-routing entry point
  ${COLORS.cyan}spawner_validate${COLORS.reset}     - Code validation and guardrails
  ${COLORS.cyan}spawner_remember${COLORS.reset}     - Persistent project memory
  ${COLORS.cyan}spawner_watch_out${COLORS.reset}    - Sharp edge detection
  ${COLORS.cyan}spawner_unstick${COLORS.reset}      - Escape hatch when stuck
  ${COLORS.cyan}spawner_skills${COLORS.reset}       - Skill search and retrieval

${COLORS.bright}Next Steps:${COLORS.reset}
  1. Restart Claude Desktop (if configured)
  2. In Claude, the spawner tools will be automatically available
  3. Try: "Use spawner_orchestrate to help me build a SaaS"
`);
  } else {
    logInfo('No new configurations needed - MCP already set up');
  }
}

function checkMcpStatus() {
  const environments = detectClaudeEnvironment();

  console.log('');
  log('MCP Server Status', COLORS.bright);
  console.log('─'.repeat(50));

  let anyConfigured = false;

  for (const env of environments) {
    const configured = mcpIsConfigured(env.path);
    if (configured) anyConfigured = true;

    const status = configured
      ? `${COLORS.green}✓ Configured${COLORS.reset}`
      : `${COLORS.yellow}○ Not configured${COLORS.reset}`;

    console.log(`${env.name}: ${status}`);
    console.log(`  ${COLORS.dim}${env.path}${COLORS.reset}`);
  }

  console.log('─'.repeat(50));

  if (!anyConfigured) {
    logInfo('Run: npx github:vibeforge1111/vibeship-spawner-skills setup-mcp');
  }

  console.log('');
}

// ==================== Install Command ====================

async function install(withMcp = false) {
  const totalSteps = withMcp ? 4 : 3;

  logStep(`1/${totalSteps}`, 'Checking prerequisites...');

  if (!checkGitInstalled()) {
    logError('Git is not installed. Please install Git first.');
    logInfo('Download: https://git-scm.com/downloads');
    process.exit(1);
  }
  logSuccess('Git is installed');

  let alreadyInstalled = false;
  if (skillsExist()) {
    logInfo('Skills already installed at ' + SKILLS_DIR);
    logInfo('Run "update" command to get the latest version');
    const count = countSkills();
    logSuccess(`${count} skills available`);
    alreadyInstalled = true;
  }

  if (!alreadyInstalled) {
    logStep(`2/${totalSteps}`, 'Creating directory structure...');

    if (!fs.existsSync(SPAWNER_DIR)) {
      fs.mkdirSync(SPAWNER_DIR, { recursive: true });
      logSuccess('Created ~/.spawner/');
    }

    logStep(`3/${totalSteps}`, 'Cloning skills repository...');
    logInfo('This may take a moment...');

    try {
      execSync(`git clone ${REPO_URL} "${SKILLS_DIR}"`, {
        stdio: 'inherit',
        cwd: SPAWNER_DIR
      });

      const count = countSkills();
      console.log('');
      logSuccess(`Installation complete! ${count} skills installed.`);
    } catch (error) {
      logError('Failed to clone repository');
      logInfo('Check your internet connection and try again');
      process.exit(1);
    }
  }

  // Configure MCP if requested
  if (withMcp) {
    logStep(`${totalSteps}/${totalSteps}`, 'Configuring MCP server...');
    await setupMcp();
  }

  // Print final instructions
  const count = countSkills();
  console.log(`
${COLORS.bright}Skills Location:${COLORS.reset} ${SKILLS_DIR}

${COLORS.bright}Quick Start:${COLORS.reset}
  In Claude, load a skill by reading its YAML files:

  ${COLORS.cyan}Read: ~/.spawner/skills/development/backend/skill.yaml
  Read: ~/.spawner/skills/development/backend/sharp-edges.yaml${COLORS.reset}

  Then ask Claude to build something - it now has specialist knowledge!

${COLORS.bright}Popular Skills:${COLORS.reset}
  development/backend      - Backend/API development
  development/frontend     - Frontend/UI development
  data/postgres-wizard     - PostgreSQL expert
  ai/llm-architect         - LLM integration
  agents/autonomous-agents - AI agents

${COLORS.bright}Full Guide:${COLORS.reset}
  ${SKILLS_DIR}/GETTING_STARTED.md
${withMcp ? '' : `
${COLORS.bright}Want MCP features?${COLORS.reset} (project memory, validation, sharp edges)
  Run: npx github:vibeforge1111/vibeship-spawner-skills setup-mcp
`}
${COLORS.bright}Update Skills:${COLORS.reset}
  npx github:vibeforge1111/vibeship-spawner-skills update
`);
}

async function update() {
  logStep('1/2', 'Checking installation...');

  if (!skillsExist()) {
    logError('Skills not installed. Run install command first.');
    process.exit(1);
  }

  logSuccess('Skills directory found');

  logStep('2/2', 'Pulling latest changes...');

  try {
    execSync('git pull', {
      stdio: 'inherit',
      cwd: SKILLS_DIR
    });

    const count = countSkills();
    console.log('');
    logSuccess(`Update complete! ${count} skills available.`);
  } catch (error) {
    logError('Failed to update. Check your internet connection.');
    process.exit(1);
  }
}

function status() {
  console.log('');
  log('Spawner Skills Status', COLORS.bright);
  console.log('─'.repeat(50));

  if (skillsExist()) {
    logSuccess(`Installed at: ${SKILLS_DIR}`);
    const count = countSkills();
    logSuccess(`Skills count: ${count}`);

    // Get git info
    try {
      const branch = execSync('git branch --show-current', {
        cwd: SKILLS_DIR,
        encoding: 'utf8'
      }).trim();
      const lastCommit = execSync('git log -1 --format="%h %s" --date=short', {
        cwd: SKILLS_DIR,
        encoding: 'utf8'
      }).trim();

      logInfo(`Branch: ${branch}`);
      logInfo(`Last update: ${lastCommit}`);
    } catch {}
  } else {
    logError('Skills not installed');
    logInfo('Run: npx github:vibeforge1111/vibeship-spawner-skills install');
  }

  // Also show MCP status
  checkMcpStatus();
}

function getCategories() {
  return fs.readdirSync(SKILLS_DIR)
    .filter(f => {
      const fullPath = path.join(SKILLS_DIR, f);
      return fs.statSync(fullPath).isDirectory() &&
             !f.startsWith('.') &&
             f !== 'scripts' &&
             f !== 'cli' &&
             f !== 'dist';
    })
    .sort();
}

function getSkillsInCategory(category) {
  const categoryPath = path.join(SKILLS_DIR, category);
  if (!fs.existsSync(categoryPath)) return [];

  return fs.readdirSync(categoryPath)
    .filter(f => {
      const skillPath = path.join(categoryPath, f);
      return fs.statSync(skillPath).isDirectory();
    })
    .sort();
}

function list(categoryArg, showAll) {
  if (!skillsExist()) {
    logError('Skills not installed. Run install command first.');
    process.exit(1);
  }

  const categories = getCategories();

  // Show clickable directory path
  console.log('');
  const clickablePath = hyperlink(fileUrl(SKILLS_DIR), SKILLS_DIR);
  console.log(`${COLORS.dim}Location:${COLORS.reset} ${COLORS.cyan}${clickablePath}${COLORS.reset}`);
  console.log('');

  // List specific category
  if (categoryArg && categoryArg !== '--all') {
    if (!categories.includes(categoryArg)) {
      logError(`Category "${categoryArg}" not found.`);
      console.log('');
      log('Available categories:', COLORS.bright);
      console.log(categories.map(c => `  ${COLORS.cyan}${c}${COLORS.reset}`).join('\n'));
      console.log('');
      process.exit(1);
    }

    const skills = getSkillsInCategory(categoryArg);
    const categoryPath = path.join(SKILLS_DIR, categoryArg);

    log(`${categoryArg} (${skills.length} skills)`, COLORS.bright);
    console.log('─'.repeat(50));

    for (const skill of skills) {
      const skillPath = path.join(categoryPath, skill);
      const skillYaml = path.join(skillPath, 'skill.yaml');

      // Try to get description from skill.yaml
      let description = '';
      if (fs.existsSync(skillYaml)) {
        try {
          const content = fs.readFileSync(skillYaml, 'utf8');
          // Try single-line description first
          let descMatch = content.match(/^description:\s*["']?([^|\n][^\n]*)["']?\s*$/m);
          // If not found or it's a pipe (multiline), try to get the first line after description: |
          if (!descMatch || descMatch[1].trim() === '|') {
            const multilineMatch = content.match(/^description:\s*\|\s*\n\s+(.+)$/m);
            if (multilineMatch) {
              descMatch = multilineMatch;
            }
          }
          if (descMatch && descMatch[1] && descMatch[1].trim() !== '|') {
            description = descMatch[1].trim().substring(0, 50);
            if (descMatch[1].length > 50) description += '...';
          }
        } catch {}
      }

      const clickableSkill = hyperlink(fileUrl(skillPath), skill);
      if (description) {
        console.log(`  ${COLORS.cyan}${clickableSkill}${COLORS.reset} ${COLORS.dim}- ${description}${COLORS.reset}`);
      } else {
        console.log(`  ${COLORS.cyan}${clickableSkill}${COLORS.reset}`);
      }
    }

    console.log('');
    logInfo(`Load with: Read ~/.spawner/skills/${categoryArg}/<skill>/skill.yaml`);
    console.log('');
    return;
  }

  // List all skills (--all flag)
  if (showAll) {
    log('All Skills', COLORS.bright);
    console.log('─'.repeat(50));

    let totalSkills = 0;

    for (const category of categories) {
      const skills = getSkillsInCategory(category);
      totalSkills += skills.length;

      console.log(`\n${COLORS.bright}${category}${COLORS.reset} (${skills.length})`);

      for (const skill of skills) {
        const skillPath = path.join(SKILLS_DIR, category, skill);
        const clickableSkill = hyperlink(fileUrl(skillPath), skill);
        console.log(`  ${COLORS.cyan}${clickableSkill}${COLORS.reset}`);
      }
    }

    console.log('');
    console.log('─'.repeat(50));
    logSuccess(`Total: ${totalSkills} skills across ${categories.length} categories`);
    console.log('');
    return;
  }

  // Default: list categories only
  log('Installed Skill Categories', COLORS.bright);
  console.log('─'.repeat(50));

  let totalSkills = 0;

  for (const category of categories) {
    const skills = getSkillsInCategory(category);
    totalSkills += skills.length;

    const categoryPath = path.join(SKILLS_DIR, category);
    const clickableCategory = hyperlink(fileUrl(categoryPath), category);
    console.log(`${COLORS.cyan}${clickableCategory}${COLORS.reset} (${skills.length} skills)`);
  }

  console.log('─'.repeat(50));
  logSuccess(`Total: ${totalSkills} skills across ${categories.length} categories`);
  console.log('');
  logInfo(`List skills in a category: list <category>`);
  logInfo(`List all skills: list --all`);
  console.log('');
}

// ==================== Main ====================

const args = process.argv.slice(2);
const command = args[0] || 'help';
const hasFlag = (flag) => args.includes(flag) || args.includes(`--${flag}`);

printBanner();

switch (command) {
  case 'install':
  case 'i':
    const withMcp = hasFlag('mcp') || hasFlag('--mcp');
    install(withMcp);
    break;
  case 'update':
  case 'u':
  case 'upgrade':
    update();
    break;
  case 'setup-mcp':
  case 'mcp':
    setupMcp();
    break;
  case 'status':
  case 's':
    status();
    break;
  case 'list':
  case 'ls':
  case 'l':
    const listArg = args[1];
    const showAll = args.includes('--all') || args.includes('-a');
    list(listArg, showAll);
    break;
  case 'help':
  case 'h':
  case '--help':
  case '-h':
    printUsage();
    break;
  default:
    logError(`Unknown command: ${command}`);
    printUsage();
    process.exit(1);
}
