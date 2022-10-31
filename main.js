const serverurl = "http://localhost/";
const siteurl = serverurl + "NITCMarket/";
const storage = siteurl + "storage/";

const user_propic = {
    init() {
        this.profilepic = document.getElementById("user_propic").children[0];
    },
    set(url) {
        this.profilepic.src = url;
    }
}

const App = {
    init() {
        this.app = document.getElementById("app");
    },
    sethtml(html) {
        this.app.innerHTML = html;
    }
}

const SideBar = {
        init() {
            this.sidebar = document.getElementById("sidebar");
            this.sidebarlayer = document.getElementById("sidebarlayer");
            this.sidebarlayer.style.zIndex = 1;
            this.sidebarlayer.style.background = "#000000af";
            this.opts = document.getElementById("opts");
            SideBar.hide();
            SideBar.setopts(false);
        },
        hide() {
            this.sidebar.style.maxWidth = "0px";
            this.sidebarlayer.style.width = "0vw";
        },
        show() {
            this.sidebar.style.maxWidth = "650px";
            this.sidebarlayer.style.width = "100vw";
        },
        setopts(_user = false) {
            const _user_ins = User.get();
            if (_user) {
                const isadmin = _user_ins.role == "admin";
                this.opts.innerHTML = `
        <div class="ele">
            <div class="opt" onclick="Home()">Home</div>
        </div>
        <div class="ele">
            <div class="opt" onclick="PostItemPage()">Post Item</div>
        </div>
        <div class="ele">
            <div class="opt" onclick="MyPosts()">My Posts</div>
        </div>
        <div class="ele">
            <div class="opt" onclick="ShowAccount()">Account</div>
        </div>
        ${isadmin?`
        <div class="ele">
            <div class="opt" onclick="ListUsers()">List users</div>
        </div>`:''}
        <div class="ele">
            <div class="opt" onclick="LogOut()">LogOut</div>
        </div>
        `;

        } else {
            this.opts.innerHTML = `
            <div class="ele">
                <div class="opt" onclick="Home()">Home</div>
            </div>
            <div class="ele">
                <div class="opt" onclick="LoginPage()">Login/Register</div>
            </div>
        `;
        }
    }
}
const User = {
    init() {
        this.data = {
            uuid: "nil",
            name: "Anonymous",
            email: "anony@gmail.com",
            role: "user",
            imgurl: "user.png",
            password: "nil",
            phno: "+919876453425"
        }
    },
    set(_data) {
        if (_data.password)
            _data.password = "nil";
        this.data = _data;
        if (_data.imgurl == "nil" || _data.imgurl == undefined || _data.imgurl == null) {
            user_propic.set(siteurl + "/user.png");
        } else {
            user_propic.set(_data.imgurl);
        }
        SideBar.setopts(_data);
    },
    get() {
        return this.data;
    }
}

const Searchbar = {
    init() {
        this.element = document.getElementsByClassName("searchbar")[0];
        this.searchfield = document.getElementById("serachstring");
        this.searchicon = document.getElementById("searchicon");
        Searchbar.show();
    },
    hide() {
        this.element.style.display = "none";
        this.searchicon.style.display = "block";
        this.searchfield.value = "";
    },
    show(_focus = false) {
        this.element.style.display = "flex";
        this.searchicon.style.display = "none";
        this.searchfield.value = "";
        if (_focus) {
            this.searchfield.focus();
        }
    },
    search() {
        var string = this.searchfield.value.trim();
        if (string.length != 0) {
            SearchResult(string);
            this.hide();
        } else {
            this.show(true);
        }
    }
}

const loginerrormodule = {
    show() {
        var element = document.getElementById("_loginerror");
        element.innerHTML = "Login Error";
    },
    hide() {
        var element = document.getElementById("_loginerror");
        element.innerHTML = "";
    }
}

