#!/bin/bash

# Script to push your SENTIVENT project to GitHub
# Make sure you have access to the repository before running this script

echo "Starting push process for SENTIVENT project..."

# Stage your changes
git add .

# Commit your changes
git commit -m "Add MongoDB integration for user registration and login"

# First, try to fetch from remote to ensure we're up-to-date
git fetch origin main

# Try to merge
echo "Attempting to merge with remote changes..."
git merge origin/main --allow-unrelated-histories

# If there are conflicts, we'll abort and try a different approach
if [ $? -ne 0 ]; then
    echo "Merge conflicts detected. Aborting merge and trying force push..."
    git merge --abort
    
    # Create a new branch and force push
    git checkout -b mongodb-integration
    git add .
    git commit -m "Add MongoDB integration for user registration and login"
    
    # Force push to the new branch
    git push -u origin mongodb-integration
    
    echo "Changes pushed to new branch 'mongodb-integration'"
    echo "Please create a pull request on GitHub to merge these changes into main"
else
    # If merge was successful, push to main
    git push -u origin main
    echo "Changes pushed to main branch successfully"
fi

echo "Push process completed!" 