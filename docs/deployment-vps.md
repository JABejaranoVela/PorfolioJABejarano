# Despliegue del portfolio en un VPS Ubuntu

Esta guía documenta el despliegue del portfolio de Jose Antonio Bejarano Vela en un VPS de Hostinger. Astro se compila en GitHub Actions y el VPS recibe únicamente los archivos estáticos generados.

## Datos del entorno

| Elemento | Valor |
| --- | --- |
| Sistema operativo | Ubuntu 24.04 LTS |
| IP pública | `72.62.235.87` |
| Usuario de despliegue | `deploy` |
| Dominio principal | `jabejarano.tech` |
| Dominio alternativo | `www.jabejarano.tech` |
| Directorio base | `/var/www/PorfolioJABejarano` |
| Release activa | `/var/www/PorfolioJABejarano/current` |
| Contenido servido | `/var/www/PorfolioJABejarano/current/dist` |
| Servidor web | Nginx |
| HTTPS | Certbot y Let's Encrypt |

## Arquitectura

```text
Push a main
    |
    v
GitHub Actions (Node 22)
    |
    | npm ci -> npm run build -> dist/release.json
    | empaquetado, checksum y SCP
    v
VPS Ubuntu (usuario deploy)
    |
    | releases/<release_id>/dist
    | cambio atómico del symlink current
    v
Nginx -> current/dist
    |
    v
https://jabejarano.tech
```

El VPS no ejecuta `git fetch`, `git reset`, `npm install` ni `npm run build`. Tampoco necesita reiniciar Nginx en cada despliegue, porque la ruta pública `current/dist` permanece estable.

## Build reproducible

El repositorio fija Node 22 en `.nvmrc`. GitHub Actions usa ese archivo con `actions/setup-node`, por lo que todos los builds se ejecutan con la misma versión principal de Node.

`package-lock.json` está versionado y el workflow instala dependencias con:

```bash
npm ci
npm run build
test -f dist/index.html
```

`npm ci` instala exactamente las versiones del lockfile y falla si `package.json` y `package-lock.json` no están sincronizados.

## Estructura del VPS

```text
/var/www/PorfolioJABejarano/
|-- releases/
|   |-- 20260627_120000_1a2b3c4/
|   |   `-- dist/
|   |-- 20260627_123000_5d6e7f8/
|   |   `-- dist/
|   `-- bootstrap_20260627_110000/
|       `-- dist/
`-- current -> /var/www/PorfolioJABejarano/releases/20260627_123000_5d6e7f8
```

Cada release normal usa el formato:

```text
YYYYMMDD_HHMMSS_<sha-corto>
```

El directorio `current` es un symlink a la release publicada.

## Usuario `deploy` y permisos

El usuario `deploy` debe poder crear releases y actualizar los symlinks sin usar `sudo`:

```bash
sudo mkdir -p /var/www/PorfolioJABejarano/releases
sudo chown -R deploy:deploy /var/www/PorfolioJABejarano
sudo chmod 755 /var/www/PorfolioJABejarano
```

La clave pública usada por GitHub Actions está autorizada en:

```text
/home/deploy/.ssh/authorized_keys
```

Permisos recomendados:

```bash
sudo chown -R deploy:deploy /home/deploy/.ssh
sudo chmod 700 /home/deploy/.ssh
sudo chmod 600 /home/deploy/.ssh/authorized_keys
```

La clave privada se conserva exclusivamente en GitHub como `VPS_SSH_KEY`. Nunca debe añadirse al repositorio ni mostrarse en logs.

## Migración inicial sin cambiar el contenido publicado

Antes de cambiar Nginx, se debe convertir el `dist` actual en una release bootstrap. Ejecutar como `deploy`:

```bash
cd /var/www/PorfolioJABejarano
mkdir -p releases
RELEASE_ID="bootstrap_$(date -u +%Y%m%d_%H%M%S)"
mkdir -p "releases/$RELEASE_ID"
cp -a dist "releases/$RELEASE_ID/dist"
ln -sfn "/var/www/PorfolioJABejarano/releases/$RELEASE_ID" current.next
mv -Tf current.next current
test -f current/dist/index.html
```

Comprobar el resultado:

```bash
readlink -f current
ls -lah current/dist/index.html
```

Esta release permite cambiar Nginx sin alterar todavía los archivos servidos.

## Configuración de Nginx

Localizar primero el bloque activo:

```bash
sudo nginx -T | grep -n -A 20 -B 5 "server_name jabejarano.tech"
```

En los bloques que sirven `jabejarano.tech` y `www.jabejarano.tech`, cambiar únicamente el `root`:

```nginx
server {
    server_name jabejarano.tech www.jabejarano.tech;

    root /var/www/PorfolioJABejarano/current/dist;
    index index.html;

    location / {
        try_files $uri $uri/ =404;
    }
}
```

Certbot puede mantener directivas adicionales de HTTP, HTTPS y certificados. No deben eliminarse al cambiar el `root`.

Validar y recargar:

```bash
sudo nginx -t
sudo systemctl reload nginx
sudo systemctl status nginx --no-pager
curl -I https://jabejarano.tech
```

No se debe ejecutar `reload` si `nginx -t` devuelve un error.

## HTTPS y renovación

El certificado cubre los dos dominios y está gestionado por Certbot:

```bash
sudo certbot certificates
sudo systemctl status certbot.timer
sudo systemctl list-timers | grep certbot
sudo certbot renew --dry-run
```

Si hubiera que emitirlo de nuevo:

```bash
sudo certbot --nginx \
  -d jabejarano.tech \
  -d www.jabejarano.tech
