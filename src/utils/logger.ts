// in real app this should be a logger that sends logs to a log visualization service like grafana
class Logger {
  public info(text: string) {
    console.log(text);
  }
  public error(err: Error) {
    // log to Sentry
  }
}

export default new Logger();
