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

| 索引 | 格子主題 | 特性描述 | 對應題庫 |
|:---:|:---:|:---|:---|
| **0** | **Start (Life/Challenge)** | 起點，繞行一圈後加分。 | 生活/挑戰題庫 |
| **1** | **Accounting 1** | 會計主題格。 | 會計題庫 1 (ACQ-1) |
| **2** | **Statistics 1** | 統計主題格。 | 統計題庫 1 (STQ-1) |
| **3** | **Calculus 1** | 微積分主題格。 | 微積分題庫 1 (CAQ-1) |
| **4** | **Economics 1** | 經濟主題格。 | 經濟題庫 1 (ECQ-1) |
| **5** | **Accounting 2** | 會計主題格。 | 會計題庫 2 (ACQ-2) |
| **6** | **Statistics 2** | 統計主題格。 | 統計題庫 2 (STQ-2) |
| **7** | **Calculus 2** | 微積分主題格。 | 微積分題庫 2 (CAQ-2) |
| **8** | **Economics 2** | 經濟主題格。 | 經濟題庫 2 (ECQ-2) |
| **9** | **Special (Life/Challenge)** | 機會格。 | 生活/挑戰題庫 |

## 4. 題目機制 (Question Banks)
- **等級劃分**：三個等級（L100, L200, L300）。
- **題目類型**:
  - `Level 1: 填充題` (核心名詞填充)
  - `Level 2: 計算題` (簡易邏輯運算)
  - `Level 3: 開放性問題` (邏輯答對即給分，無絕對標準答案)

## 5. 數據範例 - 題庫 1 & 2 (Question Samples)

### 1. Accounting (會計學)
#### ACQ-1 (用於格子 1)
- **Lv1**: "The recording of an asset’s cost as an expense over its useful life is called ______." (Ans: Depreciation)
- **Lv2**: "Total Assets = $100, Total Equity = $60. How much are the Liabilities?" (Ans: $40)
- **Lv3**: "Why do we need 'Adjusting Entries' at the end of a period?" (Ans: To match revenues and expenses)

#### ACQ-2 (用於格子 5)
- **Lv1**: "When a company sells a bond at $1,050 (Face Value: $1,000), it is called a ______." (Ans: Premium)
- **Lv2**: "A machine costs $5,000 with a 5-year life. What is the annual straight-line depreciation?" (Ans: $1,000)
- **Lv3**: "Explain the difference between 'Depreciation' and 'Amortization' in one simple sentence." (Ans: Depreciation is for tangible assets; Amortization is for intangible assets.)

### 2. Economics (經濟學)
#### ECQ-1 (用於格子 4)
- **Lv1**: "The point where Supply meets Demand is called the Market ______." (Ans: Equilibrium)
- **Lv2**: "Price increases from $10 to $12. Quantity demanded drops from 100 to 80. Is the demand elastic or inelastic?" (Ans: Elastic)
- **Lv3**: "Explain 'Opportunity Cost' using an example from your daily life as a university student." (Ans: Giving up study time to sleep.)

#### ECQ-2 (用於格子 8)
- **Lv1**: "When your income increases and you buy LESS of a good, that good is called an ______ good." (Ans: Inferior)
- **Lv2**: "Opportunity Cost: You can work (earn $160) or go to a concert (cost $100). What is the total cost of the concert?" (Ans: $260)
- **Lv3**: "In your opinion, what is one 'Negative Externality' of using AI for homework?" (Ans: Losing critical thinking)

### 3. Calculus (微積分)
#### CAQ-1 (用於格子 3)
- **Lv1**: "If the slope of a curve is zero, it might be a maximum or a ______ point." (Ans: Minimum)
- **Lv2**: "Find the derivative (f') of f(x) = x³ + 2x." (Ans: 3x² + 2)
- **Lv3**: "Describe a real-world scenario where we might need to use 'Optimization'." (Ans: Minimizing cost / Maximizing profit.)

#### CAQ-2 (用於格子 7)
- **Lv1**: "The reverse process of differentiation is called ______." (Ans: Integration / Antiderivative)
- **Lv2**: "What is the value of 'e' to two decimal places?" (Ans: 2.72)
- **Lv3**: "Explain the 'Chain Rule' in one simple sentence." (Ans: Function inside a function.)

### 4. Statistics (統計學)
#### STQ-1 (用於格子 2)
- **Lv1**: "A value that is very far away from all other data points is called an ______." (Ans: Outlier)
- **Lv2**: "Data: {1, 1, 2, 3, 8}. What is the Median?" (Ans: 2)
- **Lv3**: "Why is 'Correlation does not imply Causation' an important rule?" (Ans: Ice cream sales don't cause shark attacks)

## 6. 核心遊戲流程 (Core Gameplay Loop)
### A. 移動 (Movement)
- 玩家擲骰子並根據步數移動。
- 如果落點格子已達到「滿級 (Level 3)」，該格子將被直接略過。

### B. 挑戰與房產 (Property Mechanics)
1. **無人佔領時**:
   - 玩家必須回答 **Level 1** 問題。
   - **答對**: 獲得該格房產（Level 1）。
   - **答錯**: 所有權維持無主。
2. **他人佔領時**:
   - 玩家必須回答該格的 **當前等級 + 1** 的問題。
   - **答對 (奪取成功)**: 該格所有權轉移給當前玩家，且等級增加。
   - **答錯 (防禦成功)**: 所有權維持原狀，且該房產「自動升一級」。

## 7. 遊戲結束條件 (End Conditions)
- 統計所有格子（0-9）的房產等級與路過獎勵總分。
- 分數最高者獲勝。

## 8. 學生名單與隨機分組 (Student Management)
### 挑戰者池 (15 人):
- **Week 5**: Anthony, Jimena, Peggie
- **Week 7**: Annie, Dylan, Wendy
- **Week 8**: Jason, Kevin, Maggie
- **Week 12**: Ryan, Ruby
- **Week 13**: Dino, Vincent
- **Week 15**: Regina, Tony

### 隨機分組規則:
- 介面提供 "Randomize Teams" 按鈕。
- 系統將 15 位同學隨機分配至 4 個組別。
- 預計分佈為: 4, 4, 4, 3 人。