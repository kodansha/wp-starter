const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

WP_STANDARD_DIR = "../../wp-standard";

// 現在のディレクトリ名を取得
const currentDir = path.basename(process.cwd());

// 現在のディレクトリが 'scripts' でない場合、メッセージを表示して終了
if (currentDir !== "scripts") {
  console.error("This script must be run from the 'scripts' directory.");
  process.exit(1);
}

// wp-standard ディレクトリが存在する場合は削除
const wpStandardPath = path.join(process.cwd(), "wp-standard");
if (fs.existsSync(wpStandardPath)) {
  fs.rmSync(wpStandardPath, { recursive: true, force: true });
}

// git リポジトリをクローン
execSync(
  "git clone --depth 1 https://github.com/kodansha/wp-starter.git wp-standard"
);

// wp-standard ディレクトリに移動
process.chdir("wp-standard");

// .git ディレクトリが存在する場合は削除
const gitDirPath = path.join(process.cwd(), ".git");
if (fs.existsSync(gitDirPath)) {
  fs.rmSync(gitDirPath, { recursive: true, force: true });
}

// bootstrap.js スクリプトを実行
execSync("node scripts/bootstrap.js --default");

// 不要なファイルとディレクトリを削除
fs.unlinkSync(path.join(process.cwd(), "README.md"));
const scriptsDirPath = path.join(process.cwd(), "scripts");
if (fs.existsSync(scriptsDirPath)) {
  fs.rmSync(scriptsDirPath, { recursive: true, force: true });
}

// ファイルパス
const filePath = path.join("cms", "composer.json");

// ファイルを同期的に読み込む
const data = fs.readFileSync(filePath, "utf8");

// ファイルの内容を行ごとに分割
const lines = data.split("\n");

// 削除するブロックのパターン
const patterns = [
  "    },",
  "    {",
  '      "type": "vcs",',
  '      "url": "https://github.com/kodansha/killer-pads.git"',
];

// ブロックを特定して削除
let newLines = [];
let i = 0;
while (i < lines.length) {
  if (
    lines[i] === patterns[0] &&
    lines[i + 1] === patterns[1] &&
    lines[i + 2] === patterns[2] &&
    lines[i + 3] === patterns[3]
  ) {
    // 4行が連続している場合はスキップ
    i += 4;
  } else if (lines[i].includes('"kodansha/killer-pads": ')) {
    newLines.push('    "wpackagist-plugin/advanced-custom-fields": "6.2.1",');
    newLines.push('    "wpackagist-plugin/wp-multibyte-patch": "2.9"');
    i++;
  } else {
    newLines.push(lines[i]);
    i++;
  }
}

// 新しい内容をファイルに同期的に書き戻す
fs.writeFileSync(filePath, newLines.join("\n"), "utf8");
console.log("File updated successfully.");

// 上位 (scripts) ディレクトリに移動
process.chdir("../");

// ディレクトリを再帰的にコピーする関数
function copyDir(src, dest) {
  // ディレクトリの中身を取得
  let entries = fs.readdirSync(src, { withFileTypes: true });

  for (let entry of entries) {
    let srcPath = path.join(src, entry.name);
    let destPath = path.join(dest, entry.name);

    // 除外するファイルでない場合に処理
    if (!excludeFiles.includes(srcPath)) {
      if (entry.isDirectory()) {
        // ディレクトリの場合は再帰的にコピー
        copyDir(srcPath, destPath);
      } else {
        // ファイルの場合はコピー
        fs.copyFileSync(srcPath, destPath);
      }
    }
  }
}

// コピー元とコピー先のディレクトリ
const sourceDir = path.join("wp-standard");
const targetDir = path.join(WP_STANDARD_DIR);

// 除外するファイルのリスト
const excludeFiles = [
  "wp-standard/cms/web/app/themes/default-theme/functions.php",
  "wp-standard/cms/.devcontainer/postCreateCommand/postCreateCommand.bash",
];

copyDir(sourceDir, targetDir);

process.chdir(path.join(WP_STANDARD_DIR, "cms"));

execSync("composer update");
