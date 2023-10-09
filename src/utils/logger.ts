// in real app this should be a logger that sends logs to a log visualization service like grafana
class Logger {
  public info(text: string) {
    console.log(text);
  }
}

export default new Logger();
