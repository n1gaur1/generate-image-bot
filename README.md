# generate-image-bot

## 前提環境

- 実行するホストマシンには以下のパッケージが必要
    - node
    - postgresql


## データベースの作成

```bash
$ sudo su - postgres
$ psql
$ CREATE DATABASE slackbot;
$ \password 
# パスワードを設定する
$ \q
```

## 起動

```bash
$ npm i -g pnpm
$ pnpm i
$ pnpm build
$ pnpm migrate
$ node src/index.ts
```