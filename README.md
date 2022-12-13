This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.tsx`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/api-routes/introduction) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.ts`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

### Prisma

npm install prisma --save-dev
npx prisma init --datasource-provider sqlite

// schema ファイルに Model を作成
npx prisma migrate dev --name init

// gui で見る
npx prisma studio

# Docker

wsl の有効化
仮想化の有効化

[WSL のインストール \| Microsoft Learn](https://learn.microsoft.com/ja-jp/windows/wsl/install)
<https://learn.microsoft.com/ja-jp/windows/wsl/install>

WSL コマンドのインストール
wsl --install

元から wsl コマンドが入ってる場合、
ディストリビューションを一覧表示し、
wsl -l -o

wsl --install -d Ubuntu-20.04
で Ubuntu をインストール

ユーザ名とパスワードの設定

Ubuntu のアップデート
sudo apt update && sudo apt upgrade

win10 系で仕事してるなら windows terminal を入れると楽
[Microsoft Apps](https://apps.microsoft.com/store/detail/windows-terminal/9N0DX20HK701?hl=ja-jp&gl=jp)

Ubuntu 上に Docker-engine をインストール
[Docker Desktop に依存しない、Windows での Docker 環境 - Qiita](https://qiita.com/ohtsuka1317/items/617a865b8a9d4fb67989)
[Install Docker Engine on Ubuntu \| Docker Documentation](https://docs.docker.com/engine/install/ubuntu/#install-using-the-repository)

sudo apt-get update

sudo apt-get install \
 ca-certificates \
 curl \
 gnupg \
 lsb-release

sudo mkdir -p /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg

echo \
 "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
 $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

sudo apt-get update
sudo apt-get install docker-ce docker-ce-cli containerd.io docker-compose-plugin

sudo usermod -aG docker $USER
sudo /etc/init.d/docker start

// wsl のバージョン関係
wsl -l -v

wsl --set-default-version 2

wsl --set-version Ubuntu-20.04 2

docker images
docker inspect hello-world:latest
docker ps -a

// コンテナ削除
docker rm <CONTAINER_ID>

docker-compose-plugin
v2 系なら
sudo apt install docker-compose-plugin
で終了。
docker compose up sample.app

docker container prune
docker image prune
docker build . -t twada/web-app

docker run -d -p 49160:8080 twada/web-app -rm

docker logs bb8bd6fa3aa5

docker kill <container id>

## failed to execute shell script

$'\r': command not found

cat -e postCreateCommand.sh

apt-get install dos2unix
dos2unix postCreateCommand.sh

### BAD

#!/bin/bash^M$
^M$
npm install^M$

### GOOD

#!/bin/bash$
$
npm install$

###

wsl --install

ディストリビューションを一覧表示し、
wsl -l -o
wsl --install -d Ubuntu-20.04

// wsl のバージョン関係
wsl -l -v
wsl --set-default-version 2
wsl --set-version Ubuntu-20.04 2

カーネルの update
https://learn.microsoft.com/ja-jp/windows/wsl/install-manual#step-4---download-the-linux-kernel-update-package

//
npx prisma migrate reset --skip-seed
npx prisma migrate dev --name init
npx prisma db push

// release build
docker build -t sample .
docker build -t be-suit .

//
ncu --target minor
ncu --target minor -u
npm install

// aspida
aspida/dist/createTemplateValues.js

```
// var valNameRegExpStr = '^_[a-zA-Z][a-zA-Z0-9_]*';
var valNameRegExpStr = '^\[[a-zA-Z][a-zA-Z0-9_]*\]';

// var hasVal = filename.startsWith('_');
var hasVal = filename.startsWith('[');
```

### release 手順

docker-compose.yml
docker-compose up -d
で postgres インスタンスを立てる

Dockerfile
docker build -t be-suit .
OR
docker build --no-cache -t be-suit .
app インスタンスを立てる。

docker run --name be-suit-app -it -p 3000:3000 be-suit
container 起動

.env の以下を適切に変更

# NEXTAUTH_URL="http://localhost:3000/"

docker の export port を 3000 で指定する。
