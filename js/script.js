var get_start = (function () {
    var newToDo = document.querySelector("#add-text-bar");
    var page_all = document.querySelector("#pills-all-tab");
    var page_progress = document.querySelector("#pills-progress-tab");
    var page_completed = document.querySelector("#pills-completed-tab");
    var todo_content = document.querySelector("#todo_content");
    var allToDo = {};
    var progressToDo = [];
    var completedToDo = [];
    var nowPage = "all";
    var todoLen = {
        all: 0,
        progress: 0,
        completed: 0
    };
    var dataSort = {};
    var allToDo_sort = [];

    // Initialize Firebase
    var config = {
        apiKey: "AIzaSyA-tfe1lHmQOIohYy2vYKQQsS4rm2ZUJek",
        authDomain: "f2e-todolist-b91ad.firebaseapp.com",
        databaseURL: "https://f2e-todolist-b91ad.firebaseio.com",
        projectId: "f2e-todolist-b91ad",
        storageBucket: "",
        messagingSenderId: "972679278969"
    };
    firebase.initializeApp(config);
    var db = firebase.database();

    // 資料即時更新,更新後先將資料分類
    function _getData() {
        db.ref('/todo').on('value', function (snapshot) {
            var data = snapshot.val();
            if (data) {
                // console.log(data);
                allToDo = data;
                _filterToDo();
            }
        });
        db.ref('/mysort').on('value', function (snapshot) {
            var data = snapshot.val();
            if (data) {
                // console.log(data);
                dataSort = data;
                _filterToDo();
            }
        });
    }

    function _eventBind() {
        newToDo.addEventListener("keydown", _addNewTodo);
        todo_content.addEventListener("click", _checkForAction);
        // 拖曳事件結束後觸發_saveDataSort
        var sortable = new Sortable(todo_content, {
            handle: '.my-handle',
            ghostClass: 'ghost',
            onEnd: function () {
                _saveDataSort();
            },
        });
        page_all.addEventListener("click", () => {
            nowPage = "all";
            _updatePage()
        });
        page_progress.addEventListener("click", () => {
            nowPage = "progress";
            _updatePage()
        });
        page_completed.addEventListener("click", () => {
            nowPage = "completed";
            _updatePage()
        });
    }

    function _addNewTodo(e) {
        if (e.keyCode == 13 && this.value != "") {
            // console.log(this.value);
            db.ref("/todo").push({
                content: this.value,
                comment: "",
                done: "no",
                star: "no",
                created_time: _DateTimezone(8),
                update_time: _DateTimezone(8)
            });
            this.value = "";
        }
    }

    // 新增當地時區的時間物件
    function _DateTimezone(offset) {
        // 建立現在時間的物件
        d = new Date();
        // 取得 UTC time
        utc = d.getTime() + (d.getTimezoneOffset() * 60000);
        // 新增不同時區的日期資料
        return new Date(utc + (3600000 * offset)).toLocaleString();
        // 8是台北
        // _DateTimezone(8)
    }

    // 此函數在資料更新時,負責data的分類,讓後續router不用再過濾要渲染的data
    function _filterToDo() {
        progressToDo = [];
        completedToDo = [];
        todoLen = {
            all: 0,
            progress: 0,
            completed: 0
        };
        var tmp = [];
        var tmp_len = 0;
        // 因為for in順序的不確定性
        // 所以先取得所有筆數後，再將key依序存入tmp
        for (let key in dataSort) {
            tmp_len++;
        }
        for (let i = 0; i < tmp_len; i++) {
            tmp.push(dataSort[i]);
        }
        // 依照key的順序來取出對應allToDo中的資料
        // 此處先過濾已完成與未完成
        for (let i = 0; i < tmp.length; i++) {
            if (allToDo[tmp[i]].done === "no") {
                allToDo[tmp[i]].key = tmp[i];
                progressToDo.push(allToDo[tmp[i]]);
                todoLen.progress++;
            } else if (allToDo[tmp[i]].done === "yes") {
                allToDo[tmp[i]].key = tmp[i];
                completedToDo.push(allToDo[tmp[i]]);
                todoLen.completed++;
            }
        }
        // 因為已完成/未完成已經排序好，所以all只要將兩陣列相加即可
        allToDo_sort = progressToDo.concat(completedToDo);
        todoLen.all = todoLen.progress + todoLen.completed;
        _updatePage();
    }

    // 此函數負責router,將當前頁面需要渲染的data傳給_createPageStr()
    function _updatePage() {
        if (nowPage === "all") {
            _createPageStr(allToDo_sort);
        } else if (nowPage === "progress") {
            _createPageStr(progressToDo);
        } else if (nowPage === "completed") {
            _createPageStr(completedToDo);
        }
    }

    // 將得到的data渲染到頁面
    function _createPageStr(data) {
        var str = "";
        for (let i = 0; i < data.length; i++) {
            str += `
                <div class="mb-2">
                    <div class="all-content p-md-3 py-3 px-1 ${_checkStarOuter(data[i].star)}">
                        <div class="row">
                            <div class="col-lg-1 col-2 d-flex justify-content-start">
                                <span class="my-handle" data-key="${data[i].key}">☰</span>
                                <label class="my-checkbox">
                                    <input type="checkbox" data-key="${data[i].key}" class="${_checkDoneClass(data[i].done)}" ${_checkDone(data[i].done)}>
                                    <span class="checkmark"></span>
                                </label>
                            </div>
                            <div class="col-lg-9 col-7 " data-toggle="collapse" data-target="#${data[i].key}" aria-expanded="false" style="cursor: pointer">
                                <div class="text-truncate ${_checkDelText(data[i].done)}">${data[i].content || ""}</div>
                            </div>
                            <div class="col-lg-2 col-3">
                                <div class="edit-icon">
                                    <i class="${_checkStarIcon(data[i].star)} fa-star mr-3" data-key="${data[i].key}"></i>
                                    <i class="fas fa-pencil-alt mr-lg-3" data-toggle="collapse" data-target="#${data[i].key}" aria-expanded="false"></i>
                                    <i class="fas fa-trash d-none d-lg-inline-block" data-key="${data[i].key}"></i>
                                </div>
                            </div>
                        </div>
                        <div class="row quick-icon mt-2 ml-4">
                            <div class="col-10" data-toggle="collapse" data-target="#${data[i].key}" aria-expanded="false">
                                ${_checkDeadDate(data[i].dead_date)}
                                <i class="far fa-file mr-2"></i>
                                ${_checkComment(data[i].comment)}
                            </div>
                            <div class="col-2">
                                <i class="fas fa-trash d-inline-block d-lg-none" data-key="${data[i].key}"></i>
                            </div>
                        </div>
                    </div>
                    <div class="collapse mb-3" id="${data[i].key}">
                        <div class="px-4 py-3" style="border: 0;border-top: 2px solid #C8C8C8;background: #F2F2F2;">
                            <form>
                                <div class="form-group">
                                    <div class="m-2">
                                        <i class="far fa-clipboard mr-1"></i>
                                        Title
                                    </div>
                                    <div class="mx-4">
                                        <textarea class="form-control" rows="3">${data[i].content || ""}</textarea>
                                    </div>
                                </div>
                                <div class="form-group">
                                    <div class="m-2">
                                        <i class="far fa-calendar-alt mr-1"></i>
                                        Deadline
                                    </div>
                                    <div class="row mx-4">
                                        <div class="col-md-6 pl-md-0 mb-md-0 mb-3">
                                            <input type="date" class="form-control value="${data[i].dead_date || ''}">
                                        </div>
                                        <div class="col-md-6 pr-md-0">
                                            <input type="time" class="form-control" value="${data[i].dead_time || ''}" pattern="[0-9]{2}:[0-9]{2}">
                                        </div>
                                    </div>
                                </div>
                                <div class="form-group">
                                    <div class="m-2">
                                        <i class="far fa-file mr-1"></i>
                                        File
                                    </div>
                                    <div class="mx-4">
                                        <input type="file" class="form-control-file">
                                    </div>
                                </div>
                                <div class="form-group">
                                    <div class="m-2">
                                        <i class="far fa-comment-dots mr-1"></i>
                                        Comment
                                    </div>
                                    <div class="mx-4">
                                        <textarea class="form-control" rows="3">${data[i].comment || ""}</textarea>
                                    </div>
                                </div>
                            </form>
                        </div>
                        <div class="d-flex justify-content-start">
                            <button type="button" class="collapse-cancel btn btn-block">
                                <i class="fas fa-times mr-1"></i>
                                Cancel
                            </button>
                            <button type="button" class="collapse-add btn btn-block m-0" data-key=${data[i].key}>
                                <i class="fas fa-plus mr-1"></i>
                                Add Task
                            </button>
                        </div>
                    </div>
                </div>
                `;
        }
        str += `<div class="px-3 len-text">${_checkLenText()}</div>`;
        todo_content.innerHTML = str;
    }

    function _checkLenText() {
        if (nowPage === "all" || nowPage === "progress") {
            if (todoLen.progress == 1) {
                return `${todoLen.progress} task left`;
            } else if (todoLen.progress == 0) {
                return "";
            } else {
                return `${todoLen.progress} tasks left`;
            }
        } else if (nowPage === "completed") {
            if (todoLen.completed == 1) {
                return `${todoLen.completed} task completed`;
            } else if (todoLen.completed == 0) {
                return "";
            } else {
                return `${todoLen.completed} tasks completed`;
            }
        }
    }

    function _saveDataSort() {
        var allKey = [];
        var tmp = {};
        $(".my-handle").each(function () {
            var $key = $(this)[0].dataset.key;
            allKey.push($key);
        });
        for (var i = 0; i < allKey.length; i++) {
            tmp[i] = allKey[i];
        }
        db.ref("/mysort").set(tmp);
    }

    function _checkForAction(e) {
        if (e.target.nodeName === "BUTTON") {
            if ($(e.target).hasClass("collapse-cancel")) {
                Ply.dialog("confirm", {
                        effect: ["slide", "scale"]
                    }, {
                        text: "確定要取消編輯嗎?",
                        ok: "Yes",
                        cancel: "No"
                    })
                    .always(function (ui) {
                        if (ui.state) {
                            // Clicked "OK"
                            _updatePage();
                        }
                    });
                // if (confirm("確定要取消編輯嗎?")) {
                //     _updatePage();
                // }
            } else if ($(e.target).hasClass("collapse-add")) {
                // 大雷 要加[0]才能取到資料
                // console.log($(e.target)[0].dataset.key);
                var $key = $(e.target)[0].dataset.key;
                // 此處[0]對應到表格
                // 再接下來[0]~[4]依序為各input
                // for(let i = 0; i < 5; i++){
                //     console.log($("#" + $key + " form")[0][i].value);
                // }
                Ply.dialog("confirm", {
                        effect: ["fall", "scale"]
                    }, {
                        text: "確定要保存更改嗎?",
                        ok: "Save",
                        cancel: "cancel"
                    }, {
                        opacity: 0,
                        backgroundColor: "red"
                    })
                    .always(function (ui) {
                        if (ui.state) {
                            // Clicked "OK"
                            _updateToDo($key);
                        }
                    });
                // if (confirm("確定要保存更改嗎?")) {
                //     _updateToDo($key);
                // }
            }
        } else if (e.target.nodeName === "I") {
            var $key = $(e.target)[0].dataset.key;
            if ($(e.target).hasClass("fa-trash")) {
                if (confirm("確定要刪除嗎?")) {
                    // 修復資料刪光時,db.on不會更新資料,造成畫面上還有最後一則刪不掉的todo(但DB已刪)
                    todoLen.all--;
                    if (todoLen.all == 0) {
                        // console.log("zero")
                        allToDo = {},
                            allToDo_sort = [],
                            progressToDo = [],
                            completedToDo = [];
                        todo_content.innerHTML = "";
                    }
                    // console.log(todoLen.all);
                    db.ref("/todo/" + $(e.target)[0].dataset.key).remove();
                    // 刪除mysort中對應的key
                    var allKey = [];
                    var tmp = {};
                    for(let key in dataSort){
                        if (dataSort[key] != $(e.target)[0].dataset.key){
                            allKey.push(dataSort[key]);
                        }
                    }
                    for (var i = 0; i < allKey.length; i++) {
                        tmp[i] = allKey[i];
                    }
                    // 將對應的資料移除
                    db.ref("/mysort" + $(e.target)[0].dataset.key).remove();
                    // 刪除排序中對應的key
                    db.ref("/mysort").set(tmp);
                }
            } else if ($(e.target).hasClass("fa-star")) {
                // star功能
                if ($(e.target).hasClass("full-star")) {
                    // 已標注>取消
                    _updateToDo($key, "no");
                } else {
                    // 未標注>標注
                    _updateToDo($key, "yes");
                }
            }
        } else if (e.target.nodeName === "INPUT") {
            var $key = $(e.target)[0].dataset.key;
            // console.log($(e.target)[0].className);
            if ($(e.target)[0].className === "todo-not-end") {
                // 未完成>完成
                _updateToDo($key, "", "yes");
            } else if ($(e.target)[0].className === "todo-end") {
                // 完成>未完成
                _updateToDo($key, "", "no");
            }
        }
    }

    function _updateToDo(mykey, mystar, mydone) {
        var $tmp = $("#" + mykey + " form")[0];
        mystar = mystar || allToDo[mykey].star;
        mydone = mydone || allToDo[mykey].done;
        // title不能修改為空
        if ($tmp[0].value != "") {
            db.ref("/todo/" + mykey).update({
                content: $tmp[0].value,
                comment: $tmp[4].value,
                star: mystar,
                done: mydone,
                dead_date: $tmp[1].value,
                dead_time: $tmp[2].value,
                update_time: _DateTimezone(8)
            });
        } else {
            alert("標題不能為空");
        }
    }

    function _checkDeadDate(date) {
        if (date) {
            // 2018-06-08 取第五個index後的所有字元來去掉2018-
            return `<span class="mr-2"><i class="far fa-calendar-alt"></i> ${date.substr(5)}</span>`;
        }
        return "";
    }

    function _checkComment(date) {
        if (date) {
            return `<i class="far fa-comment-dots"></i>`;
        }
        return "";
    }

    function _checkStarOuter(data) {
        if (data === "yes") {
            return "todo-star";
        }
        return "";
    }

    function _checkStarIcon(data) {
        if (data === "yes") {
            return "fas full-star";
        } else {
            return "far";
        }
    }

    function _checkDoneClass(data) {
        if (data === "yes") {
            return "todo-end";
        } else {
            return "todo-not-end";
        }
    }

    function _checkDone(data) {
        if (data === "yes") {
            return "checked";
        } else {
            return "";
        }
    }

    function _checkDelText(data) {
        if (data === "yes") {
            return "del-text";
        } else {
            return "";
        }
    }

    function init() {
        _getData();
        _eventBind();
        // console.log("init");
    }

    return {
        init
    }

})();