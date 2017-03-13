<?php

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    return view('index');
});

Route::get('getTokens', ['as' => 'get.tokens', 'uses' => 'GameController@getTokens']);
Route::get('getGames', ['as' => 'get.games', 'uses' => 'GameController@getNotStartedGames']);
Route::post('createGame', ['as' => 'create.game', 'uses' => 'GameController@createGame']);
Route::post('joinGame', ['as' => 'join.game', 'uses' => 'GameController@joinGame']);

Route::get('getUsers', ['as' => 'get.users', 'uses' => 'UserController@getUsers']);
Route::post('createUser', ['as' => 'create.user', 'uses' => 'UserController@createUser']);
Route::post('loginUser', ['as' => 'login.user', 'uses' => 'UserController@loginUser']);