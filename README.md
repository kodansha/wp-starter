# wp-starter

WordPress CMS のスターターボイラープレート。

テンプレートとして [Bedrock](https://roots.io/bedrock/) を利用している。

## 使い方

### リポジトリの clone

本リポジトリを任意のプロジェクト名で clone する。

> **Note**
> この手順の中では、サンプルのプロジェクト名として **awesome-wp** を利用する。
> 実際に手元で行う場合はその部分を任意のプロジェクト名に置き換えること。

```text
git clone https://github.com/kodansha/wp-starter.git awesome-wp
```

### プロジェクト名の置換

clone したプロジェクトのディレクトリに入る:

```text
cd awesome-wp
```

コード中に存在する以下の2点を任意のプロジェクト名に置換する必要があるため、エディタの一斉置換機能なども利用して置換を行う:

(1) コード内の `wp-starter` の文言を全て置換する
(2) `web/app/themes/wp-starter` のディレクトリ名を全て置換する

> **Warning**
> `.devcontainer/docker-compose.yml` と　`.env.example` にある `wp-starter` はデータベース名を示している。
> そのため、データベース名として有効なものに置換する必要があることに注意 (例えば `-` は利用できないので `_` を使うなど)

## ローカル開発環境

ローカル開発は VS Code の [Remote - Containers](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers) の Dev Container を利用して Docker コンテナ内部で行う。

そのため、Docker をインストールしておく必要がある。

- 現在、ローカル開発環境は macOS + Docker Desktop のみで検証しています

また、Remote - Containers を含む、推奨する VS Code の拡張機能を指定しているので、拡張機能のインストールを促すダイアログが表示された場合はインストールすること。

### 事前準備

まず、Dev Container の設定ファイルが必要なので、テンプレートファイルをコピーして作成する:

```text
cp .devcontainer/devcontainer.default.jsonc .devcontainer/devcontainer.json
```

このファイルはデフォルトの構成を提供するものなので、コピーしてそのままでも使えるが、必要に応じて `extensions` の追加などのカスタマイズを行う。

また、環境変数を `.env` で設定する必要があるため、サンプルファイルをコピーして作成する:

```text
cp .env.example .env
```

特に `.env` の内容を変更しなくてもローカル開発には問題ない。

### 開発環境の起動

VS Code で clone したフォルダーをワークスペースとして開き、**Remote-Containers: Reopen in Container** を実行する。

それだけで、`.devcontainer` に格納された設定情報にしたがって、自動的に Docker コンテナ内の開発環境が起動する。

具体的には以下の初期化プロセスが自動実行される:

1. WordPress / Nginx の Docker コンテナのビルド
2. WordPress / Nginx / MySQL の Docker コンテナの起動
3. VS Code のコンテナ開発環境の起動
4. `postCreateCommand.bash` による、以下の開発環境の初期設定

- Composer パッケージによる WordPress core やプラグインの取得
- WordPress のインストールと初期設定
- 必要なプラグインの有効化と初期設定

**NOTE:**

- 初回起動時には、マシンのリソース状況に依存するが、上記実行に時間がかかる。エラーがなければ待っていれば終了するので、放置していて OK
- 初回起動時に、MySQL コンテナの初期化処理に時間がかかり、`postCreateCommand` の実行でエラーが発生する場合がある。そのときは、`Rebuild Container` を実行してコンテナを再ビルドすること
- 再起動時などにエラーが発生した場合は、まず **Remote-Containers: Reopen in Container** を実行して再構築を試すこと
- もし、再構築してもどうしても復旧しない場合、データは初期化されるが、Docker ボリュームの削除が有効なことがある。`docker volume ls` で `wp-starter_devcontainer_*` のボリュームを確認し、個別に削除すること

実行が完了すると、すぐに WordPress 管理画面にアクセスできるようになる。

- フロント画面: http://localhost:8808
- 管理画面: http://localhost:8808/wp/wp-admin
  - ユーザー: `admin`
  - パスワード: `admin`

## テーマの開発

主に開発は WordPress テーマに対して行う。テーマは `web/app/themes` 以下に配置されている。

初期状態では完全に空っぽのテーマになっているため、画面なども一切ない状態。

### Cron の実行

Dev Container では WordPress 組み込みの擬似 cron が正常動作しないため、利用しない設定としている。

もし (例えば予約投稿の確認などで) cron を実行したい場合は、Dev Container のターミナルで WP-CLI を使って cron イベントを実行すること。

```text
wp cron event run --due-now --allow-root
```
