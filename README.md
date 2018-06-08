# TheF2E_w1_todolist
更多關於 TheF2E 挑戰的資訊及其他週作品

https://github.com/hbdoy/TheF2E

## View
https://hbdoy.github.io/TheF2E_w1_todolist/

## 說明
連續九週挑戰的第一關，其實沒有很意外的是 ToDoList，每當學新的語言/框架，總是拿它鍊手，這樣說起來它的地位似乎不亞於 **hello world** 喔XD

## 使用工具
- CSS
  - Bootstrap4
- JS
  - JQuery
  - [Sortable.js](https://github.com/RubaXa/Sortable)
  - [Ply.js](https://github.com/RubaXa/Ply)
- DB
  - Firebase

## 架構
原本糾結 todos 要存在 `localstorage` 還是乾脆不要存每次刷新XD，因為完程度(UI、功能)打算要和設計稿至少90%，所以就不打算花額外時間寫一個後端來接資料，

突然腦洞一開，前陣子在寫 linebot 的時候，資料都丟 ``firebase``，怎麼可以忘記這個好工具呢XD

最後資料變成用 ``firebase`` 界接，並採取即時更新(像聊天室那樣)，這樣省了很多麻煩，除了不用處理後端外，前端的渲染也只要將更新後的資料 render 出來就好，

能夠更專心處理UI和程式邏輯的部分~

## 心得
收穫之一大概就是不會糾結於某個library，原本想用``Jquery UI``弄draggable，但自訂性不是很好，主要想弄成畫面中左側點點才能拖拉，而不是整個欄位都可以拉，

因為這樣也造成手機版滑動時會被視為拖拉動作，後來發現``Sortable.js``真是神器阿，果斷使用XD

而且它demo網頁下方有推薦其他的library，快速看了下，眼球馬上被``Ply.js``吸走，能夠快速取代原本醜醜的**alert、confirm**，恩恩，也是馬上載進來囉~

其它心得有空再補QQ

## 尚須完成
- [ ] 紀錄排序順序
- [ ] 檔案上傳
- [ ] firebase 權限管理
