# TheF2E_w1_todolist
更多關於 TheF2E 挑戰的資訊及其他週作品

https://github.com/hbdoy/TheF2E

## View
https://hbdoy.github.io/TheF2E_w1_todolist/

![](https://i.imgur.com/CU5ipE8.png)

RWD是一定要der

![](https://i.imgur.com/qbT570E.png)

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
#### 更:
2018/06/09

能夠紀錄 todos 排序了，最後處理辦法是在 DB 中多開一個 table 來記錄所有 key 的排序，然後 filter data 時，把資料按照該 table 中 key 的順序重新排列即可。(碎碎念: 功力不夠，還是花了一個小時來處理QQ)

------

原本糾結 todos 要存在 `localstorage` 還是乾脆不要存每次刷新XD，因為完程度(UI、功能)打算要和設計稿至少90%，所以就不打算花額外時間寫一個後端來接資料，

突然腦洞一開，前陣子在寫 linebot 的時候，資料都丟 ``firebase``，怎麼可以忘記這個好工具呢XD

最後資料變成用 ``firebase`` 界接，並採取即時更新(像聊天室那樣)，這樣省了很多麻煩，除了不用處理後端外，前端的渲染也只要將更新後的資料 render 出來就好，

能夠更專心處理UI和程式邏輯的部分~

> 目前 ``Firebase`` 開放公開權限，請不要惡意破壞QQ

## 心得
#### 更:
2018/06/09

終於能夠紀錄排序啦(灑花，不然每次前端拉一拉，重新整理後排序又回到原本。

以下紀錄一下思考的過程:

整個流程是: ``開新表格紀錄 key 的排序`` => ``filter data 時多一個處理排序的動作`` => ``update/remove 排序時，也要重新 render`` 。

但是該怎麼紀錄 DOM 結構中 Key 的順序呢?

想了一下決定這麼做: ``偵測拖曳事件結束後`` => ``抓取 DOM 中的所有 Key`` => ``update DB``
後面兩個沒什麼問題，但是如何實作偵測拖曳事件結束呢?

一開始是想電腦版與手機版分開，電腦偵測 ``mouseup``、手機偵測 ``touchend``，但是在測試過程中不順利，只要拖拉數秒不放時，上述事件就無法偵測，但是如果監聽 ``click`` 可行，但是卻無法知道使用者何時拖拉完畢QQ

卡了一下後，覺得 ``Sortable.js`` 中應該支持事件處理，就跑去看說明文件，還真的發現在建立 Sortable 時，可以自訂義事件參數，那...就解決了XD

程式碼大致是這樣，在 new Sortable 時，綁一個拖曳結束的 Event，callback function 則是上面提到的，負責抓取當前 DOM 中的所有 key，然後再 update 到 DB~
```javascript
// 拖曳事件結束後觸發_saveDataSort
var sortable = new Sortable(todo_content, {
    handle: '.my-handle',
    ghostClass: 'ghost',
    onEnd: function () {
        _saveDataSort();
    },
});
```

------
切版算基本功，就不寫心得了XD

收穫之一大概就是不會糾結於某個library，原本想用``Jquery UI``弄draggable，但自訂性不是很好，主要想弄成畫面中左側點點才能拖拉，而不是整個欄位都可以拉，

因為這樣也造成手機版滑動時會被視為拖拉動作，後來發現``Sortable.js``真是神器阿，果斷使用XD

而且它demo網頁下方有推薦其他的library，快速看了下，眼球馬上被``Ply.js``吸走，能夠快速取代原本醜醜的**alert、confirm**，恩恩，也是馬上載進來囉~

其它心得有空再補QQ

## 尚須完成
- [X] 紀錄排序順序
- [ ] 檔案上傳
- [ ] firebase 權限管理
