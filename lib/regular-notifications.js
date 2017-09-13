'use babel';

import { CompositeDisposable } from 'atom';

export default {
  timerId: null,
  timerFlag: false,
  subscriptions: null,
  remainingDurationInSeconds: 0,

  config: {
    DurationInSeconds: {
      title: "Duration In Seconds",
      type: 'integer',
      default: 600,
    },
    NotificationText: {
      title: "Notification Text",
      type: "string",
      default: "Drink Water / Commit your changes"
    }
  },

  activate(state) {
    this.subscriptions = new CompositeDisposable();
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'regular-notifications:toggle': () => this.toggle()
    }));
  },

  deactivate() {
    this.subscriptions.dispose();
  },

  toggle() {
    if (this.timerFlag) {
      this.stopTimer();
      this.timerFlag = false;
    } else {
      this.startTimer();
      this.timerFlag = true;
    }
  },

  startTimer() {
    atom.notifications.addSuccess('Regular notifications enabled');

    this.remainingDurationInSeconds = atom.config.get('regular-notifications.DurationInSeconds');
    var timer_in_seconds = this.remainingDurationInSeconds % 60;
    var timer_in_minutes = (this.remainingDurationInSeconds - timer_in_seconds) / 60;
    var formated_timer = (timer_in_minutes > 0 ? timer_in_minutes + 'mins ' : '');
    if (timer_in_seconds) {
      formated_timer = formated_timer + timer_in_seconds + 'seconds';
    }
    atom.notifications.addInfo('You will receive your regular notifications every: <br/>' + formated_timer);

    this.timerId = window.setInterval(
      (function(self) {
        return function() {
          self.processTimer();
        };
      })(this), 1000);
    },

    processTimer() {
      if (this.remainingDurationInSeconds <= 0) {
        atom.notifications.addInfo(atom.config.get('regular-notifications.NotificationText'));
        this.remainingDurationInSeconds = atom.config.get('regular-notifications.DurationInSeconds');
      } else {
        this.remainingDurationInSeconds--;
      }
    },

    stopTimer() {
      atom.notifications.addError('Regular notifications disabled.');
      window.clearInterval(this.timerId);
    },
  };
