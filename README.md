HFT-2-BUTTON-GAMEJAM
====================

This is a template for the [Pico Pico Cafe](http://picopicocafe.com) [HappyFunTimes](http://docs.happyfuntimes.net) 2 button gamejam

<img src="screenshot.png" />

## Terse Instructions

1.  [Download and install HappyFunTimes](http://superhappyfuntimes.net/install)
2.  clone or download this repo

    to clone

        git clone https://github.com/greggman/hft-2-button-gamejam.git

    [to download click here](https://github.com/greggman/hft-2-button-gamejam/archive/master.zip)

3.  open a terminal / command prompt and type

        cd <path-where-you-cloned-or-unzipped-template>
        hft add

4.  Run HappyFunTimes.

    You should a simple 2 button game. Click it. Open another
    browser window (Ctrl-N or Cmd-N), size it so you can see
    both windows, in the new window go to `http://localhost:18679`.

    You should see 2 button controller appear. You can use the left
    and right keys to press the buttons

    *   Pull out your smartphone
    *   Make sure it's **on the same WiFi as your computer**.
    *   On your phone's browser go to `http://happfuntimes.net`

    The phone should connect. Since it's a gamejam you'll likely
    see a list of systems to choose from. They default to the name
    of your computer so pick yours.

## Short Docs

For the game jam you pretty much just want to edit `scripts/game.js`.
Look inside, it should hopefully be clear how it works.

You'll see a `Player` class. You'll see some code that creates
a new player anytime a player connects and some other code that
deletes a player when they disconnect.

Otherwise this particlar game each player just moves constantly.
The state of each button is in `this.buttonState[0]` and
`this.buttonState[1]`.

There's one example of sending a message to the controller. When
a player starts it picks a random color and sends that color to
the controller. The controller then colorizes itself to match.

Use that as a template if you want to send more messages to the
controller.

This sample is using the HTML5 canvas 2d api. It's easy but it's
often slow. If you'd like help loading images and using them
or using WebGL for either 2d or 3d just ask.

## Setting your game's name

It would be nice if you'd pick name and id for you game.

Edit `package.json` and change the `name`, `description` and `id`

You can type `hft check` to make sure everything is ok, or just ask.

This has no impact for the jam probably. It's just nice to edit it
now before we forget.

