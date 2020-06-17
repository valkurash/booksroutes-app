This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/zeit/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
```

# Docker

Настраивается по мануалу https://steveholgado.com/nginx-for-nextjs/

## Отдельный запуск

### app
```bash
docker build --tag nextjs-image -f docker/Dockerfile .
```

```bash
docker run --name nextjs-container -p "90:3000" nextjs-image
```
### балансир

```bash
docker build --tag nginx -f docker/nginx/Dockerfile ./docker/nginx
```

запустится если контейнер с app будет в одной сети (в конфиге прописан upstream)

```bash
docker run --name nginx-test  -p "8080:80" nginx

```
