<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Game extends Model
{

    protected $table = 'games';

    public function users() {

        return $this->belongsToMany('App\UserModel', 'user_games', 'game_id', 'user_id');

    }

}
