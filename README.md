# Next.js con Docker y pnpm

Contador interactivo creado con `create-next-app`, Next.js 14 y pnpm. Permite sumar, restar, definir el paso y reiniciar la cuenta. El valor y el paso se conservan en el almacenamiento local del navegador. La imagen usa Node.js 22 Alpine, una versión con soporte vigente.

## Desarrollo local

```bash
pnpm install
pnpm dev
```

Abre http://localhost:3000.

## Docker

Construye la imagen desde la raíz del proyecto:

```bash
docker build -t nextjs-pnpm-demo .
```

Inicia el contenedor y publica el puerto 3000:

```bash
docker run --rm -p 3000:3000 nextjs-pnpm-demo
```

Visita http://localhost:3000. Para detener el contenedor, pulsa `Ctrl+C`.

El Dockerfile utiliza varias etapas, instala dependencias de forma reproducible desde el lockfile con pnpm, deja solo dependencias de producción en la imagen final, compila Next.js y ejecuta `pnpm start` como usuario no root. El archivo `.dockerignore` evita enviar dependencias locales, compilaciones, archivos de entorno y temporales al contexto de build.