```

## Firewall UFW

El firewall permite únicamente SSH y el perfil HTTP/HTTPS de Nginx:

```bash
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw status verbose
```

`OpenSSH` debe estar permitido antes de activar UFW.

## Secrets de GitHub Actions

Configurar en **Settings > Secrets and variables > Actions**:

| Secret | Contenido esperado |
| --- | --- |
| `VPS_HOST` | Host o IP del VPS |
| `VPS_USER` | Usuario `deploy` |
| `VPS_SSH_KEY` | Clave privada específica para GitHub Actions |
| `VPS_KNOWN_HOSTS` | Línea verificada de `known_hosts` para el VPS |

No se debe guardar ningún valor real en archivos versionados.

### Verificar la clave del host SSH

Obtener la huella directamente desde el VPS mediante una sesión confiable:

```bash
sudo ssh-keygen -lf /etc/ssh/ssh_host_ed25519_key.pub
```

Desde un equipo local se puede obtener la línea candidata:

```bash
ssh-keyscan -H 72.62.235.87
```

Antes de usarla, su huella debe coincidir con la mostrada directamente por el VPS. Una vez verificada, guardar la línea completa como secret `VPS_KNOWN_HOSTS`.

El workflow escribe este secret en `~/.ssh/known_hosts`. No ejecuta `ssh-keyscan` durante el despliegue, evitando confiar automáticamente en una clave recibida en ese momento.

## Flujo del workflow de despliegue

`.github/workflows/deploy.yml` se ejecuta con cada push a `main` y manualmente mediante `workflow_dispatch`.

1. Descarga el repositorio con `actions/checkout`.
2. Configura Node 22 desde `.nvmrc`.
3. Ejecuta `npm ci` y `npm run build`.
4. Comprueba `dist/index.html`.
5. Genera `dist/release.json`:

   ```json
   {
     "release": "20260627_123000_5d6e7f8",
     "sha": "5d6e7f8...",
     "deployed_at": "2026-06-27T12:30:00Z"
   }
   ```

6. Empaqueta `dist`, genera un checksum SHA-256 y sube ambos archivos a `/tmp`.
7. Verifica el checksum y extrae en una carpeta nueva de `releases`.
8. Comprueba `index.html` y `release.json` antes de publicar.
9. Cambia `current` mediante `current.next` y `mv -Tf`.
10. Comprueba la home y descarga `/release.json` por HTTPS.
11. Verifica que el JSON publicado contiene el `GITHUB_SHA` esperado.
12. Solo tras superar el health check elimina releases antiguas.

La concurrencia usa:

```yaml
concurrency:
  group: portfolio-production
  cancel-in-progress: false
