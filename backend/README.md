# debug
- PowerShell (VS Code default):
```
$env:DEBUG = "*,-not_this"
```

# Deploying a multi-instance app in development (NOT in production):
- Setup config.json, especially the "ports" section (socket_io: no solution yet)
- In 'client\arbiter\.env' file set the port on which the frontend will be served
- In 'client\arbiter\package.json' file set the proxy on which the backend calls will be made

# Installing app for production:
1. Clone the repository:
```
   git clone
```
2. Enter arbiter directory:
```
   cd arbiter
```
3. Install dependencies:
```
   npm i
```
4. Create database with table(s):
```
   knex migrate:latest
```
5. Create and update config.json from config.example.json.
6. Enter client\arbiter directory:
```
   cd client\arbiter
```
7. Setup proxy for the client in package.json:
```
   "proxy": "http://localhost:3003"
```
8. Install client dependencies:
```
   npm i
```
9. Build the client app:
```
   npm run build
```
10. Start pm2 process manager:
```
   pm2 start npm --name arbiter -- run dev
```