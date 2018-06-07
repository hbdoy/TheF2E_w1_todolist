var get_start = (function () {
    var newToDo = document.querySelector("#add-text-bar");
    var page_all = document.querySelector("#pills-all");
    var page_progress = document.querySelector("#pills-progress");
    var page_completed = document.querySelector("#pills-completed");
    var todo_content = document.querySelector("#todo_content");
    var tmpToDo = {};

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

    function _getData() {
        db.ref('/todo').on('value', function (snapshot) {
            var data = snapshot.val();
            if (data) {
                console.log(data);
                tmpToDo = data;
                _updatePage(data);
            }
        });
    }

    function _eventBind() {
        newToDo.addEventListener("keydown", _addNewTodo);
        todo_content.addEventListener("click", _checkForAction);
    }

    function _addNewTodo(e) {
        if (e.keyCode == 13 && this.value != "") {
            console.log(this.value);
            db.ref("/todo").push({
                content: this.value,
                comment: "",
                done: false,
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

    function _updatePage(data) {
        var str = "";
        for (let key in data) {
            str += `
            <div class="mb-2">
                <div class="all-content p-md-3 py-3 px-1">
                    <div class="row">
                        <div class="col-1">
                            <label class="my-checkbox mr-auto">
                                <input type="checkbox">
                                <span class="checkmark"></span>
                            </label>
                        </div>
                        <div class="col-lg-9 col-8 pl-lg-0" data-toggle="collapse" data-target="#${key}" aria-expanded="false" style="cursor: pointer">
                            <div class="text-truncate">${data[key].content}</div>
                        </div>
                        <div class="col-lg-2 col-3">
                            <div class="edit-icon">
                                <i class="far fa-star mr-3"></i>
                                <i class="fas fa-pencil-alt mr-lg-3" data-toggle="collapse" data-target="#${key}" aria-expanded="false"></i>
                                <i class="fas fa-trash d-none d-lg-inline-block" data-key="${key}"></i>
                            </div>
                        </div>
                    </div>
                    <div class="row quick-icon mt-2 ml-4">
                        <div class="col-10" data-toggle="collapse" data-target="#${key}" aria-expanded="false">
                            <i class="far fa-calendar-alt mr-2"></i>
                            <i class="far fa-file mr-2"></i>
                            <i class="far fa-comment-dots"></i>
                        </div>
                        <div class="col-2">
                            <i class="fas fa-trash d-inline-block d-lg-none" data-key="${key}"></i>
                        </div>
                    </div>
                </div>
                <div class="collapse mb-3" id="${key}">
                    <div class="px-4 py-3" style="border: 0;border-top: 2px solid #C8C8C8;background: #F2F2F2;">
                        <form>
                            <div class="form-group">
                                <div class="m-2">
                                    <i class="far fa-clipboard mr-1"></i>
                                    Title
                                </div>
                                <div class="mx-4">
                                    <input type="text" class="form-control" value="${data[key].content}">
                                </div>
                            </div>
                            <div class="form-group">
                                <div class="m-2">
                                    <i class="far fa-calendar-alt mr-1"></i>
                                    Deadline
                                </div>
                                <div class="row mx-4">
                                    <div class="col-6 pl-0">
                                        <input type="date" class="form-control">
                                    </div>
                                    <div class="col-6 pr-0">
                                        <input type="time" class="form-control" pattern="[0-9]{2}:[0-9]{2}">
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
                                    <textarea class="form-control" rows="3">${data[key].comment}</textarea>
                                </div>
                            </div>
                        </form>
                    </div>
                    <div class="d-flex justify-content-start">
                        <button type="button" class="collapse-cancel btn btn-block">
                            <i class="fas fa-times mr-1"></i>
                            Cancel
                        </button>
                        <button type="button" class="collapse-add btn btn-block m-0" data-key=${key}>
                            <i class="fas fa-plus mr-1"></i>
                            Add Task
                        </button>
                    </div>
                </div>
            </div>
            `;
        }
        todo_content.innerHTML = str;
    }

    function _checkForAction(e) {
        if (e.target.nodeName === "BUTTON") {
            if ($(e.target).hasClass("collapse-cancel")) {
                if (confirm("確定要取消編輯嗎?")) {
                    _updatePage(tmpToDo);
                }
            } else if ($(e.target).hasClass("collapse-add")) {
                // 大雷 要加[0]才能取到資料
                // console.log($(e.target)[0].dataset.key);
                var $key = $(e.target)[0].dataset.key;
                // 此處[0]對應到表格
                // 再接下來[0]~[4]依序為各input
                // console.log($("#" + key + " form")[0][4].value);
                if (confirm("確定要保存更改嗎?")) {
                    _updateToDo($key);
                }
            }
        } else if (e.target.nodeName === "I"){
            if ($(e.target).hasClass("fa-trash")) {
                if (confirm("確定要刪除嗎?")) {
                    db.ref("/todo/" + $(e.target)[0].dataset.key).remove();
                }
            }
        }
    }

    function _updateToDo(key) {
        var $tmp = $("#" + key + " form")[0];
        db.ref("/todo/" + key).update({
            content: $tmp[0].value,
            comment: $tmp[4].value,
            update_time: _DateTimezone(8)
        });
    }

    function init() {
        _getData();
        _eventBind();
        console.log("init");
    }

    return {
        init
    }

})();