const PoPUp = {
    //Error popup
    init() {
        this.ele = document.getElementById("popup")
    },
    show(title, msg, _class) {
        let html_ = `
        <div class="wrapbox dfcc">
            <div class="title ${_class}">${title}</div>
            <div class="msg">${msg}</div>
            <i class="fa fa-times-circle-o" aria-hidden="true" onclick="PoPUp.hide()"></i>
        </div>`;
        this.ele.innerHTML = html_;
        this.ele.classList = "dfc show";
    },
    hide() {
        this.ele.innerHTML = "";
        this.ele.classList = "dfc";
    },
    setname(val){
        let html_ = `
        <div class="wrapbox dfcc" onclick="if(event.stopPropagation){event.stopPropagation();}event.cancelBubble=true;">
            <div class="title">Type new name</div>
            <div class="msg"><input type='text' value="${val}" class="askpopup" id="setname"></div>
            <div>
                <i class="fa fa-check-circle-o" aria-hidden="true" style="color:#0f0" onclick="changename()"></i>
                <i class="fa fa-times-circle-o" aria-hidden="true" style="color:#f00" onclick="PoPUp.hide()"></i>
            </div>
        </div>`;
        this.ele.innerHTML = html_;
        this.ele.classList = "dfc show";
    },
    setnumber(val){
        let html_ = `
        <div class="wrapbox dfcc" onclick="if(event.stopPropagation){event.stopPropagation();}event.cancelBubble=true;">
            <div class="title">Type mobile number</div>
            <div class="msg"><input type='text' value="${val}" class="askpopup" id="setnumber"></div>
            <div>
                <i class="fa fa-check-circle-o" aria-hidden="true" style="color:#0f0" onclick="changenumber()"></i>
                <i class="fa fa-times-circle-o" aria-hidden="true" style="color:#f00" onclick="PoPUp.hide()"></i>
            </div>
        </div>`;
        this.ele.innerHTML = html_;
        this.ele.classList = "dfc show";
    },
    setpassword(){
        let html_ = `
        <div class="wrapbox dfcc" onclick="if(event.stopPropagation){event.stopPropagation();}event.cancelBubble=true;">
            <div class="title">ChangePassword</div>
            <div class="msg"><input type='password' class="askpopup" id="pass1" placeholder='old password'></div>
            <div class="msg"><input type='password' class="askpopup" id="pass2" placeholder='new password'></div>
            <div class="msg"><input type='password' class="askpopup" id="pass3" placeholder='re-type new password'></div>
            <div>
                <i class="fa fa-check-circle-o" aria-hidden="true" style="color:#0f0" onclick="changepassword()"></i>
                <i class="fa fa-times-circle-o" aria-hidden="true" style="color:#f00" onclick="PoPUp.hide()"></i>
            </div>
        </div>`;
        this.ele.innerHTML = html_;
        this.ele.classList = "dfc show";
    }
}

function LogOut() {
    User.set({
        uuid: "nil",
        name: "",
        email: "",
        role: "",
        imgurl: "user.png",
        password: "nil",
        phno: ""
    });
    LoginPage();
    SideBar.setopts(false);
}

//Post request -- It will sxtract data as JSON format

function Post(url, data, onready, eparam) {
    var req = new XMLHttpRequest();
    req.open('POST', url, true);
    req.send(data);
    req.onreadystatechange = (e) => {
        if (req.readyState == 4) {
            onready(req.response, eparam);
        }
    }
}

//Switch between login and register views
function showlogin(_show = true) {
    const login_btn = document.getElementById("login_btn");
    const register_btn = document.getElementById("register_btn");
    login_btn.classList = "lele";
    register_btn.classList = "lele";
    const lr_datas = document.getElementById("lr_datas");
    lr_datas.innerHTML =
        `
        <input type="email" id="email" placeholder="Email">
        <input type="password" placeholder="Password" id="password">
        <div style="color: red;font-size: 1.2rem;" id="_loginerror"></div>
        <button onclick="_Login()">Login</button>
        `;
    if (_show) {
        login_btn.classList.add("a");
    } else {
        register_btn.classList.add("a");
        lr_datas.innerHTML =
            `
            <input type="text" placeholder="Name" id="name">
            <input type="text" placeholder="mobile no" id="phno">
            <input type="email" id="email" placeholder="Email">
            <input type="password" placeholder="Password" id="password">
            <button onclick="_Register()">Register</button>
            `;
    }
}

