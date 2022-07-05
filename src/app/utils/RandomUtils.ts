export class RandomUtils {

  private static instance: RandomUtils;

  static getInstance(): RandomUtils {
    if (!RandomUtils.instance) {
      RandomUtils.instance = new RandomUtils();
    }

    return RandomUtils.instance;
  }
  public shipLoading(): boolean {
    return Math.random() < 0.5;
  }
}
