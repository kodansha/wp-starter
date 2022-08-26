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

### 初期設定 (bootstrapping)

clone したプロジェクトのディレクトリに入る:

```text
cd awesome-wp
```

clone した状態では、コード中に存在するプロジェクト名などがプレースホルダー (例: `{{project_name}}`)
になっているため、これを置換する必要がある。

この作業を自動化した bootstrap スクリプトを用意しているので、それを利用する。

> **Note**
> スクリプトの実行には Node.js v12 以降が必要

```text
node scripts/bootstrap.js
```

このスクリプトを実行すると以下が実行される:

- プロジェクト名が clone したディレクトリ名に自動設定される (例: `awesome-wp`)
- データベース名が **`-` や `.` を `_` に置換して** clone したディレクトリ名に自動設定される (例: `awesome_wp`)
- WordPress にアクセスするためのポートがインタラクティブに入力した値に設定される
- データベースにアクセスするためのポートがインタラクティブに入力した値に設定される

また、以下の環境固有の設定ファイルが生成される:

- `.env`
- `.devcontainer/devcontainer.json`

> **Warning**
> 環境固有の設定ファイルは `.gitignore` の対象となっているため、リポジトリをチーム開発する場合は「ローカル開発環境」の「事前準備」を参考に各環境でサンプルファイルから生成すること

> **Note**
> bootstrap スクリプトの実行後には `scripts` ディレクトリは削除してよい

## ローカル開発環境

ローカル開発は VS Code の [Remote - Containers](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers) の Dev Container を利用して Docker コンテナ内部で行う。

そのため、Docker をインストールしておく必要がある。

- 現在、ローカル開発環境は macOS + Docker Desktop のみで検証しています

また、Remote - Containers を含む、推奨する VS Code の拡張機能を指定しているので、拡張機能のインストールを促すダイアログが表示された場合はインストールすること。

### 事前準備

> **Note**
> bootstrap スクリプトを実行した環境ではこれらの「事前準備」は不要

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

- フロント画面: http://localhost:<設定した WordPress ポート>
- 管理画面: http://localhost:<設定した WordPress ポート>/wp/wp-admin
  - ユーザー: `admin`
  - パスワード: `admin`

## テーマの開発

主に開発は WordPress テーマに対して行う。テーマは `web/app/themes/default-theme` として配置されている。

初期状態では完全に空っぽのテーマになっているため、画面なども一切ない状態。

### Cron の実行

Dev Container では WordPress 組み込みの擬似 cron が正常動作しないため、利用しない設定としている。

もし (例えば予約投稿の確認などで) cron を実行したい場合は、Dev Container のターミナルで WP-CLI を使って cron イベントを実行すること。

```text
wp cron event run --due-now --allow-root
```

## wp-starter 開発者向け情報

### 更新とタグのルール

wp-starter は、本家 Bedrock の更新をできるだけ取り込んで更新すべきものとなっている。
それによって、最新の WordPress や Bedrock バージョンへの追従が可能になる。

そのため、Bedrock リポジトリ側の更新差分が把握できるように、**どのバージョンの Bedrock
がベースとなっているかを Git タグで明示しておく必要がある。**

例えば、[Bedrock のリリースバージョン **1.20.1**](https://github.com/roots/bedrock/releases/tag/1.20.1)
をベースにしている場合は、wp-starter 側でも同様に [**1.20.1** のタグを打っておく](https://github.com/kodansha/wp-starter/releases/tag/1.20.1)ことをルールとする。

同様に、もし Bedrock **1.21.0** の更新差分を wp-starter に取り込んだ場合は **1.21.0** のタグを打っておくこと。

### Bedrock 差分チェッカー

Bedrock の更新差分の反映がやりやすいように、差分チェックを半自動化するスクリプトを用意している。

スクリプトは以下で実行する:

```text
scripts/check-bedrock-changes.sh
```

このスクリプトは単純に `roots/bedrock` のリポジトリを clone して、wp-starter
の最新タグと比較して `git difftool` を実行している。