//Calls reg api
function _Register() {
    const name = document.getElementById("name").value;
    const phno = document.getElementById("phno").value;
    const password = document.getElementById("password").value;
    const email = document.getElementById("email").value;
    var url = siteurl + "main.php";
    var data = new FormData();
    data.append('status', 'reguser');
    data.append('name', name);
    data.append('phno', phno);
    data.append('email', email);
    data.append('imgurl', "nil");
    data.append('password', password);
    Post(url, data, (result) => {
        console.log(result);
        result = JSON.parse(result);
        console.log(result);
        User.set(result);
        ShowAccount();
    });
}

//Calls login api
function _Login(callback = Home) {
    const password = document.getElementById("password").value;
    const email = document.getElementById("email").value;
    var url = siteurl + "main.php";
    var data = new FormData();
    data.append('status', 'login');
    data.append('email', email);
    data.append('password', password);
    loginerrormodule.hide();
    Post(url, data, (result) => {
        console.log(result);
        result = JSON.parse(result);
        console.log(result);
        if (result == "error") {
            loginerrormodule.show();
        } else {
            User.set(result);
            callback();
        }
    });

}

//Renders Login/Register Page
function LoginPage() {
    const _app = App.app;
    _app.innerHTML = `
    <div class="dfcc c full">
        <div class="gbox">
            <div class="dfc">
                <div class="lele a" onclick="showlogin(true)" id="login_btn">Login</div>
                <div class="lele" onclick="showlogin(false)" id="register_btn">Register</div>
            </div>
            <div class="dfcc" id="lr_datas">
                <input type="email" id="email" placeholder="Email">
                <input type="password" placeholder="Password" id="password">
                <div style="color: red;font-size: 1.2rem;" id="_loginerror"></div>
                <button onclick="_Login()">Login</button>
            </div>
        </div>
    </div>`;
    SideBar.hide();
    Searchbar.hide();
}

//Get account details from api
function ShowAccount() {
    if (User.get().uuid == "nil") {
        console.log("No User");
        return;
    }
    var url = siteurl + "main.php";
    var data = new FormData();
    data.append('status', 'specificuserdata');
    data.append('uuid', User.get().uuid);
    Post(url, data, (dat) => {
        dat = JSON.parse(dat);
        _AccountPage(dat);
    });
}

//Show others profile
function ShowProfile(uuid) {
    var url = siteurl + "main.php";
    var data = new FormData();
    data.append('status', 'specificuserdata');
    data.append('uuid', uuid);
    Post(url, data, (dat) => {
        dat = JSON.parse(dat);
        _AccountPage(dat);
    });
}

