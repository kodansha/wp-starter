# wp-starter

WordPress CMS のスターターボイラープレート。

テンプレートとして [Bedrock](https://roots.io/bedrock/) を利用している。

## 使い方

### リポジトリの clone

本リポジトリを任意のプロジェクト名で clone する。

> [!NOTE]
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

> [!NOTE]
> スクリプトの実行には Node.js v12 以降が必要

```text
node scripts/bootstrap.js
```

このスクリプトを実行すると、いくつかの質問に対してインタラクティブに入力を求められる。

```text
Enter WordPress Web port number (default 80):
```

上記は、WordPress にウェブブラウザでアクセスするときのポートを指定するもので、未入力時のデフォルトは `80` になっている。

> [!TIP]
> WordPress のポートには、できる限りデフォルトの `80` の値を設定することを推奨する。
> それ以外のポート (例: 8000) などを指定した場合、コンテナ内からのポートと開発マシンホストからのポートが異なるため、
> WP-Cron が正常動作しない、一部の REST API を使った機能に不具合があるなどの問題が発生する。

次に、データベースのポートの入力が求められ、未入力時のデフォルトは `33060` になっている。

```text
Enter Database port number (default 33060):
```

> [!TIP]
> データベースは Docker の MySQL コンテナとして起動される。
> したがって、ここで指定するポートというのは、ホスト側から MySQL コンテナにアクセスするためのポート番号ということ。

上記を入力しスクリプトの実行が完了すると、以下のような設定が行われる:

- プロジェクト名が clone したディレクトリ名に自動設定される (例: `awesome-wp`)
- データベース名が **`-` や `.` を `_` に置換して** clone したディレクトリ名に自動設定される (例: `awesome_wp`)
- WordPress にアクセスするためのポートがインタラクティブに入力した値に設定される
- データベースにアクセスするためのポートがインタラクティブに入力した値に設定される

> [!NOTE]
> bootstrap スクリプトの実行後には `scripts` ディレクトリは削除してよい。

> [!NOTE]
> Git の履歴に wp-starter のログを残したくない場合には、 `.git` ディレクトリを削除し、改めて `git init` すること。

## ローカル開発環境

ローカル開発は VS Code の [Remote - Containers](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers) の Dev Container を利用して Docker コンテナ内部で行う。

そのため、Docker をインストールしておく必要がある。

- 現在、ローカル開発環境は macOS + Docker Desktop のみで検証しています

また、Remote - Containers を含む、推奨する VS Code の拡張機能を指定しているので、拡張機能のインストールを促すダイアログが表示された場合はインストールすること。

### 開発環境の起動

VS Code で clone したフォルダーをワークスペースとして開き、**Dev Containers: Reopen in Container** を実行する。

それだけで、`.devcontainer` に格納された設定情報にしたがって、自動的に Docker コンテナ内の開発環境が起動し、各種設定が実行される。

> [!NOTE]
> 初回の Dev Container 起動時には時間がかかる。特にエラーになっていなければそのまま待つこと。

### WordPress 管理画面へのアクセス

Dev Container が起動していれば、WordPress 管理画面にアクセスできる。

- フロント画面: http://dev.mylocaldoma.in:<設定した WordPress ポート>
- 管理画面: http://dev.mylocaldoma.in:<設定した WordPress ポート>/wp/wp-admin
  - ユーザー: `admin`
  - パスワード: `admin`

### テーマの開発

主に開発は WordPress テーマに対して行う。テーマは `cms/web/app/themes/default-theme` として配置されている。

初期状態では完全に空っぽのテーマになっているため、画面なども一切ない状態。

## wp-starter 開発者向け情報

### 更新とタグのルール

wp-starter は、本家 Bedrock の更新をできるだけ取り込んで更新すべきものとなっている。
それによって、最新の WordPress や Bedrock バージョンへの追従が可能になる。

そのため、Bedrock リポジトリ側の更新差分が把握できるように、**どのバージョンの Bedrock
がベースとなっているかを Git タグで明示しておく必要がある。**

例えば、[Bedrock のリリースバージョン **1.22.5**](https://github.com/roots/bedrock/releases/tag/1.22.5)
をベースにしている場合は、wp-starter 側で [**bedrock/1.22.5** のタグを打っておく](https://github.com/kodansha/wp-starter/releases/tag/bedrock%2F1.22.5)ことをルールとする。

同様に、もし Bedrock **1.23.10** の更新差分を wp-starter に取り込んだ場合は **bedrock/1.23.10** のタグを打っておくこと。

### Bedrock 差分チェッカー

Bedrock の更新差分の反映がやりやすいように、差分チェックを半自動化するスクリプトを用意している。

スクリプトは以下で実行する:

```text
scripts/check-bedrock-changes.sh
```

このスクリプトは単純に `roots/bedrock` のリポジトリを clone して、wp-starter
の最新タグと比較して `git difftool` を実行している。

### wp-standard 更新補助用スクリプト

[kodansha/wp-standard](https://github.com/kodansha/wp-standard) は、この
wp-starter を利用して作られており、wp-starter の更新に追従するようにしている。

手動でそれを行うのは面倒なので、wp-standard の更新補助用スクリプトを用意している。

以下の手順で実行すると、wp-standard の最新版を取得して、wp-starter に反映することができる。

```text
cd scripts
```

```text
node create-wp-standard.js
```

> [!NOTE]
> wp-standard のローカルリポジトリのディレクトリが `../wp-standard` に存在することを前提としているため、別の場所にある場合は正しく動作しない。
> また、 `composer update` を実行するので、wp-starter の要求するバージョンと一致した PHP の実行環境も必要になる。
