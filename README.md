# Mirror Commits - Interactive Command Builder 🚀

An interactive web tool to generate commands for mirroring your work commits to your personal GitHub contribution graph.

## The Problem

You've been shipping code all year using a work email, but your personal GitHub looks empty. Recruiters and other developers can't see your consistent contributions because they're hidden in private corporate repositories.

## The Solution

**Mirror Commits** creates a new repository with empty commits that match the timestamps of your work commits. This updates your contribution graph to reflect your actual activity.

### What Gets Mirrored?
- ✅ Commit timestamps only
- ❌ NO source code
- ❌ NO commit messages
- ❌ NO file names
- ❌ NO company IP

**100% safe. Zero IP leakage.**

## Features

- 🎨 **Interactive UI**: Configure your mirror with a simple web interface
- 🔒 **Secure**: Nothing is sent to any server - all processing happens in YOUR terminal
- 🚀 **Auto-push**: Optional automatic GitHub repository creation and push
- 👁️ **Preview Mode**: Dry-run option to see what would happen
- 📦 **Multiple Repos**: Mirror commits from multiple repositories at once
- 🎯 **Smart Filtering**: Only mirror commits from specified email addresses

## Tech Stack

- **Next.js 15** - React framework
- **Tailwind CSS** - Styling
- **Bash** - Core mirroring script
- **Vercel** - Deployment platform

## Local Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Open http://localhost:3000
```

## Project Structure

```
mirror-commits-web/
├── src/
│   ├── app/
│   │   ├── layout.js          # Root layout
│   │   ├── page.js             # Main page
│   │   └── globals.css         # Global styles
│   └── components/
│       ├── CommandBuilder.jsx  # Input form
│       └── CommandPreview.jsx  # Command output & instructions
├── public/
│   └── scripts/
│       └── mirror.sh           # Core bash script
├── tailwind.config.js
├── postcss.config.js
└── vercel.json                 # Vercel configuration
```

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import project in Vercel
3. Deploy (automatic)

The script will be available at: `https://your-domain.vercel.app/mirror.sh`

## How It Works

1. **User configures** their settings in the web interface
2. **Command is generated** client-side (JavaScript)
3. **User downloads** the bash script
4. **User runs** the command in their terminal
5. **Script processes** local git repositories
6. **New repo created** with mirrored timestamps
7. **Optional auto-push** to GitHub using provided token

## Script Usage

### Basic Usage
```bash
bash mirror.sh \
  --emails "work@company.com,personal@gmail.com" \
  --repos "project1,project2,project3" \
  --name "work-mirror-2025"
```

### With Auto-Push
```bash
bash mirror.sh \
  --emails "work@company.com" \
  --repos "my-project" \
  --name "work-mirror-2025" \
  --username "your-github-username" \
  --token "ghp_your_token_here" \
  --auto-push
```

### Preview Mode (Dry Run)
```bash
bash mirror.sh \
  --emails "work@company.com" \
  --repos "my-project" \
  --name "test-mirror" \
  --dry-run
```

## Command Options

| Option | Description | Required |
|--------|-------------|----------|
| `--emails` | Comma-separated list of email addresses | Yes |
| `--repos` | Comma-separated list of repo directory names | Yes |
| `--name` | Name for the mirror repository | Yes |
| `--username` | GitHub username (for auto-push) | If `--auto-push` |
| `--token` | GitHub personal access token | If `--auto-push` |
| `--auto-push` | Automatically create repo and push to GitHub | No |
| `--private` | Create private repository | No |
| `--dry-run` | Preview without making changes | No |

## GitHub Token Setup

To use auto-push, you need a GitHub Personal Access Token:

1. Go to [GitHub Settings → Tokens](https://github.com/settings/tokens/new)
2. Create a token with `repo` scope
3. Copy the token
4. Paste it in the web interface or use directly in command

**Note:** Your token is never sent to any server. It's only used in your local terminal.

## Security

- ✅ All processing is local (runs in your terminal)
- ✅ Web interface is 100% client-side JavaScript
- ✅ No backend, no database, no data collection
- ✅ GitHub token is never stored or transmitted
- ✅ Only commit dates are extracted from your repos
- ✅ No source code or proprietary information is exposed

## Inspiration

Inspired by [@PetarRan](https://github.com/PetarRan).

## License

MIT

---

Made with 💚 by devs tired of empty contribution graphs
# mirror-commits-web
