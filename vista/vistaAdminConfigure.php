<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <link rel="stylesheet" href="vista/css/vistaAdminConfigure.css">
</head>
<body>
    <label for="players">Number of players</label>
    <input type="number" id="nPlayers" name="nPlayers" min="2">
    <br>
    <label for="mode">Mode</label>
    <select>
        <option value="stars">Star collector</option>
        <option value="time">Time trial</option>
    </select>
    <br>
    <label for="timer">Timer</label>
    <input type="number" id="timer" name="timer" min="1">
    <br>
    <button id="start" name="start">START</button>

</body>
</html>