//Renders AccountDetails
function _AccountPage(_data) {
    if (User.get().uuid == "nil") {
        LoginPage();
        return;
    }
    const _app = App.app;
    const _role = _data.role;
    console.log(_data.imgurl);
    const _imgurl = (_data.imgurl == "nil" || _data.imgurl == undefined || _data.imgurl == null) ? "user.png" : _data.imgurl;
    _app.innerHTML = `
    <div class="dfcc c full">
        <div class="gbox account dfcc">
            <div class="imgwrap dfc"><img src=${_imgurl} alt="no - image"></div>
            ${_data.uuid == User.get().uuid?`
            <label for="image"><i class="fa fa-camera"></i></label>
            <input type="file" id="image" accept="image/*" style="width:0px;height:0px" onchange="SetImage()"/>
            `:``}
            ${_role=="admin"?`<div class="user_datas">Admin</div>`:""}
            <div class="dfc user_datas">
                <div class="userdata">${_data.name}</div>
                ${_data.uuid == User.get().uuid?`<i class="fa fa-edit" onclick='PoPUp.setname("${_data.name}")'></i>`:""}
            </div>
            <div class="dfc user_datas">
                <div class="userdata">${_data.phno}</div>
                ${_data.uuid == User.get().uuid?`<i class="fa fa-edit" onclick='PoPUp.setnumber("${_data.phno}")'></i>`:""}
            </div>
            <div class="user_datas">${_data.email.toLowerCase()}</div>
            <div class="dfc user_datas">
                ${_data.uuid == User.get().uuid?`<button onclick='PoPUp.setpassword()' >Change Password</button>`:""}
            </div>
            ${User.get().role=="admin" && User.get().uuid!=_data.uuid?`<button onclick='DeleteUser(${_data.uuid})' class='del'>Delete User</button>`:""}
        </div>
    </div>`;
    SideBar.hide();
    Searchbar.hide();
}
function ListUsers(){
    var url = siteurl + "main.php";
    var data = new FormData();
    data.append('status', 'getallusers');
    data.append('uuid', User.get().uuid);
    Post(url, data, (dat) => {
        dat = JSON.parse(dat);
        console.log(dat);
        let ini_html=`<div class="main_head">All Users</div>`;
        let _html=ini_html;
        for(const i in dat){
            _html+=`<div class="pbox" onclick="ShowProfile(${dat[i].uuid})">
            <div class="iwrap dfc clamp200">
                <img src=${dat[i].imgurl} alt="No image uploaded">
            </div>
            <div class="cwrap dfc">
                <div>
                    <div class="name">Name : ${dat[i].name}</div><br><br>
                    <div class="name">UID : ${dat[i].uuid}</div><br><br>
                </div>
            </div>
        </div>`;
        }
        App.sethtml(`
        <div class="products">
            ${_html==ini_html?`
                ${ini_html}
                <h3>No users are here</h3>
            `:`${_html}`}
        </div>
        `);
        SideBar.hide();
        Searchbar.show();
    });

}
function DeleteUser(user_id){
    var url = siteurl + "main.php";
    var data = new FormData();
    data.append('status', 'deleteuser');
    data.append('user_id', user_id);
    data.append('uuid', Number(User.get().uuid));
    Post(url, data, (data)=>{
        console.log(data);
        ListUsers();
    })
}

function changename(){
    let _name=document.getElementById("setname").value.trim();
    var url = siteurl + "main.php";
    var data = new FormData();
    data.append('status', 'changename');
    data.append('name', _name);
    data.append('uuid', Number(User.get().uuid));
    Post(url, data, (data)=>{
        console.log(data);
        PoPUp.hide();
        ShowAccount();
    })
}

function changenumber(){
    let _name=document.getElementById("setnumber").value.trim();
    var url = siteurl + "main.php";
    var data = new FormData();
    data.append('status', 'changenumber');
    data.append('number', _name);
    data.append('uuid', Number(User.get().uuid));
    Post(url, data, (data)=>{
        console.log(data);
        PoPUp.hide();
        ShowAccount();
    })
}
function changepassword(){
    const pass1=document.getElementById("pass1").value.trim();
    const pass2=document.getElementById("pass2").value.trim();
    const pass3=document.getElementById("pass3").value.trim();
    if(pass1.length<8||pass2.length<8||pass2!=pass3){
        PoPUp.hide();
        PoPUp.show("Error","Try Again...","error");
        return;
    }
    var url = siteurl + "main.php";
    var data = new FormData();
    data.append('status', 'changepassword');
    data.append('pass1', pass1);
    data.append('pass2', pass2);
    data.append('uuid', Number(User.get().uuid));
    Post(url, data, (data)=>{
        PoPUp.hide();
        data=JSON.parse(data);
        if(data.error){
            PoPUp.show("Error","Wrong Password","error");
        }
    })
}
//Update UserImage
function SetImage(){
    //["lhkjh","png"]
    const _image=document.getElementById("image").files[0];
    const _imgname=User.get().uuid+"."+_image.name.split(".")[1];
    var url = siteurl + "main.php";
    var data = new FormData();
    data.append('status', 'updateimg');
    data.append('image', _image);
    data.append('name', _imgname);
    data.append('uuid', Number(User.get().uuid));
    Post(url, data, (data)=>{
        console.log(data);
        data=JSON.parse(data);
        const _userdata=data.userdata;
        const tempimg=URL.createObjectURL(_image);
        User.set(_userdata);
        User.data.imgurl=tempimg;
        user_propic.set(tempimg);
        _AccountPage(_userdata);
    });
}

