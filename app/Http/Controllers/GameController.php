<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Game;

class GameController extends Controller
{

    public function createGame(Request $request) {

        $user_name = $request->input('username');
        $x = $request->input('size_x');
        $y = $request->input('size_y');
        $timing = $request->input('timing');

        $game = new Game();
        $game->creator = $user_name;
        $game->size_x = $x;
        $game->size_y = $y;
        $game->timing = $timing;
        $game->save();

        return response()->json($game);

    }

}
