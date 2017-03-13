<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Token extends Model
{

    protected $table = 'tokens';

    public function users() {

        return $this->hasMany('App\UserModel');

    }
}
