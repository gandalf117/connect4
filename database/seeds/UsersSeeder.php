<?php

use Illuminate\Database\Seeder;

use App\UserModel;

class UsersSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {

        for($i=1; $i<=10; $i++) {

            $item = new UserModel();
            $item->username = 'user '.$i;
            $item->password = 'f4542db9ba30f7958ae42c113dd87ad21fb2eddb';
            $item->email = 'exampleEmail_'.$i.'@mail.com';
            $item->token_id = $i;
            $item->save();

        }

    }
}
