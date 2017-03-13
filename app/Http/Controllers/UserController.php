<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\UserModel;

class UserController extends Controller
{

    public function getUsers() {

        $users = UserModel::all();

        return response()->json($users);

    }

    public function createUser(Request $request) {

        $this->validate($request, array(
            'username'  => 'required',
            'pass'  => 'required',
            'token'  => 'required',
        ));

        $username = $request->username;
        $email = $request->email;
        $password = sha1($request->pass);
        $token = $request->token;

        $user = new UserModel();
        $user->username = $username;
        $user->email = $email;
        $user->password = $password;
        $user->token_id = $token;
        $user->save();

        return response()->json($user);

    }

    public function loginUser(Request $request) {

        $this->validate($request, array(
            'username'  => 'required',
            'pass'  => 'required',
        ));

        $username = $request->username;
        $password = sha1($request->pass);

        $user = UserModel::where('username', $username)->where('password', $password)->first();

        return response()->json($user);

    }

}
