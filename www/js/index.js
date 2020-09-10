/*
 * on_item contains all items listed for sale.
 * some would expire and some won't
 * each food menu is an item with a long life
 * each ticket entry is an item with an expiry life
 * each gas size is an item with a long life
 * each laundry item is an item with a long life
 * graphics
 * makeup
 * 
 */
 //\
 //||
 /*
 * TODO
 * notifications (post-a-reply) fetchMessageReplies buildReply
 * multiple sizes
 * withdraw from wallet
 * gallery for graphics and beauty
 * increase upload limit on server
 * buyers interface - products**
 *
 *
 * 
 *
 */
 $(document).ready(function() {

    document.addEventListener('deviceready', onDeviceReady, false);
    window.addEventListener('resize', handleResize, false);

    var VERSION = '1.0.0'
    //
    , MY_URL = "http://localhost/api/v1"
    // 
    // , MY_URL = "http://192.168.43.75/api/v1"
    //
    // , MY_URL = "http://172.20.10.4/api/v1"
    //
    // , MY_URL = "https://www.oncampus.ng/api/v1"
    //
    , BASE_URL = "https://www.oncampus.ng"
    //
    , PLATFORM = 'android'
    , Views = ['#splashView']
    , ChangingView = false
    //
    , VIEWPORTWIDTH = $(window).width()
    , VIEWPORTHEIGHT = $(window).height()
    , SQL = window.openDatabase("OnCampus", "1.0", "user records", 5 * 1024 * 1024)
    , Store = window.localStorage
    , UsernameRegexp = /^[_]{0,2}[a-zA-Z]+[a-zA-Z0-9_]{3,31}$/


    , MT=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
    , DY=['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday']



    , SPINNER = `<svg class="pull-to-refresh-spinner loaderN" width="32" height="32" viewBox="25 25 50 50">
          <circle class="pull-to-refresh-path" cx="50" cy="50" r="20" fill="none" stroke="#fe5215" stroke-width="4" stroke-miterlimit="10" />
        </svg>`
    , PAGELOADER = '<div class="loaderHolder box48 psa centered fx fx-ac fx-jc">' + SPINNER + '</div>'
    , $H = "<div class='fw fx ov-h bb bg mg-b16 ba psr'>\
            <div class='box120 mg-r fx fx-ac fx-jc ov-h bg-ac'></div>\
            <div class='fx60 pd10'></div>\
        </div>"

    , $MM = $('#menuModal')
    , $MF = $('#menuFlexer')



    /**/
    , UUID = null
    , EMAIL = null
    , USERNAME = null
    , CAMPUSKEY = 0
    , USERTYPE = 0
    , CATEGORY = 0


    , PHONE = null
    , FULLNAME = null
    , BIRTHDAY = null
    , ADDRESS = null


    , mDrawer = document.querySelector('#side-nav-menu-view')
    , mModal = document.querySelector('#side-nav-modal')
    , mNav = document.querySelector('#side-nav')



    , CURRENT_SHOP = null
    , CURRENT_ORDER = {}
    , ORDER_TOTAL = 0
    , CURRENT_ORDER_ID = null
    , PAYLOAD = null
    , TRN_REF = null

    , MY_ORDERS = []

    , CATEGORIES = ['', 'E-Commerce', 'Food Services', 'Event Tickets', 'Graphics Design', 'Make Up Artist', 'Dry Cleaning', 'Gas Delivery']
    , EVENTS = ['', 'Club Party', 'Pool Party', 'Hangout', 'Concert', 'Movie Ticket', 'House Party', 'Gaming Competition', 'Departmental Party', 'Departmental Dinner']
    , TICKETS = ['', 'Regular', 'Couple', 'VIP', 'VVIP', 'Table for 4', 'Table for 5', 'Table for 6', 'Table for 10']
    , LAUNDRIES = ['', 'Shirt', 'Trouser', 'Jeans', 'Suit', 'Jacket', 'Towel', 'Kaftan', 'Trad', 'Bedsheet', 'Rug', 'Abaya', 'Skirt', 'Socks', 'Singlet', 'Boxer', 'Duvet', 'Blanket', 'Scarf', 'Hoodie', 'Agbada', 'Bag', 'Shoes', 'Jalab']
    , GASES = ['', '3kg Cylinder', '5kg Cylinder', '6kg Cylinder', '12kg Cylinder']
    , GRAPHICS = ['', 'Logo', 'UI/UX', 'Banner and Flier Design', 'Branding and Corporate Designs', 'Digital Painting', 'Album Art', 'Motion Design']
    , MAKEUPS = ['', 'Craving brows', 'Light makeup', 'Nude makeup', 'Party rocker makeup', 'Bridal Makeup']

    , ACTIVESELECT = null
    , COLORPICKER = null

    , ITEMS_DATA = []

    , MY_MAILS = []




    , BROWSEROPTIONS = 'location=yes,closebuttoncolor=#FE5215,footer=no,hardwareback=no,hidenavigationbuttons=yes,toolbarcolor=#FFFFFF,shouldPauseOnSuspend=yes'
    ;

    /*SQL.transaction(function(i){
        i.executeSql("DROP TABLE IF EXISTS on_user");
    });
    Store.clear();*/


    var App = {
        // LeavingView: false,
        changeViewTo: function(View) {
            // console.log(this.Views);
            if (View === Views[Views.length - 1]/* || document.querySelector(View) == null*/) return; // cannot translate to self
            // if (ChangingView) return; // one ends before stacking another
            // ChangingView = true;
            // var active = $('.active-view').attr('id');
            $('.active-view').removeClass('active-view');
            $(View).addClass('active-view');
            Views.push(View); // current
            // LeavingView = false;
            // ChangingView = false;
            $('body').unspin();
        },
        closeCurrentView: function() {
            var active = Views.pop();
            var previous = Views.pop();
            this.changeViewTo(previous);
        },
        switchTabTo: function(Tab) {
            $('.active-tab').removeClass('active-tab');
            $(Tab).addClass('active-tab');
        }
    }

    function comma(x) {
        var parts = x.toString().split(".");
        if (parts[0].length < 4) return x;
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        return parts.join(".");
    }

    function handleResize() {
        if ($(window).height() < VIEWPORTHEIGHT * 0.9) $('.hideWhenShrink').addClass('hd');
        else $('.hideWhenShrink').removeClass('hd');
    }

    function onDeviceReady() {
        StatusBar.backgroundColorByHexString('#FE5215');
        document.addEventListener('backbutton', onBackButton, false);
        //online
        //resume
    }
    
    function onBackButton() {

        if ($('#menuModal').is(':visible')) return $('#menuModal').hide();
        if ($('#searchModal').is(':visible')) {
            $('#searchHeader').hide();
            $('#searchModal').hide();
            showAllOrderEntries();
            return;
        }
        if ($('#side-nav-modal').is(':visible')) return navEnd.call(mNav);
        //
        var activeView = document.querySelector('.active-view').id;
        //
        switch (activeView) {
            case 'home':
                var activeTab = document.querySelector('.active-tab').id;
                if (activeTab !== 'timeline') {
                    App.switchTabTo('#timeline');
                    $('.tab-locator').removeClass('c-o');
                    document.querySelector('.tab-locator[data-tab="#timeline"]').classList.add('c-o');
                }
                else if ($('#timeline-content').scrollTop() != 0) $('#timeline-content').scrollTop(0);
                else navigator.Backbutton.goHome();
                break;
            case 'splashView':
            case 'emailRegView':
            case 'signupView':
            case 'channelPrompt':
                navigator.Backbutton.goHome();
                break;
            default:
                App.closeCurrentView();
        }
    }

    $.fn.extend({
        spin: function(e) {
            if (e) this.html(e);
            else {
                if (this.find('.loaderHolder').length > 0) return this;
                this.append(PAGELOADER);
            }
            return this;
        },
        unspin: function() { this.find('.loaderHolder').remove(); return this; },
        hasID: function(id) { return this.attr('id') == id; },
        disable: function() { this.attr('data-disabled', 'true'); return this; },
        enable: function() { this.attr('data-disabled', 'false'); return this; },
        isDisabled: function() { return this.attr('data-disabled') == 'true'; },
        isLoading: function() { return this.find('.loaderN').length == 1; },
        blink: function() {
            var el = this;
            el.addClass('blink');
            setTimeout(function(){ el.removeClass('blink'); },2000);
            return el;
        },
        flash: function() {
            var el = this;
            el.addClass('flash');
            setTimeout(function(){ el.removeClass('flash'); },400);
            return el;
        },
        scrollToPosition: function(value, callback) {
            var h = this.prop('scrollHeight');
            this.animate({ scrollTop: h - value }, 500, callback);
            return this;
        },
        zoom: function(level) {
            var el = this;
            el.addClass('zoom');
            setTimeout(function(){ el.removeClass('zoom'); }, 300);
            return el;
        },
        countdown: function(callback) {
            var el = this;
            var v = Number(el.text());
            var tokenTime = setInterval(function() {
                --v;
                el.text(v);
                if (v == 0) {
                    callback();
                    clearInterval(tokenTime);
                }
            }, 1000);
            return this;
        },
        showPad: function(sendId) {
            this.html(`
            <div class="fw fx b f20 h40 ba b4-r mg-b"></div>
          <div class="input-6 i-b b4-r psr b ac token-code ba" data-code="1">
            <div class="fw fh fx f20 psa">1</div>
          </div><div class="input-6 i-b b4-r psr b ac token-code ba" data-code="2">
            <div class="fw fh fx f20 psa">2</div>
          </div><div class="input-6 i-b b4-r psr b ac token-code ba" data-code="3">
            <div class="fw fh fx f20 psa">3</div>
          </div><div class="input-6 i-b b4-r psr b ac token-code ba" data-code="4">
            <div class="fw fh fx f20 psa">4</div>
          </div><div class="input-6 i-b b4-r psr b ac token-code ba" data-code="5">
            <div class="fw fh fx f20 psa">5</div>
          </div><div class="input-6 i-b b4-r psr b ac token-code ba" data-code="6">
            <div class="fw fh fx f20 psa">6</div>
          </div><div class="input-6 i-b b4-r psr b ac token-code ba" data-code="7">
            <div class="fw fh fx f20 psa">7</div>
          </div><div class="input-6 i-b b4-r psr b ac token-code ba" data-code="8">
            <div class="fw fh fx f20 psa">8</div>
          </div><div class="input-6 i-b b4-r psr b ac token-code ba" data-code="9">
            <div class="fw fh fx f20 psa">9</div>
          </div><div class="input-6 i-b b4-r psr b ac token-code Red" data-code="x">
            <div class="fw fh fx f20 psa icon-times"></div>
          </div><div class="input-6 i-b b4-r psr b ac token-code ba" data-code="0">
            <div class="fw fh fx f20 psa">0</div>
          </div><div class="input-6 i-b b4-r psr b ac Theme code-submit" id="${sendId}">
            <div class="fw fh fx f20 psa icon-mark"></div>
          </div>`);
            return this;
        }
    });



    SQL.transaction(function(c) {
        c.executeSql(`CREATE TABLE IF NOT EXISTS on_user
            (id INTEGER PRIMARY KEY AUTOINCREMENT
            , uuid INT NOT NULL
            , email VARCHAR NOT NULL
            , username VARCHAR NOT NULL
            , phone VARCHAR NULL
            , user_type INT NOT NULL
            , channel INT NOT NULL DEFAULT '0'
            , campus_key INT NOT NULL DEFAULT '0'
            , fullname VARCHAR NULL
            , address VARCHAR NULL
            , birthday VARCHAR NULL
            , category INT NOT NULL
            )`,[], s => {
            //category=e-co,food,ticket,gas,graphics,laundry,makeup
                s.executeSql("SELECT * FROM on_user WHERE id = ?", [1], (k, result) => {
                    var len = result.rows.length;
                    if (len > 0) {//data found
                        var r = result.rows.item(0);
                          UUID = r.uuid
                        , EMAIL = r.email
                        , USERNAME = r.username
                        , CAMPUSKEY = r.campus_key
                        , USERTYPE = r.user_type
                        , PHONE = r.phone
                        , FULLNAME = r.fullname
                        , ADDRESS = r.address
                        , CATEGORY = r.category
                        , BIRTHDAY = r.birthday
                        ;
                        loadUserPicture();
                        if (r.channel == 0) showChannelScreen();
                        else preparePage(true);
                    }//else App.changeViewTo('#emailRegView');
                });
            });
    }, function() {/*error*/}, function() {/*success*/});
    function loadUserPicture() {
        var im = new Image();
        im.onload = function() {
            $('.user-display-picture').attr('src', im.src);
        }
        im.onerror = function() {
            $('.user-display-picture').attr('src', '');
        }
        im.src = MY_URL+'/img/users/'+UUID+'.jpg?id='+Date.now();
    }
    function showChannelScreen() {
        App.changeViewTo('#channelPrompt');
    }
    function preparePage(existing) {
        App.changeViewTo('#home');
        if (existing) checkMail();
        if (USERTYPE == 0) {//buyer
            $('.forSeller').addClass('hd');
            $('.forBuyer').removeClass('hd');
            fetchEvents('timeline', 10);
            fetchRestaurants('timeline', 10);
        } else if (USERTYPE == 1) {//seller
            $('.forSeller').removeClass('hd');
            $('.forBuyer').addClass('hd');
            $('.create-form:not([data-catg="'+CATEGORY+'"])').hide();
            var tx = CATEGORIES[CATEGORY];
            $('#my-service-name').text(tx);
            if (existing) {
                checkWallet();
                fetchProgress();
            }
        }
    }









    











    $('body').on('click', '.view-locator', function () {
        var View = this.dataset.view;
        // console.log(View);
        App.changeViewTo(View);
        
    }).on('click', '#profile-link', function() {
        var el = document.querySelector('#profile-edit-form');
        el.querySelector('input[name="fullname"]').value = FULLNAME;
        if (BIRTHDAY) el.querySelector('input[name="birthday"]').value = BIRTHDAY;
        el.querySelector('input[name="username"]').value = USERNAME;
        el.querySelector('input[name="phone"]').value = PHONE;
        el.querySelector('textarea[name="officeAddress"]').value = ADDRESS;
        App.changeViewTo('#profileEditor');
    }).on('click', '#logoutLink', function() {
        SQL.transaction(function(i){
            i.executeSql("DROP TABLE IF EXISTS on_user");
        });
        Store.clear();
        setTimeout(function() {
            window.location.reload();
        }, 300);
    }).on('mousedown', 'select', function(e) {
        e.preventDefault();
        ACTIVESELECT = this;
        //
        $(':focus').blur();//UI improvement
        //
        var options = this.options;
        var selIdx = this.selectedIndex;
        //
        var h = '';
        Array.prototype.slice.call(options).forEach(function(op, i) {
            h += '<div class="fx fx-ac c-g option pd1215 f16 bb" data-index="'+op.index+'" data-selected="'+(selIdx==i)+'">'+op.text+'</div>';
        });
        //
        $MM.show();
        $MF.html(h).zoom();
        return false;
    }).on('click', '.option', function() {
        var idx = this.dataset.index;
        ACTIVESELECT.selectedIndex = idx;
        if (ACTIVESELECT.id == 'channel-select') {
            if (idx == 0) return;
            $.ajax({
                url: MY_URL + "/send.php",
                data: {
                    action: 'adsChannel',
                    me: UUID,
                    channel: idx
                },
                timeout: 30000,
                dataType: 'json',
                method: "POST",
                success: function(p) {
                    if (p == 1) {
                        toast('Thanks for your feedback');
                        preparePage(false);
                        SQL.transaction(function(i) {
                            i.executeSql("UPDATE on_user SET channel=? WHERE id=?", [idx, 1]);
                        });
                    } else if (p == 0) {
                        toast('Network error. Try again');
                        ACTIVESELECT.selectedIndex = 0;
                    }
                },
                complete: function(x) {
                    if (x.status == 0) {
                        toast('Network error. Try again');
                        ACTIVESELECT.selectedIndex = 0;
                        $('body').unspin();
                    }
                }
            });
        }
    }).on('click', '.color-picker', function() {
        COLORPICKER = this;
        var h=`
        <div id="color-palette" class="pd010 b5 st-p">
            <div id="select-color" class="fx fx-ac pd16 bb" data-index="0">
                <div class="fx60">Select Color</div>
                <div id="color-palette-submit" class="modalClose c-o b">Done</div>
            </div>
            <div class="radio multipo psr fx fx-ac pd10 bb" data-index="137" data-hex="#FFFFFF">
                <div class="fx60">White</div>
                <div class="box32 i-b ba b-rd" style="background:#FFFFFF;" ></div>
            </div>
            <div class="radio multipo psr fx fx-ac pd10 bb" data-index="8" data-hex="#000000">
                <div class="fx60">Black</div>
                <div class="box32 i-b ba b-rd" style="background:#000000;" ></div>
            </div>
            <div class="radio multipo psr fx fx-ac pd10 bb" data-index="114" data-hex="#FF0000">
                <div class="fx60">Red</div>
                <div class="box32 i-b ba b-rd" style="background:#FF0000;" ></div>
            </div>
            <div class="radio multipo psr fx fx-ac pd10 bb" data-index="100" data-hex="#FFA500">
                <div class="fx60">Orange</div>
                <div class="box32 i-b ba b-rd" style="background:#FFA500;" ></div>
            </div>
            <div class="radio multipo psr fx fx-ac pd10 bb" data-index="139" data-hex="#FFFF00">
                <div class="fx60">Yellow</div>
                <div class="box32 i-b ba b-rd" style="background:#FFFF00;" ></div>
            </div>
            <div class="radio multipo psr fx fx-ac pd10 bb" data-index="52" data-hex="#008000">
                <div class="fx60">Green</div>
                <div class="box32 i-b ba b-rd" style="background:#008000;" ></div>
            </div>
            <div class="radio multipo psr fx fx-ac pd10 bb" data-index="10" data-hex="#0000FF">
                <div class="fx60">Blue</div>
                <div class="box32 i-b ba b-rd" style="background:#0000FF;" ></div>
            </div>
            <div class="radio multipo psr fx fx-ac pd10 bb" data-index="57" data-hex="#4B0082">
                <div class="fx60">Indigo</div>
                <div class="box32 i-b ba b-rd" style="background:#4B0082;" ></div>
            </div>
            <div class="radio multipo psr fx fx-ac pd10 bb" data-index="135" data-hex="#EE82EE">
                <div class="fx60">Violet</div>
                <div class="box32 i-b ba b-rd" style="background:#EE82EE;" ></div>
            </div>
            <div class="radio multipo psr fx fx-ac pd10 bb" data-index="49" data-hex="#FFD700">
                <div class="fx60">Gold</div>
                <div class="box32 i-b ba b-rd" style="background:#FFD700;" ></div>
            </div>
            <div class="radio multipo psr fx fx-ac pd10 bb" data-index="51" data-hex="#808080">
                <div class="fx60">Gray</div>
                <div class="box32 i-b ba b-rd" style="background:#808080;" ></div>
            </div>
            <div class="radio multipo psr fx fx-ac pd10 bb" data-index="110" data-hex="#FFC0CB">
                <div class="fx60">Pink</div>
                <div class="box32 i-b ba b-rd" style="background:#FFC0CB;" ></div>
            </div>
            <div class="radio multipo psr fx fx-ac pd10 bb" data-index="113" data-hex="#800080">
                <div class="fx60">Purple</div>
                <div class="box32 i-b ba b-rd" style="background:#800080;" ></div>
            </div>
            <div class="radio multipo psr fx fx-ac pd10 bb" data-index="96" data-hex="#000080">
                <div class="fx60">Navy</div>
                <div class="box32 i-b ba b-rd" style="background:#000080;" ></div>
            </div>
            <div class="radio multipo psr fx fx-ac pd10 bb" data-index="123" data-hex="#C0C0C0">
                <div class="fx60">Silver</div>
                <div class="box32 i-b ba b-rd" style="background:#C0C0C0;" ></div>
            </div>

            <div class="radio multipo psr fx fx-ac pd10 bb" data-index="1" data-hex="#F0F8FF">
                <div class="fx60">Alice Blue</div>
                <div class="box32 i-b ba b-rd" style="background:#F0F8FF;" ></div>
            </div>
            <div class="radio multipo psr fx fx-ac pd10 bb" data-index="2" data-hex="#FAEBD7">
                <div class="fx60">Antique White</div>
                <div class="box32 i-b ba b-rd" style="background:#FAEBD7;" ></div>
            </div>
            <div class="radio multipo psr fx fx-ac pd10 bb" data-index="3" data-hex="#00FFFF">
                <div class="fx60">Aqua</div>
                <div class="box32 i-b ba b-rd" style="background:#00FFFF;" ></div>
            </div>
            <div class="radio multipo psr fx fx-ac pd10 bb" data-index="4" data-hex="#7FFFD4">
                <div class="fx60">Aquamarine</div>
                <div class="box32 i-b ba b-rd" style="background:#7FFFD4;" ></div>
            </div>
            <div class="radio multipo psr fx fx-ac pd10 bb" data-index="5" data-hex="#F0FFFF">
                <div class="fx60">Azure</div>
                <div class="box32 i-b ba b-rd" style="background:#F0FFFF;" ></div>
            </div>
            <div class="radio multipo psr fx fx-ac pd10 bb" data-index="6" data-hex="#F5F5DC">
                <div class="fx60">Beige</div>
                <div class="box32 i-b ba b-rd" style="background:#F5F5DC;" ></div>
            </div>
            <div class="radio multipo psr fx fx-ac pd10 bb" data-index="7" data-hex="#FFE4C4">
                <div class="fx60">Bisque</div>
                <div class="box32 i-b ba b-rd" style="background:#FFE4C4;" ></div>
            </div>
            <div class="radio multipo psr fx fx-ac pd10 bb" data-index="9" data-hex="#FFEBCD">
                <div class="fx60">Blanched Almond</div>
                <div class="box32 i-b ba b-rd" style="background:#FFEBCD;" ></div>
            </div>
            <div class="radio multipo psr fx fx-ac pd10 bb" data-index="11" data-hex="#8A2BE2">
                <div class="fx60">Blue Violet</div>
                <div class="box32 i-b ba b-rd" style="background:#8A2BE2;" ></div>
            </div>
            <div class="radio multipo psr fx fx-ac pd10 bb" data-index="12" data-hex="#A52A2A">
                <div class="fx60">Brown</div>
                <div class="box32 i-b ba b-rd" style="background:#A52A2A;" ></div>
            </div>
            <div class="radio multipo psr fx fx-ac pd10 bb" data-index="13" data-hex="#DEB887">
                <div class="fx60">Burly Wood</div>
                <div class="box32 i-b ba b-rd" style="background:#DEB887;" ></div>
            </div>
            <div class="radio multipo psr fx fx-ac pd10 bb" data-index="14" data-hex="#5F9EA0">
                <div class="fx60">Cadet Blue</div>
                <div class="box32 i-b ba b-rd" style="background:#5F9EA0;" ></div>
            </div>
            <div class="radio multipo psr fx fx-ac pd10 bb" data-index="15" data-hex="#7FFF00">
                <div class="fx60">Chartreuse</div>
                <div class="box32 i-b ba b-rd" style="background:#7FFF00;" ></div>
            </div>
            <div class="radio multipo psr fx fx-ac pd10 bb" data-index="16" data-hex="#D2691E">
                <div class="fx60">Chocolate</div>
                <div class="box32 i-b ba b-rd" style="background:#D2691E;" ></div>
            </div>
            <div class="radio multipo psr fx fx-ac pd10 bb" data-index="17" data-hex="#FF7F50">
                <div class="fx60">Coral</div>
                <div class="box32 i-b ba b-rd" style="background:#FF7F50;" ></div>
            </div>
            <div class="radio multipo psr fx fx-ac pd10 bb" data-index="18" data-hex="#6495ED">
                <div class="fx60">Cornflower Blue</div>
                <div class="box32 i-b ba b-rd" style="background:#6495ED;" ></div>
            </div>
            <div class="radio multipo psr fx fx-ac pd10 bb" data-index="19" data-hex="#FFF8DC">
                <div class="fx60">Cornsilk</div>
                <div class="box32 i-b ba b-rd" style="background:#FFF8DC;" ></div>
            </div>
            <div class="radio multipo psr fx fx-ac pd10 bb" data-index="20" data-hex="#DC143C">
                <div class="fx60">Crimson</div>
                <div class="box32 i-b ba b-rd" style="background:#DC143C;" ></div>
            </div>
            <div class="radio multipo psr fx fx-ac pd10 bb" data-index="21" data-hex="#00FFFF">
                <div class="fx60">Cyan</div>
                <div class="box32 i-b ba b-rd" style="background:#00FFFF;" ></div>
            </div>
            <div class="radio multipo psr fx fx-ac pd10 bb" data-index="22" data-hex="#00008B">
                <div class="fx60">Dark Blue</div>
                <div class="box32 i-b ba b-rd" style="background:#00008B;" ></div>
            </div>
            <div class="radio multipo psr fx fx-ac pd10 bb" data-index="23" data-hex="#008B8B">
                <div class="fx60">Dark Cyan</div>
                <div class="box32 i-b ba b-rd" style="background:#008B8B;" ></div>
            </div>
            <div class="radio multipo psr fx fx-ac pd10 bb" data-index="24" data-hex="#B8860B">
                <div class="fx60">Dark Goldenrod</div>
                <div class="box32 i-b ba b-rd" style="background:#B8860B;" ></div>
            </div>
            <div class="radio multipo psr fx fx-ac pd10 bb" data-index="25" data-hex="#A9A9A9">
                <div class="fx60">Dark Gray</div>
                <div class="box32 i-b ba b-rd" style="background:#A9A9A9;" ></div>
            </div>
            <div class="radio multipo psr fx fx-ac pd10 bb" data-index="26" data-hex="#006400">
                <div class="fx60">Dark Green</div>
                <div class="box32 i-b ba b-rd" style="background:#006400;" ></div>
            </div>
            <div class="radio multipo psr fx fx-ac pd10 bb" data-index="27" data-hex="#BDB76B">
                <div class="fx60">Dark Khaki</div>
                <div class="box32 i-b ba b-rd" style="background:#BDB76B;" ></div>
            </div>
            <div class="radio multipo psr fx fx-ac pd10 bb" data-index="28" data-hex="#8B008B">
                <div class="fx60">Dark Magenta</div>
                <div class="box32 i-b ba b-rd" style="background:#8B008B;" ></div>
            </div>
            <div class="radio multipo psr fx fx-ac pd10 bb" data-index="29" data-hex="#556B2F">
                <div class="fx60">Dark Olive Green</div>
                <div class="box32 i-b ba b-rd" style="background:#556B2F;" ></div>
            </div>
            <div class="radio multipo psr fx fx-ac pd10 bb" data-index="30" data-hex="#FF8C00">
                <div class="fx60">Dark Orange</div>
                <div class="box32 i-b ba b-rd" style="background:#FF8C00;" ></div>
            </div>
            <div class="radio multipo psr fx fx-ac pd10 bb" data-index="31" data-hex="#9932CC">
                <div class="fx60">Dark Orchid</div>
                <div class="box32 i-b ba b-rd" style="background:#9932CC;" ></div>
            </div>
            <div class="radio multipo psr fx fx-ac pd10 bb" data-index="32" data-hex="#8B0000">
                <div class="fx60">Dark Red</div>
                <div class="box32 i-b ba b-rd" style="background:#8B0000;" ></div>
            </div>
            <div class="radio multipo psr fx fx-ac pd10 bb" data-index="33" data-hex="#E9967A">
                <div class="fx60">Dark Salmon</div>
                <div class="box32 i-b ba b-rd" style="background:#E9967A;" ></div>
            </div>
            <div class="radio multipo psr fx fx-ac pd10 bb" data-index="34" data-hex="#8FBC8F">
                <div class="fx60">Dark Sea Green</div>
                <div class="box32 i-b ba b-rd" style="background:#8FBC8F;" ></div>
            </div>
            <div class="radio multipo psr fx fx-ac pd10 bb" data-index="35" data-hex="#483D8B">
                <div class="fx60">Dark Slate Blue</div>
                <div class="box32 i-b ba b-rd" style="background:#483D8B;" ></div>
            </div>
            <div class="radio multipo psr fx fx-ac pd10 bb" data-index="36" data-hex="#2F4F4F">
                <div class="fx60">Dark Slate Gray</div>
                <div class="box32 i-b ba b-rd" style="background:#2F4F4F;" ></div>
            </div>
            <div class="radio multipo psr fx fx-ac pd10 bb" data-index="37" data-hex="#00CED1">
                <div class="fx60">Dark Turquoise</div>
                <div class="box32 i-b ba b-rd" style="background:#00CED1;" ></div>
            </div>
            <div class="radio multipo psr fx fx-ac pd10 bb" data-index="38" data-hex="#9400D3">
                <div class="fx60">Dark Violet</div>
                <div class="box32 i-b ba b-rd" style="background:#9400D3;" ></div>
            </div>
            <div class="radio multipo psr fx fx-ac pd10 bb" data-index="39" data-hex="#FF1493">
                <div class="fx60">Deep Pink</div>
                <div class="box32 i-b ba b-rd" style="background:#FF1493;" ></div>
            </div>
            <div class="radio multipo psr fx fx-ac pd10 bb" data-index="40" data-hex="#00BFFF">
                <div class="fx60">Deep Sky Blue</div>
                <div class="box32 i-b ba b-rd" style="background:#00BFFF;" ></div>
            </div>
            <div class="radio multipo psr fx fx-ac pd10 bb" data-index="41" data-hex="#696969">
                <div class="fx60">Dim Gray</div>
                <div class="box32 i-b ba b-rd" style="background:#696969;" ></div>
            </div>
            <div class="radio multipo psr fx fx-ac pd10 bb" data-index="42" data-hex="#1E90FF">
                <div class="fx60">Dodger Blue</div>
                <div class="box32 i-b ba b-rd" style="background:#1E90FF;" ></div>
            </div>
            <div class="radio multipo psr fx fx-ac pd10 bb" data-index="43" data-hex="#B22222">
                <div class="fx60">Fire Brick</div>
                <div class="box32 i-b ba b-rd" style="background:#B22222;" ></div>
            </div>
            <div class="radio multipo psr fx fx-ac pd10 bb" data-index="44" data-hex="#FFFAF0">
                <div class="fx60">Floral White</div>
                <div class="box32 i-b ba b-rd" style="background:#FFFAF0;" ></div>
            </div>
            <div class="radio multipo psr fx fx-ac pd10 bb" data-index="45" data-hex="#228B22">
                <div class="fx60">Forest Green</div>
                <div class="box32 i-b ba b-rd" style="background:#228B22;" ></div>
            </div>
            <div class="radio multipo psr fx fx-ac pd10 bb" data-index="46" data-hex="#FF00FF">
                <div class="fx60">Fuchsia</div>
                <div class="box32 i-b ba b-rd" style="background:#FF00FF;" ></div>
            </div>
            <div class="radio multipo psr fx fx-ac pd10 bb" data-index="47" data-hex="#DCDCDC">
                <div class="fx60">Gainsboro</div>
                <div class="box32 i-b ba b-rd" style="background:#DCDCDC;" ></div>
            </div>
            <div class="radio multipo psr fx fx-ac pd10 bb" data-index="48" data-hex="#F8F8FF">
                <div class="fx60">Ghost White</div>
                <div class="box32 i-b ba b-rd" style="background:#F8F8FF;" ></div>
            </div>
            <div class="radio multipo psr fx fx-ac pd10 bb" data-index="50" data-hex="#DAA520">
                <div class="fx60">Goldenrod</div>
                <div class="box32 i-b ba b-rd" style="background:#DAA520;" ></div>
            </div>
            <div class="radio multipo psr fx fx-ac pd10 bb" data-index="53" data-hex="#ADFF2F">
                <div class="fx60">Green Yellow</div>
                <div class="box32 i-b ba b-rd" style="background:#ADFF2F;" ></div>
            </div>
            <div class="radio multipo psr fx fx-ac pd10 bb" data-index="54" data-hex="#F0FFF0">
                <div class="fx60">Honey Dew</div>
                <div class="box32 i-b ba b-rd" style="background:#F0FFF0;" ></div>
            </div>
            <div class="radio multipo psr fx fx-ac pd10 bb" data-index="55" data-hex="#FF69B4">
                <div class="fx60">Hot Pink</div>
                <div class="box32 i-b ba b-rd" style="background:#FF69B4;" ></div>
            </div>
            <div class="radio multipo psr fx fx-ac pd10 bb" data-index="56" data-hex="#CD5C5C">
                <div class="fx60">Indian Red</div>
                <div class="box32 i-b ba b-rd" style="background:#CD5C5C;" ></div>
            </div>
            <div class="radio multipo psr fx fx-ac pd10 bb" data-index="58" data-hex="#FFFFF0">
                <div class="fx60">Ivory</div>
                <div class="box32 i-b ba b-rd" style="background:#FFFFF0;" ></div>
            </div>
            <div class="radio multipo psr fx fx-ac pd10 bb" data-index="59" data-hex="#F0E68C">
                <div class="fx60">Khaki</div>
                <div class="box32 i-b ba b-rd" style="background:#F0E68C;" ></div>
            </div>
            <div class="radio multipo psr fx fx-ac pd10 bb" data-index="60" data-hex="#E6E6FA">
                <div class="fx60">Lavender</div>
                <div class="box32 i-b ba b-rd" style="background:#E6E6FA;" ></div>
            </div>
            <div class="radio multipo psr fx fx-ac pd10 bb" data-index="61" data-hex="#FFF0F5">
                <div class="fx60">Lavender Blush</div>
                <div class="box32 i-b ba b-rd" style="background:#FFF0F5;" ></div>
            </div>
            <div class="radio multipo psr fx fx-ac pd10 bb" data-index="62" data-hex="#7CFC00">
                <div class="fx60">Lawn Green</div>
                <div class="box32 i-b ba b-rd" style="background:#7CFC00;" ></div>
            </div>
            <div class="radio multipo psr fx fx-ac pd10 bb" data-index="63" data-hex="#FFFACD">
                <div class="fx60">Lemon Chiffon</div>
                <div class="box32 i-b ba b-rd" style="background:#FFFACD;" ></div>
            </div>
            <div class="radio multipo psr fx fx-ac pd10 bb" data-index="64" data-hex="#ADD8E6">
                <div class="fx60">Light Blue</div>
                <div class="box32 i-b ba b-rd" style="background:#ADD8E6;" ></div>
            </div>
            <div class="radio multipo psr fx fx-ac pd10 bb" data-index="65" data-hex="#F08080">
                <div class="fx60">Light Coral</div>
                <div class="box32 i-b ba b-rd" style="background:#F08080;" ></div>
            </div>
            <div class="radio multipo psr fx fx-ac pd10 bb" data-index="66" data-hex="#E0FFFF">
                <div class="fx60">Light Cyan</div>
                <div class="box32 i-b ba b-rd" style="background:#E0FFFF;" ></div>
            </div>
            <div class="radio multipo psr fx fx-ac pd10 bb" data-index="67" data-hex="#FAFAD2">
                <div class="fx60">Light Goldenrod Yellow</div>
                <div class="box32 i-b ba b-rd" style="background:#FAFAD2;" ></div>
            </div>
            <div class="radio multipo psr fx fx-ac pd10 bb" data-index="68" data-hex="#90EE90">
                <div class="fx60">Light Green</div>
                <div class="box32 i-b ba b-rd" style="background:#90EE90;" ></div>
            </div>
            <div class="radio multipo psr fx fx-ac pd10 bb" data-index="69" data-hex="#D3D3D3">
                <div class="fx60">Light Grey</div>
                <div class="box32 i-b ba b-rd" style="background:#D3D3D3;" ></div>
            </div>
            <div class="radio multipo psr fx fx-ac pd10 bb" data-index="70" data-hex="#FFB6C1">
                <div class="fx60">Light Pink</div>
                <div class="box32 i-b ba b-rd" style="background:#FFB6C1;" ></div>
            </div>
            <div class="radio multipo psr fx fx-ac pd10 bb" data-index="71" data-hex="#FFA07A">
                <div class="fx60">Light Salmon</div>
                <div class="box32 i-b ba b-rd" style="background:#FFA07A;" ></div>
            </div>
            <div class="radio multipo psr fx fx-ac pd10 bb" data-index="72" data-hex="#20B2AA">
                <div class="fx60">Light Sea Green</div>
                <div class="box32 i-b ba b-rd" style="background:#20B2AA;" ></div>
            </div>
            <div class="radio multipo psr fx fx-ac pd10 bb" data-index="73" data-hex="#87CEFA">
                <div class="fx60">Light Sky Blue</div>
                <div class="box32 i-b ba b-rd" style="background:#87CEFA;" ></div>
            </div>
            <div class="radio multipo psr fx fx-ac pd10 bb" data-index="74" data-hex="#778899">
                <div class="fx60">Light Slate Gray</div>
                <div class="box32 i-b ba b-rd" style="background:#778899;" ></div>
            </div>
            <div class="radio multipo psr fx fx-ac pd10 bb" data-index="75" data-hex="#B0C4DE">
                <div class="fx60">Light Steel Blue</div>
                <div class="box32 i-b ba b-rd" style="background:#B0C4DE;" ></div>
            </div>
            <div class="radio multipo psr fx fx-ac pd10 bb" data-index="76" data-hex="#FFFFE0">
                <div class="fx60">Light Yellow</div>
                <div class="box32 i-b ba b-rd" style="background:#FFFFE0;" ></div>
            </div>
            <div class="radio multipo psr fx fx-ac pd10 bb" data-index="77" data-hex="#00FF00">
                <div class="fx60">Lime</div>
                <div class="box32 i-b ba b-rd" style="background:#00FF00;" ></div>
            </div>
            <div class="radio multipo psr fx fx-ac pd10 bb" data-index="78" data-hex="#32CD32">
                <div class="fx60">LimeGreen</div>
                <div class="box32 i-b ba b-rd" style="background:#32CD32;" ></div>
            </div>
            <div class="radio multipo psr fx fx-ac pd10 bb" data-index="79" data-hex="#FAF0E6">
                <div class="fx60">Linen</div>
                <div class="box32 i-b ba b-rd" style="background:#FAF0E6;" ></div>
            </div>
            <div class="radio multipo psr fx fx-ac pd10 bb" data-index="80" data-hex="#FF00FF">
                <div class="fx60">Magenta</div>
                <div class="box32 i-b ba b-rd" style="background:#FF00FF;" ></div>
            </div>
            <div class="radio multipo psr fx fx-ac pd10 bb" data-index="81" data-hex="#800000">
                <div class="fx60">Maroon</div>
                <div class="box32 i-b ba b-rd" style="background:#800000;" ></div>
            </div>
            <div class="radio multipo psr fx fx-ac pd10 bb" data-index="82" data-hex="#66CDAA">
                <div class="fx60">Medium Aquamarine</div>
                <div class="box32 i-b ba b-rd" style="background:#66CDAA;" ></div>
            </div>
            <div class="radio multipo psr fx fx-ac pd10 bb" data-index="83" data-hex="#0000CD">
                <div class="fx60">Medium Blue</div>
                <div class="box32 i-b ba b-rd" style="background:#0000CD;" ></div>
            </div>
            <div class="radio multipo psr fx fx-ac pd10 bb" data-index="84" data-hex="#BA55D3">
                <div class="fx60">Medium Orchid</div>
                <div class="box32 i-b ba b-rd" style="background:#BA55D3;" ></div>
            </div>
            <div class="radio multipo psr fx fx-ac pd10 bb" data-index="85" data-hex="#9370DB">
                <div class="fx60">Medium Purple</div>
                <div class="box32 i-b ba b-rd" style="background:#9370DB;" ></div>
            </div>
            <div class="radio multipo psr fx fx-ac pd10 bb" data-index="86" data-hex="#3CB371">
                <div class="fx60">Medium Sea Green</div>
                <div class="box32 i-b ba b-rd" style="background:#3CB371;" ></div>
            </div>
            <div class="radio multipo psr fx fx-ac pd10 bb" data-index="87" data-hex="#7B68EE">
                <div class="fx60">Medium Slate Blue</div>
                <div class="box32 i-b ba b-rd" style="background:#7B68EE;" ></div>
            </div>
            <div class="radio multipo psr fx fx-ac pd10 bb" data-index="88" data-hex="#00FA9A">
                <div class="fx60">Medium Spring Green</div>
                <div class="box32 i-b ba b-rd" style="background:#00FA9A;" ></div>
            </div>
            <div class="radio multipo psr fx fx-ac pd10 bb" data-index="89" data-hex="#48D1CC">
                <div class="fx60">Medium Turquoise</div>
                <div class="box32 i-b ba b-rd" style="background:#48D1CC;" ></div>
            </div>
            <div class="radio multipo psr fx fx-ac pd10 bb" data-index="90" data-hex="#C71585">
                <div class="fx60">Medium Violet Red</div>
                <div class="box32 i-b ba b-rd" style="background:#C71585;" ></div>
            </div>
            <div class="radio multipo psr fx fx-ac pd10 bb" data-index="91" data-hex="#191970">
                <div class="fx60">Midnight Blue</div>
                <div class="box32 i-b ba b-rd" style="background:#191970;" ></div>
            </div>
            <div class="radio multipo psr fx fx-ac pd10 bb" data-index="92" data-hex="#F5FFFA">
                <div class="fx60">Mint Cream</div>
                <div class="box32 i-b ba b-rd" style="background:#F5FFFA;" ></div>
            </div>
            <div class="radio multipo psr fx fx-ac pd10 bb" data-index="93" data-hex="#FFE4E1">
                <div class="fx60">Misty Rose</div>
                <div class="box32 i-b ba b-rd" style="background:#FFE4E1;" ></div>
            </div>
            <div class="radio multipo psr fx fx-ac pd10 bb" data-index="94" data-hex="#FFE4B5">
                <div class="fx60">Moccasin</div>
                <div class="box32 i-b ba b-rd" style="background:#FFE4B5;" ></div>
            </div>
            <div class="radio multipo psr fx fx-ac pd10 bb" data-index="95" data-hex="#FFDEAD">
                <div class="fx60">Navajo White</div>
                <div class="box32 i-b ba b-rd" style="background:#FFDEAD;" ></div>
            </div>
            <div class="radio multipo psr fx fx-ac pd10 bb" data-index="97" data-hex="#FDF5E6">
                <div class="fx60">Old Lace</div>
                <div class="box32 i-b ba b-rd" style="background:#FDF5E6;" ></div>
            </div>
            <div class="radio multipo psr fx fx-ac pd10 bb" data-index="98" data-hex="#808000">
                <div class="fx60">Olive</div>
                <div class="box32 i-b ba b-rd" style="background:#808000;" ></div>
            </div>
            <div class="radio multipo psr fx fx-ac pd10 bb" data-index="99" data-hex="#6B8E23">
                <div class="fx60">Olive Drab</div>
                <div class="box32 i-b ba b-rd" style="background:#6B8E23;" ></div>
            </div>
            <div class="radio multipo psr fx fx-ac pd10 bb" data-index="101" data-hex="#FF4500">
                <div class="fx60">Orange Red</div>
                <div class="box32 i-b ba b-rd" style="background:#FF4500;" ></div>
            </div>
            <div class="radio multipo psr fx fx-ac pd10 bb" data-index="102" data-hex="#DA70D6">
                <div class="fx60">Orchid</div>
                <div class="box32 i-b ba b-rd" style="background:#DA70D6;" ></div>
            </div>
            <div class="radio multipo psr fx fx-ac pd10 bb" data-index="103" data-hex="#EEE8AA">
                <div class="fx60">Pale Goldenrod</div>
                <div class="box32 i-b ba b-rd" style="background:#EEE8AA;" ></div>
            </div>
            <div class="radio multipo psr fx fx-ac pd10 bb" data-index="104" data-hex="#98FB98">
                <div class="fx60">Pale Green</div>
                <div class="box32 i-b ba b-rd" style="background:#98FB98;" ></div>
            </div>
            <div class="radio multipo psr fx fx-ac pd10 bb" data-index="105" data-hex="#AFEEEE">
                <div class="fx60">Pale Turquoise</div>
                <div class="box32 i-b ba b-rd" style="background:#AFEEEE;" ></div>
            </div>
            <div class="radio multipo psr fx fx-ac pd10 bb" data-index="106" data-hex="#DB7093">
                <div class="fx60">Pale Violet Red</div>
                <div class="box32 i-b ba b-rd" style="background:#DB7093;" ></div>
            </div>
            <div class="radio multipo psr fx fx-ac pd10 bb" data-index="107" data-hex="#FFEFD5">
                <div class="fx60">Papaya Whip</div>
                <div class="box32 i-b ba b-rd" style="background:#FFEFD5;" ></div>
            </div>
            <div class="radio multipo psr fx fx-ac pd10 bb" data-index="108" data-hex="#FFDAB9">
                <div class="fx60">Peach Puff</div>
                <div class="box32 i-b ba b-rd" style="background:#FFDAB9;" ></div>
            </div>
            <div class="radio multipo psr fx fx-ac pd10 bb" data-index="109" data-hex="#CD853F">
                <div class="fx60">Peru</div>
                <div class="box32 i-b ba b-rd" style="background:#CD853F;" ></div>
            </div>
            <div class="radio multipo psr fx fx-ac pd10 bb" data-index="111" data-hex="#DDA0DD">
                <div class="fx60">Plum</div>
                <div class="box32 i-b ba b-rd" style="background:#DDA0DD;" ></div>
            </div>
            <div class="radio multipo psr fx fx-ac pd10 bb" data-index="112" data-hex="#B0E0E6">
                <div class="fx60">Powder Blue</div>
                <div class="box32 i-b ba b-rd" style="background:#B0E0E6;" ></div>
            </div>
            <div class="radio multipo psr fx fx-ac pd10 bb" data-index="115" data-hex="#BC8F8F">
                <div class="fx60">Rosy Brown</div>
                <div class="box32 i-b ba b-rd" style="background:#BC8F8F;" ></div>
            </div>
            <div class="radio multipo psr fx fx-ac pd10 bb" data-index="116" data-hex="#4169E1">
                <div class="fx60">Royal Blue</div>
                <div class="box32 i-b ba b-rd" style="background:#4169E1;" ></div>
            </div>
            <div class="radio multipo psr fx fx-ac pd10 bb" data-index="117" data-hex="#8B4513">
                <div class="fx60">Saddle Brown</div>
                <div class="box32 i-b ba b-rd" style="background:#8B4513;" ></div>
            </div>
            <div class="radio multipo psr fx fx-ac pd10 bb" data-index="118" data-hex="#FA8072">
                <div class="fx60">Salmon</div>
                <div class="box32 i-b ba b-rd" style="background:#FA8072;" ></div>
            </div>
            <div class="radio multipo psr fx fx-ac pd10 bb" data-index="119" data-hex="#F4A460">
                <div class="fx60">Sandy Brown</div>
                <div class="box32 i-b ba b-rd" style="background:#F4A460;" ></div>
            </div>
            <div class="radio multipo psr fx fx-ac pd10 bb" data-index="120" data-hex="#2E8B57">
                <div class="fx60">Sea Green</div>
                <div class="box32 i-b ba b-rd" style="background:#2E8B57;" ></div>
            </div>
            <div class="radio multipo psr fx fx-ac pd10 bb" data-index="121" data-hex="#FFF5EE">
                <div class="fx60">Seashell</div>
                <div class="box32 i-b ba b-rd" style="background:#FFF5EE;" ></div>
            </div>
            <div class="radio multipo psr fx fx-ac pd10 bb" data-index="122" data-hex="#A0522D">
                <div class="fx60">Sienna</div>
                <div class="box32 i-b ba b-rd" style="background:#A0522D;" ></div>
            </div>
            <div class="radio multipo psr fx fx-ac pd10 bb" data-index="124" data-hex="#87CEEB">
                <div class="fx60">Sky Blue</div>
                <div class="box32 i-b ba b-rd" style="background:#87CEEB;" ></div>
            </div>
            <div class="radio multipo psr fx fx-ac pd10 bb" data-index="125" data-hex="#6A5ACD">
                <div class="fx60">Slate Blue</div>
                <div class="box32 i-b ba b-rd" style="background:#6A5ACD;" ></div>
            </div>
            <div class="radio multipo psr fx fx-ac pd10 bb" data-index="126" data-hex="#708090">
                <div class="fx60">Slate Gray</div>
                <div class="box32 i-b ba b-rd" style="background:#708090;" ></div>
            </div>
            <div class="radio multipo psr fx fx-ac pd10 bb" data-index="127" data-hex="#FFFAFA">
                <div class="fx60">Snow</div>
                <div class="box32 i-b ba b-rd" style="background:#FFFAFA;" ></div>
            </div>
            <div class="radio multipo psr fx fx-ac pd10 bb" data-index="128" data-hex="#00FF7F">
                <div class="fx60">Spring Green</div>
                <div class="box32 i-b ba b-rd" style="background:#00FF7F;" ></div>
            </div>
            <div class="radio multipo psr fx fx-ac pd10 bb" data-index="129" data-hex="#4682B4">
                <div class="fx60">Steel Blue</div>
                <div class="box32 i-b ba b-rd" style="background:#4682B4;" ></div>
            </div>
            <div class="radio multipo psr fx fx-ac pd10 bb" data-index="130" data-hex="#D2B48C">
                <div class="fx60">Tan</div>
                <div class="box32 i-b ba b-rd" style="background:#D2B48C;" ></div>
            </div>
            <div class="radio multipo psr fx fx-ac pd10 bb" data-index="131" data-hex="#008080">
                <div class="fx60">Teal</div>
                <div class="box32 i-b ba b-rd" style="background:#008080;" ></div>
            </div>
            <div class="radio multipo psr fx fx-ac pd10 bb" data-index="132" data-hex="#D8BFD8">
                <div class="fx60">Thistle</div>
                <div class="box32 i-b ba b-rd" style="background:#D8BFD8;" ></div>
            </div>
            <div class="radio multipo psr fx fx-ac pd10 bb" data-index="133" data-hex="#FF6347">
                <div class="fx60">Tomato</div>
                <div class="box32 i-b ba b-rd" style="background:#FF6347;" ></div>
            </div>
            <div class="radio multipo psr fx fx-ac pd10 bb" data-index="134" data-hex="#40E0D0">
                <div class="fx60">Turquoise</div>
                <div class="box32 i-b ba b-rd" style="background:#40E0D0;" ></div>
            </div>
            <div class="radio multipo psr fx fx-ac pd10 bb" data-index="136" data-hex="#F5DEB3">
                <div class="fx60">Wheat</div>
                <div class="box32 i-b ba b-rd" style="background:#F5DEB3;" ></div>
            </div>
            <div class="radio multipo psr fx fx-ac pd10 bb" data-index="138" data-hex="#F5F5F5">
                <div class="fx60">White Smoke</div>
                <div class="box32 i-b ba b-rd" style="background:#F5F5F5;" ></div>
            </div>
            <div class="radio multipo psr fx fx-ac pd10 bb" data-index="140" data-hex="#9ACD32">
                <div class="fx60">Yellow Green</div>
                <div class="box32 i-b ba b-rd" style="background:#9ACD32;" ></div>
            </div>
        </div>`;
        $MM.show();
        $MF.html(h).zoom();

        var selectedOptions = [];
        var so = this.dataset.selectedOptions;
        if (so) {
            selectedOptions = so.split(',');
            var $r = $('#color-palette').find('.radio');
            $.each($r, function() {
                if (selectedOptions.indexOf(this.dataset.index) > -1) {
                    var $es = $('#color-palette .radio.selected').last();
                    if (!$es[0]) $es = $('#select-color');
                    $(this).addClass('selected').insertAfter($es);
                }
            });
        }
    }).on('click', '#color-palette .radio', function() {
        var $el = $(this).detach();
        // setTimeout(function() {
            var $es = $('#color-palette .radio.selected').last();
            if (!$es[0]) $es = $('#select-color');
            $el.insertAfter($es);
        // }, 10);
    }).on('click', '#color-palette-submit', function() {
        var o = $('#color-palette').find('.radio.selected'), s = '', h = '';
        if (o.length) {
            var os = [];
            $.each(o, function() {
                os.push(this.dataset.index);
                h+="<div class='box32 mg-rm i-b ba b-rd' style='background:"+this.dataset.hex+";'></div>";
            });
            s = os.join(',');
        }
        COLORPICKER.dataset.selectedOptions = s;
        COLORPICKER.innerHTML = h;
    }).on('click', '#add-item', function() {
        App.changeViewTo('#createView');
        $('.main-wrapper').remove();
        if (CATEGORY == 1) {
            $('.color-picker').html('');
            $('#product-add-form img.im-sh').attr('src','');
        }
        document.querySelector('.create-form[data-catg="'+CATEGORY+'"]').reset();
    }).on('click', '.tab-locator', function() {
        var Tab = this.dataset.tab;
        App.switchTabTo(Tab);
        $('.tab-locator').removeClass('c-o');
        this.classList.add('c-o');
    }).on('click', '.view-closer', function() {
        App.closeCurrentView();
    }).on('click', '.terms-link', function() {
        cordova.InAppBrowser.open(BASE_URL + '/legal/terms.html', '_blank', BROWSEROPTIONS);
    }).on('click', '.forgot-password', function() {
        
        App.changeViewTo('#retrievalView');

    }).on('click', '.signup-option', function() {

        $(this).addClass('c-o').siblings().removeClass('c-o');
        $('#reg-type').text(this.innerText);
        var ix = this.dataset.index;
        $('form[data-index="'+ix+'"]').show().siblings('form').hide();

    }).on('change', '.images', function(e) {

        var that = this;
        if (this.files && this.files[0]) {
            var reader = new FileReader();
            reader.onloadend = function(e) {
                that.previousElementSibling.src = this.result;
                // that.previousElementSibling.classList.add('fw');
            }
            reader.readAsDataURL(this.files[0]);
            //
            if (this.id == 'profile-picture') {
                var fd = new FormData();
                fd.append('action', 'updateDisplayPix');
                fd.append('displaypix', this.files[0]);
                fd.append('me', UUID);
                //
                $.ajax({
                    url: MY_URL + "/send.php",
                    data: fd,
                    method: "POST",
                    cache: false,
                    processData: false,
                    contentType: false,
                    dataType: 'json',
                    timeout: 30000,
                    success: function(p) {
                        if (p == '1') {
                            loadUserPicture();
                            toast("Profile picture uploaded successfully");
                        }
                    }
                });
            }
        } else {
            that.previousElementSibling.src = '';
            // that.previousElementSibling.classList.remove('fw');
            // console.log('No file');
        }

    }).on('submit', '.start-form', function(evt) {
        evt.preventDefault();
        if (this.dataset.disabled == 'true') return;

        var el = this;
        var id = el.id;
        var error = null;

        switch (id) {
            case 'signup-form-email':
                var Email = el.querySelector('input[name="email"]').value.toLowerCase();
                if (!Email) return toast('Please type your email');
                el.dataset.disabled = 'true';
                $('body').spin();
                $.ajax({
                    url: MY_URL + "/send.php",
                    data: {
                        action: 'preRegister',
                        email: Email
                    },
                    method: "POST",
                    timeout: 30000,
                    dataType: 'json',
                    success: function(p) {
                        if (p.state == 'success') {
                            Store.setItem('userEmail', Email);
                            toast("We've sent you a verification code");
                            App.changeViewTo('#tokenPrompt');
                        } else {
                            toast(p.message);
                        }
                    },
                    error: function() {toast('No connection');},
                    complete: function() {
                        el.dataset.disabled = 'false';
                        $('body').unspin();
                    }
                });
                break;
            case 'signup-form-code':
                var Code = el.querySelector('input[name="token"]').value;
                if (!Code) return;
                el.dataset.disabled = 'true';
                $('body').spin();
                $.ajax({
                    url: MY_URL + "/send.php",
                    data: {
                        action: 'codeVerification',
                        code: Code,
                        email: Store.getItem('userEmail')
                    },
                    method: "POST",
                    timeout: 30000,
                    dataType: 'json',
                    success: function(p) {
                        if (p.state == 'success') {//verified successfully
                            toast('Your email address has been verified');
                            App.changeViewTo('#signupView');
                        } else {
                            toast(p.message);
                        }
                    },
                    complete: function() {
                        el.dataset.disabled = 'false';
                        $('body').unspin();
                    }
                });
                break;
            case 'signup-form-buyer':
                var Fullname = el.querySelector('input[name="fullname"]').value;
                var Username = el.querySelector('input[name="username"]').value.toLowerCase().split(' ').join('');
                var Campus = el.querySelector('select[name="institute"]').value;
                var Phone = el.querySelector('input[name="phone"]').value
                var Pass = el.querySelector('input[name="password"]').value;

                if (!Fullname && !error) error = "<div class='b bb pd10'>Full Name is Required</div><div class='pd10'>Your full name is required.</div>";
                if (!UsernameRegexp.test(Username) && !error) error = "<div class='b bb pd10'>Display name error</div><div class='pd10'>Username must be 4 or more characters long and may contain letters, underscore and numbers but cannot start with a number. Special characters and full-stop are not allowed</div>";
                if (Campus == 0 && !error) error = "<div class='b bb pd10'>Please select your institution</div><div class='pd10'>Select your institution to help us serve you nearby items.</div>";
                if (!Phone && !error) error = "<div class='b bb pd10'>Provide your phone number</div><div class='pd10'>Your phone number is required for notifications.</div>";
                if ((Pass.length < 8 || Pass.length > 32) && !error) error = "<div class='b bb pd10'>Password not accepted</div><div class='pd10'>Password must be between 8 - 32 characters long.</div>";
                
                if (error) {
                    var h = '<div class="pd10">'+error+'<div class="fw fx"><div class="fx60"></div><div class="pd516 b bg-ac c-o ac">OK</div></div></div>';

                    $MM.show();
                    $MF.html(h).zoom();

                    return;
                }
                el.dataset.disabled = 'true';

                $('body').spin();
                $.ajax({
                    url: MY_URL + "/send.php",
                    data: {
                        action: 'register',
                        email: Store.getItem('userEmail'),
                        fullname: Fullname,
                        username: Username,
                        campus: Campus,
                        phone: Phone,
                        password: Pass,
                        usertype: '0',
                        platform: PLATFORM
                    },
                    method: "POST",
                    timeout: 30000,
                    dataType: 'json',
                    success: function(p) {
                        if (p.state == 'success') {
                            var data = {
                                  ui: p.ui
                                , un: Username
                                , em: Store.getItem('userEmail')
                                , sk: Campus
                                , ph: Phone
                                , ut: '0'
                                , ma: null
                                , fn: null
                                , ad: null
                                , cg: '0'
                                , ch: '0'
                            };
                            toast('Registration Completed Successfully');
                            localizeUserDetails(data, 'signup');
                        } else {
                            if (p.message.indexOf("email") > -1) {
                                toast('Email address not available');
                            } else if (p.message.indexOf("username") > -1) {
                                toast('Username not available');
                            } else toast('An error occurred. Please try again later.');//not expecting this.
                        }
                    },
                    complete: function() {
                        el.dataset.disabled = 'false';
                        $('body').unspin();
                    }
                });

                break;

            case 'signup-form-seller':
                var Fullname = el.querySelector('input[name="fullname"]').value
                  , Username = el.querySelector('input[name="username"]').value
                  , Address = el.querySelector('textarea[name="officeAddress"]').value
                  , Category = el.querySelector('select[name="category"]').value
                  , Phone = el.querySelector('input[name="phone"]').value
                  , Pass = el.querySelector('input[name="password"]').value
                  , Campus = el.querySelector('select[name="institute"]').value;
                  ;
                
                if (!Fullname && !error) error = "<div class='b bb pd10'>Full Name is Required</div><div class='pd10'>Your full name is required.</div>";
                if (!Username && !error) error = "<div class='b bb pd10'>Display/Brand Name is Required</div><div class='pd10'>Your Display/Brand name would be displayed on your profile.</div>";
                if (!Address && !error) error = "<div class='b bb pd10'>Your Address is Required</div><div class='pd10'>Your address is required for pickup.</div>";
                if (Category == '0' && !error) error = "<div class='b bb pd10'>You must select your business category</div>";
                if (!Phone && !error) error = "<div class='b bb pd10'>Provide your phone number</div><div class='pd10'>Your phone number is required for notifications.</div>";
                if ((Pass.length < 8 || Pass.length > 32) && !error) error = "<div class='b bb pd10'>Password not accepted</div><div class='pd10'>Password must be between 8 - 32 characters long.</div>";
                if (Campus == 0 && !error) error = "<div class='b bb pd10'>Please select your institution</div><div class='pd10'>Select your institution to help us serve your items to nearby buyers.</div>";
                
                if (error) {
                    var h = '<div class="pd10">'+error+'<div class="fw fx"><div class="fx60"></div><div class="pd516 b bg-ac c-o ac">OK</div></div></div>';

                    $MM.show();
                    $MF.html(h).zoom();

                    return;
                }

                el.dataset.disabled = 'true';

                $('body').spin();
                $.ajax({
                    url: MY_URL + "/send.php",
                    data: {
                        action: 'register',
                        email: Store.getItem('userEmail'),
                        username: Username,
                        campus: Campus,
                        fullname: Fullname,
                        address: Address,
                        category: Category,
                        phone: Phone,
                        password: Pass,
                        usertype: '1',
                        platform: PLATFORM
                    },
                    method: "POST",
                    timeout: 30000,
                    dataType: 'json',
                    success: function(p) {
                        if (p.state == 'success') {
                            var data = {
                                  ui: p.ui
                                , un: Username
                                , em: Store.getItem('userEmail')
                                , sk: '0'
                                , ut: '1'
                                , ph: Phone
                                , fn: Fullname
                                , ad: Address
                                , cg: Category
                                , ch: '0'
                            };
                            toast('Registration Completed Successfully.');
                            localizeUserDetails(data, 'signup');
                        } else {
                            if (p.message.indexOf("email") > -1) {
                                toast('Email address not available');
                            } else if (p.message.indexOf("username") > -1) {
                                toast('Username not available');
                            } else toast('An error occurred. Please try again.');//maybe key conflict.
                        }
                    },
                    complete: function() {
                        el.dataset.disabled = 'false';
                        $('body').unspin();
                    }
                });
                break;
            case 'login-form':
                var Email = this.querySelector("input[name='emailaddress']").value.toLowerCase();
                var Pass = this.querySelector("input[name='password']").value;
                if (Email && Pass) {
                    el.dataset.disabled = 'true';
                    $('body').spin();
                    $.ajax({
                        url: MY_URL + "/fetch.php",
                        data: {
                            action: 'login',
                            id: Email,
                            password: Pass,
                            platform: PLATFORM
                        },
                        timeout: 30000,
                        dataType: 'json',
                        method: "GET",
                        success: function(p) {
                            // console.log(JSON.stringify(p));
                            if (p.error) {
                                toast('Incorrect login details');
                            } else {
                                toast('Login Successful');
                                localizeUserDetails(p, 'login');
                            }
                        },
                        error: function() {toast('No connection');},
                        complete: function() { el.dataset.disabled = 'false'; $('body').unspin();}
                    });
                }
                break;
            case 'profile-edit-form':
                var Fullname = el.querySelector('input[name="fullname"]').value
                  , Username = el.querySelector('input[name="username"]').value
                  , Phone = el.querySelector('input[name="phone"]').value
                  , Birthday = null
                  , Address = null
                  ;
                if (!Fullname && !error) error = "<div class='b bb pd10'>Full Name is Required</div><div class='pd10'>Your full name is required.</div>";
                if (!Phone && !error) error = "<div class='b bb pd10'>Provide your phone number</div><div class='pd10'>Your phone number is required for notifications.</div>";
                
                if (USERTYPE == 1) {
                      Address = el.querySelector('textarea[name="officeAddress"]').value
                      ;
                    if (!Username && !error) error = "<div class='b bb pd10'>Display/Brand Name is Required</div><div class='pd10'>Your Display/Brand name would be displayed on your profile.</div>";
                    if (!Address && !error) error = "<div class='b bb pd10'>Your Address is Required</div><div class='pd10'>Your address is required for pickup.</div>";
                } else {
                    Birthday = el.querySelector('input[name="birthday"]').value;
                    if (!UsernameRegexp.test(Username) && !error) error = "<div class='b bb pd10'>Username not available</div><div class='pd10'>Username must be 4 or more characters long and may contain letters, underscore and numbers but cannot start with a number. Special characters and full-stop are not allowed</div>";
                    if (!Birthday && !error) error = "<div class='b bb pd10'>Your Birthday is Required</div><div class='pd10'>Your birthday is required.</div>";
                }
                if (error) {
                    var h = '<div class="pd10">'+error+'<div class="fw fx"><div class="fx60"></div><div class="pd516 b bg-ac c-o ac">OK</div></div></div>';

                    $MM.show();
                    $MF.html(h).zoom();

                    return;
                }

                el.dataset.disabled = 'true';

                $('body').spin();
                //
                // return;
                var fd = new FormData();
                fd.append('action', 'profileUpdate');
                fd.append('userkey', UUID);
                fd.append('usertype', USERTYPE);
                fd.append('fullname', Fullname);
                fd.append('username', Username);
                fd.append('birthday', Birthday);
                fd.append('address', Address);
                fd.append('phone', Phone);

                $.ajax({
                    url: MY_URL + "/send.php",
                    data: fd,
                    method: "POST",
                    cache: false,
                    processData: false,
                    contentType: false,
                    dataType: 'json',
                    timeout: 30000,
                    success: function(p) {
                        // console.log(p);
                        if (p.state == 'success') {
                            toast('Profile updated successfully.');
                            SQL.transaction(function(i) {
                                i.executeSql("UPDATE on_user SET username=?, fullname=?, birthday=?, address=?, phone=? WHERE id=?", [Username, Fullname, Birthday, Address, Phone, 1]);
                            }, function(){}, function() {
                                //
                                  FULLNAME = Fullname
                                , USERNAME = Username
                                , BIRTHDAY = Birthday
                                , ADDRESS = Address
                                , PHONE = Phone
                                ;
                                // App.closeCurrentView();
                            });

                        } else {
                            if (p.message.indexOf('username') > -1) {
                                toast('Username not available');
                            } else toast('An error occurred. Please try again later.');//not expecting this.
                        }
                    },
                    complete: function() {
                        el.dataset.disabled = 'false';
                        $('body').unspin();
                    }
                });
                //
                break;
            default:
                // break;
        }
    }).on('click', '.password-toggle', function() {
        var handle = this.previousElementSibling;
        if (handle.getAttribute('type') == 'password') {
            handle.setAttribute('type', 'text');
            this.classList.remove('icon-eye');
            this.classList.add('icon-eye-off');
        } else {
            handle.setAttribute('type', 'password');
            this.classList.remove('icon-eye-off');
            this.classList.add('icon-eye');
        }
        handle.focus();
    }).on('click', '#delivery-help', function() {
        var h = `<div class="pd20">
            <b>Delivery options:</b> -these are ways in which logistics of every item sold on our ecommerce platform will be handled.
        To make the process really easy for sellers we provided 3 different options namely:-OnCampus express,OnCampus pick up and deliver ,OnCamus drop and deliver.
        <br>
        <br>
        1. <b>OnCampus express</b> -this stands for express delivery for customers because items registered in this category are stored in our warehouse,sellers wouldn’t have to worry about the item and its delivery
        <br>
        <br>
        2. <b>OnCampus pick up and deliver:</b> -this category the item remains with the seller once there’s an order our delivery personnel comes to pick up from the office address written during registration and delivers to the customer.
        <br>
        <br>
        3. <b>OnCampus drop and deliver:</b> -in this category when a sellers gets an order he/she brings such order to our office and we carry out the delivery 
        <br>
        <br>
        Charges varies on each department and other terms and conditions apply.</div>`;
        $MM.show();
        $MF.html(h).zoom();
    }).on('click', '.add-more-photos', function() {
        if ($(this).siblings('.product-image').length == 4) return toast("You can only add up to four (4) photos");
        var h = `<div class="product-image main-wrapper fx40 h200 mg-l bg b4-r fx fx-ac fx-jc ov-h ba bg-im-ct psr" style="display:none;">
            <img src="res/img/icon/upload.png">
            <img class="fw psa im-sh" src="">
            <input type="file" accept="image/*" name="images" class="images fw fh psa t0 l0 op0">
            <div class="wrapper-closer box32 f20 psa fx fx-ac Pink c-g b5 b bm-r mg-r mg-t t0 r0 fx-jc z4">&times;</div>
        </div>`;
        $(this).before(h);
        $('.product-image').last().slideDown();
    }).on('submit', '.create-form', function(evt) {
        evt.preventDefault();
        if (this.dataset.disabled == 'true') return;

        var el = this;
        var id = el.id;
        var cg = el.dataset.catg;
        var error = null;

        switch(cg) {
            case '1'://product-add-form
                var Images = el.querySelectorAll('input[name="images"]')
                  , Name = el.querySelector('input[name="name"]').value
                  , ProductCategory = el.querySelector('select[name="product_type"]').value
                  , ProductSize = el.querySelector('select[name="product_size"]').value
                  , ShoeSize = el.querySelector('select[name="shoe_size"]').value
                  , AvailableColors = el.querySelector('.color-picker').dataset.selectedOptions
                  , ProductDelivery = el.querySelector('select[name="product_delivery"]').value
                  , Price = parseInt(el.querySelector('input[name="price"]').value, 10) || 0
                  , Discount = parseInt(el.querySelector('input[name="discount"]').value, 10) || 0
                  , Description = el.querySelector('textarea[name="description"]').value
                  ;
                if (!Name && !error) error = "<div class='b bb pd10'>Please add a Name</div><div class='pd10'>A name is required for item description.</div>";
                if (!ProductCategory && !error) error = "<div class='b bb pd10'>Please select item category</div><div class='pd10'>Select a category for this item.</div>";
                if (!ProductDelivery && !error) error = "<div class='b bb pd10'>Please select delivery option</div><div class='pd10'>Select a delivery option for this item.</div>";
                if (Price === 0 && !error) error = "<div class='b bb pd10'>Please add a Price</div><div class='pd10'>Price should include numbers only.</div>";
                //
                if (error) {
                    var h = '<div class="pd10">'+error+'<div class="fw fx"><div class="fx60"></div><div class="pd516 b bg-ac c-o ac">OK</div></div></div>';
                    $MM.show();
                    $MF.html(h).zoom();
                    return;
                }
                var fd = new FormData();
                fd.append('action', 'addECommerceItem');
                fd.append('ownerID', UUID);
                fd.append('name', Name);
                fd.append('productCategory', ProductCategory);
                fd.append('productSize', ProductSize);
                fd.append('shoeSize', ShoeSize);
                fd.append('availableColors', AvailableColors);
                fd.append('productDelivery', ProductDelivery);
                fd.append('price', Price);
                fd.append('discount', Discount);
                fd.append('description', Description);
                var TotalImages = 0;
                Images.forEach(function(el) {
                    if (el.files && el.files[0]) {
                        fd.append('image[]', el.files[0]);
                        TotalImages++;
                    }
                });
                if (TotalImages === 0) return toast('You must add at least 1 photo');
                fd.append('totalImages', TotalImages);
                $('body').spin();
                el.dataset.disabled = 'true';
                //submit package
                $.ajax({
                    url: MY_URL + "/send.php",
                    data: fd,
                    method: "POST",
                    cache: false,
                    processData: false,
                    contentType: false,
                    dataType: 'json',
                    timeout: 30000,
                    success: function(d) {
                        if (d.error) return toast('Unable to add item');
                        toast('Item added successfully');
                        var p = {
                            itemID: d.success,
                            ownerID: UUID,
                            name: Name,
                            price: Price,
                            discount: Discount,
                            delivery: ProductDelivery
                        }
                        buildItems([p], CATEGORY, true);
                        Views.pop();App.changeViewTo('#itemsView');//do not go back to item add view
                    },
                    error: function() { toast('Unable to connect'); },
                    complete: function() {
                        el.dataset.disabled = 'false';
                        $('body').unspin();
                    }
                });
                break;
            case '2'://food-add-form
                var Image = el.querySelector('input[name="images"]').files
                  , FoodType = el.querySelector('select[name="food_type"]').value
                  , Name = el.querySelector('input[name="name"]').value
                  , Price = parseInt(el.querySelector('input[name="price"]').value, 10)
                  , Discount = el.querySelector('input[name="discount"]').value
                  ;
                if (!Image || !Image[0] || Image[0].size > 2 * 1024 * 1024 && !error) error = "<div class='b bb pd10'>Image Error!</div><div class='pd10'>Please attach an image to your item (Maximum size = 2MB).</div>";
                if (!FoodType && !error) error = "<div class='b bb pd10'>Please select a type</div><div class='pd10'>Select a type for this item.</div>";
                if (!Name && !error) error = "<div class='b bb pd10'>Please add a Name</div><div class='pd10'>A name is required for meal description.</div>";
                if ((!Price || isNaN(Price)) && !error) error = "<div class='b bb pd10'>Please add a Price</div><div class='pd10'>Price should include numbers only.</div>";
                if (!Discount) Discount = 0;
                //
                if (error) {
                    var h = '<div class="pd10">'+error+'<div class="fw fx"><div class="fx60"></div><div class="pd516 b bg-ac c-o ac">OK</div></div></div>';
                    $MM.show();
                    $MF.html(h).zoom();
                    return;
                }
                //
                $('body').spin();
                //submit package
                var fd = new FormData();
                fd.append('action', 'addFoodItem');
                fd.append('ownerID', UUID);
                fd.append('image', Image[0]);
                fd.append('foodType', FoodType);
                fd.append('name', Name);
                fd.append('price', Price);
                fd.append('discount', Discount);

                $.ajax({
                    url: MY_URL + "/send.php",
                    data: fd,
                    method: "POST",
                    cache: false,
                    processData: false,
                    contentType: false,
                    dataType: 'json',
                    timeout: 30000,
                    success: function(d) {
                        if (d.error) return toast('Unable to add item');
                        toast('Item added successfully');
                        var p = {
                            itemID: d.success,
                            ownerID: UUID,
                            food_type: FoodType,
                            name: Name,
                            price: Price,
                            discount: Discount
                        }
                        buildItems([p], CATEGORY, true);
                        Views.pop();App.changeViewTo('#itemsView');//do not go back to item add view
                    },
                    error: function() { toast('Unable to connect'); },
                    complete: function() {
                        el.dataset.disabled = 'false';
                        $('body').unspin();
                    }
                });
                break;
            case '3'://event-add-form
                var Image = el.querySelector('input[name="images"]').files
                  , Name = el.querySelector('input[name="name"]').value
                  , EventType = el.querySelector('select[name="event_type"]').value
                  , Venue = el.querySelector('textarea[name="venue"]').value

                  , Year = el.querySelector('input[name="year"]').value
                  , Month = el.querySelector('input[name="month"]').value
                  , Day = el.querySelector('input[name="day"]').value
                  , Hour = el.querySelector('input[name="hour"]').value || '00'
                  , Min = el.querySelector('input[name="min"]').value || '00'
                  
                  , AllTickets = []
                  , EventDate = Year + '-' + Month + '-' + Day + ' ' + Hour + ':' + Min
                  ;
                var cgs = el.querySelectorAll('.ticket_category'), localError = false;
                cgs.forEach(function(t) {
                    t.classList.remove('Red');
                    var TicketCatg = t.querySelector('select[name="category"]').value;
                    var Price = parseInt(t.querySelector('input[name="price"]').value, 10) || 0;
                    var Discount = parseInt(t.querySelector('input[name="discount"]').value, 10) || 0;
                    var Seats = parseInt(t.querySelector('input[name="seats"]').value, 10) || 0;
                      ;
                    if (TicketCatg == '0' || Price === 0) {
                        t.classList.add('Red');
                        localError = true;
                        return;
                    }
                    // var entry = [TicketCatg, Price, Discount, Seats];
                    var ticket = {ticket_type: TicketCatg, price: Price, discount: Discount, seats: Seats};
                    // console.log(entry);
                    AllTickets.push(ticket);
                });
                if (localError) return toast('Some entries are not valid');

                if (!Image || !Image[0] || Image[0].size > 2 * 1024 * 1024 && !error) error = "<div class='b bb pd10'>Image Error!</div><div class='pd10'>Please attach an image to your item (Maximum size = 2MB).</div>";
                if (EventType == '0' && !error) error = "<div class='b bb pd10'>Please select a type</div><div class='pd10'>Select a type for this ticket.</div>";
                if (!Name && !error) error = "<div class='b bb pd10'>Please add a Name</div><div class='pd10'>A name is required to identify this event.</div>";
                if (!Venue && !error) error = "<div class='b bb pd10'>Please add a Venue</div><div class='pd10'>Please state the venue for this event.</div>";
                if (AllTickets.length == 0 && !error) error = "<div class='b bb pd10'>Please add a Ticket</div><div class='pd10'>You must add at least 1 ticket with a complete information.</div>";
                //
                if (error) {
                    var h = '<div class="pd10">'+error+'<div class="fw fx"><div class="fx60"></div><div class="pd516 b bg-ac c-o ac">OK</div></div></div>';
                    $MM.show();
                    $MF.html(h).zoom();
                    return;
                }
                $('body').spin();
                //
                var fd = new FormData();
                fd.append('action', 'addEventItem');
                fd.append('ownerID', UUID);
                fd.append('name', Name);
                fd.append('event_date', EventDate);
                fd.append('venue', Venue);
                fd.append('event_type', EventType);//tickets: pool,hangout,club...//[[new]] no mote//regular,VIP...
                fd.append('image', Image[0]);
                fd.append('all_tickets', JSON.stringify(AllTickets));//regular,VIP...//all in one JSON stringified object

                $.ajax({
                    url: MY_URL + "/send.php",
                    data: fd,
                    method: "POST",
                    cache: false,
                    processData: false,
                    contentType: false,
                    dataType: 'json',
                    timeout: 30000,
                    success: function(d) {
                        if (d.error) return toast('Unable to add item');
                        toast('Item added successfully');
                        var p = {
                            ownerID: UUID,
                            itemID: d.success,
                            name: Name,
                            event_type: EventType,
                            event_date: EventDate,
                            venue: Venue,
                            tickets: AllTickets
                        }
                        buildItems([p], CATEGORY, true);
                        Views.pop();App.changeViewTo('#itemsView');//do not go back to item add view
                    },
                    error: function() { toast('Unable to connect'); },
                    complete: function() {
                        el.dataset.disabled = 'false';
                        $('body').unspin();
                    }
                });
                break;
            case '4'://graphics-add-form
                var Image = el.querySelector('input[name="images"]').files
                  , GraphicsType = el.querySelector('select[name="graphics_type"]').value
                  , Price = parseInt(el.querySelector('input[name="price"]').value, 10) || 0
                  ;
                if (!Image || !Image[0]/* || Image[0].size > 2 * 1024 * 1024*/ && !error) error = "<div class='b bb pd10'>Image Error!</div><div class='pd10'>Please attach an image to your item (Maximum size = 2MB).</div>";
                if (!GraphicsType && !error) error = "<div class='b bb pd10'>Please select a type</div><div class='pd10'>Select a type for this item.</div>";
                if (Price === 0 && !error) error = "<div class='b bb pd10'>Please add a Price</div><div class='pd10'>Price should include numbers only.</div>";
                //
                if (error) {
                    var h = '<div class="pd10">'+error+'<div class="fw fx"><div class="fx60"></div><div class="pd516 b bg-ac c-o ac">OK</div></div></div>';
                    $MM.show();
                    $MF.html(h).zoom();
                    return;
                }
                //
                $('body').spin();
                //submit package
                var fd = new FormData();
                fd.append('action', 'addGraphicsItem');
                fd.append('ownerID', UUID);
                fd.append('image', Image[0]);
                fd.append('graphicsType', GraphicsType);
                fd.append('price', Price);

                $.ajax({
                    url: MY_URL + "/send.php",
                    data: fd,
                    method: "POST",
                    cache: false,
                    processData: false,
                    contentType: false,
                    dataType: 'json',
                    timeout: 30000,
                    success: function(d) {
                        // var d = JSON.parse(d);
                        if (d.error) return toast('Unable to add item');
                        toast('Item added successfully');
                        var p = {
                            itemID: d.success,//array
                            ownerID: UUID,
                            graphics_type: GraphicsType,
                            price: Price
                        }
                        buildItems([p], CATEGORY, true);
                        Views.pop();App.changeViewTo('#itemsView');//do not go back to item add view
                    },
                    error: function() { toast('Unable to connect'); },
                    complete: function() {
                        el.dataset.disabled = 'false';
                        $('body').unspin();
                    }
                });
                break;
            case '5'://makeup-add-form
                var Image = el.querySelector('input[name="images"]').files
                  , MakeupType = el.querySelector('select[name="makeup_type"]').value
                  , Name = el.querySelector('input[name="name"]').value
                  , Price = parseInt(el.querySelector('input[name="price"]').value, 10)
                  ;
                if (!Image || !Image[0] || Image[0].size > 2 * 1024 * 1024 && !error) error = "<div class='b bb pd10'>Image Error!</div><div class='pd10'>Please attach an image to your item (Maximum size = 2MB).</div>";
                if (MakeupType == '0' && !error) error = "<div class='b bb pd10'>Please select a type</div><div class='pd10'>Select a type for this item.</div>";
                if (!Name && !error) error = "<div class='b bb pd10'>Please add a Name</div><div class='pd10'>A name is required for item description.</div>";
                if ((!Price || isNaN(Price)) && !error) error = "<div class='b bb pd10'>Please add a Price</div><div class='pd10'>Price should include numbers only.</div>";
                //
                if (error) {
                    var h = '<div class="pd10">'+error+'<div class="fw fx"><div class="fx60"></div><div class="pd516 b bg-ac c-o ac">OK</div></div></div>';
                    $MM.show();
                    $MF.html(h).zoom();
                    return;
                }
                //
                $('body').spin();
                //submit package
                var fd = new FormData();
                fd.append('action', 'addMakeupItem');
                fd.append('ownerID', UUID);
                fd.append('image', Image[0]);
                fd.append('makeupType', MakeupType);
                fd.append('name', Name);
                fd.append('price', Price);

                $.ajax({
                    url: MY_URL + "/send.php",
                    data: fd,
                    method: "POST",
                    cache: false,
                    processData: false,
                    contentType: false,
                    dataType: 'json',
                    timeout: 30000,
                    success: function(d) {
                        // var d = JSON.parse(d);
                        if (d.error) return toast('Unable to add item');
                        toast('Item added successfully');
                        var p = {
                            itemID: d.success,//array
                            ownerID: UUID,
                            makeup_type: MakeupType,
                            name: Name,
                            price: Price
                        }
                        buildItems([p], CATEGORY, true);
                        Views.pop();App.changeViewTo('#itemsView');//do not go back to item add view
                    },
                    error: function() { toast('Unable to connect'); },
                    complete: function() {
                        el.dataset.disabled = 'false';
                        $('body').unspin();
                    }
                });
                break;
            case '6'://laundry-add-form
                var items = [];
                var fms = el.querySelectorAll('.laundry-item'), localError = false;
                fms.forEach(function(fm) {
                    fm.classList.remove('Red');
                    var LaundryType = fm.querySelector('select[name="itemID"]').value
                      , Wash = parseInt(fm.querySelector('input[name="wash"]').value, 10) || 0
                      , Iron = parseInt(fm.querySelector('input[name="iron"]').value, 10) || 0
                      , Full = parseInt(fm.querySelector('input[name="full"]').value, 10) || 0
                      ;
                    // if (!Image || !Image[0] || Image[0].size > 2 * 1024 * 1024 && !error) error = "<div class='b bb pd10'>Image Error!</div><div class='pd10'>Please attach an image to your item (Maximum size = 2MB).</div>";
                    if (!LaundryType && !error) error = "<div class='b bb pd10'>Please select a category</div><div class='pd10'>Select a type for this item.</div>";
                    if (Wash == 0 && Iron == 0 && Full == 0 && !error) error = "<div class='b bb pd10'>Please add a Price</div><div class='pd10'>Add price for at least a category. Price should include numbers only.</div>";
                    //
                    if (error) {
                        if (!localError) {
                            var h = '<div class="pd10">'+error+'<div class="fw fx"><div class="fx60"></div><div class="pd516 b bg-ac c-o ac">OK</div></div></div>';
                            $MM.show();
                            $MF.html(h).zoom();
                            fm.classList.add('Red');
                            localError = true;
                            //scroll to fm
                        }
                        return;
                    }
                    items.push({ownerID: UUID, itemID: LaundryType, wash: Wash, iron: Iron, full: Full});
                });
                if (localError || items.length === 0) return;// toast('Some entries are not valid');
                //
                $('body').spin();
                //submit package
                var fd = new FormData();
                fd.append('action', 'addLaundryItem');
                fd.append('ownerID', UUID);
                fd.append('laundryData', JSON.stringify(items));

                $.ajax({
                    url: MY_URL + "/send.php",
                    data: fd,
                    method: "POST",
                    cache: false,
                    processData: false,
                    contentType: false,
                    dataType: 'json',
                    timeout: 30000,
                    success: function(d) {
                        // var d = JSON.parse(d);
                        if (d.error) return toast('Unable to add item');
                        toast('Item added successfully');
                        buildItems(items, CATEGORY, true);
                        Views.pop();App.changeViewTo('#itemsView');//do not go back to item add view
                    },
                    error: function() { toast('Unable to connect'); },
                    complete: function() {
                        el.dataset.disabled = 'false';
                        $('body').unspin();
                    }
                });
                break;
            case '7'://gas-add-form
                var items = [];
                var fms = el.querySelectorAll('.gas-item'), localError = false;
                fms.forEach(function(fm) {
                    fm.classList.remove('Red');
                    var GasType = fm.querySelector('select[name="itemID"]').value
                      , Price = parseInt(fm.querySelector('input[name="price"]').value, 10) || 0
                      ;
                    if (!GasType && !error) error = "<div class='b bb pd10'>Please select a type</div><div class='pd10'>Select a type for this item.</div>";
                    if (Price === 0 && !error) error = "<div class='b bb pd10'>Please add a Price</div><div class='pd10'>Price should include numbers only.</div>";
                    //
                    if (error) {
                        if (!localError) {
                            var h = '<div class="pd10">'+error+'<div class="fw fx"><div class="fx60"></div><div class="pd516 b bg-ac c-o ac">OK</div></div></div>';
                            $MM.show();
                            $MF.html(h).zoom();
                            fm.classList.add('Red');
                            localError = true;
                            //scroll to fm
                        }
                        return;
                    }
                    items.push({ownerID: UUID, itemID: GasType, price: Price});
                });
                if (localError || items.length === 0) return;// toast('Some entries are not valid');
                //
                $('body').spin();
                //
                var fd = new FormData();
                fd.append('action', 'addGasItem');
                fd.append('ownerID', UUID);
                fd.append('gasData', JSON.stringify(items));

                $.ajax({
                    url: MY_URL + "/send.php",
                    data: fd,
                    method: "POST",
                    cache: false,
                    processData: false,
                    contentType: false,
                    dataType: 'json',
                    timeout: 30000,
                    success: function(d) {
                        if (d.error) return toast('Unable to add item');
                        toast('Item added successfully');
                        buildItems(items, CATEGORY, true);
                        Views.pop();App.changeViewTo('#itemsView');//do not go back to item add view
                    },
                    error: function() { toast('Unable to connect'); },
                    complete: function() {
                        el.dataset.disabled = 'false';
                        $('body').unspin();
                    }
                });
                break;
            
            default:
        }
    }).on('click', '.wrapper-closer', function(e) {
        var $el = $(this).closest('.main-wrapper');
        $el.slideUp(function(){
            $el.remove();
        });
    }).on('click', '#ticket-add', function(e) {
        var h="<div class='fw main-wrapper ticket_category pd10 b4-r mg-b16 bg'>\
                <div class='fw f10 t-c mg-b b psr'>ADD ANOTHER TICKET<span class='wrapper-closer psa t-c t0 r0 w32'>x</span></div>\
                <select name='category' class='fw pd20 bg mg-b16 b4-r ba'>\
                    <option value='0'>Select Ticket Type</option>\
                    <option value='1'>Regular</option>\
                    <option value='2'>Couple</option>\
                    <option value='3'>VIP</option>\
                    <option value='4'>VVIP</option>\
                    <option value='5'>Table for 4</option>\
                    <option value='6'>Table for 5</option>\
                    <option value='7'>Table for 6</option>\
                    <option value='8'>Table for 10</option>\
                </select>\
                <input type='number' name='price' class='fw pd20 bg mg-b16 b4-r ba' placeholder='Price'>\
                <input type='number' name='discount' class='fw pd20 bg mg-b16 b4-r ba' placeholder='Add Discount'>\
                <input type='number' name='seats' class='fw pd20 bg b4-r ba' placeholder='Available Seats'>\
            </div>";
        $(this).before(h);
    }).on('click', '#laundry-add', function(e) {
        var h=`<div class="laundry-item main-wrapper mg-b16 pd16 Grey b4-r">
            <div class='fw f10 mg-b psr b'>ADD ANOTHER ITEM<span class='wrapper-closer psa t-c t0 r0 w32'>x</span></div>
            <div class="triangle-down mg-b16"><select name="itemID" class="fw pd20 bg b4-r ba">
                <option value="">Select Type</option>
                <option value="1">Shirt</option>
                <option value="2">Trouser</option>
                <option value="3">Jeans</option>
                <option value="4">Suit</option>
                <option value="5">Jacket</option>
                <option value="6">Towel</option>
                <option value="7">Kaftan</option>
                <option value="8">Trad</option>
                <option value="9">Bedsheet</option>
                <option value="10">Rug</option>
                <option value="11">Abaya</option>
                <option value="12">Skirt</option>
                <option value="13">Socks</option>
                <option value="14">Singlets</option>
                <option value="15">Boxer</option>
                <option value="16">Duvet</option>
                <option value="17">Blanket</option>
                <option value="18">Scarf</option>
                <option value="19">Hoodie</option>
                <option value="20">Agbada</option>
                <option value="21">Bag</option>
                <option value="22">Shoes</option>
                <option value="23">Jalab</option>
            </select></div>
            <input type="number" name="wash" class="fw pd20 bg b4-r ba" placeholder="Price for Wash only">
            <input type="number" name="iron" class="fw pd20 bg b4-r ba" placeholder="Price for Iron only">
            <input type="number" name="full" class="fw pd20 bg b4-r ba" placeholder="Price for Full laundry">
        </div>`;
        $(this).before(h);
    }).on('click','#gas-add',function(){
        var h=`<div class="gas-item main-wrapper pd16 mg-b16 Grey b4-r">
            <div class='fw f10 mg-b psr b'>ADD ANOTHER ITEM<span class='wrapper-closer psa t-c t0 r0 w32'>x</span></div>
            <div class="triangle-down mg-b16"><select name="itemID" class="fw pd20 bg b4-r ba">
                <option value="">Select Cylinder Size</option>
                <option value="1">3kg</option>
                <option value="2">5kg</option>
                <option value="3">6kg</option>
                <option value="4">12kg</option>
            </select></div>
            <input type="number" name="price" class="fw pd20 bg b4-r ba" placeholder="Price">
        </div>`;
        $(this).before(h);
    }).on('click','.singo',function(){
        $(this).addClass('selected').siblings().removeClass('selected');
    }).on('click','.multipo',function(){
        this.classList.toggle('selected');
    }).on('click', '.menu-btn', function(e) {
        $(this).addClass('active').siblings('.active').removeClass('active');
        // change tabs appropriately
    }).on('click', '.meal-type', function() {
        var idx = this.dataset.index;
        $('#meal-container').animate({'left': '-'+(idx*100)+'vw'});
    }).on('touchstart click', '.st-p', function(e) {
        // e.preventDefault();
        e.stopPropagation();
    }).on('click', '.Modal', function() {
        $(this).hide();
        if (this.id == 'searchModal') {
            $('#searchHeader').hide();
            showAllOrderEntries();
        }
    }).on('click', '.modalClose', function() {
        $('#menuModal').hide();
    }).on('touchmove', '.Modal', function(e) {
        if (e.cancelable) e.preventDefault();
        e.stopPropagation();
    }).on('click', '#menu-button', function() {
        mDrawer.style.transition = 'transform 200ms ease-out';
        mDrawer.style.transform = 'translate3d(0, 0, 0)';
        mDrawer.classList.add('sh-l');
        mModal.style.display = 'block';
    }).on('click', '#myItemsLink, .shop-link', function() {
        App.changeViewTo('#itemsView');
        $('.items-container').hide();

        var catg, shopId, shopName, shopAddress;
        if (this.id == 'myItemsLink') {//owner's item.
            catg = CATEGORY;
            shopId = UUID;
            shopName = USERNAME;
            shopAddress = ADDRESS;
            $('#proceed-to-cart').hide();
        } else {//highlighted items
            catg = this.dataset.catg;
            shopId = this.dataset.shopId;
            shopName = this.dataset.shopName;
            shopAddress = this.dataset.shopAddress;
            $('#proceed-to-cart').show().attr('data-catg', catg);
        }

        updateStoreInformation(shopId, shopName, shopAddress, catg);
        
        $('body').spin();
        $.ajax({
            url: MY_URL + "/fetch.php",
            data: {
                action: 'fetchItems',
                shopID: shopId,
                catg: catg
            },
            dataType: 'json',
            timeout: 30000,
            method: "GET",
            success: function(p) {
                if (p.length > 0) {
                    CURRENT_SHOP = shopId;
                    buildItems(p, catg, false);
                } else {
                    //
                }
            },
            complete: function() {$('body').unspin();}
        });
    }).on('click', '.item-remove', function(e) {
        console.log('Will delete: ' + this.dataset.itemId);//[[***]]
    }).on('click', '.item-order-spinner', function(e) {
        var id = e.target.classList;
        var counter = this.querySelector('.item-count');
        var count = Number(counter.innerText);
        if (id.contains('item-subtract')) {
            if (count == 0) return;
            counter.innerText = --count;
        } else if (id.contains('item-add')) {
            counter.innerText = ++count;
        }
    }).on('click', '#proceed-to-cart', function(e) {
        var catg = this.dataset.catg;
        var menu = document.querySelector('.items-container[data-catg="'+catg+'"]');
        var items = menu.querySelectorAll('.item-count');
        var invoice = [];
        switch(catg) {
            case '1'://e-commerce
                break;
            case '2'://food
            case '4'://graphics
            case '5'://makeup
            case '7'://gas
                items.forEach(function(item) {
                    var tt = item.innerText; if (tt == 0) return;// console.log(tt);
                    var id = item.dataset.itemId;
                    var d = ITEMS_DATA.find(function(a) {return a.itemID == id;});
                    if (d) {
                        invoice.push({id: id, nm: d.name, pr: parseFloat(d.price).toFixed(2), ds: parseFloat(d.discount).toFixed(2), tt: tt});
                    }
                });
                break;
            case '3'://events
                items.forEach(function(item) {
                    var tt = item.innerText; if (tt == 0) return;// console.log(tt);
                    var id = item.dataset.itemId;
                    var ty = item.dataset.itemType;
                    var d = ITEMS_DATA.find(function(a) {return a.itemID == id;});
                    if (d) {
                        var tk = d.tickets.find(function(b){return b.ticket_type==ty});
                        invoice.push({id: id, nm: d.name+' ('+TICKETS[ty]+')', pr: parseFloat(tk.price).toFixed(2), ds: parseFloat(tk.discount).toFixed(2), tt: tt});
                    }
                });
                break;
            case '6'://laundry
                items.forEach(function(item) {
                    var tt = item.innerText; if (tt == 0) return;// console.log(tt);
                    var id = item.dataset.itemId;
                    var d = ITEMS_DATA.find(function(a) {return a.itemID == id;});
                    if (d) {
                        var y = document.querySelector('.laundry-type[data-item-id="'+id+'"] .radio.selected').dataset.name;
                        invoice.push({id: id, nm: d.name+' ('+y.split('_').map(function(t){return t[0].toUpperCase()+t.substring(1);}).join(' ')+')', pr: parseFloat(d[y]).toFixed(2), ds: '0.00', tt: tt});
                    }
                });
                break;
        }
        if (invoice[0]) {
            CURRENT_ORDER = invoice;
            App.changeViewTo('#invoiceView');
            $('#invoice-content').html(buildInvoice(invoice, null));
        } else toast('No item was selected');
    }).on('click', '#proceed-to-address', function(e) {//on invoice-view
        App.changeViewTo('#dropoffView');
        var fm = document.querySelector('#dropoff-content');
        fm.querySelector('input[name="address"]').value = Store.getItem('delivery_address');
        fm.querySelector('input[name="name"]').value = Store.getItem('delivery_name');
        fm.querySelector('input[name="phone"]').value = Store.getItem('delivery_phone');
    }).on('click', '#submit-for-review', function(e) {
        var fm = document.querySelector('#dropoff-content');
        var address = fm.querySelector('input[name="address"]').value;
        var name = fm.querySelector('input[name="name"]').value;
        var phone = fm.querySelector('input[name="phone"]').value;
        var frd = fm.querySelector('select[name="order_for"]').value;
        var deliveryInstruction = fm.querySelector('textarea[name="deliveryInstruction"]').value;
        var voucherCode = document.querySelector('input[name="voucherCode"]').value;
        //
        if (!address || !name || !phone || !frd) return toast('Provide all required fields');
        //
        var details = {address: address, name: name, phone: phone, friend: frd, instruction: deliveryInstruction};
        //
        $('body').spin();
        $.ajax({
            url: MY_URL + "/send.php",
            data: {
                action: 'createOrder',
                cost: ORDER_TOTAL,
                invoice: JSON.stringify(CURRENT_ORDER),
                details: JSON.stringify(details),
                voucher: voucherCode,
                sellerID: ITEMS_DATA[0].ownerID,
                buyerID: UUID
            },
            method: "POST",
            timeout: 30000,
            dataType: 'json',
            success: function(p) {
                // console.log(p);
                if (p.state == '0') {
                    toast('Order create error. Please submit your order again.');
                } else {
                    Views = ['#home'];
                    App.changeViewTo('#successView');
                    Store.setItem('delivery_address', address);
                    Store.setItem('delivery_name', name);
                    Store.setItem('delivery_phone', phone);
                }
            },
            complete: function() {
               $('body').unspin();
            }
        });
    }).on('click', '.services-link', function(e) {
        var catg = this.dataset.catg;
        $('#services-found').html($H+$H+$H);
        $('#current-service').text(this.querySelector('.service-link-name').dataset.name);
        App.changeViewTo('#servicesView');
        $('body').spin();
        $.ajax({
            url: MY_URL + "/fetch.php",
            data: {
                action: 'fetchServices',
                campus: CAMPUSKEY,
                catg: catg
            },
            timeout: 30000,
            dataType: 'json',
            method: "GET",
            success: function(p) {
                // console.log(p);
                if (p.length == 0) return toast('No seller was found');
                $('#services-found').html(buildServices(p));
            },
            complete: function() {$('body').unspin();}
        });
    }).on('click', '.more-services', function(e) {
        var g = this.dataset.catg;
        $('#services-found').html($H+$H+$H);
        $('#current-service').text(this.dataset.name);
        App.changeViewTo('#servicesView');
        //
        if (g == '2') fetchRestaurants('more', 20);
        else if (g == '3') fetchEvents('more', 20);
        else return;
        $('body').spin();
    }).on('click', '.products-catg-entry', function(e) {
        toast('Coming soon...');
    }).on('click', '#orders-link', function(e) {
        fetchMyOrders($('#ordersWrapper'), 'full');
    }).on('click', '.order-details-btn', function(e) {
        var i = this.dataset.orderId;
        var order = MY_ORDERS.find(function(e) {return e.orderID == i;});
        var invoice = JSON.parse(order.invoice);
        $('#orderDetails').html(buildInvoice(invoice, order));
        App.changeViewTo('#orderDetailsView');
    }).on('click', '.order-complete-btn', function(e) {
        var i = this.dataset.orderId;
        $('body').spin();
        $.ajax({
            url: MY_URL + "/send.php",
            data: {
                action: 'completeOrder',
                sellerID: UUID,
                orderID: i
            },
            timeout: 30000,
            dataType: 'json',
            method: "POST",
            success: function(p) {
                if (p.state == '1') {
                    toast('Order completed successfully');
                    $('.order-status[data-order-id="'+i+'"]').attr('data-status', '1').text('Completed');
                    var order = MY_ORDERS.find(function(e) {return e.orderID == i;});
                    order.delivery_status = 1;
                    checkWallet();
                    fetchProgress();
                    App.closeCurrentView();
                } else toast('Please try again');
            },
            complete: function() {$('body').unspin();}
        });
    }).on('click', '.order-payment-btn', function(e) {
        App.changeViewTo('#cardView');
    }).on('click', '#submit-card-details', function(e) {
        var el = document.querySelector('#card-content');
        var cardNumber = el.querySelector('input[name="cardNumber"]').value;
        var cardMonth = parseInt(el.querySelector('input[name="cardMonth"]').value);
        var cardYear = el.querySelector('input[name="cardYear"]').value;
        var cardCVV = el.querySelector('input[name="cardCVV"]').value;
        if (cardMonth < 10) cardMonth = '0' + cardMonth;
        //
        var fName = '', lName = '';
        if (FULLNAME) {
            var i = FULLNAME.indexOf(' ');
            if (i == -1) i = FULLNAME.length;
            fName = FULLNAME.substring(0, i);
            lName = FULLNAME.substring(i);
        }
        /*
        5531 8866 5214 2950
        cvv 564
        Expiry: 09/22
        Pin 3310
        otp 12345

        5061 4604 1012 0223 210
        Expiry Month 12
        Expiry Year 21
        cvv: 780
        Pin: 3310
        otp 12345
        */
        PAYLOAD = {
          // "PBFPubKey": "FLWPUBK-d7f08c4900b741ac9dbc917972bbf8db-X",
          "PBFPubKey": "FLWPUBK_TEST-f97470a2644144b63407003be8af7c5f-X",
          // "cardno": cardNumber,
          "cardno": "5531886652142950",
          // "cvv": cardCVV,
          "cvv": "564",
          // "expirymonth": cardMonth,
          "expirymonth": "09",
          // "expiryyear": cardYear,
          "expiryyear": "22",
          "currency": "NGN",
          "country": "NG",
          "amount": ORDER_TOTAL,
          "email": EMAIL,
          "phonenumber": PHONE,
          "firstname": fName,
          "lastname": lName,
          "txRef": CURRENT_ORDER_ID// your unique merchant reference
        }
        sendPaymentInfo(1);
    }).on('click', '.pin-key', function(e) {
        var pin = $('#card-pin-container');
        var val = pin.attr('data-value');
        var key = this.innerText;
        if (key == 'x') pin.html('').attr('data-value', '');
        else {
            if (val.length == 4) return;
            pin.html(pin.html() + '*').attr('data-value', val + key);
        }
    }).on('click', '#submit-card-pin', function(e) {
        var PIN = $('#card-pin-container').attr('data-value');
        if (PIN.length < 4) return;
        // PAYLOAD.pin = PIN;
        PAYLOAD.suggested_auth = 'PIN';
        PAYLOAD.pin = '3310';
        sendPaymentInfo(2);
    }).on('click', '#submit-card-token', function(e) {
        // var OTP = $('#card-token-input').val();
        var OTP = '12345';
        validatePayment(OTP);
    }).on('click', '#pending-orders-btn', function(e) {
        fetchMyOrders($('#pendingOrders'), 'pending');
        App.changeViewTo('#ordersPendingView');
    }).on('click', '#completed-orders-btn', function(e) {
        fetchMyOrders($('#completedOrders'), 'completed');
        App.changeViewTo('#ordersCompletedView');
    }).on('click', '.orders-filter', function(e) {
        $('#searchModal').show();
        $('#searchHeader').show(300);
        var ip = document.querySelector('#search-input');
        ip.dataset.container = this.dataset.container;
        ip.value = '';
        ip.focus();
    }).on('keyup', '#search-input', function(e) {
        var query=this.value;
        var ct = this.dataset.container;
        var items = document.querySelectorAll(ct + ' .order-entry');
        items.forEach(function(el){
            var id = el.dataset.orderId;
            if(id && id.startsWith(query)){
                el.style.display = '';
            } else el.style.display = 'none';
        });
    }).on('click', '#store-review', function(e) {
        App.changeViewTo('#reviewView');
    }).on('click', '#post-a-review', function(e) {
        var text = document.querySelector('#review-input').value.trim();
        if (!text) return;
        var el = this;
        if (el.dataset.disabled == 'true') return;
        el.dataset.disabled = 'true';
        $('body').spin();
        $.ajax({
            url: MY_URL + "/send.php",
            data: {
                action: 'submitReview',
                message: text,
                reviewerID: UUID,
                ownerID: CURRENT_SHOP
            },
            method: "POST",
            timeout: 30000,
            dataType: 'json',
            success: function(p) {
                if (p.state == '1') {
                    toast('Your review was posted successfully');
                    App.closeCurrentView();
                } else {
                    toast(p.state);
                }
            },
            complete: function() {
                el.dataset.disabled = 'false';
                $('body').unspin();
            }
        });
    }).on('click', '#reviews-link', function(e) {
        var $WRP = $('#reviewsWrapper');
        if ($WRP.is(':empty')) $('body').spin();
        $.ajax({
            url: MY_URL + "/fetch.php",
            data: {
                action: 'fetchReviews',
                ownerID: UUID
            },
            timeout: 30000,
            dataType: 'json',
            method: "GET",
            success: function(p) {
                if (p.length == 0) return;
                $WRP.html(buildReviews(p));
            },
            complete: function() {$('body').unspin();}
        });
    }).on('click', '#withdraw-cash', function(e) {
        toast('Connecting...');
    }).on('click', '#notifications-btn', function(e) {
        this.dataset.total = '0';
        App.changeViewTo('#inboxView');
        fetchMails();
    }).on('click', '.msg-entry', function(e) {
        var key = this.dataset.key;
        var msg = MY_MAILS.find(function(m) {return m.k = key;});
        $('#repliesWrapper').empty();
        App.changeViewTo('#messageView');
        buildMessage(msg);
        // fetchMessageReplies(key);
    }).on('click', '.msg-reply', function(e) {
        App.changeViewTo('#replyView');
        $('#post-a-reply').attr('data-key', this.dataset.key);
    }).on('click', '#post-a-reply', function(e) {//[[***]]
        var reply = $('#reply-input').val().trim();
        if (!reply) return;
        // console.log(reply);
        var el = this;
        if (el.dataset.disabled == 'true') return;
        el.dataset.disabled = 'true';
        $('body').spin();
        $.ajax({
            url: MY_URL + "/send.php",
            data: {
                action: 'submitAReply',
                reply: reply,
                messageKey: el.dataset.key,
                senderID: UUID
            },
            method: "POST",
            timeout: 30000,
            dataType: 'json',
            success: function(p) {
                if (p.state == '1') {
                    // buildReply();
                    App.closeCurrentView();
                } else {
                    toast(p.state);
                }
            },
            complete: function() {
                el.dataset.disabled = 'false';
                $('body').unspin();
            }
        });
    }).on('click', '.msg-close', function(e) {
        buildConfirm('message-close-confirm', 'Confirm to Close this Message?', this.dataset.key);
    }).on('click', '#message-close-confirm', function(e) {
        var key = this.dataset.key;
        $.ajax({
            url: MY_URL + "/send.php",
            data: {
                action: 'messageClose',
                ownerID: UUID,
                key: key
            },
            dataType: 'json',
            timeout: 30000,
            method: "POST",
            success: function(p) {
                if (p == 1) {
                    var msg = MY_MAILS.find(function(m) {return m.k = key;});
                    msg.isopen = 0;
                    buildMessage(msg);
                    $('.mail-status[data-key="'+key+'"]').removeClass('Orange').addClass('bg-fd').text('closed');
                }
            }
        });
    }).on('click', '.msg-delete', function(e) {
        buildConfirm('message-delete-confirm', 'Confirm to Delete this Message?', this.dataset.key);
    }).on('click', '#message-delete-confirm', function(e) {
        var key = this.dataset.key;
        $.ajax({
            url: MY_URL + "/send.php",
            data: {
                action: 'messageDelete',
                ownerID: UUID,
                key: key
            },
            dataType: 'json',
            timeout: 30000,
            method: "POST",
            success: function(p) {
                if (p == '1') {
                    $('.msg-entry[data-key="'+key+'"]').remove();
                    var msg = MY_MAILS.find(function(m) {return m.k = key;});
                    msg.isdeleted = 1;
                    App.closeCurrentView();
                }
            }
        });
    })
    ;











    var D = { X: 0, Y: 0, Z: 0 }, VIEW80 = -VIEWPORTWIDTH * 0.8;
    $('#drawer-listener').on('touchstart', function(e) {
        mDrawer.style.transition = '';
        var e = e.originalEvent || e, touch = e.touches[0];
        if (e.touches.length > 1) return;
        if (touch) {
            D.Z = VIEW80, D.X = touch.pageX, D.Y = touch.pageY;
            this.addEventListener('touchmove', touchmove);
            this.addEventListener('touchend', touchend);
        }
    });
    function touchmove(e) {
        var e = e.originalEvent || e, touch = e.touches[0];
        if (touch.pageX - D.X > Math.abs(touch.pageY - D.Y)) {
            if (touch.pageX - D.X <= 0) return this.removeEventListener('touchmove', touchmove);
            if (e.cancelable) e.preventDefault(); //direction > 1 => pulling, disallow native scrolling
            var distance = touch.pageX - D.X, p = Math.min(VIEW80 + 0.8 * distance, 0);
            mDrawer.classList.add('sh-l');
            mDrawer.style.transform = 'translate3d(' + p + 'px, 0, 0)';
            D.Z = p;
        } else if (D.Z == VIEW80) return this.removeEventListener('touchmove', touchmove);
    }
    function touchend(e) {
        this.removeEventListener('touchmove', touchmove);
        this.removeEventListener('touchend', touchend);
        if (D.Z > -150) {
            mDrawer.style.transform = 'translate3d(0, 0, 0)';
            mModal.style.display = 'block';
        } else {
            mDrawer.style.transform = 'translate3d(-105%, 0, 0)';
            mDrawer.classList.remove('sh-l');
            mModal.style.display = 'none';
        }
        mDrawer.style.transition = 'all 200ms ease-out';
    }

    var nav = { x: 0, y: 0, z: 0 }
    mNav.addEventListener('touchstart', function(e) {
        e.stopPropagation();
        mDrawer.style.transition = '';
        var touch = e.touches[0];
        nav.x = touch.pageX, nav.y = touch.pageY, nav.z = 0;
        this.addEventListener('touchmove', navMove);
        this.addEventListener('touchend', navEnd);
    });
    function navMove(e) {
        var touch = e.touches[0];
        var distance = touch.pageX - nav.x, p = Math.min(distance * 0.8, 1);
        if (Math.abs(touch.pageY - nav.y) > Math.abs(distance)) return this.removeEventListener('touchmove', navMove); // user scrolling vertically
        if (e.cancelable) e.preventDefault();
        mDrawer.style.transform = 'translate3d(' + p + 'px, 0, 0)';
        nav.z = p;
    }
    function navEnd(e) {
        this.removeEventListener('touchmove', navMove);
        this.removeEventListener('touchend', navEnd);
        if (e.target == mModal) e.preventDefault();
        // console.log(nav.z);
        if (nav.z > -150 && nav.z !== 0) {//not down to -150
            mDrawer.style.transform = 'translate3d(0, 0, 0)';
            mModal.style.display = 'block';
        } else {
            mDrawer.style.transform = 'translate3d(-105%, 0, 0)';
            mDrawer.classList.remove('sh-l');
            mModal.style.display = 'none';
        }
        mDrawer.style.transition = 'all 200ms ease-in';
    }


    var S = {a:0,z:0}
    document.getElementById('swipe-container').addEventListener('touchstart', function(e) {
        e.stopPropagation();
        this.style.transition = '';
        var touch = e.touches[0];
        S.a = touch.pageX;
        this.addEventListener('touchmove', swipeMove);
        this.addEventListener('touchend', swipeEnd);
    });
    function swipeMove(e) {
        var touch = e.touches[0];
        var distance = touch.pageX - S.a
        var p = Math.min(distance * 0.8 + S.z, 0);
        p = Math.max(p, -VIEWPORTWIDTH * 2);
        if (e.cancelable) e.preventDefault();
        this.style.transform = 'translate3d(' + p + 'px, 0, 0)';
        this.dataset.left = p;
    }
    function swipeEnd(e) {
        this.removeEventListener('touchmove', swipeMove);
        this.removeEventListener('touchend', swipeEnd);
        S.z = parseInt(this.dataset.left);
        if (S.z < -VIEWPORTWIDTH * 0.4 - VIEWPORTWIDTH) {
            var p = -VIEWPORTWIDTH * 2;
            this.style.transform = 'translate3d(' + p + 'px, 0, 0)';
            this.dataset.index = '2';
            S.z = p;
        } else if (S.z < -VIEWPORTWIDTH * 0.4) {
            var p = -VIEWPORTWIDTH;
            this.style.transform = 'translate3d(' + p + 'px, 0, 0)';
            this.dataset.index = '1';
            S.z = p;
        } else {
            var p = 0;
            this.style.transform = 'translate3d(' + p + 'px, 0, 0)';
            this.dataset.index = '0';
            S.z = p;
        }
        this.style.transition = 'transform 150ms ease-out';
    }

 





    function fetchEvents(source,limit) {//timeline, search,
        $.ajax({
            url: MY_URL + "/fetch.php",
            data: {
                action: 'fetchEvents',
                campus: CAMPUSKEY,
                limit: limit
            },
            timeout: 30000,
            dataType: 'json',
            method: "GET",
            success: function(p) {
                // console.log(p);
                if (p.length == 0) {
                    if (source == 'timeline') {
                        var h = "<div class='w85p-c i-b ov-h mg-r ba psr bs-r more-services' data-catg='3' data-name='Events'>\
                                <div class='fw fh fx fx-ac fx-jc ov-h bg-ac'>\
                                    <img src='res/img/icon/party.jpg' width='110%'>\
                                </div>\
                                <div class='fw psa white info-banner h60 lh-i b0 l0 pd10'>\
                                    <div class='fw b f14'>No suggested events</div>\
                                    <div class='fw ovx-h f14'>Browse other events...?</div>\
                                </div>\
                            </div>\
                            <div class='w85p-c i-b ov-h mg-r ba psr bs-r'>\
                                <div class='fw fh fx fx-ac fx-jc ov-h bg-ac'></div>\
                                <div class='fw psa bg-ac h60 b0 l0 pd10'></div>\
                            </div>";
                        $('#carousel-buy-ticket').html(h);
                    }
                    return;
                }
                if (source == 'timeline') {
                    $('#carousel-buy-ticket').html(buildEvents(p));
                }else if (source == 'more') $('#services-found').html(buildMoreEvents(p));
            },
            complete: function() {$('body').unspin();}
        });
    }
    function fetchRestaurants(source,limit) {//timeline, search,
        $.ajax({
            url: MY_URL + "/fetch.php",
            data: {
                action: 'fetchRestaurants',
                campus: CAMPUSKEY,
                limit: limit
            },
            timeout: 30000,
            dataType: 'json',
            method: "GET",
            success: function(p) {
                // console.log(p);
                if (p.length == 0) {
                    if (source == 'timeline') {
                        var h = "<div class='w85p-c i-b ov-h mg-r ba psr bs-r more-services' data-catg='2' data-name='Restaurants'>\
                                <div class='fw fh fx fx-ac fx-jc ov-h bg-ac'>\
                                    <img src='res/img/icon/food.jpg' width='110%'>\
                                </div>\
                                <div class='fw psa white info-banner h60 lh-i b0 l0 pd10'>\
                                    <div class='fw b f14'>No suggested restaurants</div>\
                                    <div class='fw ovx-h f14'>Check our top rated sellers...?</div>\
                                </div>\
                            </div>\
                            <div class='w85p-c i-b ov-h mg-r ba psr bs-r'>\
                                <div class='fw fh fx fx-ac fx-jc ov-h bg-ac'></div>\
                                <div class='fw psa bg-ac h60 b0 l0 pd10'></div>\
                            </div>";
                        $('#carousel-buy-food').html(h);
                    }
                    return;
                }
                if (source == 'timeline') {
                    $('#carousel-buy-food').html(buildRestaurants(p));
                }else if (source == 'more') $('#services-found').html(buildMoreRestaurants(p));
            },
            complete: function() {$('body').unspin();}
        });
    }
    function buildEvents(p) {
        var h = '';
        p.forEach(function(c) {
            h+="<div class='w85p-c i-b ov-h mg-r sh-a ba psr bs-r shop-link"
                    +"' data-shop-id='"+c.ui
                    +"' data-shop-name='"+c.sn
                    +"' data-shop-address='"+c.sd
                    +"' data-catg='3'>\
                    <div class='fw fh fx fx-ac fx-jc ov-h bg-mod'>\
                        <img src='"+MY_URL+"/img/items/events/"+c.id+".jpg' class='fw'>\
                    </div>\
                    <div class='fw psa white info-banner lh-i b0 l0 pd10'>\
                        <div class='fw b f16'>"+c.nm+"</div>\
                        <div class='fw b f16'>"+EVENTS[c.tp]+"</div>\
                        <div class='fw b'>"+c.dt+"</div>\
                        <div class='fw f10'>"+c.ad+"</div>\
                    </div>\
                </div>";
        });
        h+="<div class='w85p-c i-b ov-h mg-r sh-a ba psr bs-r more-services' data-catg='3' data-name='Events'>\
                <div class='fw fh fx fx-ac fx-jc ov-h bg-mod'>\
                    <img src='res/img/icon/party.jpg' class='fw'>\
                </div>\
                <div class='fw psa white info-banner lh-i b0 l0 pd10'>\
                    <div class='fw b f14'>Want something different?</div>\
                    <div class='fw f10'>Browse more events...</div>\
                </div>\
            </div>";
        return h;
    }
    function buildMoreEvents(p) {
        var h = '';
        p.forEach(function(c) {
            h+="<div class='fw ov-h mg-b16 psr bs-r sh-a ba shop-link"
                    +"' data-shop-id='"+c.ui
                    +"' data-shop-name='"+c.sn
                    +"' data-shop-address='"+c.sd
                    +"' data-catg='3'>\
                    <div class='fw fh fx fx-ac fx-jc ov-h bg-mod'>\
                        <img src='"+MY_URL+"/img/items/events/"+c.id+".jpg' class='fw'>\
                    </div>\
                    <div class='fw psa white info-banner lh-i b0 l0 pd10'>\
                        <div class='fw b f16'>"+c.nm+"</div>\
                        <div class='fw b f16'>"+EVENTS[c.tp]+"</div>\
                        <div class='fw b'>"+c.dt+"</div>\
                        <div class='fw f10'>"+c.ad+"</div>\
                    </div>\
                </div>";
        });
        return h;
    }
    function buildRestaurants(p) {
        var h = '';
        p.forEach(function(c) {
            h+="<div class='w85p-c i-b ov-h mg-r psr bs-r sh-a ba shop-link"
                    +"' data-shop-id='"+c.ui
                    +"' data-catg='"+c.cg
                    +"' data-shop-name='"+c.nm
                    +"' data-shop-address='"+c.ad
                    +"'>\
                    <div class='fw fh fx fx-ac fx-jc ov-h bg-mod'>\
                        <img src='"+MY_URL+"/img/users/"+c.ui+".jpg' class='fw'>\
                    </div>\
                    <div class='fw psa white info-banner lh-i b0 l0 pd10'>\
                        <div class='fw b f16'>"+c.nm+"</div>\
                        <div class='fw ovx-h ovy-a f10'>"+c.ad+"</div>\
                    </div>\
                </div>";
        });
        h+="<div class='w85p-c i-b ov-h mg-r psr bs-r sh-a ba more-services' data-catg='2' data-name='Restaurants'>\
                <div class='fw fh fx fx-ac fx-jc ov-h bg-mod'>\
                    <img src='res/img/icon/food.jpg' class='fw'>\
                </div>\
                <div class='fw psa white info-banner lh-i b0 l0 pd10'>\
                    <div class='fw b f14'>More...</div>\
                    <div class='fw ovx-h ovy-a f10'>Browse more restaurants...</div>\
                </div>\
            </div>";
        return h;
    }
    function buildMoreRestaurants(p) {
        var h = '';
        p.forEach(function(c) {
            h+="<div class='fw ov-h mg-b16 ba psr bs-r sh-a ba shop-link"
                    +"' data-shop-id='"+c.ui
                    +"' data-catg='"+c.cg
                    +"' data-shop-name='"+c.nm
                    +"' data-shop-address='"+c.ad
                    +"'>\
                    <div class='fw fh fx fx-ac fx-jc ov-h bg-mod' style='height:50vw;'>\
                        <img src='"+MY_URL+"/img/users/"+c.ui+".jpg' class='fw'>\
                    </div>\
                    <div class='fw psa white info-banner lh-i b0 l0 pd10'>\
                        <div class='fw b f16'>"+c.nm+"</div>\
                        <div class='fw ovx-h ovy-a f10'>"+c.ad+"</div>\
                    </div>\
                </div>";
        });
        return h;
    }
    function buildServices(p) {
        var h = '';
        p.forEach(function(c) {
            h+="<div class='fw fx ov-h bb bg mg-b16 ba psr shop-link"
                    +"' data-shop-id='"+c.ui
                    +"' data-catg='"+c.cg
                    +"' data-shop-name='"+c.nm
                    +"' data-shop-address='"+c.ad
                    +"'>\
                    <div class='box120 mg-r fx fx-ac fx-jc ov-h bg-ac'>\
                        <img src='"+MY_URL+"/img/users/"+c.ui+".jpg' class='fw'>\
                    </div>\
                    <div class='fx60 pd10'>\
                        <div class='fw b f16'>"+c.nm+"</div>\
                        <div class='fw ovx-h ovy-a f10'>"+c.ad+"</div>\
                    </div>\
                </div>";
        });
        return h;
    }
    function checkWallet() {
        $.ajax({
            url: MY_URL + "/fetch.php",
            data: {
                action: 'checkWallet',
                sellerID: UUID
            },
            timeout: 30000,
            dataType: 'json',
            method: "GET",
            success: function(p) {
                $('#wallet-balance').text(comma(p.balance));
            }
        });
    }
    function fetchProgress() {
        $.ajax({
            url: MY_URL + "/fetch.php",
            data: {
                action: 'fetchProgress',
                sellerID: UUID
            },
            timeout: 30000,
            dataType: 'json',
            method: "GET",
            success: function(p) {
                $('#completed-orders').text(comma(p.completed));
                $('#pending-orders').text(comma(p.pending));
            }
        });
    }
    function checkMail() {
        $.ajax({
            url: MY_URL + "/fetch.php",
            data: {
                action: 'checkMail',
                ownerID: UUID
            },
            timeout: 30000,
            dataType: 'json',
            method: "GET",
            success: function(p) {
                $('#notifications-btn').attr('data-total', p.total);
            }
        });
    }
    function fetchMails() {
        $.ajax({
            url: MY_URL + "/fetch.php",
            data: {
                action: 'fetchMails',
                ownerID: UUID
            },
            timeout: 30000,
            dataType: 'json',
            method: "GET",
            success: function(p) {
                if (p.length > 0) {
                    MY_MAILS = p;
                    $('#messagesWrapper').html(buildMails(p));
                }
            }
        });
    }
    function buildMails(p) {
        var h = '';
        p.forEach(function(c) {//admins will close it. To reopen this ticket, reply this message
            h += "<div class='msg-entry fw pd10 psr b4-r mg-b16 ba sh-a ov-h' data-key='"+c.k+"'>\
                <div class='mail-status psa t0 r0 white "+(c.isopen == 1 ? 'Orange' : 'bg-fd')+"' data-key='"+c.k+"' style='padding:2px 5px;'>"+(c.isopen == 1 ? 'open' : 'closed')+"</div>\
                <div class='fw b f16'>"+c.title+"</div>\
                <div class='fw ov-h pd10z b5 tx-el c-g' style='white-space:nowrap;'>"+c.message+"</div>\
                <div class='f10 c-g'>"+checkTime(c.time_*1000)+"</div>\
            </div>";
        });
        return h;
    }
    function buildMessage(c) {
        var h = "<div class='fw pd10 psr b4-r ba sh-a ov-h'>\
                <div class='psa t0 r0 white "+(c.isopen == 1 ? 'Orange' : 'bg-fd')+"' style='padding:2px 5px;'>"+(c.isopen == 1 ? 'open' : 'closed')+"</div>\
                <div class='fw b f16'>"+c.title+"</div>\
                <div class='f10 c-g'>"+checkTime(c.time_*1000)+"</div>\
                <div class='fw pd10z'>"+c.message+"</div>\
                <div class='fw fx c-g b5'>\
                    <div class='msg-reply mg-r' data-key='"+c.k+"'>Reply</div>\
                    <div class='"+(c.isopen == '1' ? 'msg-close' : '')+" mg-r' data-key='"+c.k+"'>"+(c.isopen == '1' ? 'Close' : "<span class='bg-fd'>Closed</span>")+"</div>\
                    <div class='msg-delete' data-key='"+c.k+"'>Delete</div>\
                </div>\
                <div class='fw pd10 mg-t ba b4-r bg-ac i c-g'>This message will be closed by the admin if you do not respond within 3 days. You may close it if you are satisfied. You can re-open the message anytime by sending a reply. If you delete this message, you would not see it in your inbox again.</div>\
            </div>";
        $('#messageWrapper').html(h);
    }
    function buildItems(p, catg, local) {
        var h = '';
        var user = p[0].ownerID == UUID;
        ITEMS_DATA = p;

        if (catg == '1') {//e-commerce
            p.forEach(function(c) {
                h+="<div class='boxes2 product-entry i-b bg' data-product-id='"+c.itemID+"'>\
                    <div class='fw'>\
                        <div class='fw fx h50w bg-ac mg-b bs-r ba ov-h'>\
                            <img class='fw im-sh' src='"+MY_URL+"/img/items/products/"+c.itemID+"_0.jpg'>\
                        </div>\
                        <div class='fw'>\
                            <div class='f16 b'>"+c.name+"</div>"+
                            (c.discount > 0 ? "<span class='tx-lt ltt c-g f10 mg-r'>&#8358;"+comma(c.price)+"</span>" : "")+
                            "<span class='f16'>&#8358;"+comma((c.price - c.discount).toFixed(2))+"</span>\
                        </div>"+
                        (c.delivery == 1 ? 
                        "<div class='fx f10'>\
                            <div style='width:54px;'><img src='res/img/logo.png' class='fw'></div><i class='b'>Express</i>\
                        </div>":
                        ""
                        )+
                    "</div>\
                </div>";
            });
            var $v = $('#products-container');
            if (local) $v.append(h); else $v.html(h);
        } else if (catg == '2') {//food
            var h1="", h2="", h3="", h4="";
            p.forEach(function(c) {
                var m="<div class='fw food-entry bg pd16 mg-tx sh-c' data-type='"+c.food_type+"'>\
                    <div class='fw fx fx-fs'>\
                        <div class='w120 xh120 bg-ac bs-r ov-h'><img src='"+MY_URL+"/img/items/food/"+c.itemID+".jpg' class='fw bs-r'></div>\
                        <div class='fx60 mg-lx'>\
                            <div class='f16 b'>"+c.name+"</div>\
                            <div class='fw fx fx-fe mg-t'>\
                                <div class='fx50'>"
                                    +(c.discount > 0 ? "<div class='tx-lt c-g f10'>&#8358;"+comma(c.price)+"</div>" : "")+
                                    "<div class='f16'>&#8358;"+comma((c.price - c.discount).toFixed(2))+"</div>\
                                </div>"+
                                (user ? 
                                "<div class='fx fx-je c-g'>\
                                    <!--<div class='item-edit f20 mg-rxx icon-edit' data-item-id='"+c.itemID+"'></div>-->\
                                    <div class='item-remove f20 icon-logout' data-item-id='"+c.itemID+"'></div>\
                                </div>":
                                "<div class='fx fx-jc item-order-spinner' data-item-id='"+c.itemID+"'>\
                                    <div class='fx fx-ac fx-jc Orange white b2-r box20 f20 item-subtract'>-</div>\
                                    <div class='fx fx-ac fx-jc w32 item-count t-c' data-item-key='"+c.pk+"' data-item-id='"+c.itemID+"'>0</div>\
                                    <div class='fx fx-ac fx-jc Orange white b2-r box20 f20 item-add'>+</div>\
                                </div>"
                                )+
                            "</div>\
                        </div>\
                    </div>\
                </div>";
                switch(c.food_type){
                    case'1':case 1:h1+=m;break;
                    case'2':case 2:h2+=m;break;
                    case'3':case 3:h3+=m;break;
                    case'4':case 4:h4+=m;break;
                }
            });
            var $v = $('#meal-container');
            if (local) {
                if (h1) $v.find('[data-menu="1"]').append(h1);
                if (h2) $v.find('[data-menu="2"]').append(h2);
                if (h3) $v.find('[data-menu="3"]').append(h3);
                if (h4) $v.find('[data-menu="4"]').append(h4);
                //let's swipe to the meal type container
                var idx = p[0].food_type - 1;
                $('.menu-btn[data-index="'+idx+'"]').click();
            } else {
                $v.find('[data-menu="1"]').html(h1);
                $v.find('[data-menu="2"]').html(h2);
                $v.find('[data-menu="3"]').html(h3);
                $v.find('[data-menu="4"]').html(h4);
            }
        } else if (catg == '3') {//ticket
            p.forEach(function(c) {
                h+="<div class='fw event-entry psr'>\
                        <div class='fw fx fx-ac pd1015 caption white psa t0 l0'>\
                            <div class='fx60'>\
                                <div class='f20 b'>"+c.name+"</div>\
                                <div class='f10'>"+EVENTS[c.event_type]+"</div>\
                                <div class='f10'>"+c.event_date+"</div>\
                            </div>\
                        </div>"+
                        (user ? "<div class='item-delete psa pd5 Grey bs-r mg-t mg-r ba r0 ac' data-item-id='"+c.itemID+"' data-catg='3'>Remove Event</div>":"")+
                        "<img class='fw fx sh-a' src='"+MY_URL+"/img/items/events/"+c.itemID+".jpg'>";
                c.tickets.forEach(function(v) {
                    h+="<div class='fw pd16 mg-bx sh-c'>\
                        <div class='fw fx fx-fs'>\
                            <div class='fx60'>\
                                <div class='f16 b'>"+TICKETS[v.ticket_type]+"</div>\
                                <div class='fw fx fx-fe mg-t'>\
                                    <div class='fx50'>"
                                        +(v.discount > 0 ? "<div class='tx-lt c-g f10'>&#8358;"+comma(v.price)+"</div>" : "")+
                                        "<div class='f16'>&#8358;"+comma((v.price - v.discount).toFixed(2))+"</div>\
                                    </div>"+
                                    (user ? 
                                    "":
                                    "<div class='fx fx-jc item-order-spinner' data-item-id='"+c.itemID+"'>\
                                        <div class='fx fx-ac fx-jc Orange white b2-r box20 f20 item-subtract'>-</div>\
                                        <div class='fx fx-ac fx-jc w32 item-count t-c"
                                            +"' data-item-id='"+c.itemID
                                            +"' data-item-type='"+v.ticket_type
                                            +"'>0</div>\
                                        <div class='fx fx-ac fx-jc Orange white b2-r box20 f20 item-add'>+</div>\
                                    </div>"
                                    )+
                                "</div>\
                            </div>\
                        </div>\
                    </div>";
                });
                h+='</div>';
            });
            var $v = $('#events-container');
            if (local) $v.append(h); else $v.html(h);
        } else if (catg == '4') {//graphics
            p.forEach(function(c) {
                c.name = GRAPHICS[c.graphics_type];
                h+="<div class='fw graphics-entry bg pd16 mg-tx sh-c'>\
                    <div class='fw fx fx-fs'>\
                        <div class='w120 xh120 bg-ac bs-r ov-h'><img src='"+MY_URL+"/img/items/graphics/"+c.itemID+".jpg' class='fw bs-r'></div>\
                        <div class='fx60 mg-lx'>\
                            <div class='f16 b'>"+GRAPHICS[c.graphics_type]+"</div>\
                            <div class='fw fx fx-fe'>\
                                <div class='fx50'>\
                                    <div class='f16'>&#8358;"+comma(parseFloat(c.price).toFixed(2))+"</div>\
                                </div>"+
                                (user ? 
                                "<div class='fx fx-je c-g'>\
                                    <!--<div class='item-edit f20 mg-rxx icon-edit' data-item-id='"+c.itemID+"'></div>-->\
                                    <div class='item-remove f20 icon-logout' data-item-id='"+c.itemID+"'></div>\
                                </div>":
                                "<div class='fx fx-jc item-order-spinner' data-item-id='"+c.itemID+"'>\
                                    <div class='fx fx-ac fx-jc Orange white b2-r box20 f20 item-subtract'>-</div>\
                                    <div class='fx fx-ac fx-jc w32 item-count t-c' data-item-id='"+c.itemID+"'>0</div>\
                                    <div class='fx fx-ac fx-jc Orange white b2-r box20 f20 item-add'>+</div>\
                                </div>"
                                )+
                            "</div>\
                        </div>\
                    </div>\
                </div>";
            });
            var $v = $('#graphics-container');
            if (local) $v.append(h); else $v.html(h);
        } else if (catg == '5') {//make up
            p.forEach(function(c) {
                h+="<div class='fw makeup-entry bg pd16 mg-tx sh-c'>\
                    <div class='fw fx fx-fs'>\
                        <div class='w120 xh120 bg-ac bs-r ov-h'><img src='"+MY_URL+"/img/items/makeup/"+c.itemID+".jpg' class='fw bs-r'></div>\
                        <div class='fx60 mg-lx'>\
                            <div>\
                                <div class='f16 b'>"+MAKEUPS[c.makeup_type]+"</div>\
                                <div class='b5'>"+c.name+"</div>\
                            </div>\
                            <div class='fw fx fx-fe mg-t'>\
                                <div class='fx50'>\
                                    <div class='f16'>&#8358;"+comma(c.price)+"</div>\
                                </div>"+
                                (user ? 
                                "<div class='fx fx-je c-g'>\
                                    <!--<div class='item-edit f20 mg-rxx icon-edit' data-item-id='"+c.itemID+"'></div>-->\
                                    <div class='item-remove f20 icon-logout' data-item-id='"+c.itemID+"'></div>\
                                </div>":
                                "<div class='fx fx-jc item-order-spinner' data-item-id='"+c.itemID+"'>\
                                    <div class='fx fx-ac fx-jc Orange white b2-r box20 f20 item-subtract'>-</div>\
                                    <div class='fx fx-ac fx-jc w32 item-count t-c' data-item-id='"+c.itemID+"'>0</div>\
                                    <div class='fx fx-ac fx-jc Orange white b2-r box20 f20 item-add'>+</div>\
                                </div>"
                                )+
                            "</div>\
                        </div>\
                    </div>\
                </div>";
            });
            var $v = $('#makeup-container');
            if (local) $v.append(h); else $v.html(h);
        } else if (catg == '6') {//laundry
            p.forEach(function(c) {
                c.name = LAUNDRIES[c.itemID];
                h+="<div class='fw laundry-entry bg pd16 mg-tx sh-c'>\
                    <div class='fw fx'>\
                        <div class='fx60 f16 b'>"+LAUNDRIES[c.itemID]+"</div>\
                        <div class='fx fx-fe mg-t'>"+
                            (user ? 
                            "<div class='fx fx-je c-g'>\
                                <div class='item-remove f20 icon-logout' data-item-id='"+c.itemID+"'></div>\
                            </div>":
                            "<div class='fx fx-jc item-order-spinner' data-item-id='"+c.itemID+"'>\
                                <div class='fx fx-ac fx-jc Orange white b2-r box20 f20 item-subtract'>-</div>\
                                <div class='fx fx-ac fx-jc w32 item-count t-c' data-item-id='"+c.itemID+"'>0</div>\
                                <div class='fx fx-ac fx-jc Orange white b2-r box20 f20 item-add'>+</div>\
                            </div>"
                            )+
                        "</div>\
                    </div>\
                    <div class='fw b5 laundry-type' data-item-id='"+c.itemID+"'>"+
                        (c.full_laundry > 0 ? "<div class='radio"+(user ? '' : ' singo selected')+" psr mg-bx' data-name='full_laundry'>&#8358;"+c.full_laundry+" (Full laundry)</div>" : "")+
                        (c.wash_only > 0 ? "<div class='radio"+(user ? '' : ' singo')+" psr mg-bx"+(c.full_laundry == 0 && !user ? ' selected' : '')+"' data-name='wash_only'>&#8358;"+c.wash_only+" (Wash only)</div>" : "")+
                        (c.iron_only > 0 ? "<div class='radio"+(user ? '' : ' singo')+" psr mg-bx"+(c.full_laundry == 0 && c.wash_only == 0 && !user ? 'selected' : '')+"' data-name='iron_only'>&#8358;"+c.iron_only+" (Iron only)</div>" : "")+
                    "</div>\
                </div>";
            });
            var $v = $('#laundry-container');
            if (local) $v.append(h); else $v.html(h);
        } else if (catg == '7') {//gas
            p.forEach(function(c) {
                c.name = GASES[c.itemID];
                h+="<div class='fw gas-entry bg pd16 mg-tx sh-c'>\
                    <div class='fw fx'>\
                        <div class='fx60'>\
                            <div class='f16 b'>"+GASES[c.itemID]+"</div>\
                            <div class='b5'>&#8358;"+comma(c.price)+"</div>\
                        </div>\
                        <div class='fx fx-fe mg-t'>"+
                            (user ? 
                            "<div class='fx fx-je c-g'>\
                                <div class='item-remove f20 icon-logout' data-item-id='"+c.itemID+"'></div>\
                            </div>":
                            "<div class='fx fx-jc item-order-spinner' data-item-id='"+c.itemID+"'>\
                                <div class='fx fx-ac fx-jc Orange white b2-r box20 f20 item-subtract'>-</div>\
                                <div class='fx fx-ac fx-jc w32 item-count t-c' data-item-id='"+c.itemID+"'>0</div>\
                                <div class='fx fx-ac fx-jc Orange white b2-r box20 f20 item-add'>+</div>\
                            </div>"
                            )+
                        "</div>\
                    </div>\
                </div>";
            });
            var $v = $('#gas-container');
            if (local) $v.append(h); else $v.html(h);
        }
    }
    function buildInvoice(invoice, order) {
        var h = '';
        var total = 0;
        invoice.forEach(function(c) {
            var price = (c.pr - c.ds) * c.tt;
            total += price;
            h+="<div class='fw fx pd516'>\
                    <span class='b c-o mg-r'>"+c.tt+"x</span>\
                    <span class='b5 fx60 mg-r'>"+c.nm+"</span>\
                    <span class='b'>&#8358;"+comma(price)+"</span>\
                </div>";
        });
        var delivery = order ? order.delivery_charge : 0;
        ORDER_TOTAL = Math.ceil(total+50+parseInt(delivery));
        h+="<div class='fw pd30'>"+(!order ? "<input type='text' name='voucherCode' class='fw pd16 bg-ac t-c b4-r ba' placeholder='Enter Voucher Code'>" : "")+"</div>\
            <div class='fw fx b5 c-g pd516'><span class='fx60'>Sub Total</span><span class=''>&#8358;"+comma(total)+"</span></div>\
            <div class='fw fx b5 c-g pd516'><span class='fx60'>Service Charge</span><span class=''>&#8358;50</span></div>"+
            (delivery > 0 ? "<div class='fw fx b5 c-g pd516'><span class='fx60'>Delivery Charge</span><span class=''>&#8358;"+delivery+"</span></div>" : "")+
            "<div class='fw fx b pd516'><span class='fx60'>Total</span><span class=''>&#8358;"+comma(ORDER_TOTAL)+"</span></div>";
        if (order) {
            var orderID = order.orderID;
            var info = JSON.parse(order.details);
            var seller = order.sellerID == UUID;
            var delivered = order.delivery_status;
            var admined = order.admin_status;
            var paid = order.payment_status;
            h+="<div class='fw pd16 mg-bx'>\
                    <div class='fw pd10 ba b4-r bg'>\
                        <div class='fw pd10 bg-ac mg-bm t-c b4-r b5 ba'>Customer Info</div>\
                        <div class='fw mg-bm'>"+info.name+"</div>\
                        <div class='fw mg-bm'>"+info.address+"</div>\
                        <div class='fw mg-bm'>"+info.phone+"</div>\
                        <div class='fw mg-bm'>"+(info.friend == 1 ? 'Ordered for friend' : 'Ordered for self')+"</div>\
                        <div class='fw'>"+info.instruction+"</div>\
                    </div>\
                </div>"+
                (
                    (seller && delivered == 0) ?
                        "<div class='fw pd016 fx fx-jc'><div class='Orange white b4-r sh-c b5 pd1015 order-complete-btn' data-order-id='"+orderID+"'>Complete Order</div></div>"
                    : (!seller) ?
                        (paid == 0) ?
                            (admined == 1) ? "<div class='fw pd016 fx fx-jc'><div class='Orange white b4-r sh-c b5 pd1015 order-payment-btn' data-order-id='"+orderID+"'>Make Payment</div></div>"
                            : (admined == 0) ? "<div class='fw pd016 fx fx-jc'><div class='ba b4-r b5 pd1015'>Awaiting Approval</div></div>"
                            : ""
                        : (paid == 1 && delivered == 0) ? "<div class='fw pd016 fx fx-jc'><div class='ba b4-r b5 pd1015'>Awaiting Delivery</div></div>"
                        : ""
                    : ""
                );
            CURRENT_ORDER_ID = orderID;
        }
        return h;
    }
    function fetchMyOrders($wrapper, type) {
        $('body').spin();
        $.ajax({
            url: MY_URL + "/fetch.php",
            data: {
                action: 'fetchOrders',
                userID: UUID,
                type: USERTYPE
            },
            timeout: 30000,
            dataType: 'json',
            method: "GET",
            success: function(p) {
                if (p.length == 0) return;
                MY_ORDERS = p;
                $wrapper.html(buildOrders(p, type));
            },
            complete: function() {$('body').unspin();}
        });
    }
    function buildOrders(orders, type) {
        var h = '';
        orders.forEach(function(c) {
            if (type == 'pending' && c.delivery_status != '0') return;
            if (type == 'completed' && c.delivery_status != '1') return;
            h += "<div class='order-entry fw ba b4-r ov-h bg mg-b16 sh-a' data-order-id='"+c.orderID+"'>\
                <div class='fw fx fx-fs bb'>\
                    <div class='fx60 fx-js pd10'>\
                        <div class='b'>#"+c.orderID+"</div>\
                        <div class='f10'>"+checkTime(c.time_*1000)+"</div>\
                    </div>\
                    <div class='order-status pd5 white' data-order-id='"+c.orderID+"' data-status='"+c.delivery_status+"'>"+(c.delivery_status=='0'?'Pending':'Completed')+"</div>\
                </div>\
                <div class='fw fx fx-je pd10 order-details-btn' data-order-id='"+c.orderID+"'><span class='b5'>View Details</span> <div class='box20 ba1 b-rd fx fx-jc mg-l icon-eye'></div></div>\
            </div>";
        });
        return h;
    }
    function sendPaymentInfo(stage) {
        $('body').spin();
        $.ajax({
            url: MY_URL + "/pay.php",
            data: {
                action: 'initiatePayment',
                payLoad: JSON.stringify(PAYLOAD)
            },
            timeout: 30000,
            dataType: 'json',
            method: "POST",
            success: function(p) {
                if (p.status == 'failure') return toast('Temporary server error. Please try again.');
                if (stage == 1) checkPaymentInitiationResponse(p);
                else if (stage == 2) checkPINSuccess(p);
            },
            complete: function() {$('body').unspin();}
        });
    }
    function validatePayment(otp) {
        $('body').spin();
        $.ajax({
            url: MY_URL + "/pay.php",
            data: {
                action: 'validatePayment',
                otp: otp,
                ref: TRN_REF,
                buyerID: UUID,
                orderID: CURRENT_ORDER_ID
            },
            timeout: 30000,
            dataType: 'json',
            method: "POST",
            success: function(p) {
                if (p.status == 'failure') return toast('Temporary server error. Please try again.');
                updateOrderPaymentStatus(p);
            },
            complete: function() {$('body').unspin();}
        });
    }
    function checkPaymentInitiationResponse(body) {
        if(body.status == "success" && body.data.suggested_auth == "NOAUTH_INTERNATIONAL") {
            toast('International Card not accepted');
        } else if (body.status == "success" && body.data.suggested_auth == "PIN") {
            App.changeViewTo('#PINView');
        }else if (body.status == "success" && body.data.suggested_auth == "GTB_OTP") {
            checkPINSuccess(body);
        }else if(body.status == "success" && body.data.authurl != 'N/A') {
            toast('Please try another Card');//iframe
        }else {
            toast('Error');// an error has probably occurred.
        }
    }
    function checkPINSuccess(body) {
        if (body.data.amount < ORDER_TOTAL) return toast('Invalid amount.');
        if (body.status == 'success' && body.data.chargeResponseCode == '02') {
            TRN_REF = body.data.flwRef;
            $('#token-instruction').text(body.data.chargeResponseMessage);
            App.changeViewTo('#OTPView');
            $('#card-token-input').focus();
        }
    }
    function updateOrderPaymentStatus(body) {
        // console.log(body.data.data.responsecode);
        if (body.state == 1) {
            toast('Your payment was successful');
            $('.order-payment-btn[data-order-id="'+CURRENT_ORDER_ID+'"]').replaceWith("<div class='fw pd016 fx fx-jc'><div class='ba b4-r b5 pd1015'>Awaiting Delivery</div></div>");
            var order = MY_ORDERS.find(function(e) {return e.orderID == CURRENT_ORDER_ID;});
            order.payment_status = 1;
            //
            let cv=Views.indexOf('#orderDetailsView');
            if(cv>-1)Views.splice(cv);//to avoid redundant cycling
            App.changeViewTo('#orderDetailsView');
        } else {
            toast('Payment revalidation is required.');
        }
    }
    function buildReviews(p) {
        var h = '';
        p.forEach(function(c) {
            h += "<div class='fw bs-r sh-c mg-b16 bg pd20'>\
                <div class='fw mg-bm b5 c-o'>"+c.reviewerName+"</div>\
                <div class='fw mg-bm'>"+c.message+"</div>\
                <div class='fw fx fx-je'><div class='f10'>"+checkTime(c.time_*1000)+"</div></div>\
            </div>";
        });
        return h;
    }
    function localizeUserDetails(p, action) {
        SQL.transaction(function(i) {
            i.executeSql(
                "INSERT INTO on_user(id,uuid,email,username,campus_key,user_type,fullname,address,category,phone,channel) VALUES(?,?,?,?,?,?,?,?,?,?,?)",
                [1, p.ui, p.em, p.un, p.sk, p.ut, p.fn, p.ad, p.cg, p.ph, p.ch]
            );
        }, function(e){console.log(e.code);console.log(e.message);}, function() {
              UUID = p.ui
            , EMAIL = p.em
            , USERNAME = p.un
            , FULLNAME = p.fn
            , PHONE = p.ph
            , CAMPUSKEY = p.sk
            , USERTYPE = p.ut
            , ADDRESS = p.ad
            , CATEGORY = p.cg
            ;
            if (action == 'signup' || p.ch == 0) showChannelScreen();//sign in? if ch == 0, means no activities yet
            else {//has passed ch check, possibly has some activities
                preparePage(true);//existing
                loadUserPicture();
            }
        });
    }
    function updateStoreInformation(shopId, shopName, shopAddress, catg) {
        var img = new Image();
        img.onload = function() {
            $('#shop-banner').css('backgroundImage', 'url('+img.src+')');
        }
        img.src = MY_URL+'/img/users/'+shopId+'.jpg?id=1';
        
        $('#display-name').text(shopName);
        $('#user-address').text(shopAddress);
        $('.items-container[data-catg="'+catg+'"]').show();
    }
    function showAllOrderEntries() {
        var ct = document.querySelector('#search-input').dataset.container;
        var items = document.querySelectorAll(ct + ' .order-entry');
        items.forEach(function(el){
            el.style.display = '';
        });
    }
    function buildConfirm(id, message, key) {
        h="<div class='pd16 st-p t-c b'>"+message+"</div>\
            <div class='fx bt modalClose'>\
                <div id='"+id+"' class='pd16z t-c fx50 b-rg b ac' data-key='"+key+"'>YES</div>\
                <div class='pd16z t-c fx50 b ac'>CANCEL</div>\
            </div>";
        $MM.show();
        $MF.html(h).zoom();
    }
    function checkTime(val){
        if(!val)return'';
        var date=new Date(val)
          , year=date.getFullYear()
          , month=MT[date.getMonth()]
          , day=date.getDate()
          , hour=date.getHours()
          , minute=date.getMinutes()
          , M = 'AM'
          ;
        if(hour>12){
            hour=hour-12;
            M='PM';
        }
        if(day<10)day='0'+day;
        // if(hour<10)hour='0'+hour;
        if(minute<10)minute='0'+minute;
        const now=new Date();
        let formatted;
        if(year<now.getFullYear())formatted=day+' '+month+' '+year+' '+hour+':'+minute+M;/*happened at previous year, this is new year*/
        else if (date.getMonth()==now.getMonth()){/*same year, same month (cannot happen in the future)*/
            var today = now.getDate();
            if (day==today)formatted='Today, '+hour+':'+minute+M;/*same day*/
            else if (Number(day) + 1 == today) formatted='Yesterday, '+hour+':'+minute+M;
            else formatted=DY[date.getDay()]+', '+hour+':'+minute+M;
        }
        else formatted=day+' '+month+' '+hour+':'+minute+M;/*not new year...different day or month*/
        return formatted;
    }

    var TST = null;
    var $tst = $('#toast-container');
    function toast(message) {
        clearTimeout(TST);
        $tst.stop()
            .html('<div class="b bg-mod pd1015 bs-r t-c f14 white" style="background-color:rgba(0, 0, 0, 0.8);">' + message + '</div>')
            .css('opacity', 1).removeClass('hd');
        
        TST = setTimeout(function() {
            $tst.animate({opacity: 0}, 1000, function(){
                $tst.addClass('hd');
            });
        }, 3000);
    }

});