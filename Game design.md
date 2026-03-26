# ETP Game Show - 互動式學術大富翁設計文件 (範例案例)

## 1. 遊戲概述 (Project Overview)
這是一個基於 Web 的英語互動競賽遊戲，模仿大富翁（Monopoly）的機制，結合大學四大專業學科（會計、統計、微積分、經濟）的內容進行答題競賽。本文件作為「互動式大富翁自定義機制」下的一個具體範例實做。

## 2. 遊戲配置 (Game Configuration)
- **玩家數量**: 4 組玩家/團隊。
- **學員主要目地**: 在專業學科挑戰中奪取房產並累積分數。
- **主題分類**:
  1. **Accounting (會計)**
  2. **Statistics (統計)**
  3. **Calculus (微積分)**
  4. **Economics (經濟)**
  5. **Life (生活)**
  6. **Challenge (挑戰)**

## 3. 地圖佈局 (Map Layout)
採用 `4x3 - 2` 的矩形佈局，共 10 格（索引 0-9），中間為空白區域。

| 索引 | 格子主題 | 特性描述 |
|:---:|:---:|:---|
| **0** | **Start (Life/Challenge)** | 起點，繞行一圈後可獲得固定加分。 |
| **1** | **Accounting 1** | 分配到會計題庫 1 (IFRS 基礎)。 |
| **2** | **Statistics 1** | 分配到統計題庫 1 (數據分析直覺)。 |
| **3** | **Calculus 1** | 分配到微積分題庫 1 (極限與導數)。 |
| **4** | **Economics 1** | 分配到經濟題庫 1 (市場機制)。 |
| **5** | **Accounting 2** | 分配到會計題庫 2 (會計方程式與分錄)。 |
| **6** | **Statistics 2** | 分配到統計題庫 2 (機率與推論)。 |
| **7** | **Calculus 2** | 分配到微積分題庫 2 (積分與應用)。 |
| **8** | **Economics 2** | 分配到經濟題庫 2 (供需與外部性)。 |
| **9** | **Special (Life/Challenge)** | 機會格，隨機觸發生活或挑戰題。 |

## 4. 題目機制 (Question Banks)
- **等級劃分**：三個等級（L100, L200, L300）。
- **題目類型**:
  - `Level 1: 填充題` (核心名詞填充)
  - `Level 2: 計算題` (簡易邏輯運算)
  - `Level 3: 開放性問題` (邏輯答對即給分，無絕對標準答案)

## 5. 數據範例 (Question Samples - Placeholder)
以下為各學科的題目範本，用於引導 AI 生成完整題庫：

### 1. Accounting (會計學)
- **Lv1**: "The recording of an asset’s cost as an expense over its useful life is called ______." (Ans: Depreciation)
- **Lv2**: "Total Assets = $100, Total Equity = $60. How much are the Liabilities?" (Ans: $40)
- **Lv3**: "Why do we need 'Adjusting Entries' at the end of a period?" (Ans: To match revenues and expenses)

### 2. Economics (經濟學)
- **Lv1**: "The point where Supply meets Demand is called the Market ______." (Ans: Equilibrium)
- **Lv2**: "Price increases from $10 to $12. Quantity demanded drops from 100 to 80. Is the demand elastic or inelastic?" (Ans: Elastic)
- **Lv3**: "In your opinion, what is one 'Negative Externality' of using AI for homework?" (Ans: Losing critical thinking)

### 3. Calculus (微積分)
- **Lv1**: "If the slope of a curve is zero, it might be a maximum or a ______ point." (Ans: Minimum)
- **Lv2**: "Find the derivative (f') of f(x) = x³ + 2x." (Ans: 3x² + 2)
- **Lv3**: "Explain the 'Chain Rule' in one simple sentence." (Ans: Function inside a function)

### 4. Statistics (統計學)
- **Lv1**: "A value that is very far away from all other data points is called an ______." (Ans: Outlier)
- **Lv2**: "If you flip a coin 3 times, what is the probability of getting 3 Heads?" (Ans: 1/8 or 12.5%)
- **Lv3**: "Why is 'Correlation does not imply Causation' an important rule?" (Ans: Ice cream sales don't cause shark attacks)

## 6. 核心遊戲流程 (Core Gameplay Loop)
### A. 移動 (Movement)
- 玩家擲骰子並根據步數移動。
- 如果落點格子已達到「滿級 (Level 3)」，該格子將被直接略過。

### B. 挑戰與房產 (Property Mechanics)
1. **無人佔領時**: 挑戰 Level 1。答對獲得房產，答錯維持無主。
2. **他人佔領時**: 挑戰「當前等級 + 1」。答對奪取房產，答錯則原主房產自動升一級。

## 7. 遊戲結束條件 (End Conditions)
- 統計所有格子（0-9）的房產等級與路過獎勵總分。最高者獲勝。