<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Token;
use App\Game;
use App\UserGame;

class GameController extends Controller
{

    public function getTokens() {

        $tokens = Token::all();

        return response()->json($tokens);

    }

    public function getNotStartedGames() {

        $games = Game::with('users')->where('winner', null)->get();

        return response()->json($games);

    }

    public function createGame(Request $request) {

        $this->validate($request, array(
            'name'  => 'required',
            'user_id'  => 'required',
            'x'  => 'required',
            'y'  => 'required',
        ));

        $user_id = $request->input('user_id');

        $game = new Game();
        $game->creator_id = $user_id;
        $game->name = $request->name;
        $game->size_x = $request->x;
        $game->size_y = $request->y;
        $game->turn = $user_id;
        $game->timing = null;
        $game->save();

        $ugame = new UserGame();
        $ugame->game_id = $game->id;
        $ugame->user_id = $game->creator_id;
        $ugame->save();

        return response()->json($game);

    }

    public function joinGame(Request $request) {

        $this->validate($request, array(
            'game_id'  => 'required',
            'user_id'  => 'required',
        ));

        $ugame = new UserGame();
        $ugame->game_id = $request->game_id;
        $ugame->user_id = $request->user_id;
        $ugame->save();

        return response()->json('success');

    }

    public function makeMove(Request $request) {

        $this->validate($request, array(
            'game_id'  => 'required',
            'col_index'  => 'required',
            'user_id'  => 'required',
            'user_key'  => 'required',
        ));

        $game_id = $request->game_id;
        $col_index = $request->col_index;
        $user_id = $request->user_id;
        $user_key = $request->user_key;

        //validate user
        $used = UserModel::where('id', $user_id)->where('password', $user_key)->first();

        if(!$used) {
            return response()->json(-1);
        }

        //validate turn
        $game = Game::where('id', $game_id)->where('turn', $user_id)->first();

        if(!$game) {
            return response()->json(-2);
        }

        //validate move
        $move_v = true;

        if(!$move_v) {
            return response()->json(-3);
        }

        //save move
        $move = new Move();
        $move->game_id = $game_id;
        $move->user_id = $user_id;
        $move->col_index = $col_index;
        $move->save();

        //update turn
        //Game::where('id', $game_id)->where('turn', $user_id)->update(['turn' => 2]);;

        return response()->json();

    }

}
