# Despliegue del portfolio en un VPS Ubuntu

Esta guía documenta el despliegue del portfolio de Jose Antonio Bejarano Vela en un VPS de Hostinger. El proyecto es un frontend estático generado con Astro y servido por Nginx.

## Datos del entorno

| Elemento | Valor |
| --- | --- |
| Sistema operativo | Ubuntu 24.04 LTS |
| IP pública | `72.62.235.87` |
| Usuario de despliegue | `deploy` |
| Dominio principal | `jabejarano.tech` |
| Dominio alternativo | `www.jabejarano.tech` |
| Repositorio en el VPS | `/var/www/PorfolioJABejarano` |
| Salida estática | `/var/www/PorfolioJABejarano/dist` |
| Servidor web | Nginx |
| HTTPS | Certbot y Let's Encrypt |
| Despliegue automático | GitHub Actions mediante SSH |

## Arquitectura del despliegue

```text
Push a main en GitHub
        |
        v
GitHub Actions
        |
        | SSH con una clave específica
        v
VPS Ubuntu (usuario deploy)
        |
        | git fetch + git reset + npm install + npm run build
        v
/var/www/PorfolioJABejarano/dist
        |
        v
Nginx + HTTPS
        |
        v
https://jabejarano.tech
```

Nginx no ejecuta un servidor Node.js. Astro genera archivos estáticos en `dist` y Nginx los entrega directamente.

## Estructura final en el VPS

```text
/var/www/PorfolioJABejarano/
├── .git/
├── .github/
├── public/
├── src/
├── dist/                  # Salida generada por npm run build
├── package.json
├── package-lock.json      # Si está disponible en el repositorio
└── astro.config.mjs
```

Comprobaciones básicas:

```bash
cd /var/www/PorfolioJABejarano
git status
git branch --show-current
ls -la
ls -la dist
```

## Usuario de despliegue

El despliegue se ejecuta con el usuario Linux `deploy`, no con `root`. Una configuración reproducible es:

```bash
sudo adduser deploy
sudo mkdir -p /home/deploy/.ssh
sudo touch /home/deploy/.ssh/authorized_keys
sudo chown -R deploy:deploy /home/deploy/.ssh
sudo chmod 700 /home/deploy/.ssh
sudo chmod 600 /home/deploy/.ssh/authorized_keys
```

El usuario debe tener permisos de lectura y escritura sobre el repositorio:

```bash
sudo mkdir -p /var/www/PorfolioJABejarano
sudo chown -R deploy:deploy /var/www/PorfolioJABejarano
```

La clave SSH específica para GitHub Actions se generó en Windows en:

```text
C:\Users\josea\.ssh\jabejarano_actions_ed25519
```

Su clave pública se añadió a:

```text
/home/deploy/.ssh/authorized_keys
```

La clave privada no debe copiarse al repositorio, imprimirse en logs ni compartirse. GitHub almacena su contenido en el secret `VPS_SSH_KEY`.

Para comprobar los permisos SSH en el VPS:

```bash
ls -ld /home/deploy/.ssh
ls -l /home/deploy/.ssh/authorized_keys
```

## Preparación del proyecto

Con Git, Node.js y npm instalados en el VPS, el repositorio debe quedar en la ruta usada por el workflow:

```bash
sudo -u deploy git clone \
  https://github.com/JABejaranoVela/PorfolioJABejarano.git \
  /var/www/PorfolioJABejarano
```

Primera instalación y build:

```bash
sudo -iu deploy
cd /var/www/PorfolioJABejarano
npm install
npm run build
exit
```

Antes de automatizar el despliegue conviene comprobar:

```bash
node --version
npm --version
test -f /var/www/PorfolioJABejarano/dist/index.html
```

## Configuración de Nginx

La configuración exacta puede variar si Certbot ya la ha modificado. Este bloque representa la configuración HTTP mínima equivalente para el portfolio:

```nginx
server {
    listen 80;
    listen [::]:80;

    server_name jabejarano.tech www.jabejarano.tech;

    root /var/www/PorfolioJABejarano/dist;
    index index.html;

    location / {
        try_files $uri $uri/ =404;
    }
}
```

