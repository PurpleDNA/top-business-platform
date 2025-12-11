---
description: This workflow main goal is to psuh editted work to github/production at my command.
---

# Push to Production

#### Steps

1. Turn off Next.js dev server if running to avoid conflicts (optional but recommended for clean build)

2.1 check the git status <br>
// turbo
` git status `

2.2 Stage modified and unstaged files <br>
// turbo
` git add .`  

3. Commit changes with a description suitable for the changes"<br>
// turbo
` git commit -m "suitable description" `  

4. Pull any remote changes to avoid conflicts <br>
` git pull --rebase `

5. Run the build command to check for errors that'll fail at build. <br>
// turbo
 ` npm run build `

6. If error, make implementation plan about error fix.

7. If no errors, push to prod <br>
  ` git push `