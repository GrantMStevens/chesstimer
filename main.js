(function () {
  var gameLength = 240; // time in seconds
  var timers = [];
  var lastPlayer;
  var gameOver = false;

  var Timer = function (timerName) {
    // default game length
    this.secondsRemaining = gameLength;
    this.name = timerName;
  };


  Timer.prototype.runClock = function () {
    // if a player's timer has reached zero, award the game to the other player
    if (this.secondsRemaining < 1){
      this.stop();
      // iterate over the timers to find the player that doesnt match the current player's name
      timers.map(function(timer){
        if (timer.name !== this.name){
          setTimeout(function(){
            alert(timer.name + ' wins!');
          }, 0);
          gameOver = true;
          timer.elBtn.innerHTML = 'Winner';
        } else {
          timer.elBtn.innerHTML = 'Loser';
        }
      }.bind(this));
      return;
    }

    // keep track of timeout so we can kill it later
    this.timeout = setTimeout(this.runClock.bind(this), 1000);
    this.secondsRemaining--;

    // format time string
    this.elClock.innerHTML = formatClock(this.secondsRemaining);

    // change button value and class
    this.elBtn.className = this.elBtn.className.replace('inactive', 'active');
    this.elBtn.innerHTML = 'End Turn';
  };

  Timer.prototype.stop = function () {
    // kill the timeout so it will stop incrementing;
    window.clearTimeout(this.timeout);
    // set the tracked timeout to undefined so we know there is no clock running on this timer
    this.timeout = undefined;
    // change button value and class
    this.elBtn.className = this.elBtn.className.replace('active', 'inactive');
    this.elBtn.innerHTML = 'Waiting';

  };

  Timer.prototype.resetTimer = function () {
    // stop timer first, just in case it is running
    this.stop();
    // reset to default game length
    this.secondsRemaining = gameLength;
    // reset button value and set class back to default
    this.elBtn.innerHTML = 'Start';
    this.elBtn.className = this.elBtn.className.replace('inactive', '') + ' active';
    this.elClock.innerHTML = formatClock(this.secondsRemaining);
  };

  var turnButtonClicked = function (e) {
    lastPlayer = e.currentTarget.getAttribute('data-timer-name');

    timers.map(function (timer) {
      // stop the timer if the button clicked was for player who's turn was active
      if (timer.name === lastPlayer) {
        timer.stop();
      } else {
        // check if there is a timer running already. We don't want duplicate timers.
        if (!timer.timeout && !gameOver)
          // start the timer
          timer.runClock();
      }
    });
  };

  var resetButtonClicked = function () {
    gameOver = false;
    // iterate over timers and reset them
    timers.map(function (timer) {
      timer.resetTimer();
    })
  };

  var formatClock= function(seconds){
    // format seconds in to 0:00 format
    var minutes = Math.floor(seconds / 60);
    var seconds = seconds >= 60 ? (seconds % 60) : seconds;
    return (minutes < 1 ? '0' : minutes) + ':' + (seconds < 10 ? ('0' + seconds) : seconds);
  };

  window.onload = function () {
    /*
    get all of the HTML timer elements. The timer name comes from the id attribute
    on each element. This allows us to avoid hard coding the names in javascript.
     */
    var playerTimers = document.getElementsByClassName('timer');

    for (var i = 0; i < playerTimers.length; i++) {
      // create a new timer
      var timer = new Timer(playerTimers[i].id);
      // store a reference to the timer's clock
      timer.elClock = document.querySelector('#' + timer.name + ' h1');
      timer.elClock.innerHTML = formatClock(timer.secondsRemaining);
      // store a reference to the timer's button
      timer.elBtn = document.querySelector('#' + timer.name + ' button');
      // bind the onclick event for the timer's button;
      timer.elBtn.onclick = turnButtonClicked;
      timers.push(timer);
    }

    // bind the reset button's onclick event to the resetButtonClicked function
    var resetBtn = document.querySelector('.reset button');
    resetBtn.onclick = resetButtonClicked;
  };

})();