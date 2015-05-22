/*
 * Copyright 2015, Gregg Tavares.
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are
 * met:
 *
 *     * Redistributions of source code must retain the above copyright
 * notice, this list of conditions and the following disclaimer.
 *     * Redistributions in binary form must reproduce the above
 * copyright notice, this list of conditions and the following disclaimer
 * in the documentation and/or other materials provided with the
 * distribution.
 *     * Neither the name of Gregg Tavares. nor the names of its
 * contributors may be used to endorse or promote products derived from
 * this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
 * "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
 * LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
 * A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT
 * OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
 * SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
 * LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
 * DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
 * THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */
"use strict";

// Require will call this with GameServer, gameSupport, and Misc once
// gameserver.js, gamesupport.js, and misc.js have loaded.

// Start the main app logic.
requirejs([
    'hft/gameserver',
    'hft/gamesupport',
    'hft/misc/misc',
    '../3rdparty/chroma.min',
  ], function(
    GameServer,
    gameSupport,
    misc,
    chroma) {
  var canvas = document.getElementById("playfield");
  var ctx = canvas.getContext("2d");
  var players = [];
  var globals = {
    size: 32,
    speed: 256,
  };
  misc.applyUrlSettings(globals);

  function pickRandomPosition() {
    return {
      x: 30 + misc.randInt(canvas.width  - 60),
      y: 30 + misc.randInt(canvas.height - 60),
    };
  }

  function wrap(value, max, edgeSize) {
    if (value < -edgeSize) {
      value = max + edgeSize - 1;
    } else if (value > max + edgeSize) {
      value = -edgeSize + 1;
    }
    return value;
  }

  var Goal = function() {
    this.pickGoal();
    this.radiusesSquared = globals.size * 2 * globals.size;
  };

  Goal.prototype.pickGoal = function() {
    this.position = pickRandomPosition();
  };

  Goal.prototype.hit = function(otherPosition) {
    var dx = otherPosition.x - this.position.x;
    var dy = otherPosition.y - this.position.y;
    return dx * dx + dy * dy < this.radiusesSquared;
  };

  var Player = function(netPlayer, name) {
    this.netPlayer = netPlayer;
    this.name = name;
    this.position = pickRandomPosition();

    // NOTE: the problem with picking a random color
    // is we get similar colors quite often. It
    // might be better to pick a random starting color
    // and then offset at least 20 degrees each time
    // or some other heuristic to try to not have like
    // colors
    var hue = misc.randInt(360);
    var saturation = 0.4;
    var value = 1;
    this.color = chroma.hsv(hue, saturation, value).hex();
    this.buttonState = [ false, false ];

    netPlayer.addEventListener('disconnect', Player.prototype.disconnect.bind(this));
    netPlayer.addEventListener('button', Player.prototype.handleButton.bind(this));

    // Send the color to the controller.
    this.netPlayer.sendCmd('color', { color: this.color });
  };

  // The player disconnected.
  Player.prototype.disconnect = function() {
    var ndx = players.indexOf(this);
    if (ndx >= 0) {
      players.splice(ndx, 1);
    }
  };

  Player.prototype.handleButton = function(data) {
    this.buttonState[data.id] = data.pressed;
  };

  Player.prototype.process = function(deltaTime) {
    var speed = globals.speed * deltaTime;
    // Move them constantly
    this.position.x += this.buttonState[0] ? -speed : speed;
    this.position.y += this.buttonState[1] ? -speed : speed;

    // Wrap at edges
    this.position.x = wrap(this.position.x, canvas.width, globals.size);
    this.position.y = wrap(this.position.y, canvas.height, globals.size);

    if (goal.hit(this.position)) {
      goal.pickGoal();
    }
  };

  var server = new GameServer();
  gameSupport.init(server, globals);

  var goal = new Goal();

  // A new player has arrived.
  server.addEventListener('playerconnect', function(netPlayer, name) {
    players.push(new Player(netPlayer, name));
  });

  function drawItem(position, color) {
    ctx.fillStyle = color;
    ctx.fillRect(
      position.x - globals.size * 0.5,
      position.y - globals.size * 0.5,
        globals.size,
        globals.size);
  };

  function render() {
    misc.resize(canvas);
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    players.forEach(function(player) {
      player.process(globals.elapsedTime);
    });
    players.forEach(function(player) {
      drawItem(player.position, player.color);
    });
    drawItem(goal.position, (globals.frameCount & 4) ? "red" : "pink");
  };
  gameSupport.run(globals, render);
});


