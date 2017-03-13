<?php

use Illuminate\Database\Seeder;

use App\Token;

class TokenSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {

        for($i=1; $i<=10; $i++) {

            $item = new Token();
            $item->name = 'token'.$i;
            $item->description = '';
            $item->save();

        }


    }
}
