---
description: This workflow main goal is to psuh editted work to github/production at my command.
---

# Push to Production

#### Steps

1. stage modified and unstaged files <br>
` git add .`  

2. commit changes with a description suitable for the changes"<br>
` git commit -m "suitable description" `  

3. run the build command to check for errors that'll fail at build. <br>
 ` npm run build `

4. if error, make implementation plan about error fix.

5. if no errors, push to prod <br>
  ` git push `