//Renders page to Add or Suggest Place by admin or user
function PostItemPage(){
    if(User.get().uuid=="nil"){
        LoginPage();
        return;
    }
    App.sethtml(`
            <div class="dfc full">
                <div class="addclass dfcc">
                    <div class="main_head">New Post</div>
                    <input type="text" id="title" placeholder="title">
                    <input type="text" id="description" placeholder="description">
                    <input type="number" id="cost" placeholder="cost">
                    <input type="file" placeholder="images" id="images" multiple accept="image/*">
                    <i class="fa fa-plus-circle spplus" onclick="PostItem()"></i>
                </div>
            </div>`
    );
    SideBar.hide();
    Searchbar.hide();
}

//Calling api to Add or Suggest Place by admin or user
function PostItem(){
    const _title=document.getElementById("title").value.toLowerCase();
    const _description=document.getElementById("description").value.toLowerCase();
    const _cost=document.getElementById("cost").value;
    const _images=document.getElementById("images").files;
    var url = siteurl + "main.php";
    var data = new FormData();
    data.append('status', 'postitem');
    data.append('uuid',User.get().uuid);
    data.append('title',_title);
    data.append('description',_description);
    data.append('cost',_cost);
    var totalimages = _images.length;
    for (var index = 0; index < totalimages; index++) {
      data.append("files[]", _images[index]);
    }
    console.log(data);
    Post(url, data,(dat)=>{
        console.log(dat);
        Home();
    });
}

//Get Most Rated places from api
function getitems(callback){
    var url = siteurl + "main.php";
    var data = new FormData();
    data.append('status', 'getitems');
    Post(url, data,(dat)=>{
        console.log(dat);
        callback(dat);
    });
}

//Renders HomePage
function Home(){
    var user_exsists=User.get().uuid!="nil";
    getitems((data)=>{
        const _items=JSON.parse(data);
        var ini_html=`<div class="main_head">Available Items</div>`;
        var _html=ini_html;
        for(const i in _items){
            const _item=_items[i];
            _html+=`
            <div class="pbox" onclick="${user_exsists?`ShowItem(${_item.uuid})`:`LoginPage()`}">
                <div class="iwrap dfc">
                    <img src=${_item.imglink} alt="No image uploaded">
                </div>
                <div class="cwrap dfc">
                    <div>
                        <div class="name">${_item.name}</div><br/><br/>
                        <div class="name">price : ₹${_item.cost}</div><br/><br/>
                        <div class="name">claims : ${_item.count}</div>
                    </div>
                </div>
            </div>`;
        }
        App.sethtml(`
        <div class="products">
            ${_html==ini_html?`
                ${ini_html}
                <h3>No Items are here</h3>
            `:`${_html}`}
        </div>
        `);
        SideBar.hide();
        Searchbar.show();
    });
}

function ClaimItem(itemid){
    var url = siteurl + "main.php";
    var data = new FormData();
    data.append('status', 'claimitem');
    data.append('item_id', itemid);
    data.append('uuid', User.get().uuid);
    Post(url, data,(data,itemid)=>{
        ShowItem(itemid);
    },itemid);
    
}
function RemoveClaim(itemid){
    var url = siteurl + "main.php";
    var data = new FormData();
    data.append('status', 'removeclaimitem');
    data.append('item_id', itemid);
    data.append('uuid', User.get().uuid);
    Post(url, data,(data,itemid)=>{
        console.log(data);
        data=JSON.parse(data);
        console.log(data);
        if(data.error=='accepted'){
            PoPUp.show("Error!","Can't remove claim accepted item, contact seller.","error");
        }
        else
            ShowItem(itemid);
    },itemid);
    
}

