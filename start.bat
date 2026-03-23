@echo off
echo Starting HelpDesk Application...
start cmd /k "cd server && npx nodemon src/index.js"
start cmd /k "cd client && npm run dev"
echo Servers are starting!
echo Frontend will be accessible at http://localhost:5173
pause