Puede guardarse como:

```text
/etc/nginx/sites-available/jabejarano.tech
```

Activación y validación:

```bash
sudo ln -s /etc/nginx/sites-available/jabejarano.tech \
  /etc/nginx/sites-enabled/jabejarano.tech
sudo nginx -t
sudo systemctl reload nginx
sudo systemctl status nginx --no-pager
```

No se debe recargar Nginx si `sudo nginx -t` devuelve un error.

## DNS

Los registros DNS de ambos dominios deben resolver a la IP pública del VPS:

```text
jabejarano.tech      -> 72.62.235.87
www.jabejarano.tech  -> 72.62.235.87
```

Comprobación desde cualquier equipo con `dig`:

```bash
dig +short jabejarano.tech
dig +short www.jabejarano.tech
```

La propagación DNS puede tardar. Certbot debe ejecutarse después de que ambos nombres resuelvan correctamente al VPS.

## HTTPS con Certbot

Instalación de Certbot y su integración con Nginx:

```bash
sudo apt update
sudo apt install certbot python3-certbot-nginx
```

Emisión del certificado para los dos dominios:

```bash
sudo certbot --nginx \
  -d jabejarano.tech \
  -d www.jabejarano.tech
```

Certbot valida los dominios, obtiene el certificado de Let's Encrypt y ajusta Nginx para servir HTTPS. Después se debe validar la configuración:

```bash
sudo nginx -t
sudo systemctl reload nginx
sudo certbot certificates
```

### Renovación automática

Ubuntu instala normalmente un timer de systemd para renovar certificados. Se puede comprobar con:

```bash
sudo systemctl status certbot.timer
sudo systemctl list-timers | grep certbot
sudo certbot renew --dry-run
```

El `dry-run` verifica la renovación sin reemplazar el certificado vigente.

## Firewall UFW

El firewall permite únicamente SSH y el perfil completo de Nginx, que abre HTTP y HTTPS:

```bash
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw enable
sudo ufw status verbose
```

Es importante permitir `OpenSSH` antes de activar UFW para no perder el acceso remoto.

## Despliegue automático con GitHub Actions

El workflow está definido en `.github/workflows/deploy.yml`. Se ejecuta:

- automáticamente con cada push a `main`;
- manualmente mediante `workflow_dispatch`.

### Secrets necesarios

En GitHub, dentro de **Settings > Secrets and variables > Actions**, están configurados:

| Secret | Contenido esperado |
| --- | --- |
| `VPS_HOST` | IP o hostname del VPS, actualmente `72.62.235.87` |
| `VPS_USER` | Usuario SSH, actualmente `deploy` |
| `VPS_SSH_KEY` | Contenido completo de la clave privada específica de GitHub Actions |

No se deben guardar los valores de estos secrets en archivos versionados.

### Flujo del workflow

GitHub Actions:

1. Crea `~/.ssh` en el runner.
2. Escribe temporalmente `VPS_SSH_KEY` con permisos `600`.
3. Añade el servidor a `known_hosts` mediante `ssh-keyscan`.
4. Se conecta al VPS como `deploy`.
5. Ejecuta:

```bash
set -e
cd /var/www/PorfolioJABejarano
git fetch origin main
git reset --hard origin/main
npm install
npm run build
```

`set -e` detiene el despliegue si falla cualquier comando. Nginx sirve el directorio `dist`, por lo que no necesita reiniciarse cuando solo cambia el contenido estático.

## Comprobar el despliegue

Desde el VPS:

```bash
cd /var/www/PorfolioJABejarano
git rev-parse --short HEAD
git status
ls -lah dist
test -f dist/index.html && echo "Build disponible"
sudo nginx -t
sudo systemctl is-active nginx
```

Desde otro equipo:

```bash
curl -I https://jabejarano.tech
curl -I https://www.jabejarano.tech
```

También se deben abrir en un navegador:

