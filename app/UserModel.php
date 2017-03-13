<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class UserModel extends Model
{

    protected $table = 'user_models';

    public function token() {

        return $this->belongsTo('App\Token', 'token_id', 'id');

    }

    public function games() {

        return $this->belongsToMany('App\Game', 'user_games', 'user_id', 'game_id');

    }

}