//Renders SearchPage , api calling included
function SearchResult(string){
    var user_exsists=User.get().uuid!="nil";
    var url = siteurl + "main.php";
    var data = new FormData();
    data.append('status', 'searchitem');
    data.append('string', string);
    Post(url, data,(data)=>{
        const _items=JSON.parse(data);
        console.log(_items);
        var ini_html = `<div class="main_head">Search Results</div>`;
        var _html=ini_html;
        for(const i in _items){
            const _item=_items[i];
            _html+=`
            <div class="pbox" onclick="${user_exsists?`ShowItem(${_item.uuid})`:`LoginPage()`}">
                <div class="iwrap dfc">
                    <img src=${_item.imglink} alt="No image uploaded">
                </div>
                <div class="cwrap dfc">
                    <div>
                        <div class="name">${_item.name}</div><br/><br/>
                        <div class="name">price : ₹${_item.cost}</div><br/><br/>
                        <div class="name">claims : ${_item.count}</div>
                    </div>
                </div>
            </div>`;
        }
        App.sethtml(`
        <div class="products">
            ${_html==ini_html?`
                ${ini_html}
                <h3>No Items are here</h3>
            `:`${_html}`}
        </div>
        `);
        SideBar.hide();
        Searchbar.hide();
    });
}

function MyPosts(){
    var url = siteurl + "main.php";
    var data = new FormData();
    data.append('status', 'myposts');
    data.append('uuid', User.get().uuid);
    Post(url, data,(data)=>{
        const _items=JSON.parse(data);
        console.log(_items);
        var ini_html = `<div class="main_head">Your Posts</div>`;
        var _html=ini_html;
        for(const i in _items){
            const _item=_items[i];
            _html+=`
            <div class="pbox" onclick="ShowItem(${_item.uuid})">
                <div class="iwrap dfc">
                    <img src=${_item.imglink} alt="No image uploaded">
                </div>
                <div class="cwrap dfc">
                    <div>
                        <div class="name">${_item.name}</div><br/><br/>
                        <div class="name">price : ₹${_item.cost}</div><br/><br/>
                        <div class="name">claims : ${_item.count}</div>
                    </div>
                </div>
            </div>`;
        }
        App.sethtml(`
        <div class="products">
            ${_html==ini_html?`
                ${ini_html}
                <h3>You don't have any posts</h3>
            `:`${_html}`}
        </div>
        `);
        SideBar.hide();
        Searchbar.hide();
    });
}
function DeletePost(item_id){
    var url = siteurl + "main.php";
    var data = new FormData();
    data.append('status', 'deleteitem');
    data.append('item_id', item_id);
    data.append('uuid', User.get().uuid);
    Post(url, data,(dat)=>{
        console.log(dat);
        const _data=JSON.parse(dat);
        console.log(_data);
        Home();
    });
}

//Shows a particular item with full details
function ShowItem(_uuid){
    if(User.get().uuid=="nil"){
        LoginPage();
        return;
    }
    var url = siteurl + "main.php";
    var data = new FormData();
    data.append('status', 'getitem_fd');
    data.append('item_uuid', _uuid);
    data.append('uuid', User.get().uuid);
    Post(url, data,(dat)=>{
        console.log(dat);
        const _data=JSON.parse(dat);
        console.log(_data)
        const _item = _data.item_details;
        const _images = _data.images;
        const _poster = _data.poster;
        App.sethtml(`
        <div class="dfc d full">
            <div class="gbox class">
                <div class="main_head">${Caps(_item.name)}</div>
                <div class="chmedia">
                    ${genslider(_images)}
                    <div class="dfcc">
                        <div class="data des">${_item.description}</div>
                    </div>
                </div>
                <div class="dfcc">
                    <div class="data seller">Price : <b>₹${_item.cost}</b></div>
                </div>
                <div class="dfcc">
                    <div class="data seller">Seller : <b onclick='ShowProfile(${_poster.uuid})'>${_poster.name}</b></div>
                </div>
                ${_poster.uuid==User.get().uuid || User.get().role=="admin"?`
                <div class="dfc">
                    <div class='post del' onclick='DeletePost(${_item.uuid})'>Delete</div>
                </div>
                `:''}
                <div class="dfcc" id='getclaimers'></div>
                ${_poster.uuid==User.get().uuid?GetClaimers(_item.uuid):`
                <div class="dfcc">
                    <button id="claimbtn" ${_item.mycount==0?`onclick='ClaimItem(${_item.uuid})'`:`onclick='RemoveClaim(${_item.uuid})'`}>${_item.mycount==0?'Claims':'Remove Claim'}(${_item.count})</button>
                </div>`}
                ${_item.mycount==0?'':`
                    <div class="dfc claimstatus">Claim Status : ${_item.mycount.status}</div>
                `}
            </div>
        </div>`);
    });
    executeswiper();
    SideBar.hide();
    Searchbar.hide();
}
function GetClaimers(item_id){
    var url = siteurl + "main.php";
    var data = new FormData();
    data.append('status', 'getclaimers');
    data.append('item_uuid', item_id);
    data.append('uuid', User.get().uuid);
    Post(url, data,(dat)=>{
        console.log(dat);
        const _data=JSON.parse(dat);
        let inject_target=document.getElementById("getclaimers");
        let _html=`<div class='claimers'> Claimers </div>`;
        for(var i=0;i<_data.length;i++){
            let claimer=_data[i];
            let btn_html='';
            if(claimer.status!='not decided')
                btn_html+=`<div class='claimer_btn' onclick="NullClaim(${item_id},${claimer.userid})"> Keep Waiting </div>`;
            if(claimer.status!='accepted')
                btn_html+=`<div class='claimer_btn' onclick="AcceptClaim(${item_id},${claimer.userid})"> Accept </div>`;
            if(claimer.status!='rejected')
                btn_html+=`<div class='claimer_btn' onclick="RejectClaim(${item_id},${claimer.userid})"> Reject </div>`;
            _html+=`<div class='claimer'>
                <div class='claimer_name'> ${claimer.name} </div>
                <div class='claimer_name'> ${Caps(claimer.status)} </div>
                ${btn_html}
            </div>`
        }
        if(_html==`<div class='claimers'> Claimers </div>`){
            _html+=`<div class='claimer'>No one claimed yet.</div>`
        }
        inject_target.innerHTML=_html;
    });
    return '';
}