- `https://jabejarano.tech`
- `https://www.jabejarano.tech`
- `https://jabejarano.tech/projects/skillmatch-ai`
- `https://jabejarano.tech/projects/social-media-dashboard`

## Logs de Nginx

Últimos accesos:

```bash
sudo tail -n 100 /var/log/nginx/access.log
```

Últimos errores:

```bash
sudo tail -n 100 /var/log/nginx/error.log
```

Seguimiento en tiempo real:

```bash
sudo tail -f /var/log/nginx/error.log
```

Logs del servicio:

```bash
sudo journalctl -u nginx --since "30 minutes ago"
```

## Rollback básico

Para volver temporalmente a un commit anterior en el VPS:

```bash
cd /var/www/PorfolioJABejarano
git log --oneline -n 10
git reset --hard <commit>
npm install
npm run build
```

Comprobar después:

```bash
git rev-parse --short HEAD
test -f dist/index.html
curl -I https://jabejarano.tech
```

Este rollback es temporal: el siguiente despliegue ejecutará `git reset --hard origin/main` y restaurará el estado actual de `main`. Para un rollback permanente se debe revertir el commit problemático en GitHub y hacer push a `main`.

## Troubleshooting

### Nginx no recarga por un error de sintaxis

Validar la configuración y revisar el archivo indicado en el error:

```bash
sudo nginx -t
sudo journalctl -u nginx -n 100 --no-pager
```

No ejecutar `reload` hasta que `nginx -t` confirme que la sintaxis es correcta. También se deben revisar enlaces rotos en `/etc/nginx/sites-enabled/`.

### El dominio no apunta al VPS

Comprobar DNS:

```bash
dig +short jabejarano.tech
dig +short www.jabejarano.tech
```

Ambos deben devolver `72.62.235.87`. Si devuelven otra IP o no responden, se deben corregir los registros DNS en Hostinger y esperar su propagación.

### Certbot falla al emitir el certificado

Comprobar que:

- ambos dominios resuelven a `72.62.235.87`;
- Nginx responde por el puerto 80;
- UFW permite `Nginx Full`;
- `server_name` incluye los dos dominios;
- `sudo nginx -t` no devuelve errores.

Comandos de diagnóstico:

```bash
sudo ufw status verbose
sudo nginx -t
curl -I http://jabejarano.tech
sudo certbot certificates
```

### GitHub Actions no puede conectarse por SSH

Revisar:

- que `VPS_HOST`, `VPS_USER` y `VPS_SSH_KEY` existen en GitHub;
- que el secret contiene la clave privada completa y conserva los saltos de línea;
- que la clave pública correspondiente está en `/home/deploy/.ssh/authorized_keys`;
- que `.ssh` tiene permisos `700` y `authorized_keys` permisos `600`;
- que UFW permite `OpenSSH`.

Prueba desde Windows:

```powershell
ssh -i $env:USERPROFILE\.ssh\jabejarano_actions_ed25519 deploy@72.62.235.87
```

### El build falla en producción

Ejecutar manualmente los mismos comandos del workflow:

```bash
sudo -iu deploy
cd /var/www/PorfolioJABejarano
git status
node --version
npm --version
npm install
npm run build
```

Revisar el primer error real del build, el espacio disponible con `df -h` y que `deploy` pueda escribir en el repositorio y en `dist`.

### El portfolio no muestra los cambios tras hacer push

Comprobar, en este orden:

1. Que el workflow de GitHub Actions terminó correctamente.
2. Que el push se hizo a `main`.
3. Que el VPS está en el commit esperado.
4. Que `dist` se regeneró.
5. Que Nginx sigue apuntando al directorio correcto.

```bash
cd /var/www/PorfolioJABejarano
git rev-parse --short HEAD
git log -1 --oneline
ls -lah dist/index.html
grep -R "root /var/www/PorfolioJABejarano/dist" /etc/nginx/sites-enabled/
sudo nginx -t
```

Si el commit y `dist` son correctos, hacer una recarga forzada del navegador o comprobar la respuesta con `curl` para descartar caché local.
