/*
 */
 //\
 //||
 /*
 * TODO
 * group items by a particular seller in a single order
 *
 * SERVER
 * use number in stock for products
 * increase upload limit on server
 * check for existing review on server and update if found
 *
 *
 * UPDATE
 * catalog infinite scroll
 * items edit
 * withdrawals history
 * gallery items delete and add-more
 *
 */
 $(document).ready(function() {

    document.addEventListener('deviceready', onDeviceReady, false);
    window.addEventListener('resize', handleResize, false);

    var VERSION = '1.0.0'
    //
    // , MY_URL = "http://localhost/api/v1"
    // 
    // , MY_URL = "http://192.168.43.75/api/v1"
    //
    // , MY_URL = "http://172.20.10.4/api/v1"
    //
    , MY_URL = "https://www.oncampus.ng/api/v1"
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

    , $SM = $('#searchModal')
    , $SH = $('#searchHeader')



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

    , MY_BALANCE = 0
    , MIN_WITHDRAWAL = 0


    , mDrawer = document.querySelector('#side-nav-menu-view')
    , mModal = document.querySelector('#side-nav-modal')
    , mNav = document.querySelector('#side-nav')



    , CURRENT_ORDER = {}
    , ORDER_TYPE = '0'
    , ORDER_INFO = null
    , ORDER_TOTAL = 0
    , ORDER_ID = null//for payment
    , PAYLOAD = null
    , TRN_REF = null

    , SELECTED_PRODUCTS = []

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
    , COLORS = [
        {dex: '137', hex: '#FFFFFF', name: 'White'},
        {dex: '8', hex: '#000000', name: 'Black'},
        {dex: '114', hex: '#FF0000', name: 'Red'},
        {dex: '100', hex: '#FFA500', name: 'Orange'},
        {dex: '139', hex: '#FFFF00', name: 'Yellow'},
        {dex: '52', hex: '#008000', name: 'Green'},
        {dex: '10', hex: '#0000FF', name: 'Blue'},
        {dex: '57', hex: '#4B0082', name: 'Indigo'},
        {dex: '135', hex: '#EE82EE', name: 'Violet'},
        {dex: '49', hex: '#FFD700', name: 'Gold'},
        {dex: '51', hex: '#808080', name: 'Gray'},
        {dex: '110', hex: '#FFC0CB', name: 'Pink'},
        {dex: '113', hex: '#800080', name: 'Purple'},
        {dex: '96', hex: '#000080', name: 'Navy'},
        {dex: '123', hex: '#C0C0C0', name: 'Silver'},
        {dex: '1', hex: '#F0F8FF', name: 'Alice Blue'},
        {dex: '2', hex: '#FAEBD7', name: 'Antique White'},
        {dex: '3', hex: '#00FFFF', name: 'Aqua'},
        {dex: '4', hex: '#7FFFD4', name: 'Aquamarine'},
        {dex: '5', hex: '#F0FFFF', name: 'Azure'},
        {dex: '6', hex: '#F5F5DC', name: 'Beige'},
        {dex: '7', hex: '#FFE4C4', name: 'Bisque'},
        {dex: '9', hex: '#FFEBCD', name: 'Blanched Almond'},
        {dex: '11', hex: '#8A2BE2', name: 'Blue Violet'},
        {dex: '12', hex: '#A52A2A', name: 'Brown'},
        {dex: '13', hex: '#DEB887', name: 'Burly Wood'},
        {dex: '14', hex: '#5F9EA0', name: 'Cadet Blue'},
        {dex: '15', hex: '#7FFF00', name: 'Chartreuse'},
        {dex: '16', hex: '#D2691E', name: 'Chocolate'},
        {dex: '17', hex: '#FF7F50', name: 'Coral'},
        {dex: '18', hex: '#6495ED', name: 'Cornflower Blue'},
        {dex: '19', hex: '#FFF8DC', name: 'Cornsilk'},
        {dex: '20', hex: '#DC143C', name: 'Crimson'},
        {dex: '21', hex: '#00FFFF', name: 'Cyan'},
        {dex: '22', hex: '#00008B', name: 'Dark Blue'},
        {dex: '23', hex: '#008B8B', name: 'Dark Cyan'},
        {dex: '24', hex: '#B8860B', name: 'Dark Goldenrod'},
        {dex: '25', hex: '#A9A9A9', name: 'Dark Gray'},
        {dex: '26', hex: '#006400', name: 'Dark Green'},
        {dex: '27', hex: '#BDB76B', name: 'Dark Khaki'},
        {dex: '28', hex: '#8B008B', name: 'Dark Magenta'},
        {dex: '29', hex: '#556B2F', name: 'Dark Olive Green'},
        {dex: '30', hex: '#FF8C00', name: 'Dark Orange'},
        {dex: '31', hex: '#9932CC', name: 'Dark Orchid'},
        {dex: '32', hex: '#8B0000', name: 'Dark Red'},
        {dex: '33', hex: '#E9967A', name: 'Dark Salmon'},
        {dex: '34', hex: '#8FBC8F', name: 'Dark Sea Green'},
        {dex: '35', hex: '#483D8B', name: 'Dark Slate Blue'},
        {dex: '36', hex: '#2F4F4F', name: 'Dark Slate Gray'},
        {dex: '37', hex: '#00CED1', name: 'Dark Turquoise'},
        {dex: '38', hex: '#9400D3', name: 'Dark Violet'},
        {dex: '39', hex: '#FF1493', name: 'Deep Pink'},
        {dex: '40', hex: '#00BFFF', name: 'Deep Sky Blue'},
        {dex: '41', hex: '#696969', name: 'Dim Gray'},
        {dex: '42', hex: '#1E90FF', name: 'Dodger Blue'},
        {dex: '43', hex: '#B22222', name: 'Fire Brick'},
        {dex: '44', hex: '#FFFAF0', name: 'Floral White'},
        {dex: '45', hex: '#228B22', name: 'Forest Green'},
        {dex: '46', hex: '#FF00FF', name: 'Fuchsia'},
        {dex: '47', hex: '#DCDCDC', name: 'Gainsboro'},
        {dex: '48', hex: '#F8F8FF', name: 'Ghost White'},
        {dex: '50', hex: '#DAA520', name: 'Goldenrod'},
        {dex: '53', hex: '#ADFF2F', name: 'Green Yellow'},
        {dex: '54', hex: '#F0FFF0', name: 'Honey Dew'},
        {dex: '55', hex: '#FF69B4', name: 'Hot Pink'},
        {dex: '56', hex: '#CD5C5C', name: 'Indian Red'},
        {dex: '58', hex: '#FFFFF0', name: 'Ivory'},
        {dex: '59', hex: '#F0E68C', name: 'Khaki'},
        {dex: '60', hex: '#E6E6FA', name: 'Lavender'},
        {dex: '61', hex: '#FFF0F5', name: 'Lavender Blush'},
        {dex: '62', hex: '#7CFC00', name: 'Lawn Green'},
        {dex: '63', hex: '#FFFACD', name: 'Lemon Chiffon'},
        {dex: '64', hex: '#ADD8E6', name: 'Light Blue'},
        {dex: '65', hex: '#F08080', name: 'Light Coral'},
        {dex: '66', hex: '#E0FFFF', name: 'Light Cyan'},
        {dex: '67', hex: '#FAFAD2', name: 'Light Goldenrod Yellow'},
        {dex: '68', hex: '#90EE90', name: 'Light Green'},
        {dex: '69', hex: '#D3D3D3', name: 'Light Grey'},
        {dex: '70', hex: '#FFB6C1', name: 'Light Pink'},
        {dex: '71', hex: '#FFA07A', name: 'Light Salmon'},
        {dex: '72', hex: '#20B2AA', name: 'Light Sea Green'},
        {dex: '73', hex: '#87CEFA', name: 'Light Sky Blue'},
        {dex: '74', hex: '#778899', name: 'Light Slate Gray'},
        {dex: '75', hex: '#B0C4DE', name: 'Light Steel Blue'},
        {dex: '76', hex: '#FFFFE0', name: 'Light Yellow'},
        {dex: '77', hex: '#00FF00', name: 'Lime'},
        {dex: '78', hex: '#32CD32', name: 'LimeGreen'},
        {dex: '79', hex: '#FAF0E6', name: 'Linen'},
        {dex: '80', hex: '#FF00FF', name: 'Magenta'},
        {dex: '81', hex: '#800000', name: 'Maroon'},
        {dex: '82', hex: '#66CDAA', name: 'Medium Aquamarine'},
        {dex: '83', hex: '#0000CD', name: 'Medium Blue'},
        {dex: '84', hex: '#BA55D3', name: 'Medium Orchid'},
        {dex: '85', hex: '#9370DB', name: 'Medium Purple'},
        {dex: '86', hex: '#3CB371', name: 'Medium Sea Green'},
        {dex: '87', hex: '#7B68EE', name: 'Medium Slate Blue'},
        {dex: '88', hex: '#00FA9A', name: 'Medium Spring Green'},
        {dex: '89', hex: '#48D1CC', name: 'Medium Turquoise'},
        {dex: '90', hex: '#C71585', name: 'Medium Violet Red'},
        {dex: '91', hex: '#191970', name: 'Midnight Blue'},
        {dex: '92', hex: '#F5FFFA', name: 'Mint Cream'},
        {dex: '93', hex: '#FFE4E1', name: 'Misty Rose'},
        {dex: '94', hex: '#FFE4B5', name: 'Moccasin'},
        {dex: '95', hex: '#FFDEAD', name: 'Navajo White'},
        {dex: '97', hex: '#FDF5E6', name: 'Old Lace'},
        {dex: '98', hex: '#808000', name: 'Olive'},
        {dex: '99', hex: '#6B8E23', name: 'Olive Drab'},
        {dex: '101', hex: '#FF4500', name: 'Orange Red'},
        {dex: '102', hex: '#DA70D6', name: 'Orchid'},
        {dex: '103', hex: '#EEE8AA', name: 'Pale Goldenrod'},
        {dex: '104', hex: '#98FB98', name: 'Pale Green'},
        {dex: '105', hex: '#AFEEEE', name: 'Pale Turquoise'},
        {dex: '106', hex: '#DB7093', name: 'Pale Violet Red'},
        {dex: '107', hex: '#FFEFD5', name: 'Papaya Whip'},
        {dex: '108', hex: '#FFDAB9', name: 'Peach Puff'},
        {dex: '109', hex: '#CD853F', name: 'Peru'},
        {dex: '111', hex: '#DDA0DD', name: 'Plum'},
        {dex: '112', hex: '#B0E0E6', name: 'Powder Blue'},
        {dex: '115', hex: '#BC8F8F', name: 'Rosy Brown'},
        {dex: '116', hex: '#4169E1', name: 'Royal Blue'},
        {dex: '117', hex: '#8B4513', name: 'Saddle Brown'},
        {dex: '118', hex: '#FA8072', name: 'Salmon'},
        {dex: '119', hex: '#F4A460', name: 'Sandy Brown'},
        {dex: '120', hex: '#2E8B57', name: 'Sea Green'},
        {dex: '121', hex: '#FFF5EE', name: 'Seashell'},
        {dex: '122', hex: '#A0522D', name: 'Sienna'},
        {dex: '124', hex: '#87CEEB', name: 'Sky Blue'},
        {dex: '125', hex: '#6A5ACD', name: 'Slate Blue'},
        {dex: '126', hex: '#708090', name: 'Slate Gray'},
        {dex: '127', hex: '#FFFAFA', name: 'Snow'},
        {dex: '128', hex: '#00FF7F', name: 'Spring Green'},
        {dex: '129', hex: '#4682B4', name: 'Steel Blue'},
        {dex: '130', hex: '#D2B48C', name: 'Tan'},
        {dex: '131', hex: '#008080', name: 'Teal'},
        {dex: '132', hex: '#D8BFD8', name: 'Thistle'},
        {dex: '133', hex: '#FF6347', name: 'Tomato'},
        {dex: '134', hex: '#40E0D0', name: 'Turquoise'},
        {dex: '136', hex: '#F5DEB3', name: 'Wheat'},
        {dex: '138', hex: '#F5F5F5', name: 'White Smoke'},
        {dex: '140', hex: '#9ACD32', name: 'Yellow Green'}
    ]

    , SIZEPICKER = null
    , SIZES = [
        {dex: '1', val: 'Small'},
        {dex: '2', val: 'Medium'},
        {dex: '3', val: 'Big'},
        {dex: '4', val: 'Large'},
        {dex: '5', val: 'XL'},
        {dex: '6', val: 'XXL'},
        {dex: '7', val: 'XXXL'},
        {dex: '8', val: '30'},
        {dex: '9', val: '31'},
        {dex: '10', val: '32'},
        {dex: '11', val: '33'},
        {dex: '12', val: '34'},
        {dex: '13', val: '35'},
        {dex: '14', val: '36'},
        {dex: '15', val: '37'},
        {dex: '16', val: '38'},
        {dex: '17', val: '39'},
        {dex: '18', val: '40'},
        {dex: '19', val: '41'},
        {dex: '20', val: '42'},
        {dex: '21', val: '43'},
        {dex: '22', val: '44'},
        {dex: '23', val: '45'},
        {dex: '24', val: '46'},
        {dex: '25', val: '47'},
        {dex: '26', val: '48'},
        {dex: '27', val: '49'},
        {dex: '28', val: '50'}
    ]

    , ITEMS_DATA = []
    , PRODUCTS = []

    , MY_MAILS = []


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
        document.addEventListener('backbutton', onBackButton, false);
        document.addEventListener('online', onOnline, false);//[[***]]
        document.addEventListener('resume', onResume, false);//[[***]]
        StatusBar.backgroundColorByHexString('#FE5215');
    }
    
    function onBackButton() {
        if ($MM.is(':visible')) return $MM.hide();
        if ($SM.is(':visible')) {
            $SH.hide();
            $SM.hide();
            showAllOrderEntries();
            return;
        }
        if ($('#side-nav-modal').is(':visible')) return navEnd.call(mNav);
        var activeView = document.querySelector('.active-view').id;
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
    function onOnline() {
        preparePage(true);
    }
    function onResume() {
        preparePage(true);
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
        /*scrollToPosition: function(value, callback) {
            var h = this.prop('scrollHeight');
            this.animate({ scrollTop: h - value }, 500, callback);
            return this;
        },*/
        zoom: function(level) {
            var el = this;
            el.addClass('zoom');
            setTimeout(function(){ el.removeClass('zoom'); }, 300);
            return el;
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
                        else {
                            App.changeViewTo('#home');
                            preparePage(true);
                        }
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
                checkWallet('landing');
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
    }).on('click', '.color-picker', function() {
        COLORPICKER = this;
        var colors = [];
        var dexs = this.dataset.availableColors;
        if (dexs == 0) colors = COLORS;
        else {
            dexs.split(',').forEach(function(d) {
                colors.push(COLORS.find(function(c) {return c.dex == d;}));
            });
        }
        var h = "<div id='color-palette' class='pd010 b5 st-p'>\
            <div id='select-color' class='fx fx-ac pd16 bb b' data-index='0'>\
                <div class='fx60'>Select Color(s)</div>\
                <div id='color-palette-submit' class='modalClose c-o b'>Done</div>\
            </div>";
        colors.forEach(function(c) {
            h += "<div class='radio multipo psr fx fx-ac pd10 bb' data-index='"+c.dex+"' data-hex='"+c.hex+"'>\
                <div class='fx60'>"+c.name+"</div>\
                <div class='box32 i-b ba b-rd' style='background:"+c.hex+";'></div>\
            </div>";
        });
        h += "</div>";
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
        var $es = $('#color-palette .radio.selected').last();
        if (!$es[0]) $es = $('#select-color');
        $el.insertAfter($es);
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
    }).on('click', '.size-picker', function() {
        SIZEPICKER = this;
        var sizes = [];
        var dexs = this.dataset.availableSizes;
        if (dexs == 0) sizes = SIZES;
        else {
            dexs.split(',').forEach(function(d) {
                sizes.push(SIZES.find(function(c) {return c.dex == d;}));
            });
        }
        var h = "<div id='size-palette' class='pd010 b5 st-p'>\
            <div id='select-size' class='fx fx-ac pd16 bb b' data-index='0'>\
                <div class='fx60'>Select Size(s)</div>\
                <div id='size-palette-submit' class='modalClose c-o b'>Done</div>\
            </div>";
        sizes.forEach(function(c) {
            h += "<div class='radio multipo psr fx fx-ac pd10 bb' data-index='"+c.dex+"' data-value='"+c.val+"'>"+c.val+"</div>";
        });
        h += "</div>";
        $MM.show();
        $MF.html(h).zoom();

        var selectedOptions = [];
        var so = this.dataset.selectedOptions;
        if (so) {
            selectedOptions = so.split(',');
            var $r = $('#size-palette').find('.radio');
            $.each($r, function() {
                if (selectedOptions.indexOf(this.dataset.index) > -1) {
                    var $es = $('#size-palette .radio.selected').last();
                    if (!$es[0]) $es = $('#select-size');
                    $(this).addClass('selected').insertAfter($es);
                }
            });
        }
    }).on('click', '#size-palette .radio', function() {
        var $el = $(this).detach();
        var $es = $('#size-palette .radio.selected').last();
        if (!$es[0]) $es = $('#select-size');
        $el.insertAfter($es);
    }).on('click', '#size-palette-submit', function() {
        var o = $('#size-palette').find('.radio.selected'), s = '', h = '';
        if (o.length) {
            var os = [];
            $.each(o, function() {
                os.push(this.dataset.index);
                h+="<div class='pd5 mg-rm i-b ba b4-r'>"+this.dataset.value+"</div>";
            });
            s = os.join(',');
        }
        SIZEPICKER.dataset.selectedOptions = s;
        SIZEPICKER.innerHTML = h;
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
        window.open(BASE_URL + '/legal/terms.html', '_system');
    }).on('click', '.forgot-password', function() {
        App.changeViewTo('#retrievalView');
    }).on('click', '.signup-option', function() {
        var ix = this.dataset.index;
        $('form[data-index="'+ix+'"]').show().siblings('form').hide();
    }).on('change', '.images', function(e) {
        var that = this;
        if (this.files && this.files[0]) {
            var reader = new FileReader();
            reader.onloadend = function(e) {
                that.previousElementSibling.src = this.result;
            }
            reader.readAsDataURL(this.files[0]);
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
                            document.querySelector('#signup-form-code input[name="email"]').value = Email;
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
                var Email = el.querySelector('input[name="email"]').value.toLowerCase();
                var Code = el.querySelector('input[name="token"]').value;
                if (!Code) return;
                el.dataset.disabled = 'true';
                $('body').spin();
                $.ajax({
                    url: MY_URL + "/send.php",
                    data: {
                        action: 'codeVerification',
                        code: Code,
                        email: Email
                    },
                    method: "POST",
                    timeout: 30000,
                    dataType: 'json',
                    success: function(p) {
                        if (p.state == 'success') {//verified successfully
                            Store.setItem('userEmail', Email);
                            toast('Your email address has been verified');
                            App.changeViewTo('#signupView');//[[allow usertype choice first]]
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
            case 'retrieve-form-email':
                var Email = el.querySelector('input[name="email"]').value.toLowerCase();
                if (!Email) return toast('Please type your email');
                el.dataset.disabled = 'true';
                $('body').spin();
                $.ajax({
                    url: MY_URL + "/send.php",
                    data: {
                        action: 'retrieveKey',
                        email: Email
                    },
                    method: "POST",
                    timeout: 30000,
                    dataType: 'json',
                    success: function(p) {
                        if (p.state == 'success') {
                            document.querySelector('#retrieve-form-code input[name="email"]').value = Email;
                            toast("We've sent you a reset key");
                            App.changeViewTo('#resetTokenPrompt');
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
            case 'retrieve-form-code':
                var Email = el.querySelector('input[name="email"]').value.toLowerCase();
                var Password = el.querySelector('input[name="password"]').value;
                var Key = el.querySelector('input[name="token"]').value;
                if (!Key) return;
                el.dataset.disabled = 'true';
                $('body').spin();
                $.ajax({
                    url: MY_URL + "/send.php",
                    data: {
                        action: 'passwordRetrieve',
                        password: Password,
                        key: Key,
                        email: Email
                    },
                    method: "POST",
                    timeout: 30000,
                    dataType: 'json',
                    success: function(p) {
                        if (p.state == 'success') {//changed successfully
                            toast('Your password has been updated');
                            App.changeViewTo('#loginView');
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
                if (!UsernameRegexp.test(Username) && !error) error = "<div class='b bb pd10'>Display name error</div><div class='pd10'>Username must be 4 or more characters long and may contain letters, underscore and numbers but cannot start with a number. Special characters, full-stop and spaces are not allowed</div>";
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
                        category: '0',
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
            case 'advert-channel-form':
                var channelIndex = el.querySelector('select[name="channel"]').value;
                if (!channelIndex) return toast('Please select one channel');
                $.ajax({
                    url: MY_URL + "/send.php",
                    data: {
                        action: 'adsChannel',
                        me: UUID,
                        channel: channelIndex
                    },
                    timeout: 30000,
                    dataType: 'json',
                    method: "POST",
                    success: function(p) {
                        if (p == 1) {
                            toast('Thanks for your feedback');
                            App.changeViewTo('#home');
                            preparePage(false);
                            SQL.transaction(function(i) {
                                i.executeSql("UPDATE on_user SET channel=? WHERE id=?", [channelIndex, 1]);
                            });
                        } else if (p == 0) {
                            toast('Network error. Try again');
                        }
                    },
                    complete: function(x) {
                        if (x.status == 0) {
                            toast('Network error. Try again');
                            $('body').unspin();
                        }
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
                    if (!UsernameRegexp.test(Username) && !error) error = "<div class='b bb pd10'>Username not available</div><div class='pd10'>Username must be 4 or more characters long and may contain letters, underscore and numbers but cannot start with a number. Special characters, full-stop and spaces are not allowed</div>";
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
                $.ajax({
                    url: MY_URL + "/send.php",
                    data: {
                        action: 'profileUpdate',
                        userkey: UUID,
                        usertype: USERTYPE,
                        fullname: Fullname,
                        username: Username,
                        birthday: Birthday,
                        address: Address,
                        phone: Phone
                    },
                    dataType: 'json',
                    method: "POST",
                    timeout: 30000,
                    success: function(p) {
                        // console.log(p);
                        if (p.state == 'success') {
                            toast('Profile updated successfully.');
                            SQL.transaction(function(i) {
                                i.executeSql("UPDATE on_user SET username=?, fullname=?, birthday=?, address=?, phone=? WHERE id=?", [Username, Fullname, Birthday, Address, Phone, 1]);
                            }, function(){}, function() {
                                  FULLNAME = Fullname
                                , USERNAME = Username
                                , BIRTHDAY = Birthday
                                , ADDRESS = Address
                                , PHONE = Phone
                                ;
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
                break;
            case 'cash-withdrawal-form':
                var AccountName = el.querySelector('input[name="account_name"]').value
                  , Nuban = el.querySelector('input[name="nuban"]').value
                  , Amount = parseInt(el.querySelector('input[name="amount"]').value)
                  , BankName = el.querySelector('select[name="bank_id"]').options[el.querySelector('select[name="bank_id"]').selectedIndex].innerText
                  ;
                if (!AccountName || !Nuban || !Amount || !el.querySelector('select[name="bank_id"]').value) return toast('All fields are required');
                if (Amount > MY_BALANCE) return toast('Withdrawal amount is higher than your balance');
                el.dataset.disabled = 'true';
                $('body').spin();
                $.ajax({
                    url: MY_URL + "/send.php",
                    data: {
                        action: 'withdrawCash',
                        ownerID: UUID,
                        amount: Amount,
                        nuban: Nuban,
                        account_name: AccountName,
                        bank_name: BankName,
                        institute: CAMPUSKEY
                    },
                    dataType: 'json',
                    timeout: 30000,
                    method: "POST",
                    success: function(p) {
                        if (p.state == 1) {
                            App.closeCurrentView();
                            checkWallet('landing');
                            toast('Your withdrawal request has been submitted successfully');
                        } else {
                            toast('There was an error. Please try again later.');
                        }
                    },
                    complete: function() {
                        el.dataset.disabled = 'false';
                        $('body').unspin();
                    }
                });
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
        To make the process really easy for sellers we provided 3 different options as described below.
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
        var limit = this.dataset.limit;
        var className = this.dataset.className;
        if ($(this).siblings('.'+className).length == limit) return toast("You can only add up to "+limit+" photos");
        var h = `<div class="${className} xtra-img mg-t main-wrapper fx40 h200 mg-l bg b4-r fx fx-ac fx-jc ov-h ba bg-im-ct psr" style="display:none;">
            <img src="res/img/icon/upload.png">
            <img class="fw psa im-sh" src="">
            <input type="file" accept="image/*" name="images" class="images fw fh psa t0 l0 op0">
            <div class="wrapper-closer box32 f20 psa fx fx-ac Pink c-g b5 b bm-r mg-r mg-t t0 r0 fx-jc z4">&times;</div>
        </div>`;
        $(this).before(h);
        $('.'+className).last().slideDown();
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
                  // , ProductSize = el.querySelector('select[name="product_size"]').value
                  , AvailableSizes = el.querySelector('.size-picker').dataset.selectedOptions
                  , AvailableColors = el.querySelector('.color-picker').dataset.selectedOptions
                  , ProductDelivery = el.querySelector('select[name="product_delivery"]').value
                  , Price = parseInt(el.querySelector('input[name="price"]').value, 10) || 0
                  , Discount = parseInt(el.querySelector('input[name="discount"]').value, 10) || 0
                  , PiecesAvailable = parseInt(el.querySelector('input[name="pieces_available"]').value, 10) || 0
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
                fd.append('availableSizes', AvailableSizes);
                fd.append('availableColors', AvailableColors);
                fd.append('productDelivery', ProductDelivery);
                fd.append('price', Price);
                fd.append('discount', Discount);
                fd.append('piecesAvailable', PiecesAvailable);
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
                            description: Description,
                            delivery: ProductDelivery
                        }
                        buildItems([p], CATEGORY, true);
                        exitItemAddView();
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
                            food_type: Number(FoodType),
                            name: Name,
                            price: Price,
                            discount: Discount
                        }
                        buildItems([p], CATEGORY, true);
                        exitItemAddView();
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
                    var ticket = {ticket_type: TicketCatg, price: Price, discount: Discount, seats: Seats, sales: 0};
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
                fd.append('event_type', EventType);//pool,hangout,club...
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
                            itemID: d.success,
                            ownerID: UUID,
                            name: Name,
                            event_type: EventType,
                            event_date: EventDate,
                            venue: Venue,
                            tickets: AllTickets
                        }
                        buildItems([p], CATEGORY, true);
                        exitItemAddView();
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
                        exitItemAddView();
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
                        exitItemAddView();
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
                        exitItemAddView();
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
                        exitItemAddView();
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
    }).on('submit', '#gallery-add-form', function(e) {
        e.preventDefault();
        if (this.dataset.disabled == 'true') return;
        var el = this;
        var Images = el.querySelectorAll('input[name="images"]');
        var fd = new FormData();
        fd.append('action', 'addGalleryItems');
        fd.append('ownerID', UUID);
        var TotalImages = 0;
        Images.forEach(function(el) {
            if (el.files && el.files[0]) {
                fd.append('image[]', el.files[0]);
                TotalImages++;
            }
        });
        if (TotalImages === 0) return;
        fd.append('totalImages', TotalImages);
        $('body').spin();
        el.dataset.disabled = 'true';
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
                if (d.state && d.state == 1) {
                    buildGalleryItems(d.links);
                    App.closeCurrentView();
                } else toast('There was an error');
            },
            error: function() { toast('Unable to connect'); },
            complete: function() {
                el.dataset.disabled = 'false';
                $('body').unspin();
            }
        });
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
    }).on('click', '.info_box', function() {
        $(this).fadeOut($(this).remove());
    }).on('click', '.Modal', function() {
        $(this).hide();
        if (this.id == 'searchModal') {
            $SH.hide();
            showAllOrderEntries();
        }
    }).on('click', '.modalClose', function() {
        $MM.hide();
    }).on('touchmove', '.Modal', function(e) {
        if (e.cancelable) e.preventDefault();
        e.stopPropagation();
    }).on('click', '#menu-button', function() {
        mDrawer.style.transition = 'transform 200ms ease-out';
        mDrawer.style.transform = 'translate3d(0, 0, 0)';
        mDrawer.classList.add('sh-l');
        mModal.style.display = 'block';
    }).on('click', '#myItemsLink, .shop-link', function() {
        $('#proceed-to-invoice').hide();
        $('.items-container').hide();
        App.changeViewTo('#itemsView');

        var catg, shopId, shopName, shopAddress;
        if (this.id == 'myItemsLink') {//owner's items
            catg = CATEGORY;
            shopId = UUID;
            shopName = USERNAME;
            shopAddress = ADDRESS;
        } else {//highlighted items
            catg = this.dataset.catg;
            shopId = this.dataset.shopId;
            shopName = this.dataset.shopName;
            shopAddress = this.dataset.shopAddress;
            if (catg != 3) $('#proceed-to-invoice').show().attr('data-catg', catg);
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
                    buildItems(p, catg, false);
                } else {
                    // toast('No items was found');
                }
            },
            complete: function() {$('body').unspin();}
        });
    }).on('click', '.item-remove', function(e) {
        h="<div class='pd16 st-p t-c b'>Confirm to remove this item?</div>\
            <div class='fx bt modalClose'>\
                <div id='item-remove-confirm' class='pd16z t-c fx50 b-rg b ac' data-item-id='"+this.dataset.itemId+"' data-catg='"+this.dataset.catg+"'>YES</div>\
                <div class='pd16z t-c fx50 b ac'>CANCEL</div>\
            </div>";
        $MM.show();
        $MF.html(h).zoom();
    }).on('click', '#item-remove-confirm', function(e) {
        var itemId = this.dataset.itemId;
        var catg = this.dataset.catg;
        if (catg != CATEGORY) return;
        $('body').spin();
        $.ajax({
            url: MY_URL + "/send.php",
            data: {
                action: 'removeItem',
                itemID: itemId,
                catg: catg,
                ownerID: UUID
            },
            dataType: 'json',
            method: "POST",
            timeout: 30000,
            success: function(p) {
                if (p.state && p.state == 1) {
                    switch(catg) {
                        case '1'://e-commerce
                            $('.product-entry[data-item-id="'+itemId+'"]').remove();
                            App.closeCurrentView();
                            //remove from object
                            var c = PRODUCTS.find(function(p) { return p.itemID == itemId; });
                            delete c;
                            break;
                        case '2'://food
                            $('.food-entry[data-item-id="'+itemId+'"]').remove();
                            var d = ITEMS_DATA.find(function(a) {return a.itemID == itemId;});
                            delete d;
                            break;
                        case '3'://ticket
                            $('.event-entry[data-item-id="'+itemId+'"] .item-remove').text('Not selling').removeClass('item-remove');
                            var d = ITEMS_DATA.find(function(a) {return a.itemID == itemId;});
                            d.isselling = 0;
                            break;
                        case '4'://graphics
                            $('.graphics-entry[data-item-id="'+itemId+'"]').remove();
                            var d = ITEMS_DATA.find(function(a) {return a.itemID == itemId;});
                            delete d;
                            break;
                        case '5'://makeup
                            $('.makeup-entry[data-item-id="'+itemId+'"]').remove();
                            var d = ITEMS_DATA.find(function(a) {return a.itemID == itemId;});
                            delete d;
                            break;
                        case '6'://laundry
                            $('.laundry-entry[data-item-id="'+itemId+'"]').remove();
                            var d = ITEMS_DATA.find(function(a) {return a.itemID == itemId;});
                            delete d;
                            break;
                        case '7'://gas
                            $('.gas-entry[data-item-id="'+itemId+'"]').remove();
                            var d = ITEMS_DATA.find(function(a) {return a.itemID == itemId;});
                            delete d;
                            break;
                    }
                } else {
                    toast('There was an error');
                }
            },
            complete: function() {
               $('body').unspin();
            }
        });
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
    }).on('click', '#add-to-cart', function(e) {
        var itemId = this.dataset.itemId;
        var c = PRODUCTS.find(function(p) { return p.itemID == itemId; });
        if (c) {
            var menu = document.querySelector('#productWrapper');
            var tt = parseInt(menu.querySelector('input[name="item-count"]').value) || 0;
            if (tt > 0) {
                var sizes = menu.querySelector('.size-picker');
                var colors = menu.querySelector('.color-picker');
                var
                selectedSizes = null, totalSizes = 0,
                selectedColors = null, totalColors = 0;
                if (sizes) {
                    selectedSizes = sizes.dataset.selectedOptions;
                    if (selectedSizes) {
                        totalSizes = selectedSizes.split(',').filter(function(j) {return j;}).length;
                        if (totalSizes == 0) return toast('Select your preferred size' + (tt > 1 ? 's' : ''));
                        if (totalSizes > tt) return toast('Total sizes cannot be more than number of items');
                    } else return toast('Select your preferred size' + (tt > 1 ? 's' : ''));
                }
                if (colors) {
                    selectedColors = colors.dataset.selectedOptions;
                    if (selectedColors) {
                        totalColors = selectedColors.split(',').filter(function(j) {return j;}).length;
                        if (totalColors == 0) return toast('Select your preferred colour' + (tt > 1 ? 's' : ''));
                        if (totalColors > tt) return toast('Total colours cannot be more than number of items');
                    } else return toast('Select your preferred colour' + (tt > 1 ? 's' : ''));
                }
                var invoice = {id: itemId, oi: c.ownerID, nm: c.name, pr: parseFloat(c.price).toFixed(2), ds: parseFloat(c.discount).toFixed(2), tt: tt, sz: selectedSizes, cl: selectedColors, isproduct:true};
                var addedIndex = SELECTED_PRODUCTS.findIndex(function(i) {return i.id == itemId; });
                if (addedIndex == -1) addedIndex = SELECTED_PRODUCTS.length;
                SELECTED_PRODUCTS[addedIndex] = invoice;
                //
                var total = SELECTED_PRODUCTS.reduce(function(a, b) { return a + b.tt}, 0);
                $('#shopping-cart').attr('data-total', total);
                App.closeCurrentView();
                toast('Item added to cart');
            } else {
                toast('Please select number of items');
            }
        } else {
            toast('This item is no longer available');
        }
    }).on('click', '#shopping-cart', function(e) {
        if (SELECTED_PRODUCTS.length == 0) return toast('Your cart is empty');
        CURRENT_ORDER = SELECTED_PRODUCTS;
        ORDER_TYPE = '1';
        App.changeViewTo('#invoiceView');
        $('#invoice-content').html(buildInvoice(SELECTED_PRODUCTS, null));
    }).on('click', '.remove-from-cart', function(e) {
        var i = this.dataset.index;
        SELECTED_PRODUCTS.splice(i, 1);
        $('#invoice-content').html(buildInvoice(SELECTED_PRODUCTS, null));
    }).on('click', '#proceed-to-invoice', function(e) {
        var catg = this.dataset.catg;
        var menu = document.querySelector('.items-container[data-catg="'+catg+'"]');
        var items = menu.querySelectorAll('.item-count');
        var invoice = [];
        switch(catg) {
            case '2'://food
            case '4'://graphics
            case '5'://makeup
            case '7'://gas
                items.forEach(function(item) {
                    var tt = item.innerText; if (tt == 0) return;
                    var id = item.dataset.itemId;
                    var d = ITEMS_DATA.find(function(a) {return a.itemID == id;});
                    if (d) {
                        invoice.push({id: id, oi: d.ownerID, nm: d.name, pr: parseFloat(d.price).toFixed(2), ds: parseFloat(d.discount).toFixed(2), tt: tt});
                    }
                });
                break;
            case '6'://laundry
                items.forEach(function(item) {
                    var tt = item.innerText; if (tt == 0) return;
                    var id = item.dataset.itemId;
                    var d = ITEMS_DATA.find(function(a) {return a.itemID == id;});
                    if (d) {
                        var y = document.querySelector('.laundry-type[data-item-id="'+id+'"] .radio.selected').dataset.name;
                        invoice.push({id: id, oi: d.ownerID, nm: d.name+' ('+y.split('_').map(function(t){return t[0].toUpperCase()+t.substring(1);}).join(' ')+')', pr: parseFloat(d[y]).toFixed(2), ds: '0.00', tt: tt});
                    }
                });
                break;
        }
        if (invoice[0]) {
            CURRENT_ORDER = invoice;
            ORDER_TYPE = catg;
            App.changeViewTo('#invoiceView');
            $('#invoice-content').html(buildInvoice(invoice, null));
        } else toast('No item was selected');
    }).on('click', '#accept-invoice', function(e) {
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
        if (ORDER_TYPE != 3) ORDER_INFO = null;
        //
        if (ORDER_TYPE == 1) {
            //re-group the items[[***]]
        }
        //
        $('body').spin();
        $.ajax({
            url: MY_URL + "/send.php",
            data: {
                action: 'createOrder',
                invoice: JSON.stringify(CURRENT_ORDER),
                total_cost: ORDER_TOTAL,
                buyer_details: JSON.stringify(details),
                voucher_code: voucherCode,
                //
                order_type: ORDER_TYPE,
                order_info: ORDER_INFO,
                //
                sellerID: CURRENT_ORDER[0].oi,
                buyerID: UUID
            },
            method: "POST",
            timeout: 30000,
            dataType: 'json',
            success: function(p) {
                // console.log(p);
                if (p.state == '0') {
                    toast(p.message);
                } else {
                    Views = ['#home'];
                    App.changeViewTo('#successView');
                    if (ORDER_TYPE=='3') $('#order-success-info').text('Check your orders and make payment');//no delivery charges
                    else {
                        $('#order-success-info').text('You will be contacted shortly');
                        if (ORDER_TYPE=='1') {
                            SELECTED_PRODUCTS.length = 0;//reset
                            $('#shopping-cart').attr('data-total', '0');
                        }
                    }
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
        var catg = this.dataset.catg;
        App.switchTabTo('#catalogTab');
        $('.item-filter[data-catg="'+catg+'"]').click();
        $('.tab-locator').removeClass('c-o');
        document.querySelector('.tab-locator[data-tab="#catalogTab"]').classList.add('c-o');
    }).on('click', '.item-filter', function(e) {
        $('.item-filter.c-o').removeClass('c-o');
        this.classList.add('c-o');
        var left = this.offsetLeft;
        document.querySelector('#categories-filter').scrollLeft = left - 10;
        $('#catalog-items-container').empty();
        getProductFetchDetails();
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
        var itm = this.dataset.itemId;
        $('body').spin();
        $.ajax({
            url: MY_URL + "/send.php",
            data: {
                action: 'completeOrder',
                sellerID: UUID,
                orderID: i,
                itemID: itm
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
                    checkWallet('landing');
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
          "PBFPubKey": "FLWPUBK-d7f08c4900b741ac9dbc917972bbf8db-X",
          // "PBFPubKey": "FLWPUBK_TEST-f97470a2644144b63407003be8af7c5f-X",
          "cardno": cardNumber,
          // "cardno": "5531886652142950",
          "cvv": cardCVV,
          // "cvv": "564",
          "expirymonth": cardMonth,
          // "expirymonth": "09",
          "expiryyear": cardYear,
          // "expiryyear": "22",
          "currency": "NGN",
          "country": "NG",
          "amount": ORDER_TOTAL,
          "email": EMAIL,
          "phonenumber": PHONE,
          "firstname": fName,
          "lastname": lName,
          "txRef": ORDER_ID// your unique merchant reference
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
    }).on('click', '#transaction-history-btn', function(e) {
        App.changeViewTo('#transactionsView');
        $('body').spin();
        checkWallet('transactions');
    }).on('click', '#completed-orders-btn', function(e) {
        fetchMyOrders($('#completedOrders'), 'completed');
        App.changeViewTo('#ordersCompletedView');
    }).on('click', '#pending-orders-btn', function(e) {
        fetchMyOrders($('#pendingOrders'), 'pending');
        App.changeViewTo('#ordersPendingView');
    })/*.on('click', '#withdrawals-query-btn', function(e) {
        fetchWithdrawals();
    })*/.on('click', '.orders-filter', function(e) {
        $SM.show();
        $SH.show(300);
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
        if (el.dataset.disabled == 'true') return; el.dataset.disabled = 'true';
        var shopId = this.dataset.shopId;
        $('body').spin();
        $.ajax({
            url: MY_URL + "/send.php",
            data: {
                action: 'submitReview',
                message: text,
                ownerID: shopId,
                reviewerID: UUID
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
    }).on('click', '#catalog-fetch-link', function(e) {
        getProductFetchDetails();
    }).on('click', '.product-entry', function(e) {
        var itemId = this.dataset.itemId;
        var isadded = SELECTED_PRODUCTS.find(function(i) {return i.id == itemId; });
        var c = PRODUCTS.find(function(p) { return p.itemID == itemId; });
        if (c) {
            var images = '';
            if (c.images > 1) {
                for (var i = 0; i < c.images; i++) images += "<img src='"+MY_URL+"/img/items/products/"+c.itemID+"_"+i+".jpg' class='thumbnail box96 ba bs-r mg-r "+(i==0?'active':'')+"'>";
            }
            var h = "<div class='fw fx fx-ac fx-jc bb'>"+
                (isadded ? "<div class='fw pd16 psf z4 t0 l0 info_box'><div class='fw bs-r sh-c pd16 psr bg c-o'>Item already in cart. This selection will override the previous one.<div class='box32 psa fx fx-ac fx-jc t0 r0 icon-cancel'></div></div></div>" : "")+
                "<img src='"+MY_URL+"/img/items/products/"+c.itemID+"_0.jpg' id='featured-photo' class='fw'>\
            </div>"+
            (c.images > 1 ? "<div class='carousel pd16 f0 bb'>"+images+"</div>" : "")+
            "<div class='pd20'>\
                <div class='f24 b'>"+c.name+"</div>"+
                (c.discount > 0 ? "<div class='c-g tx-lt'>&#8358;"+comma(c.price)+"</div>" : "")+
                "<div class='f16 b'>&#8358;"+comma((c.price - c.discount).toFixed(2))+"</div>\
                <div class='c-o'>Available in stock: "+comma(c.pieces_available)+"</div>\
                <div class='description pd16z c-g'>"+(c.description||'')+"</div>"+
                (c.ownerID != UUID ?
                    "<div class='fw fx fx-ac b5 pd516 mg-bx b4-r ba'>\
                        <div class='fx40'>PCS:</div>\
                        <div class='fx60 h50 mg-lxx pd020'><input class='fw fh f16' type='number' name='item-count' value='1' min='1' placeholder='1'></div>\
                    </div>"+
                    (c.sizes ? "<div class='fw fx fx-ac pd516 mg-bx b4-r ba triangle-down'>\
                        <div class='fx40 b'>SIZE:</div>\
                        <div class='size-picker picker psr fx fx-ac fx60 h50 mg-lxx pd020 ov-h ovx-a not-null' data-available-sizes='"+c.sizes+"' data-selected-options='' placeholder='Select size'></div>\
                    </div>" : "")+
                    (c.colors ? "<div class='fw fx fx-ac pd516 mg-bx b4-r ba triangle-down'>\
                        <div class='fx40 b'>COLOUR:</div>\
                        <div class='color-picker picker psr fx fx-ac fx60 h50 mg-lxx pd020 ov-h ovx-a not-null' data-available-colors='"+c.colors+"' data-selected-options='' placeholder='Select colours'></div>\
                    </div>" : "")+
                    "<div id='add-to-cart' class='fw mg-tx Orange white b4-r pd16 t-c b' data-item-id='"+c.itemID+"'>ADD TO CART</div>"
                    :"<div class='item-remove fw Orange psf b0 l0 white pd16 t-c b' data-item-id='"+c.itemID+"' data-catg='1'>DELETE THIS ITEM</div>"
                )+
            "</div>";
            $('#productWrapper').html(h);
            App.changeViewTo('#productView');
            $('#productWrapper').parent().scrollTop(0);
        }
    }).on('click', '.thumbnail', function(e) {
        $('.thumbnail.active').removeClass('active');
        this.classList.add('active');
        $('#featured-photo').attr('src', this.src).hide().fadeIn();
    }).on('click', '.event-entry', function(e) {
        var itemId = this.dataset.itemId;
        var c = ITEMS_DATA.find(function(a) {return a.itemID == itemId;});
        if (c) {
            if (c.isselling == 0) return toast('This event is no more selling');
            var h = "<div class='fw b f16 pd16 bb t-c'>BUY A TICKET</div>";
            var user = c.ownerID == UUID;
            c.tickets.forEach(function(v) {
                h+="<div class='ticket-entry fw pd16 bb'>\
                    <div class='fw fx fx-fs'>\
                        <div class='fx60'>\
                            <div class='f16 b'>"+TICKETS[v.ticket_type]+"</div>\
                            <div class='fw fx fx-fe mg-t'>\
                                <div class='fx50'>"
                                    +(v.discount > 0 ? "<div class='tx-lt c-g f10'>&#8358;"+comma(v.price)+"</div>" : "")+
                                    "<div class='f16'>&#8358;"+comma((v.price - v.discount).toFixed(2))+"</div>\
                                </div>"+
                                (user ? ""
                                    :v.sales == v.seats ? "<div class='pd10 b4-r bg-fd carousel c-g'>SOLD OUT</div>"
                                    : "<div class='buy-ticket pd10 b4-r Orange white' data-item-id='"+c.itemID+"' data-item-type='"+v.ticket_type+"'>BUY</div>")+
                            "</div>\
                        </div>\
                    </div>\
                </div>";
            });
            $MM.show();
            $MF.html(h).zoom();
        }
    }).on('click', '.buy-ticket', function(e) {
        var itemId = this.dataset.itemId;
        var tType = this.dataset.itemType;
        var d = ITEMS_DATA.find(function(a) {return a.itemID == itemId;});
        if (d) {
            var tk = d.tickets.find(function(b){return b.ticket_type==tType});
            var invoice = [{id: itemId, oi: d.ownerID, nm: d.name+' ('+TICKETS[tType]+')', pr: parseFloat(tk.price).toFixed(2), ds: parseFloat(tk.discount).toFixed(2), tt: 1}];
            CURRENT_ORDER = invoice;
            ORDER_TYPE = '3';
            ORDER_INFO = JSON.stringify({ticket_type: tType, event_id: itemId});
            App.changeViewTo('#invoiceView');
            $('#invoice-content').html(buildInvoice(invoice, null));
        }
    }).on('click', '#withdraw-cash', function(e) {
        $('body').spin();
        checkWallet('query');
    }).on('click', '#notifications-btn', function(e) {
        this.dataset.total = '0';
        App.changeViewTo('#inboxView');
        fetchMails();
    }).on('click', '.msg-entry', function(e) {
        var key = this.dataset.key;
        var msg = MY_MAILS.find(function(m) {return m.k == key;});
        $('#repliesWrapper').empty().attr('placeholder','Loading replies...');
        App.changeViewTo('#messageView');
        buildMessage(msg);
        fetchReplies(key);
    }).on('click', '.msg-reply', function(e) {
        App.changeViewTo('#replyView');
        $('#post-a-reply').attr('data-key', this.dataset.key);
    }).on('click', '#post-a-reply', function(e) {
        var reply = $('#reply-input').val().trim();
        if (!reply) return;
        var el = this;
        if (el.dataset.disabled == 'true') return; el.dataset.disabled = 'true';
        $('body').spin();
        $.ajax({
            url: MY_URL + "/send.php",
            data: {
                action: 'messageReply',
                reply: reply,
                messageKey: el.dataset.key,
                senderID: UUID
            },
            method: "POST",
            timeout: 30000,
            dataType: 'json',
            success: function(p) {
                if (p.state == '1') {
                    $('#repliesWrapper').prepend(buildReplies([{senderID: UUID, reply: reply, messageKey: el.dataset.key, time_: (Date.now()/1000)}], true));
                    App.closeCurrentView();
                    setTimeout(function() { $('.reply-entry').first().slideDown(); }, 300);
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
                    var msg = MY_MAILS.find(function(m) {return m.k == key;});
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
                    var msg = MY_MAILS.find(function(m) {return m.k == key;});
                    msg.isdeleted = 1;
                    App.closeCurrentView();
                }
            }
        });
    }).on('click', '#add-gallery-items', function(e) {
        App.changeViewTo('#galleryAddView');
    }).on('click', '.gallery-viewer', function(e) {
        var $ctn = $('#pictures-container');
        $ctn.attr('placeholder', 'Loading gallery items...');
        $('#add-gallery-items').hide();
        App.changeViewTo('#galleryView');
        $('body').spin();
        $.ajax({
            url: MY_URL + "/fetch.php",
            data: {
                action: 'fetchGalleryLinks',
                ownerID: UUID
            },
            dataType: 'json',
            timeout: 30000,
            method: "GET",
            success: function(p) {
                if (p.gallery_links) buildGalleryItems(p.gallery_links);
                else {
                    $ctn.attr('placeholder', 'No gallery items have been added');
                    if (USERTYPE == 1) $('#add-gallery-items').show();
                }
            },
            complete: function(x) {$('body').unspin(); if (x.status === 0) toast('Network error');}
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
        if (S.a - e.changedTouches[0].pageX > 1) {
            if (S.z < -(VIEWPORTWIDTH * 0.2) - VIEWPORTWIDTH) {
                var p = -VIEWPORTWIDTH * 2;
                this.style.transform = 'translate3d(' + p + 'px, 0, 0)';
                this.dataset.index = '2';
                S.z = p;
            } else if (S.z < -VIEWPORTWIDTH * 0.2) {
                var p = -VIEWPORTWIDTH;
                this.style.transform = 'translate3d(' + p + 'px, 0, 0)';
                this.dataset.index = '1';
                S.z = p;
            } else {//-60 and higher (small swipe)
                var p = 0;
                this.style.transform = 'translate3d(' + p + 'px, 0, 0)';
                this.dataset.index = '0';
                S.z = p;
            }
        } else {
            if (S.z > -VIEWPORTWIDTH * 0.8) {//-240
                var p = 0;
                this.style.transform = 'translate3d(' + p + 'px, 0, 0)';
                this.dataset.index = '0';
                S.z = p;
            } else if (S.z > -(VIEWPORTWIDTH * 0.8) - VIEWPORTWIDTH) {//>-540
                var p = -VIEWPORTWIDTH;
                this.style.transform = 'translate3d(' + p + 'px, 0, 0)';
                this.dataset.index = '1';
                S.z = p;
            } else {//-60
                var p = -VIEWPORTWIDTH * 2;
                this.style.transform = 'translate3d(' + p + 'px, 0, 0)';
                this.dataset.index = '2';
                S.z = p;
            }
        }
        this.style.transition = 'transform 300ms ease-out';
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
                                    <div class='fw b f16'>No suggested events</div>\
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
                                    <div class='fw b f16'>No suggested restaurants</div>\
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
    function checkWallet(type) {
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
                if (type == 'landing') {
                    $('#amount-due').text(comma(parseFloat(p.balance).toFixed(2)));
                } else if (type == 'transactions') {
                    $('#total-sales').text(comma(p.credit));
                    $('#total-withdrawal').text(comma(p.debit));
                    $('#wallet-balance').text(comma(parseFloat(p.balance).toFixed(2)));
                } else if (type == 'query') {
                    MY_BALANCE = p.balance;
                    MIN_WITHDRAWAL = p.minim;
                    if (MY_BALANCE == 0 || MY_BALANCE < MIN_WITHDRAWAL) return toast('You have insufficient funds');
                    App.changeViewTo('#withdrawalView');
                }
            },
            complete: function() {if (type != 'landing') $('body').unspin();}
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
        p.forEach(function(c) {
            h += "<div class='msg-entry fw pd10 psr b4-r mg-b16 ba sh-a ov-h' data-key='"+c.k+"'>\
                <div class='mail-status psa t0 r0 white "+(c.isopen == 1 ? 'Orange' : 'bg-fd')+"' data-key='"+c.k+"' style='padding:2px 5px;'>"+(c.isopen == 1 ? 'open' : 'closed')+"</div>\
                <div class='fw b f16'>"+c.title+"</div>\
                <div class='fw ov-h pd10z b5 tx-el c-g'>"+c.message+"</div>\
                <div class='f10 c-g'>"+checkTime(c.time_*1000)+"</div>\
            </div>";
        });
        return h;
    }
    function buildMessage(c) {
        var h = "<div class='fw psr b4-r ov-h'>\
                <div class='psa t0 r0 white "+(c.isopen == 1 ? 'Orange' : 'bg-fd')+"' style='padding:2px 5px;'>"+(c.isopen == 1 ? 'open' : 'closed')+"</div>\
                <div class='fw b f16'>"+c.title+"</div>\
                <div class='f10 c-g'>"+checkTime(c.time_*1000)+"</div>\
                <div class='fw pd10z pr-w'>"+c.message+"</div>\
                <div class='fw fx c-g b5'>\
                    <div class='msg-reply mg-r' data-key='"+c.k+"'>Reply</div>\
                    <div class='"+(c.isopen == '1' ? 'msg-close' : '')+" mg-r' data-key='"+c.k+"'>"+(c.isopen == '1' ? 'Close' : "<span class='bg-fd'>Closed</span>")+"</div>\
                    <div class='msg-delete' data-key='"+c.k+"'>Delete</div>\
                </div>\
                <div class='fw pd10 mg-t ba b4-r bg-ac i c-g'>This message will be closed by the admin if you do not respond within 3 days. You may close it if you are satisfied. You can re-open the message anytime by sending a reply. If you delete this message, you would not see it in your inbox again.</div>\
            </div>";
        $('#messageWrapper').html(h);
    }
    function fetchReplies(key) {
        $.ajax({
            url: MY_URL + "/fetch.php",
            data: {
                action: 'fetchReplies',
                messageKey: key,
                senderID: UUID
            },
            dataType: 'json',
            timeout: 30000,
            method: "GET",
            success: function(p) {
                if (p.length == 0) return $('#repliesWrapper').attr('placeholder','No replies');
                $('#repliesWrapper').html(buildReplies(p, false));
            },
            complete: function() {$('body').unspin();}
        });
    }
    function buildReplies(p, hide) {
        var h = '';
        p.forEach(function(c) {
            h += "<div class='reply-entry pd10 ba1 b4-r mg-b' "+(hide ? "style='display:none;'" : '')+">\
                <div class='fw b'>"+(c.senderID == UUID ? 'You' : 'Admin')+"</div>\
                <div class='f10 c-g'>"+checkTime(c.time_*1000)+"</div>\
                <div class='fw pd10z pr-w'>"+c.reply+"</div>\
            </div>";
        });
        return h;
    }
    function buildItems(p, catg, local) {
        var h = '';
        var user = p[0].ownerID == UUID;
        //
        if (catg != 1) {
            if (local) ITEMS_DATA.push(p[0]);
            else ITEMS_DATA = p;
        }

        if (catg == '1') {//e-commerce, fetched by the owner
            if (local) PRODUCTS.push(p[0]);
            else PRODUCTS = p;
            //
            h+=buildProducts(p);
            var $v = $('#products-container');
            if (local) $v.append(h); else $v.html(h);
        } else if (catg == '2') {//food
            var h1="", h2="", h3="", h4="";
            p.forEach(function(c) {
                var m="<div class='fw food-entry bg pd16 mg-tx sh-c' data-item-id='"+c.itemID+"'>\
                    <div class='fw fx fx-fs'>\
                        <div class='w120 xh120 bg-ac ba bs-r ov-h'><img src='"+MY_URL+"/img/items/food/"+c.itemID+".jpg' class='fw bs-r'></div>\
                        <div class='fx60 mg-lx'>\
                            <div class='fw fx fx-fs'>\
                                <div class='fx60 f16 b mg-rx'>"+c.name+"</div>"+
                                (user ?
                                "<div class='fx fx-je c-g'>\
                                    <!--<div class='item-edit f16 mg-rxx icon-edit-1' data-item-id='"+c.itemID+"'></div>-->\
                                    <div class='item-remove f16 icon-cancel' data-item-id='"+c.itemID+"' data-catg='2'></div>\
                                </div>":
                                "<div class='fx fx-jc item-order-spinner' data-item-id='"+c.itemID+"'>\
                                    <div class='fx fx-ac fx-jc Orange white b2-r box20 f20 item-subtract'>-</div>\
                                    <div class='fx fx-ac fx-jc w32 item-count t-c' data-item-key='"+c.pk+"' data-item-id='"+c.itemID+"'>0</div>\
                                    <div class='fx fx-ac fx-jc Orange white b2-r box20 f20 item-add'>+</div>\
                                </div>"
                                )+
                            "</div>\
                            <div class='fw mg-tm'>"
                                +(c.discount > 0 ? "<div class='tx-lt c-g f10'>&#8358;"+comma(c.price)+"</div>" : "")+
                                "<div class='f16 b5'>&#8358;"+comma((c.price - c.discount).toFixed(2))+"</div>\
                            </div>\
                        </div>\
                    </div>\
                </div>";
                switch(c.food_type){
                    case 1:h1+=m;break;
                    case 2:h2+=m;break;
                    case 3:h3+=m;break;
                    case 4:h4+=m;break;
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
                h+="<div class='fw event-entry psr mg-b16' data-item-id='"+c.itemID+"'>\
                    <div class='fw fx fx-ac pd1015 Grey tx-hs psa t0 l0'>\
                        <div class='fx60'>\
                            <div class='f20 b'>"+c.name+"</div>\
                            <div class='f10'>"+EVENTS[c.event_type]+"</div>\
                            <div class='f10'>"+c.event_date+"</div>\
                        </div>\
                    </div>"+
                    (user ?
                        c.isselling == 1 ?
                            "<div class='item-remove psa pd5 Grey bs-r mg-t mg-r ba r0 ac b' data-item-id='"+c.itemID+"' data-catg='3'>Stop Selling</div>"
                            :"<div class='psa pd5 Grey bs-r mg-t mg-r ba r0 b'>Not Selling</div>"
                    : c.isselling == 1 ?
                        "<div class='psa pd5 Grey bs-r mg-t mg-r ba r0 b'>Still Selling</div>"
                        :"<div class='psa pd5 Grey bs-r mg-t mg-r ba r0 b'>No more Selling</div>")+
                    "<img class='fw fx sh-a' src='"+MY_URL+"/img/items/events/"+c.itemID+".jpg'>\
                </div>";
            });
            var $v = $('#events-container');
            if (local) $v.append(h); else $v.html(h);
        } else if (catg == '4') {//graphics
            p.forEach(function(c) {
                c.name = GRAPHICS[c.graphics_type];
                h+="<div class='fw graphics-entry bg pd16 mg-tx sh-c' data-item-id='"+c.itemID+"'>\
                    <div class='fw fx fx-fs'>\
                        <div class='w120 xh120 bg-ac ba bs-r ov-h'><img src='"+MY_URL+"/img/items/graphics/"+c.itemID+".jpg' class='fw bs-r'></div>\
                        <div class='fx60 mg-lx'>\
                            <div class='fw fx fx-fs'>\
                                <div class='fx60 f16 b mg-rx'>"+GRAPHICS[c.graphics_type]+"</div>"+
                                (user ? 
                                "<div class='fx fx-je c-g'>\
                                    <!--<div class='item-edit f20 mg-rxx icon-edit-1' data-item-id='"+c.itemID+"'></div>-->\
                                    <div class='item-remove f16 icon-cancel' data-item-id='"+c.itemID+"' data-catg='4'></div>\
                                </div>":
                                "<div class='fx fx-jc item-order-spinner' data-item-id='"+c.itemID+"'>\
                                    <div class='fx fx-ac fx-jc Orange white b2-r box20 f20 item-subtract'>-</div>\
                                    <div class='fx fx-ac fx-jc w32 item-count t-c' data-item-id='"+c.itemID+"'>0</div>\
                                    <div class='fx fx-ac fx-jc Orange white b2-r box20 f20 item-add'>+</div>\
                                </div>"
                                )+
                            "</div>\
                            <div class='fw mg-tm'>\
                                <div class='f16'>&#8358;"+comma(parseFloat(c.price).toFixed(2))+"</div>\
                            </div>\
                        </div>\
                    </div>\
                </div>";
            });
            var $v = $('#graphics-container');
            if (local) $v.append(h); else $v.html(h);
        } else if (catg == '5') {//make up
            p.forEach(function(c) {
                h+="<div class='fw makeup-entry bg pd16 mg-tx sh-c' data-item-id='"+c.itemID+"'>\
                    <div class='fw fx fx-fs'>\
                        <div class='w120 xh120 bg-ac ba bs-r ov-h'><img src='"+MY_URL+"/img/items/makeup/"+c.itemID+".jpg' class='fw bs-r'></div>\
                        <div class='fx60 mg-lx'>\
                            <div class='fw fx fx-fs'>\
                                <div class='fx60 mg-r'>\
                                    <div class='f16 b'>"+MAKEUPS[c.makeup_type]+"</div>\
                                    <div class='b5'>"+c.name+"</div>\
                                </div>"+
                                (user ? 
                                "<div class='fx fx-je c-g'>\
                                    <!--<div class='item-edit f20 mg-rxx icon-edit-1' data-item-id='"+c.itemID+"'></div>-->\
                                    <div class='item-remove f16 icon-cancel' data-item-id='"+c.itemID+"' data-catg='5'></div>\
                                </div>":
                                "<div class='fx fx-jc item-order-spinner' data-item-id='"+c.itemID+"'>\
                                    <div class='fx fx-ac fx-jc Orange white b2-r box20 f20 item-subtract'>-</div>\
                                    <div class='fx fx-ac fx-jc w32 item-count t-c' data-item-id='"+c.itemID+"'>0</div>\
                                    <div class='fx fx-ac fx-jc Orange white b2-r box20 f20 item-add'>+</div>\
                                </div>"
                                )+
                            "</div>\
                            <div class='fw mg-tm'>\
                                <div class='f16'>&#8358;"+comma(c.price)+"</div>\
                            </div>\
                        </div>\
                    </div>\
                </div>";
            });
            var $v = $('#makeup-container');
            if (local) $v.append(h); else $v.html(h);
        } else if (catg == '6') {//laundry
            p.forEach(function(c) {
                c.name = LAUNDRIES[c.itemID];
                h+="<div class='fw laundry-entry bg pd16 mg-tx sh-c' data-item-id='"+c.itemID+"'>\
                    <div class='fw fx fx-js'>\
                        <div class='fx60 f16 b'>"+LAUNDRIES[c.itemID]+"</div>\
                        <div class='fx fx-fe'>"+
                            (user ? 
                            "<div class='fx fx-je c-g'>\
                                <div class='item-remove f16 icon-cancel' data-item-id='"+c.itemID+"' data-catg='6'></div>\
                            </div>":
                            "<div class='fx fx-jc item-order-spinner' data-item-id='"+c.itemID+"'>\
                                <div class='fx fx-ac fx-jc Orange white b2-r box20 f20 item-subtract'>-</div>\
                                <div class='fx fx-ac fx-jc w32 item-count t-c' data-item-id='"+c.itemID+"'>0</div>\
                                <div class='fx fx-ac fx-jc Orange white b2-r box20 f20 item-add'>+</div>\
                            </div>"
                            )+
                        "</div>\
                    </div>\
                    <div class='fw b5 mg-t laundry-type' data-item-id='"+c.itemID+"'>"+
                        (c.full_laundry > 0 ? "<div class='"+(user ? '' : 'radio singo selected')+" psr mg-bx' data-name='full_laundry'>&#8358;"+c.full_laundry+" (Full laundry)</div>" : "")+
                        (c.wash_only > 0 ? "<div class='"+(user ? '' : 'radio singo')+" psr mg-bx"+(c.full_laundry == 0 && !user ? ' selected' : '')+"' data-name='wash_only'>&#8358;"+c.wash_only+" (Wash only)</div>" : "")+
                        (c.iron_only > 0 ? "<div class='"+(user ? '' : 'radio singo')+" psr mg-bx"+(c.full_laundry == 0 && c.wash_only == 0 && !user ? 'selected' : '')+"' data-name='iron_only'>&#8358;"+c.iron_only+" (Iron only)</div>" : "")+
                    "</div>\
                </div>";
            });
            var $v = $('#laundry-container');
            if (local) $v.append(h); else $v.html(h);
        } else if (catg == '7') {//gas
            p.forEach(function(c) {
                c.name = GASES[c.itemID];
                h+="<div class='fw gas-entry bg pd16 mg-tx sh-c' data-item-id='"+c.itemID+"'>\
                    <div class='fw'>\
                        <div class='fx fx'>\
                            <div class='fx60 f16 b'>"+GASES[c.itemID]+"</div>"+
                            (user ? 
                            "<div class='fx fx-je c-g'>\
                                <div class='item-remove f16 icon-cancel' data-item-id='"+c.itemID+"' data-catg='7'></div>\
                            </div>":
                            "<div class='fx fx-jc item-order-spinner' data-item-id='"+c.itemID+"'>\
                                <div class='fx fx-ac fx-jc Orange white b2-r box20 f20 item-subtract'>-</div>\
                                <div class='fx fx-ac fx-jc w32 item-count t-c' data-item-id='"+c.itemID+"'>0</div>\
                                <div class='fx fx-ac fx-jc Orange white b2-r box20 f20 item-add'>+</div>\
                            </div>"
                            )+
                        "</div>\
                        <div class='fw mg-t'>\
                            <div class='b5'>&#8358;"+comma(c.price)+"</div>\
                        </div>\
                    </div>\
                </div>";
            });
            var $v = $('#gas-container');
            if (local) $v.append(h); else $v.html(h);
        }
    }
    function exitItemAddView() {
        Views.pop();
        Views.pop();
        App.changeViewTo('#itemsView');
    }
    function getProductFetchDetails() {
        var $entries = $('#catalog-items-container .product-entry');
        var catg = $('.item-filter.c-o').attr('data-catg');
        if ($entries.length == 0) {
            $('body').spin();
            fetchProducts('top', 1, catg);
        } else {
            var cue = $entries.first().attr('data-item-key');
            fetchProducts('more', cue, catg);
        }
    }
    function fetchProducts(type, cue, catg) {
        var $cn = $('#catalog-items-container');
        $cn.attr("placeholder","Fetching products...");
        $.ajax({
            url: MY_URL + "/fetch.php",
            data: {
                action: 'fetchProducts',
                campus: CAMPUSKEY,
                type: type,
                catg: catg,
                cue: cue
            },
            dataType: 'json',
            timeout: 30000,
            method: "GET",
            success: function(p) {
                if (p.length > 0) {
                    var h = buildProducts(p);
                    if (type == 'top') {
                        $cn.html(h);
                        PRODUCTS = p;
                    } else if (type == 'more') {
                        $cn.prepend(h);
                        p.forEach(function(i) { PRODUCTS.push(i); });
                    } else if (type == 'less') {
                        $cn.append(h);
                        p.forEach(function(i) { PRODUCTS.push(i); });
                    }
                } else {
                    $cn.attr("placeholder","We couldn't find a matching product");
                }
            },
            complete: function() {$('body').unspin();}
        });
    }
    function buildProducts(p) {
        var h = '';
        p.forEach(function(c) {
            h+="<div class='boxes2 product-entry i-b bg ac' data-item-id='"+c.itemID+"' data-item-key='"+c.pk+"'>\
                    <div class='fw fx h50w bg-ac ba mg-b bs-r ba ov-h'>\
                        <img class='fw im-sh' src='"+MY_URL+"/img/items/products/"+c.itemID+"_0.jpg'>\
                    </div>\
                    <div class='fw'>\
                        <div class='fw ovx-h f16 b tx-el'>"+c.name+"</div>"+
                        (c.discount > 0 ? "<span class='tx-lt ltt c-g f10 mg-r'>&#8358;"+comma(c.price)+"</span>" : "")+
                        "<span class='f16'>&#8358;"+comma((c.price - c.discount).toFixed(2))+"</span>\
                    </div>"+
                    (c.delivery == 1 ?
                    "<div class='fx f10'>\
                        <div style='width:54px;'><img src='res/img/logo.png' class='fw'></div><i class='b'>Express</i>\
                    </div>":
                    "<div style='height:13px;'></div>"
                    )+
                "</div>";
        });
        return h;
    }
    function buildInvoice(invoice, order) {
        var h = '';
        var total = 0;
        invoice.forEach(function(c,x) {
            var price = (c.pr - c.ds) * c.tt;
            total += price;
            h+="<div class='fw fx f16 pd516'>\
                    <span class='b c-o mg-r'>"+c.tt+"x</span>\
                    <span class='b5 fx60 mg-r'>"+c.nm+"</span>\
                    <span class='b'>&#8358;"+comma(price)+"</span>\
                </div>";
            if (c.isproduct) {
                h+="<div class='pd1015 bb'>";
                if(c.sz){
                    var sizes = [];
                    c.sz.split(',').forEach(function(d) { sizes.push(SIZES.find(function(c) {return c.dex == d;})); });
                    sizes.forEach(function(s) { h += "<div class='pd5 mg-rm mg-bm i-b ba1 b5 b4-r'>"+s.val+"</div>"; });
                }
                if(c.cl){
                    var colors = [];
                    c.cl.split(',').forEach(function(d) { colors.push(COLORS.find(function(c) {return c.dex == d;})); });
                    colors.forEach(function(l) {
                        h += "<div class='pd5 mg-rm mg-bm i-b ba b5 b4-r'><div class='i-b b-rd ba1 mg-rm' style='background-color:"+l.hex+";vertical-align:bottom;width:18px;height:18px;'></div>"+l.name+"</div>";
                    });
                }
                h+="<div>\
                        <img src='"+MY_URL+"/img/items/products/"+c.id+"_0.jpg' class='invoice-item-thumb box96 ba bs-r' data-item-id='"+c.id+"'>\
                    </div>\
                    <div class='remove-from-cart pd10 i-b b4-r Orange white' data-index='"+x+"'>Remove this item</div>\
                </div>";
            }
        });
        var service_ch;
        if (USERTYPE == 0) service_ch = 50;
        else service_ch = 0;
        //
        var delivery = order ? order.delivery_charge : 0;
        ORDER_TOTAL = Math.ceil(total+service_ch+parseInt(delivery));
        h+=(!order ? "<div class='fw pd30'><input type='text' name='voucherCode' class='fw pd16 bg-ac t-c b4-r ba' placeholder='Enter Voucher Code'></div>" : "<div class='fw pd16'></div>")+
            "<div class='fw fx b5 c-g pd516'><span class='fx60'>Sub Total</span><span class=''>&#8358;"+comma(total)+"</span></div>"+
            (USERTYPE == 0 ? "<div class='fw fx b5 c-g pd516'><span class='fx60'>Service Charge</span><span class=''>&#8358;50</span></div>" : "")+
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
                        <div class='fw mg-bm'>"+info.phone+"</div>\
                        <div class='fw mg-bm'>"+info.address+"</div>\
                        <div class='fw mg-bm'>Ordered for "+(info.friend == 1 ? 'friend' : 'self')+"</div>\
                        <div class='fw'>"+info.instruction+"</div>\
                    </div>\
                </div>"+
                (
                    (seller && delivered == 0) ?
                        "<div class='fw pd016 fx fx-jc'><div class='Orange white b4-r sh-c b5 pd1015 order-complete-btn' data-order-id='"+orderID+"' data-item-id='"+order.itemID+"'>Complete Order</div></div>"
                    : (!seller) ?
                        (paid == 0) ?
                            (admined == 1) ? "<div class='fw pd016 fx fx-jc'><div class='Orange white b4-r sh-c b5 pd1015 order-payment-btn' data-order-id='"+orderID+"'>Make Payment</div></div>"
                            : (admined == 0) ? "<div class='fw pd016 fx fx-jc'><div class='ba b4-r b5 pd1015'>Awaiting Approval</div></div>"
                            : ""
                        : (paid == 1 && delivered == 0) ? "<div class='fw pd016 fx fx-jc'><div class='ba b4-r b5 pd1015'>Awaiting Delivery</div></div>"
                        : ""
                    : ""
                );
            ORDER_ID = orderID;
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
                        <div class='f10'>"+checkTime(c.time_start*1000)+"</div>\
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
                orderID: ORDER_ID
            },
            timeout: 30000,
            dataType: 'json',
            method: "POST",
            success: function(p) {
                if (p.status == 'failure') return toast('Temporary server error. Please try again.');
                updatePaymentStatus(p);
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
    function updatePaymentStatus(body) {
        // console.log(body.data.data.responsecode);
        if (body.state == 1) {
            toast('Your payment was successful');
            $('.order-payment-btn[data-order-id="'+ORDER_ID+'"]').replaceWith("<div class='fw pd016 fx fx-jc'><div class='ba b4-r b5 pd1015'>Awaiting Delivery</div></div>");
            var order = MY_ORDERS.find(function(e) {return e.orderID == ORDER_ID;});
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
    function buildGalleryItems(gallery_links) {
        var h = '';
        var g = gallery_links.split(',');
        g.forEach(function(imageLink) {
            h += "<div class='fw mg-b16'><img src='"+MY_URL+'/img/gallery/'+imageLink+'.jpg'+"' class='fw'></div>";
        });
        $('#pictures-container').html(h);
        if (g.length == 6) $('#add-gallery-items').hide();
        else if (USERTYPE == 1) $('#add-gallery-items').show();
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
                App.changeViewTo('#home');
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
        img.src = MY_URL+'/img/users/'+shopId+'.jpg';
        
        $('#display-name').text(shopName);
        $('#user-address').text(shopAddress);
        $('.items-container[data-catg="'+catg+'"]').show();
        $('#post-a-review').attr('data-shop-id', shopId);
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
        if(hour==0)hour=12;
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

    var POLLING_TIME = 3;
    POLLING_TRACKER = null;
    POLLING_TRACKER = setInterval(function() {
        if (POLLING_TIME == 0) {
            checkMail();
            if (USERTYPE == 0) {
                fetchEvents('timeline', 10);
                fetchRestaurants('timeline', 10);
            }
            POLLING_TIME = 3;
        } else POLLING_TIME--;
    }, 60000);

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