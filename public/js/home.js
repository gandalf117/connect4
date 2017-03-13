$(function() {

    var container = $('.game-container'),
        all_users = getUsersFromSession(),
        all_users_list = {},
        all_tokens = {},
        refresh_rate = 3000,
        board_min_x = 4,
        board_max_x = 12,
        board_min_y = 4,
        board_max_y = 12;

    console.log('current user session:');
    console.log(all_users);

    function isLoggedIn() {

        if(all_users && !$.isEmptyObject(all_users)) { return true; }
        else { return false; }

    }

    /*****************************************************************************/
    /* CREATING AND LOADING THE HOME PAGE
    /*****************************************************************************/

    function loadHomePage() {

        var home = $('<div>').appendTo(container).addClass('home'),
            menu = $('<div>').appendTo(home).addClass('menu'),
            link1 = $('<a>').appendTo(menu).text('Add user').on('click', loginPopup),
            link2 = $('<a>').appendTo(menu).text('Create user').on('click', createUserPopup),
            link3 = $('<a>').appendTo(menu).text('Create game').addClass('disabled').attr('id', 'cgame_btn'),   //disabled by default
            link4 = $('<a>').appendTo(menu).text('Join game').addClass('disabled').attr('id', 'jgame_btn'),     //disabled by default
            link5 = $('<a>').appendTo(menu).text('Log out').addClass('disabled').attr('id', 'logout_btn'),      //disabled by default
            content = $('<div>').appendTo(home).addClass('content row'),
            col1 = $('<div>').appendTo(content).addClass('col-xs-12 col-md-4 col-lg-4').attr('id', 'col1'),
            col2 = $('<div>').appendTo(content).addClass('col-xs-12 col-md-4 col-lg-4').attr('id', 'col2'),
            col3 = $('<div>').appendTo(content).addClass('col-xs-12 col-md-4 col-lg-4').attr('id', 'col3'),
            title1 = $('<div>').appendTo(col1).addClass('title').text('Stats'),
            title2 = $('<div>').appendTo(col2).addClass('title').text('Users'),
            title3 = $('<div>').appendTo(col3).addClass('title').text('Games');

        //enable log out and create games buttons right after creating them, only if there are logged in users
        if(isLoggedIn()) {
            enableCreateGameBtn();
            enableLogoutBtn();
        }

        //populate the columns and get all the tokens
        getTokensRequest();
        getUsersRequest();
        getGamesRequest();

        //run routine requests to update the columns in anything changes
        setInterval(getUsersRequest, refresh_rate);
        setInterval(getGamesRequest, refresh_rate);

    }

    loadHomePage();

    /*****************************************************************************/
    /* GET TOKENS
    /*****************************************************************************/

    function getTokensRequest() {

        show_preloader();

        $.ajax({

            url : '/getTokens',

            type: 'GET',

            cache: false,

            dataType : 'json',

            error : function(xmlhttprequest, textstatus, message) {

                hide_preloader();

                $('#note').text('Something went wrong on the server!');

            },

            success : function(tokens) {

                hide_preloader();

                if(tokens) {

                    for(var key in tokens) {

                        all_tokens[tokens[key].id] = tokens[key];

                    }

                } else {
                    createPopup('Error', 'No game can start, because no tokens were returned by the server!', [{ txt: 'ok', action: closePopupOverlay}]);
                }

            }

        });

    }

    /*****************************************************************************/
    /* POPULATING COLUMN 1
    /*****************************************************************************/

    function updateStats(obj) {

        var col = $('#col1');

        col.find('div').not('.title').remove();

        if(obj['username']) {

            var dots_a = obj.username.length > 10 ? '...' : '',
                dots_b = obj.email.length > 10 ? '...' : '',
                is_active = all_users[obj.id] ? 'yes' : 'no',   //can change to something cooler
                is_active_txt = all_users[obj.id] ? 'yes' : 'no';

            $('<div>').appendTo(col).append($('<span>').addClass('t').text('Username: ')).append($('<span>').addClass('c').text(obj.username.substring(0, 10) + dots_a).attr('title', obj.username));
            $('<div>').appendTo(col).append($('<span>').addClass('t').text('Email: ')).append($('<span>').addClass('c').text(obj.email.substring(0, 10) + dots_b).attr('title', obj.email));
            $('<div>').appendTo(col).append($('<span>').addClass('t').text('Active: ')).append($('<span>').addClass('c').append(is_active).attr('title', is_active_txt));
            $('<div>').appendTo(col).append($('<span>').addClass('t').text('Token: ')).append($('<span>').addClass('tk').addClass(all_tokens[obj.token_id].name).attr('title', all_tokens[obj.token_id].description));
            $('<div>').appendTo(col).append($('<span>').addClass('t').text('Games won: ')).append($('<span>').addClass('c').text(0));
            $('<div>').appendTo(col).append($('<span>').addClass('t').text('Games lost: ')).append($('<span>').addClass('c').text(0));

        } else if(obj['size_x']) {

            var creator_name = all_users_list[obj.creator_id].username,
                dots_a = obj.name.length > 15 ? '...' : '',
                dots_b = creator_name.length > 10 ? '...' : '',
                is_active = all_users[obj.id] ? 'yes' : 'no',   //can change to something cooler
                is_active_txt = all_users[obj.id] ? 'yes' : 'no';

            $('<div>').appendTo(col).append($('<span>').addClass('t').text('Game: ')).append($('<span>').addClass('c').text(obj.name.substring(0, 15) + dots_a).attr('title', obj.name));
            $('<div>').appendTo(col).append($('<span>').addClass('t').text('Created by: ')).append($('<span>').addClass('c').text(creator_name.substring(0, 10) + dots_b).attr('title', creator_name));
            $('<div>').appendTo(col).append($('<span>').addClass('t').text('Board width: ')).append($('<span>').addClass('c').text(obj.size_x).attr('title', obj.size_x));
            $('<div>').appendTo(col).append($('<span>').addClass('t').text('Board height: ')).append($('<span>').addClass('c').text(obj.size_y).attr('title', obj.size_y));

            //leaving the game, only available if has joined the game
            if(true) {

                $('<div>').appendTo(col).append($('<a>').addClass('btn').text('Leave the game').on('click', function(game) {

                    return function() {

                        alert('leaving game: ' + game.name + '=' + game.id);

                    }

                }(obj)));

            }

            //starting the game, only available if the creator of the game
            if(all_users[obj.creator_id]) {

                $('<div>').appendTo(col).append($('<a>').addClass('btn').text('Start the game').on('click', function(game) {

                    return function() {

                        alert('starting game: ' + game.name + '=' + game.id);

                    }

                }(obj)));

            }

        }

    }

    /*****************************************************************************/
    /* POPULATING COLUMN 2  (GETTING ALL USERS)
    /*****************************************************************************/

    function getUsersRequest() {

        //show_preloader();

        $.ajax({

            url : '/getUsers',

            type: 'GET',

            cache: false,

            dataType : 'json',

            error : function(xmlhttprequest, textstatus, message) {

                //hide_preloader();

                $('#note').text('Something went wrong on the server!');

            },

            success : function(users) {

                //hide_preloader();

                if(users) {

                    var len = users.length,
                        col = $('#col2');

                    col.find('div').not('.title').remove();

                    for(var i=0; i<len; i++) {

                        var row = $('<div>').appendTo(col).append($('<a>').addClass('u').text(users[i].username).click(function(user) {

                            return function(e) {

                                e.preventDefault();

                                updateStats(user);

                            };

                        }(users[i])));

                        all_users_list[users[i].id] = users[i];

                        if(all_users[users[i].id]) { row.addClass('logged'); }

                    }

                }


            }

        });

    }

    /*****************************************************************************/
    /* POPULATING COLUMN 3  (GETTING ALL GAMES)
     /*****************************************************************************/

    function getGamesRequest() {

        //show_preloader();

        $.ajax({

            url : '/getGames',

            type: 'GET',

            cache: false,

            dataType : 'json',

            error : function(xmlhttprequest, textstatus, message) {

                //hide_preloader();

                $('#note').text('Something went wrong on the server!');

            },

            success : function(games) {

                //hide_preloader();
console.log('gameeee');
console.log(games);
                if(games) {

                    var len = games.length,
                        col = $('#col3'),
                        curr_sel = col.find('.selected a').attr('data-id');

                    col.find('div').not('.title').remove();

                    for(var i=0; i<len; i++) {

                        var dots = games[i].name.length > 10 ? '...' : '';

                        var row = $('<div>').appendTo(col).append($('<a>').addClass('g').text('(' + games[i].size_x + 'x' + games[i].size_y + ') ' + games[i].name.substring(0, 10) + dots).attr({ 'data-id': games[i].id, 'data-creator': games[i].creator_id, 'title': games[i].name }));

                        if(curr_sel != 'undefined' && curr_sel == games[i].id) { row.addClass('selected'); }

                        row.click(function(game) {

                            return function(e) {

                                e.preventDefault();

                                //select the current element and enable the join game button
                                if(!$(this).hasClass('selected')) {

                                    col.find('.selected').removeClass('selected');
                                    $(this).addClass('selected');
                                    if(isLoggedIn()) { enableJoinGameBtn(); }

                                }

                                updateStats(game);

                            };

                        }(games[i]));

                        if(all_users[games[i].creator_id]) { row.addClass('logged'); }

                    }

                }


            }

        });

    }

    /*****************************************************************************/
    /* CREATING A USER
    /*****************************************************************************/

    function createUserPopup() {

        var btns = [{ txt: 'cancel', action: closePopupOverlay }, { txt: 'create', action: createUserRequest }];

        var form = $('<div>').addClass('form');

        $('<div>').appendTo(form).addClass('form-note').attr('id', 'note');
        $('<div>').appendTo(form).addClass('form-margin').append($('<label>').attr('for', 'username').text('Username'));
        $('<div>').appendTo(form).append($('<input>').attr({ 'id': 'username', 'type': 'text' }).addClass('form-control'));
        $('<div>').appendTo(form).addClass('form-margin').append($('<label>').attr('for', 'email').text('Email'));
        $('<div>').appendTo(form).append($('<input>').attr({ 'id': 'email', 'type': 'text' }).addClass('form-control'));
        $('<div>').appendTo(form).addClass('form-margin').append($('<label>').attr('for', 'password1').text('Password'));
        $('<div>').appendTo(form).append($('<input>').attr({ 'id': 'password1', 'type': 'password' }).addClass('form-control'));
        $('<div>').appendTo(form).addClass('form-margin').append($('<label>').attr('for', 'password2').text('Repeat Password'));
        $('<div>').appendTo(form).append($('<input>').attr({ 'id': 'password2', 'type': 'password' }).addClass('form-control'));

        createPopup('Create User', form, btns);

    }

    function createUserRequest() {

        var username = $('#username').val(),
            password1 = $('#password1').val(),
            password2 = $('#password2').val(),
            email = $('#email').val(),
            token = 1,
            validation = true;

        //reset error messages
        $('.form-border').each(function() { $(this).removeClass('form-border'); });
        $('#note').text('');

        if(!username || username.length < 3) {
            $('#username').addClass('form-border');
            validation = false;
        }

        if(email && !is_email(email)) {
            $('#email').addClass('form-border');
            validation = false;
        }

        if(!password1 || password1.length < 6) {
            $('#password1').addClass('form-border');
            validation = false;
        }

        if(!password2 || password2.length < 6) {
            $('#password2').addClass('form-border');
            validation = false;
        }

        if(validation && password1 != password2) {
            $('#note').text('Passwords don\'t match');
            validation = false;
        }

        if(validation) {

            var params = { username: username, pass: password1, email: email, token: token };

            $.ajax({

                url : '/createUser',

                type: 'POST',

                cache: false,

                data: params,

                dataType : 'json',

                error : function(xmlhttprequest, textstatus, message) {

                    $('#note').text('Something went wrong on the server!');

                },

                success : function(user) {

                    //update the global arrays
                    all_users[user.id] = user;
                    all_users_list[user.id] = user;

                    addUserToSession(user);

                    closePopupOverlay();

                }

            });

        }

    }

    /*****************************************************************************/
    /* ADDING A USER
    /*****************************************************************************/

    function loginPopup() {

        var btns = [{ txt: 'cancel', action: closePopupOverlay }, { txt: 'Add user', action: loginUserRequest }];

        var form = $('<div>').addClass('form');

        $('<div>').appendTo(form).addClass('form-note').attr('id', 'note');
        $('<div>').appendTo(form).addClass('form-margin').append($('<label>').attr('for', 'username').text('Username'));
        $('<div>').appendTo(form).append($('<input>').attr({ 'id': 'username', 'type': 'text' }).addClass('form-control'));
        $('<div>').appendTo(form).addClass('form-margin').append($('<label>').attr('for', 'password').text('Password'));
        $('<div>').appendTo(form).append($('<input>').attr({ 'id': 'password', 'type': 'password' }).addClass('form-control'));

        createPopup('Log In', form, btns);

    }

    function loginUserRequest() {

        var username = $('#username').val(),
            password = $('#password').val(),
            validation = true;

        //reset error messages
        $('.form-border').each(function() { $(this).removeClass('form-border'); });
        $('#note').text('');

        if(!username || username.length < 3) {
            $('#username').addClass('form-border');
            validation = false;
        }

        if(!password || password.length < 6) {
            $('#password').addClass('form-border');
            validation = false;
        }

        if(validation) {

            var params = { username: username, pass: password };

            show_preloader();

            $.ajax({

                url : '/loginUser',

                type: 'POST',

                cache: false,

                data: params,

                dataType : 'json',

                error : function(xmlhttprequest, textstatus, message) {

                    hide_preloader();

                    $('#note').text('Something went wrong on the server!');

                },

                success : function(user) {

                    hide_preloader();

                    if(user && !$.isEmptyObject(user)) {

                        //update the global arrays
                        all_users[user.id] = user;
                        all_users_list[user.id] = user;

                        addUserToSession(user);

                        closePopupOverlay();

                    } else {

                        $('#note').text('Invalid username or password.');

                    }

                }

            });

        }

    }

    /*****************************************************************************/
    /* CREATING A GAME
    /*****************************************************************************/

    function createGamePopup() {

        var btns = [{ txt: 'cancel', action: closePopupOverlay }, { txt: 'create', action: createGameRequest }];

        var form = $('<div>').addClass('form');

        $('<div>').appendTo(form).addClass('form-note').attr('id', 'note');

        var select = $('<select>').attr({ 'id': 'creator', 'type': 'text' }).addClass('form-control form-txt');

        //populate the select created above
        for(var key in all_users) {

            select.append($('<option>').val(all_users[key].id).text(all_users[key].username));

        }

        $('<div>').appendTo(form).addClass('form-margin').append($('<label>').attr('for', 'creator').text('Creator: ')).append(select);
        $('<div>').appendTo(form).addClass('form-margin').append($('<label>').attr('for', 'name').text('Name: '))
            .append($('<input>').attr({ 'id': 'name', 'type': 'text' }).addClass('form-control form-txt'));
        $('<div>').appendTo(form).addClass('form-margin').append($('<label>').attr('for', 'size_x').text('Board width: '))
                                                         .append($('<input>').attr({ 'id': 'size_x', 'type': 'text' }).addClass('form-control form-num'))
                                                         .append($('<span>').text(' ( ' + board_min_x + ' <= ' + 'x' + ' <= ' + board_max_x + ' )' ));
        $('<div>').appendTo(form).addClass('form-margin').append($('<label>').attr('for', 'size_y').text('Board height: '))
                                                         .append($('<input>').attr({ 'id': 'size_y', 'type': 'text' }).addClass('form-control form-num'))
                                                         .append($('<span>').text(' ( ' + board_min_y + ' <= ' + 'y' + ' <= ' + board_max_y + ' )' ));

        createPopup('Create Game', form, btns);

    }

    function createGameRequest() {

        var user_id = $('#creator :selected').val(),
            name = $('#name').val().trim(),
            x = $('#size_x').val(),
            y = $('#size_y').val(),
            validation = true;

        //reset error messages
        $('.form-border').each(function() { $(this).removeClass('form-border'); });
        $('#note').text('');

        if(!user_id || !is_int(user_id)) {
            $('#creator').addClass('form-border');
            validation = false;
        }

        if(!name || name.length < 3) {
            $('#name').addClass('form-border');
            validation = false;
        }

        if(!x || !(x >= board_min_x && x <= board_max_x) || !is_int(x)) {
            $('#size_x').addClass('form-border');
            validation = false;
        }

        if(!y || !(y >= board_min_y && y <= board_max_y) || !is_int(y)) {
            $('#size_y').addClass('form-border');
            validation = false;
        }

        if(validation) {

            var params = { user_id: user_id, name: name, x: x, y: y };
            console.log('created game pppp');
            console.log( params );
            show_preloader();

            $.ajax({

                url : '/createGame',

                type: 'POST',

                cache: false,

                data: params,

                dataType : 'json',

                error : function(xmlhttprequest, textstatus, message) {

                    hide_preloader();

                    $('#note').text('Something went wrong on the server!');

                },

                success : function(game) {

                    hide_preloader();

                    console.log('created game');
                    console.log( game );

                    closePopupOverlay();

                }

            });

        }

    }

    /*****************************************************************************/
    /* JOIN A GAME
    /*****************************************************************************/

    function joinGamePopup() {

       var game_sel = $('#col3 .selected a'),
           game_id = game_sel.attr('data-id'),
           game_name = game_sel.attr('title'),
           creator_id = game_sel.attr('data-creator'),
           counter = 0;

        var select = $('<select>').attr({ 'id': 'joining_player', 'type': 'text' }).addClass('form-control form-txt');

        //populate the select created above
        for(var key in all_users) {

            if(creator_id != all_users[key].id) { select.append($('<option>').val(all_users[key].id).text(all_users[key].username)); counter++; }

        }

        //Show notice that the creator can't join their own game
        if(counter === 0) {
            createPopup('Notice', 'You have created this game. You have already joined.', [{ txt: 'ok', action: closePopupOverlay}]);
            return;
        }

        var btns = [{ txt: 'cancel', action: closePopupOverlay }, { txt: 'join', action: joinGameRequest }];

        var form = $('<div>').addClass('form');

        $('<div>').appendTo(form).addClass('form-note').attr('id', 'note');

        $('<div>').appendTo(form).addClass('form-margin').append($('<label>').attr('for', 'joining_player').text('Player to join: ')).append(select);

        $('<div>').appendTo(form).addClass('form-margin').append($('<input>').attr({ 'type': 'hidden', 'id': 'game_id', 'value': game_id }));

        $('<div>').appendTo(form).addClass('form-margin').text('Are you sure that you want to join game: ' + game_name);

        createPopup('Join Game', form, btns);

    }

    function joinGameRequest() {

        var user_id = $('#joining_player').val(),
            game_id = $('#game_id').val(),
            validation = true;

        //reset error messages
        $('.form-border').each(function() { $(this).removeClass('form-border'); });
        $('#note').text('');

        if(!user_id || !is_int(user_id)) {
            $('#user_id').addClass('form-border');
            validation = false;
        }

        if(validation) {

            var params = { game_id: game_id, user_id: user_id };

            show_preloader();

            $.ajax({

                url : '/joinGame',

                type: 'POST',

                cache: false,

                data: params,

                dataType : 'json',

                error : function(xmlhttprequest, textstatus, message) {

                    hide_preloader();

                    $('#note').text('Something went wrong on the server!');

                },

                success : function(status) {

                    hide_preloader();

                    console.log('joining game');
                    console.log( status );

                    closePopupOverlay();

                }

            });

        }

    }

    /*****************************************************************************/
    /* SESSION HANDLERS
    /*****************************************************************************/

    function clearSession() {

        //update the global arrays
        all_users = {};

        sessionStorage.setItem('users', JSON.stringify(null));

        disableCreateGameBtn();
        disableJoinGameBtn();
        disableLogoutBtn();

    }

    function getUsersFromSession() {

        var users = sessionStorage.getItem('users');

        if(users && users != 'null') {

            users = JSON.parse(users);

        } else {

            users = null;

        }

        if(users) { enableLogoutBtn(); enableCreateGameBtn(); }

        return {};

    }

    function addUserToSession(user) {

        var users = sessionStorage.getItem('users');

        if(users && users != 'null') {

            users = JSON.parse(users);

        } else {

            users = {};

        }

        //enable the create game button and the log out button if not enabled already
        enableCreateGameBtn();
        enableLogoutBtn();

        users[user.id] = user;

        sessionStorage.setItem('users', JSON.stringify(users));

    }

    /*****************************************************************************/
    /* MENU BUTTON ENABLERs AND DISABLERS
    /*****************************************************************************/

    function enableLogoutBtn() {
        if($('#logout_btn').hasClass('disabled')) { $('#logout_btn').removeClass('disabled').on('click', clearSession); }
    }

    function disableLogoutBtn() {
        if(!$('#logout_btn').hasClass('disabled')) { $('#logout_btn').addClass('disabled').off('click'); }
    }

    function enableCreateGameBtn() {
        if($('#cgame_btn').hasClass('disabled')) { $('#cgame_btn').removeClass('disabled').on('click', createGamePopup); }
    }

    function disableCreateGameBtn() {
        if(!$('#cgame_btn').hasClass('disabled')) { $('#cgame_btn').addClass('disabled').off('click'); }
    }

    function enableJoinGameBtn() {
        if($('#jgame_btn').hasClass('disabled')) { $('#jgame_btn').removeClass('disabled').on('click', joinGamePopup); }
    }

    function disableJoinGameBtn() {
        if(!$('#jgame_btn').hasClass('disabled')) { $('#jgame_btn').addClass('disabled').off('click'); }
    }

});