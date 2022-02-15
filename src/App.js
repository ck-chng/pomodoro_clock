import React, { Component } from 'react';
import './App.css';
import Container from 'react-bootstrap/Container';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      togglePlay: true,
      playing: false,
      status: 'working',
      count: 1500,
      breakSeconds: 300,
      time: {
        "m": 25,
        "s": '00'
      },
      break: {
        "m": 5,
        "s": '00'
      }
    };
  this.clearer = 0;
  this.breakClearer = 0;
  this.initialCount = this.state.count;
  this.initialMinute = Math.floor(this.state.count / 60);
  this.initialBreakSeconds = this.state.breakSeconds;
  this.initialBreakMinute = Math.floor(this.state.breakSeconds / 60);
  this.onToggle = this.onToggle.bind(this);
  this.resetTimer = this.resetTimer.bind(this);
  this.timer = this.timer.bind(this);
  this.breakTimer = this.breakTimer.bind(this);
  this.handleIncrement = this.handleIncrement.bind(this);
  this.handleDecrement = this.handleDecrement.bind(this);
  this.handleRestart = this.handleRestart.bind(this);
  this.secondsToTime = this.secondsToTime.bind(this);
  };

  
  onToggle(e) {
    this.setState({
      togglePlay: !this.state.togglePlay,
      playing: !this.state.playing
    }, () => {
      this.resetTimer()
    });
   
  };
  
  handleIncrement(e) {
    if(this.state.playing == false) {
      switch(e.target.id) {
        case "break-increment": 
          if(this.state.breakSeconds <= 3540) {
            let currentBreakSeconds = Math.ceil((this.state.breakSeconds + 60)/60)*60;
            this.initialBreakMinute = currentBreakSeconds / 60;
            this.initialBreakSeconds = currentBreakSeconds;
            let breakLeft = this.secondsToTime(currentBreakSeconds);
            this.setState({
              breakSeconds: currentBreakSeconds,
              break: breakLeft
            });
          };
          /* this.setState({
            breakSeconds: this.state.breakSeconds + 60
          }, () => {
            this.initialBreakSeconds = this.state.breakSeconds
          }); */
          break;
        default :
          if(this.state.count <= 3540) {
            let currentCount= Math.ceil((this.state.count + 60)/60)*60;
            this.initialMinute = currentCount / 60;
            this.initialCount = currentCount;
            let timeLeft = this.secondsToTime(currentCount);
            this.setState({
              count: currentCount,
              time: timeLeft
            });
          };
      }

    }

  };
  
  handleDecrement(e) {
    if(this.state.playing == false) {
      switch(e.target.id) {
        case "break-decrement": 
         if(this.state.breakSeconds > 60) {
              let currentBreakSeconds= Math.ceil((this.state.breakSeconds - 60)/60)*60;
              this.initialBreakMinute = currentBreakSeconds / 60;
              this.initialBreakSeconds = currentBreakSeconds;
              let breakLeft = this.secondsToTime(currentBreakSeconds);
              this.setState({
                breakSeconds: currentBreakSeconds,
                break: breakLeft
              });
            };
         break;
/*           if(this.state.breakSeconds > 0) {
            this.setState({
            breakSeconds: this.state.breakSeconds - 60
          }, () => {
              this.initialBreakSeconds = this.state.breakSeconds
            });
          }; */
        default :
          if(this.state.count > 60) {
            let currentCount= Math.ceil((this.state.count - 60)/60)*60;
            this.initialMinute = currentCount / 60;
            this.initialCount = currentCount;
            let timeLeft = this.secondsToTime(currentCount);
            this.setState({
              count: currentCount,
              time: timeLeft
            });
          }
      }
    }
  };
  
  resetTimer() {
    if(this.state.status == 'working') {
      if(this.state.playing) {
        this.clearer = setInterval(this.timer, 1000);
      } else if(!this.state.playing) {
        clearInterval(this.clearer);
      }
    } else if(this.state.status == 'breakTime') {
        if(this.state.playing) {
          this.breakClearer = setInterval(this.breakTimer, 1000);
        } else if(!this.state.playing) {
          clearInterval(this.breakClearer);
      }
    }

  };
  
  timer() {
    let count = this.state.count;
    count --;
    let timeLeft = this.secondsToTime(count);
    this.setState({
      count: count,
      time: timeLeft
    });
    if(this.state.count <= 0) {
      clearInterval(this.clearer);
      this.setState({
        count: this.initialCount,
        status: 'breakTime'
      });
      const clip = document.getElementById("beep");
      clip.currentTime = 0;
      clip.play();
      this.resetTimer();
      /* setTimeout(this.resetTimer, this.initialBreakSeconds) */
    };
  }
  
  
  breakTimer() {
    let breakSeconds= this.state.breakSeconds;
    breakSeconds --;
    let breakLeft = this.secondsToTime(breakSeconds);
    this.setState({
      breakSeconds: breakSeconds,
      break: breakLeft
    });
    if(this.state.breakSeconds <= 0) {
      clearInterval(this.breakClearer);
      this.setState({
        breakSeconds: this.initialBreakSeconds,
        status: 'working'
      }, () => {
        this.resetTimer();
      });
    };
  }
  
 secondsToTime(secs){
    let divisor_for_minutes = secs % (60 * 60);
    let minutes = Math.floor(divisor_for_minutes / 60);

    let divisor_for_seconds = divisor_for_minutes % 60;
    let seconds = Math.ceil(divisor_for_seconds);

    if(secs == 3600) {
      minutes = 60
    }
   
    let obj = {
        "m": minutes < 10 ? '0' + minutes: minutes,
        "s": seconds < 10 ? '0' + seconds: seconds
    };
    return obj;
  };
  
  handleRestart() {
    clearInterval(this.clearer);
    clearInterval(this.breakClearer);

    this.setState({
      togglePlay: true,
      playing: false,
      status: 'working',
      count: 1500,
      breakSeconds: 300,
      time: {
        "m": 25,
        "s": '00'
      },
      break: {
        "m": 5,
        "s": '00'
      }
    });
    this.initialCount = 1500;
    this.initialMinute = 25;
    this.initialBreakSeconds = 300;
    this.initialBreakMinute = 5;
    const clip = document.getElementById("beep");
    clip.pause();
  }
  
  
  render() {
    return (
      <Container id="pomodoro-clock" fluid={true}>
      <div id="main">
        <h1 style={{color: "white"}} id="title">Pomodoro Clock</h1>
        <div id="break-session">
          <div id="break">
            <h3 style={{color: "white"}} id="break-label">Break Length</h3>
            <div className="control">
              <button className="add-minus">
                <i onClick={this.handleIncrement} className="fas fa-plus" id="break-increment"/>
              </button>
              <p id="break-length">{this.initialBreakMinute}</p>
              <button className="add-minus">
                <i onClick={this.handleDecrement} className="fas fa-minus" id="break-decrement"/>
              </button>
            </div>
          </div>
          <div id="session">
            <h3 style={{color: "white"}} id="session-label">Session Length</h3>
            <div className="control">
              <button className="add-minus">
                <i onClick={this.handleIncrement} className="fas fa-plus" id="session-increment"></i>
              </button>
              <p id="session-length">{this.initialMinute}</p>
              <button className="add-minus">
                <i onClick={this.handleDecrement} className="fas fa-minus" id="session-decrement"></i>
              </button>
            </div>
          </div>
        </div>
        <div id="timer-container">
          <h3 id="timer-label">{this.state.status == 'working' ? 'Session' : 'Break'}</h3>
          <h1 className="time-left">{this.state.status == 'working' ? this.state.time.m : this.state.break.m}:{this.state.status == 'working' ? this.state.time.s : this.state.break.s}</h1>
        </div>
        <div id="play-pause-restart">
          <div className="start-button-wrapper">
          <button onClick={this.onToggle} id="start-stop">
            {this.state.togglePlay ? <h5>START</h5>: <h5>PAUSE</h5> }
          </button> 
          </div>
          <div className="reset-button-wrapper">
          <button style={{color: "white"}} onClick={this.handleRestart} id="reset"> 
            <i className="fas fa-redo fa-2x"></i>
          </button>
          </div>
          <audio id="beep" src="https://raw.githubusercontent.com/freeCodeCamp/cdn/master/build/testable-projects-fcc/audio/BeepSound.wav" />
        </div>

         
      </div>
      </Container>
    );
  };
  
  
  
}

export default App;