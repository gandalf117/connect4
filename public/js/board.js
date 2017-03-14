
    var curr_game,
        curr_user_id,
        curr_user_key,
        board,
        board_obj,
        token_class,
        default_w = 75,
        default_h = 75,
        default_token_w = 65,
        default_token_h = 65,
        default_token_t = (default_w - default_token_w) /2, //token top margin, helps in centering it
        default_token_l = (default_h - default_token_h) /2, //token left margin, helps in centering it
        default_drop_speed = 200;   //drop speed per cell in milliseconds

    function getGameUser(id) {

        for(var key in curr_game.users) {

            if(curr_game.users[key].id == id) {

                return curr_game.users[key];

            }

        }

        return null;

    }

    function getNextUser(id) {

        var len = curr_game.users.length;

        for(var i=0; i<len; i++) {

            if(curr_game.users[i].id == id) {

                if(i+1<len) {
                    return curr_game.users[i+1];
                } else {
                    return curr_game.users[0];
                }

            }

        }

    }

    function createBoard(game) {

        setTopMargin(50);

        curr_game = game;

        //the creator always moves 1st
        curr_user_id = game.creator_id;

        board = $('<div>').appendTo(container).addClass('board').attr('id', 'board');

        board_obj = [];

        var x = game.size_x,
            y = game.size_y,
            i,
            j,
            token_id = getGameUser(curr_user_id).token_id;

        token_class = all_tokens[token_id].name;

        for(i=0; i<x; i++) {

            //create initialization array
            var init_arr = [];

            //create a column

            var col = $('<div>').addClass('col')
                        .on('mouseup', function(ind) { return function() { columnClickEvent(ind); } }(i) )
                        .on('mouseover', function(ind) { return function() { columnHoverEvent(ind); } }(i) );

            for(j=0; j<y; j++) {

                var cell = $('<div>').addClass('cell')
                            .css({ width: default_w + 'px', height: default_h + 'px' });

                col.append(cell);

                init_arr.push(0);

            }

            board.append(col);

            board_obj.push(init_arr);

        }

        //append back to homepage link
        container.append($('<div>').addClass('back-link').append($('<a>').text('<< Go back to home page').on('click', function() {

            clearPage();
            loadHomePage();

        })));

        //set left margin
        board.css('margin-left', (board.width() - default_w * x) / 2);

        console.log('Board object:');
        console.log(board_obj);

    }

    function columnHoverEvent(ind) {

        var curr_col = board.find('.col:eq('+ind+')');

        if(!curr_col.hasClass('selected')) {

            board.find('.selected').removeClass('selected');

            board.find('.token-temp-hover').remove();

            curr_col.addClass('selected');

            var token_temp = $('<div>').addClass(token_class).addClass('token-temp').addClass('token-temp-hover')
                            .css({ width: default_token_w + 'px', height: default_token_h + 'px', 'margin-top': default_token_t + 'px', 'margin-left': default_token_l + 'px' })
                            .attr('data-cl', token_class);

            curr_col.append(token_temp);

        }

    }

    /*function columnClickEvent(ind) {

        var curr_col = board.find('.col:eq('+ind+')');

        var col_len = getColLength(ind);

        var col_pos = getColNextPos(ind);

        var speed = default_drop_speed;

        //proceed only if there is more space on this column

        if(col_pos >= 0) {

            var h = curr_col.height() - default_h * (col_len + 1);

            var token_temp = board.find('.token-temp').removeClass('token-temp-hover');
            var token_cl = token_temp.attr('data-cl');

            token_temp.animate({
                top: h
            }, speed, function() {

                token_temp.remove();

                board_obj[ind][col_pos] = 1;

                var new_token = $('<div>').addClass(token_cl).css({ width: default_token_w + 'px', height: default_token_h + 'px', 'margin-top': default_token_t + 'px', 'margin-left': default_token_l + 'px' });

                curr_col.find('.cell:eq('+col_pos+')').append(new_token);

                //reset token icon
                if(token_class == 'token1') { token_class = 'token2'; } else { token_class = 'token1'; }

                //reset the column select class
                curr_col.removeClass('selected');
                columnHoverEvent(ind);

            });

        }

    }*/

    /*****************************************************************************/
    /* MAKING A MOVE
    /*****************************************************************************/

    function columnClickEvent(ind) {

        var params = { game_id: curr_game.id, col_index: ind+1, user_id: curr_user_id, user_key: curr_user_key };

        console.log(params);
        moveToken(ind);
        return;
        show_preloader();

        $.ajax({

            url : '/makeMove',

            type: 'POST',

            cache: false,

            data: params,

            dataType : 'json',

            error : function(xmlhttprequest, textstatus, message) {

                hide_preloader();

                createPopup('Error', 'Something went wrong on the server!', [{ txt: 'ok', action: closePopupOverlay}]);

            },

            success : function(move_status) {

                hide_preloader();

                //moveToken(ind);

            }

        });

    }

    function moveToken(ind) {

        var curr_col = board.find('.col:eq('+ind+')');

        var col_len = getColLength(ind);

        var col_pos = getColNextPos(ind);

        var speed = default_drop_speed;

        //proceed only if there is more space on this column

        if(col_pos >= 0) {

            var h = curr_col.height() - default_h * (col_len + 1);

            var token_temp = board.find('.token-temp').removeClass('token-temp-hover');
            var token_cl = token_temp.attr('data-cl');

            token_temp.animate({
                top: h
            }, speed, function() {

                token_temp.remove();

                //NOTE: should change
                curr_user_id = getNextUser(curr_user_id).id;

                token_id = getGameUser(curr_user_id).token_id;
                token_class = all_tokens[token_id].name;

                board_obj[ind][col_pos] = curr_user_id;

                var new_token = $('<div>').addClass(token_cl).css({ width: default_token_w + 'px', height: default_token_h + 'px', 'margin-top': default_token_t + 'px', 'margin-left': default_token_l + 'px' });

                curr_col.find('.cell:eq('+col_pos+')').append(new_token);

                //reset the column select class
                curr_col.removeClass('selected');
                columnHoverEvent(ind);

            });

        }

    }

    //gets the number of tokens currently in that column

    function getColLength(ind) {

        var len = board_obj[ind].length,
            i = 0,
            result = 0;

        while(i < len) {

            if(board_obj[ind][i] > 0) { result++; }

            i++;

        }

        return result;

    }

    //gets the index of the next empty spot (position) in the column

    function getColNextPos(ind) {

        var len = board_obj[ind].length,
            i = 0;

        while(i < len) {

            if(board_obj[ind][i] > 0) { break; }

            i++;

        }

        return i-1;

    }