#!/bin/bash

# Mirror Commits Tool
# Mirrors commit timestamps from your work repos to personal GitHub
# NO CODE, NO SECRETS - just timestamps for contribution graph

set -e

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
RED='\033[0;31m'
CYAN='\033[0;36m'
NC='\033[0m'

# Default values
EMAILS=""
REPOS=""
MIRROR_NAME=""
GITHUB_USERNAME=""
GITHUB_TOKEN=""
AUTO_PUSH=false
DRY_RUN=false
PRIVATE=false

# Parse arguments
while [[ $# -gt 0 ]]; do
  case $1 in
    --emails)
      EMAILS="$2"
      shift 2
      ;;
    --repos)
      REPOS="$2"
      shift 2
      ;;
    --name)
      MIRROR_NAME="$2"
      shift 2
      ;;
    --username)
      GITHUB_USERNAME="$2"
      shift 2
      ;;
    --token)
      GITHUB_TOKEN="$2"
      shift 2
      ;;
    --auto-push)
      AUTO_PUSH=true
      shift
      ;;
    --dry-run)
      DRY_RUN=true
      shift
      ;;
    --private)
      PRIVATE=true
      shift
      ;;
    *)
      echo "Unknown option: $1"
      exit 1
      ;;
  esac
done

# Validation
if [ -z "$EMAILS" ]; then
  echo -e "${RED}Error: --emails is required${NC}"
  exit 1
fi

if [ -z "$REPOS" ]; then
  echo -e "${RED}Error: --repos is required${NC}"
  exit 1
fi

if [ -z "$MIRROR_NAME" ]; then
  echo -e "${RED}Error: --name is required${NC}"
  exit 1
fi

if [ -z "$GITHUB_USERNAME" ]; then
  echo -e "${RED}Error: --username is required${NC}"
  exit 1
fi

if [ "$AUTO_PUSH" = true ] && [ -z "$GITHUB_USERNAME" ]; then
  echo -e "${RED}Error: --username required for auto-push${NC}"
  exit 1
fi

if [ "$AUTO_PUSH" = true ] && [ -z "$GITHUB_TOKEN" ]; then
  echo -e "${RED}Error: --token required for auto-push${NC}"
  exit 1
fi

