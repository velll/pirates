// TODO: log levels
const logger = {
  enabled: false,

  enable: function() { this.enabled = true; },
  disable: function() { this.enabled = true; },

  debug: function(what: any) {
    // tslint:disable-next-line:no-console
    if (this.enabled) { console.log(what); }
  }
};

export { logger };
