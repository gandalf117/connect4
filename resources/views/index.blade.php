<!DOCTYPE html>
<html lang="{{ config('app.locale') }}">

    <head>

        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="csrf-token" content="{{ csrf_token() }}" />

        <title>connect4</title>

        <link rel="shortcut icon" type="image/ico" href="/images/favicon.ico"/>

        <!-- jQuery and bootstrap -->
        <script src="{{ URL::to('/js/app.js') }}"></script>

        <link rel="stylesheet" href="{{ URL::to('/css/app.css') }}">

        <script src="https://code.jquery.com/jquery-1.12.4.js"></script>
        <script src="https://code.jquery.com/ui/1.12.1/jquery-ui.js"></script>

        <script src="{{ URL::to('/js/custom-functions.js') }}"></script>
        <script src="{{ URL::to('/js/board.js') }}"></script>
        <script src="{{ URL::to('/js/home.js') }}"></script>

        <link rel="stylesheet" type="text/css" href="{{ URL::to('/css/main.css') }}">

        <!-- Fonts -->
        <link href="https://fonts.googleapis.com/css?family=Raleway:100,600" rel="stylesheet" type="text/css">

    </head>

    <body>

        <div class="main-container">

            <div class="game-container">

            </div>

        </div>

    </body>

</html>
