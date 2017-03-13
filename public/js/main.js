$(function() {

    var params = { game_id: 1023 , size_x: 7, size_y: 6 };

    var board = $('#board'),
        board_obj = [],
        token_class = 'token1',
        default_w = 50,
        default_h = 50,
        default_token_w = 40,
        default_token_h = 40,
        default_token_t = (default_w - default_token_w) /2, //token top margin, helps in centering it
        default_token_l = (default_h - default_token_h) /2, //token left margin, helps in centering it
        default_drop_speed = 200;   //drop speed per cell in milliseconds

    function createBoard(params) {

        var x = params.size_x,
            y = params.size_y,
            i,
            j;

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

    function columnClickEvent(ind) {

        var curr_col = board.find('.col:eq('+ind+')');

        var col_len = getColLength(ind);

        var col_pos = getColNextPos(ind);

        var speed = default_drop_speed;

        //proceed only if there is more space on this column

        if(col_pos >= 0) {

            var h = curr_col.height() - default_h * (col_len + 1);

            var token_temp = board.find('.token-temp').removeClass('token-temp-hover');
            var token_class = token_temp.attr('data-cl');

            token_temp.animate({
                top: h
            }, speed, function() {

                token_temp.remove();

                board_obj[ind][col_pos] = 1;

                var new_token = $('<div>').addClass(token_class).css({ width: default_token_w + 'px', height: default_token_h + 'px', 'margin-top': default_token_t + 'px', 'margin-left': default_token_l + 'px' });

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

    function createGame() {

        var params = { username: 'tester', size_x: 7, size_y: 6, timing: null };

        var validation = true;

        if(validation) {

            $.ajax({

                url : '/createGame',

                type: 'POST',

                cache: false,

                data: params,

                dataType : 'json',

                error : function(xmlhttprequest, textstatus, message) {
                    $('#note').text('Something went wrong on the server!');
                },

                success : function(game) {

                    if(true) {

                        console.log("DSLKDSKL");
                        console.log( game );
                        createBoard(game);

                    }

                }

            });

        }

    }

    createGame();

});