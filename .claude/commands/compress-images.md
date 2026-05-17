# compress-images

記事フォルダ内の画像を圧縮・リサイズします。HEIC/HEIF はJPEGに変換されます。

## 使い方

```
/compress-images [オプション]
```

## 実行手順

まず pillow-heif が入っているか確認し、なければインストールを提案してください。

```bash
python3 -c "import pillow_heif" 2>/dev/null || echo "未インストール"
```

未インストールの場合はユーザーに確認した上で:

```bash
pip3 install pillow-heif
```

次に、どのディレクトリを対象にするかユーザーに確認してください（デフォルトはプロジェクトルート）。

確認が取れたら以下を実行します（まず dry-run で確認してから本番実行）:

```bash
python3 compress_images.py $ARGUMENTS --dry-run
```

dry-run の結果をユーザーに見せ、問題なければ本番実行:

```bash
python3 compress_images.py $ARGUMENTS
```

## オプション例

- `articles/article20260419` — 特定の記事フォルダのみ
- `--quality 75` — より高圧縮（デフォルト: 80）
- `--max-size 800` — 小さめにリサイズ（デフォルト: 1200px）
- `--min-kb 100` — 100KB以上をすべて対象に

## 注意

- 元ファイルは上書きされます（HEICはJPEGに変換後、元ファイルは削除）
- 実行前に git でコミットするか、バックアップを取ることを推奨します
