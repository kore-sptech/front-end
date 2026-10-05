# Deploy React + Nginx (guia rápido)
 
> Exemplos para **Vite** (`dist/`). Se for CRA, troque `dist` por `build`.
 
## 1. Build
 
```bash
npm install
npm run build
```
 
---
 
## 2. Nginx no servidor
 
**Instalar:**
 
```bash
sudo apt update && sudo apt install nginx -y
```
 
**Copiar o build:**
 
```bash
sudo rm -rf /usr/share/nginx/html/*
sudo cp -r dist/* /usr/share/nginx/html/
```
 
**Criar a config** (`/etc/nginx/conf.d/meu-app.conf`):
 
```bash
sudo tee /etc/nginx/conf.d/meu-app.conf > /dev/null << 'CONF'
server {
    listen 80;
    server_name _;
 
    root /usr/share/nginx/html;
    index index.html;
 
    location / {
        try_files $uri $uri/ /index.html;
    }
}
CONF
```
 
**Aplicar:**
 
```bash
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t && sudo systemctl reload nginx
```
 
Acesse: `http://localhost`
 
**Novo deploy:**
 
```bash
npm run build
sudo rm -rf /usr/share/nginx/html/* && sudo cp -r dist/* /usr/share/nginx/html/
```
 
---