function AcceptClaim(itemid,userid){
    var url = siteurl + "main.php";
    var data = new FormData();
    data.append('status', 'acceptclaim');
    data.append('item_id', itemid);
    data.append('uuid', User.get().uuid);
    data.append('user_id', userid);
    Post(url, data,(data,itemid)=>{
        console.log(data);
        ShowItem(itemid);
    },itemid);
}
function RejectClaim(itemid,userid){
    var url = siteurl + "main.php";
    var data = new FormData();
    data.append('status', 'rejectclaim');
    data.append('item_id', itemid);
    data.append('uuid', User.get().uuid);
    data.append('user_id', userid);
    Post(url, data,(data,itemid)=>{
        console.log(data);
        ShowItem(itemid);
    },itemid);
}
function NullClaim(itemid,userid){
    var url = siteurl + "main.php";
    var data = new FormData();
    data.append('status', 'nullclaim');
    data.append('item_id', itemid);
    data.append('uuid', User.get().uuid);
    data.append('user_id', userid);
    Post(url, data,(data,itemid)=>{
        console.log(data);
        ShowItem(itemid);
    },itemid);
}

//Image Slider Manager
function genslider(imglinks){
    var _html= `
    <style>
    .swiper {
        width: 80vw;
        height: 300px;
        max-width:500px;
        margin:20px auto;
      }
    </style>
    <div class="swiper">
  <!-- Additional required wrapper -->
  <div class="swiper-wrapper">
    <!-- Slides -->
    `;
    for(var i=0;i<imglinks.length;i++){
        _html+=`<div class="imgslide swiper-slide">
            <img src=${imglinks[i]}>
        </div>`
    }
    _html+=`
  </div>

  <!-- If we need navigation buttons -->
  <div class="swiper-button-prev"></div>
  <div class="swiper-button-next"></div>
</div>
    `;
    return _html;
}
//To Wait sometime
async function timer(ms){
    return new Promise((resolve) => setTimeout(resolve, ms));
}
//Giving Image slides , sliding behaviour
async function executeswiper(){
    await timer(200);
    const swiper = new Swiper('.swiper', {
        direction: 'horizontal',
        loop: true,
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
        }
      });
}

function Caps(_str) {
    var string = _str;
    return string[0].toUpperCase()+string.slice(1);
}

user_propic.init();
user_propic.set("user.png");
App.init();
SideBar.init();
User.init();
Searchbar.init();
PoPUp.init();
Home();