import os
import json

# 設定
base_dir = "groups"
num_groups = 20

# イベント名のバリエーション
events = [
    "合同合宿", "中間発表会", "成果報告会", "ハッカソン", "学園祭展示",
    "ポスターセッション", "最終プレゼン", "プロトタイプ完成日", "合宿準備会", "技術選定ミーティング"
]

# 改善案のバリエーション（ランダムに配布する用）
improvement_samples = [
    "- 締切が過ぎているタスクの文字を赤くしたい\n- タスクの並び順を締切が近い順にしたい",
    "- 完了したタスクの割合（％）をプログレスバーで表示したい\n- 担当者ごとにタスクを色分けしたい",
    "- 重要なタスクに星マーク（★）をつけられるようにしたい\n- 残り日数が3日を切ったらアラートを出したい",
    "- 完了したタスクを一覧の最後に移動させたい\n- スマートフォンで見たときにもっとボタンを大きくしたい"
]

os.makedirs(base_dir, exist_ok=True)

for i in range(1, num_groups + 1):
    group_id = f"group{i:02d}"
    group_path = os.path.join(base_dir, group_id)
    os.makedirs(group_path, exist_ok=True)

    # 1. config.json の作成
    config = {
        "groupName": f"Group {i:02d}",
        "eventName": events[i % len(events)],
        "eventDate": "2026-07-20"
    }
    with open(os.path.join(group_path, "config.json"), "w", encoding="utf-8") as f:
        json.dump(config, f, indent=2, ensure_ascii=False)

    # 2. tasks.json の作成
    tasks = [
        {
            "title": "プロジェクトの目標を決める",
            "deadline": "2026-06-10",
            "status": "完了",
            "owner": "メンバーA"
        },
        {
            "title": "メイン機能の実装",
            "deadline": "2026-06-25",
            "status": "作業中",
            "owner": "メンバーB"
        }
    ]
    with open(os.path.join(group_path, "tasks.json"), "w", encoding="utf-8") as f:
        json.dump(tasks, f, indent=2, ensure_ascii=False)
        
    # 3. improvement_ideas.md の作成
    sample_idea = improvement_samples[i % len(improvement_samples)]
    md_content = f"""# 次にAIに依頼したい改善案（{group_id}）

このファイルには、自分たちの班で「もっとこうしたい！」と思ったアイディアをメモしてください。
AIに依頼する際の「依頼文」の練習にも使えます。

## アイディアの例
{sample_idea}

## 自分たちの改善案
- （ここに自由に追記してください）
- 

---
## AIへの依頼文案（プロンプト）の練習
> 「このToDoアプリに、〇〇という機能を追加したいです。app/script.js と app/style.css をどのように修正すればよいですか？」
"""
    with open(os.path.join(group_path, "improvement_ideas.md"), "w", encoding="utf-8") as f:
        f.write(md_content)

print(f"{num_groups}グループ分のファイル（config, tasks, improvement_ideas）を生成しました。")
