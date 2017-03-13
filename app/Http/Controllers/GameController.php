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

        $games = Game::where('turn', null)->where('winner', null)->get();

        return response()->json($games);

    }

    public function createGame(Request $request) {

        $this->validate($request, array(
            'name'  => 'required',
            'user_id'  => 'required',
            'x'  => 'required',
            'y'  => 'required',
        ));

        $game = new Game();
        $game->creator_id = $request->input('user_id');
        $game->name = $request->name;
        $game->size_x = $request->x;
        $game->size_y = $request->y;
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

}