```

Así, un despliegue en ejecución no se interrumpe durante la activación del symlink.

## Verificar la release activa

En el VPS:

```bash
cd /var/www/PorfolioJABejarano
readlink -f current
test -f current/dist/index.html
cat current/dist/release.json
```

Desde otro equipo:

```bash
curl --fail --location --head https://jabejarano.tech
curl --fail --location https://jabejarano.tech/release.json
```

El campo `sha` de la respuesta debe coincidir con el commit desplegado por GitHub Actions.

## Retención de releases

Después de un despliegue correcto se conservan las cinco releases más recientes. La limpieza:

- se ejecuta únicamente después del health check;
- opera solo dentro de `releases/`;
- nunca elimina el destino actual de `current`;
- puede conservar una sexta carpeta si se ha hecho rollback a una release antigua.

## Rollback manual

Listar releases y seleccionar el nombre completo de una release válida:

```bash
cd /var/www/PorfolioJABejarano
ls -1dt releases/*/

PREVIOUS="$(readlink -f current)"
TARGET="/var/www/PorfolioJABejarano/releases/<release>"

test -f "$TARGET/dist/index.html"

ln -sfn "$TARGET" current.next
mv -Tf current.next current

curl --fail --location --head https://jabejarano.tech || {
  ln -sfn "$PREVIOUS" current.next
  mv -Tf current.next current
  exit 1
}
```

Si la release incluye `release.json`, comprobar también:

```bash
cat "$TARGET/dist/release.json"
curl --fail --location https://jabejarano.tech/release.json
```

## Rollback desde GitHub Actions

`.github/workflows/rollback.yml` se ejecuta manualmente y solicita el nombre de la release. Solo acepta:

```text
^[0-9]{8}_[0-9]{6}_[a-f0-9]{7,40}$|^bootstrap_[0-9]{8}_[0-9]{6}$
```

El workflow valida el input tanto en GitHub como en el VPS, comprueba `dist/index.html`, cambia el symlink y restaura automáticamente la release anterior si el health check falla.

## Logs de Nginx

```bash
sudo tail -n 100 /var/log/nginx/access.log
sudo tail -n 100 /var/log/nginx/error.log
sudo tail -f /var/log/nginx/error.log
sudo journalctl -u nginx --since "30 minutes ago"
```

## Troubleshooting

### El workflow falla en `npm ci`

Comprobar que `package-lock.json` está versionado y sincronizado con `package.json`:

```bash
npm install --package-lock-only
npm ci
```

El lockfile actualizado debe revisarse y enviarse al repositorio.

### El build falla en GitHub Actions

Reproducir con Node 22:

```bash
nvm use
npm ci
npm run build
test -f dist/index.html
```

El VPS no interviene en esta fase.

### GitHub Actions no puede conectar por SSH

Comprobar:

- `VPS_HOST`, `VPS_USER`, `VPS_SSH_KEY` y `VPS_KNOWN_HOSTS`;
- correspondencia entre clave privada y `authorized_keys`;
- permisos `700` para `.ssh` y `600` para `authorized_keys`;
- huella del host tras cualquier reinstalación del VPS;
- que UFW permite `OpenSSH`.

### La subida termina pero la release no se activa

Revisar permisos y estructura:

```bash
ls -ld /var/www/PorfolioJABejarano
ls -ld /var/www/PorfolioJABejarano/releases
ls -la /var/www/PorfolioJABejarano
find /var/www/PorfolioJABejarano/releases -maxdepth 2 -name index.html
```

El usuario `deploy` debe poder crear directorios y reemplazar `current.next` y `current`.

### La web responde pero muestra una release anterior

Comparar el symlink, el archivo local y la respuesta pública:

```bash
cd /var/www/PorfolioJABejarano
readlink -f current
cat current/dist/release.json
curl --fail --location \
  "https://jabejarano.tech/release.json?nocache=$(date +%s)"
```

Si el symlink es correcto pero la respuesta no coincide, revisar el `root` activo con `sudo nginx -T` y cualquier caché o proxy situado delante de Nginx.

### Nginx no recarga

```bash
sudo nginx -t
sudo journalctl -u nginx -n 100 --no-pager
```

No recargar hasta corregir la ruta o sintaxis indicada.

### Falla el health check después de cambiar `current`

El workflow restaura automáticamente el symlink anterior y termina con error. Revisar:

```bash
readlink -f /var/www/PorfolioJABejarano/current
sudo tail -n 100 /var/log/nginx/error.log
curl -i https://jabejarano.tech/release.json
```

La release fallida se conserva para diagnóstico y no se ejecuta la limpieza de releases antiguas.
