#!/bin/bash

echo "=== Current HEAD ==="
git rev-parse HEAD
echo ""

echo "=== Current branch ==="
git branch --show-current
echo ""

echo "=== Recent commits (git log --all --oneline -20) ==="
git log --all --oneline -20
echo ""

echo "=== Git reflog (last 20 entries) ==="
git reflog -20
echo ""

echo "=== Commits after 9699f74 ==="
git log --all --oneline 9699f74..HEAD 2>/dev/null || echo "Could not find commit 9699f74 or it's the current HEAD"