# Banner
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}  Mirror Commits - Contribution Graph Fix${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

# Parse inputs
IFS=',' read -ra EMAIL_ARRAY <<< "$EMAILS"
IFS=',' read -ra REPO_ARRAY <<< "$REPOS"

GREP_PATTERN=$(IFS='|'; echo "${EMAIL_ARRAY[*]}")

echo -e "${CYAN}Configuration:${NC}"
echo -e "  Emails: ${#EMAIL_ARRAY[@]}"
echo -e "  Repos: ${#REPO_ARRAY[@]}"
echo -e "  Mirror: $MIRROR_NAME"
if [ "$DRY_RUN" = true ]; then
  echo -e "  ${YELLOW}Mode: DRY RUN (preview only)${NC}"
fi
echo ""

# Create temp file
TEMP_FILE=$(mktemp)
TEMP_DIR=$(mktemp -d)

echo -e "${CYAN}Scanning repos...${NC}"
TOTAL_COMMITS=0

for repo in "${REPO_ARRAY[@]}"; do
  repo=$(echo "$repo" | xargs) # trim whitespace

  # Detect if it's a URL or local path
  if [[ "$repo" =~ ^https?:// ]]; then
    # It's a URL - clone it temporarily
    REPO_NAME=$(basename "$repo" .git)
    CLONE_DIR="$TEMP_DIR/$REPO_NAME"

    echo -e "  ${CYAN}Cloning${NC} $repo..."

    # Try to clone (supports both public and private with token)
    if [ -n "$GITHUB_TOKEN" ]; then
      # Clone with token for private repos
      CLONE_URL=$(echo "$repo" | sed "s|https://|https://$GITHUB_TOKEN@|")
      git clone -q "$CLONE_URL" "$CLONE_DIR" 2>/dev/null
    else
      # Clone without token (public only)
      git clone -q "$repo" "$CLONE_DIR" 2>/dev/null
    fi

    if [ ! -d "$CLONE_DIR/.git" ]; then
      echo -e "  ${YELLOW}⊘${NC} $repo: failed to clone (may be private - try using --token)"
      continue
    fi

    WORK_DIR="$CLONE_DIR"
  else
    # It's a local path
    if [ ! -d "$repo/.git" ]; then
      echo -e "  ${YELLOW}⊘${NC} $repo: not found"
      continue
    fi
    WORK_DIR="$repo"
  fi

  cd "$WORK_DIR"
  COUNT=$(git log --format="%ae" | grep -E "($GREP_PATTERN)" 2>/dev/null | wc -l || echo 0)

  if [ "$COUNT" -gt 0 ]; then
    echo -e "  ${GREEN}✓${NC} $repo: $COUNT commits"
    git log --reverse --format="%ai|%ae|$repo" | grep -E "($GREP_PATTERN)" >> "$TEMP_FILE" 2>/dev/null || true
    TOTAL_COMMITS=$((TOTAL_COMMITS + COUNT))
  else
    echo -e "  ${YELLOW}○${NC} $repo: 0 commits"
  fi

  cd - > /dev/null
done

# Cleanup temp clones
if [ -d "$TEMP_DIR" ]; then
  rm -rf "$TEMP_DIR"
fi

echo ""
echo -e "${GREEN}Total: $TOTAL_COMMITS commits${NC}"
echo ""

if [ "$TOTAL_COMMITS" -eq 0 ]; then
  echo -e "${RED}No commits found. Exiting.${NC}"
  rm "$TEMP_FILE"
  exit 1
fi

if [ "$DRY_RUN" = true ]; then
  echo -e "${YELLOW}DRY RUN - Would create:${NC}"
  echo -e "  Repository: $MIRROR_NAME"
  echo -e "  Commits: $TOTAL_COMMITS"
  echo -e "  Date range: $(head -1 "$TEMP_FILE" | cut -d'|' -f1 | cut -d' ' -f1) to $(tail -1 "$TEMP_FILE" | cut -d'|' -f1 | cut -d' ' -f1)"
  rm "$TEMP_FILE"
  exit 0
fi

# Check if directory exists
if [ -d "$MIRROR_NAME" ]; then
  echo -e "${RED}Error: Directory $MIRROR_NAME already exists${NC}"
  rm "$TEMP_FILE"
  exit 1
fi

# Create mirror repo
echo -e "${BLUE}Creating mirror repository...${NC}"
mkdir -p "$MIRROR_NAME"
cd "$MIRROR_NAME"
git init -q

# Create README
cat > README.md << EOF
# ${MIRROR_NAME} 🚀

This repository mirrors commit activity to maintain an accurate GitHub contribution graph.

## ⚠️ Important Notice

**This repository contains NO source code, commit messages, or file names.**

Only commit timestamps are preserved to demonstrate development activity.

## 📊 Stats

- **Total Commits:** $TOTAL_COMMITS
- **Purpose:** Showcase consistent work contributions

## Why?

These commits were made using work/corporate email addresses. This mirror ensures all work is visible on the GitHub contribution graph.

---

*Generated with [Mirror Commits Tool](https://your-domain.vercel.app)*
*No intellectual property exposed*
EOF

git add README.md
git commit -q -m "Initial commit: Mirror setup" --date="$(date)"

echo -e "${BLUE}Creating $TOTAL_COMMITS mirror commits...${NC}"

# Sort and create commits
sort "$TEMP_FILE" > "${TEMP_FILE}.sorted"

COUNTER=0
while IFS='|' read -r date email repo; do
  git commit --allow-empty -q -m "Work on $repo" --date="$date"
  COUNTER=$((COUNTER + 1))

  if [ $((COUNTER % 20)) -eq 0 ]; then
    echo -ne "${GREEN}$COUNTER/${TOTAL_COMMITS}${NC}\r"
  fi
done < "${TEMP_FILE}.sorted"

echo -e "${GREEN}✓ Created $TOTAL_COMMITS commits${NC}"
echo ""

# Cleanup
rm "$TEMP_FILE" "${TEMP_FILE}.sorted"

# Auto-push if enabled
if [ "$AUTO_PUSH" = true ]; then
  echo -e "${BLUE}Creating GitHub repository...${NC}"

  VISIBILITY="public"
  if [ "$PRIVATE" = true ]; then
    VISIBILITY="private"
  fi

  # Create repo using GitHub API
  curl -s -X POST \
    -H "Authorization: token $GITHUB_TOKEN" \
    -H "Accept: application/vnd.github.v3+json" \
    https://api.github.com/user/repos \
    -d "{\"name\":\"$MIRROR_NAME\",\"private\":$([ "$PRIVATE" = true ] && echo "true" || echo "false")}" \
    > /dev/null

  echo -e "${GREEN}✓ Repository created${NC}"
  echo -e "${BLUE}Pushing commits...${NC}"

  git remote add origin "https://$GITHUB_TOKEN@github.com/$GITHUB_USERNAME/$MIRROR_NAME.git"
  git branch -M main
  git push -u origin main -q

  echo -e "${GREEN}✓ Pushed to GitHub${NC}"
  echo ""
  echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
  echo -e "${GREEN}✓ Success!${NC}"
  echo ""
  echo -e "${YELLOW}View at:${NC} https://github.com/$GITHUB_USERNAME/$MIRROR_NAME"
  echo ""
else
  echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
  echo -e "${GREEN}✓ Success!${NC} Local repository created."
  echo ""
  echo -e "${YELLOW}To push manually:${NC}"
  echo ""
  echo "cd \"$MIRROR_NAME\""
  echo "git remote add origin https://github.com/$GITHUB_USERNAME/$MIRROR_NAME.git"
  echo "git branch -M main"
  echo "git push -u origin main"
  echo ""
fi

echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
