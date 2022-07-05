import {
  autorun,
  IAutorunOptions,
  IReactionDisposer,
  IReactionOptions,
  IReactionPublic,
  IWhenOptions,
  reaction,
  when,
} from "mobx";

export interface IReactionData {
  disposer: IReactionDisposer | null;

  promise: Promise<void> | null;

  data: any;
}

/**
 * Utils class for Mobx to register the reactions. This allows to keep track of all registered
 * reactions so that they are disposed properly.
 */
export class MobxUtils {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  public static readonly WHEN_NAME = "_when_";

  // eslint-disable-next-line @typescript-eslint/naming-convention
  public static readonly REACTION_NAME = "_reaction_";

  // eslint-disable-next-line @typescript-eslint/naming-convention
  public static readonly AUTORUN_NAME = "_autorun_";

  private static instance: MobxUtils;

  private _uniqueId = 0;

  public reactions: Map<string, IReactionData> = new Map();

  static getInstance(): MobxUtils {
    if (!MobxUtils.instance) {
      MobxUtils.instance = new MobxUtils();
    }

    return MobxUtils.instance;
  }

  /**
   *
   * Adds when observable to the MobX reactions map to keep track of
   *
   * @param {string} name - Name of when reaction
   * @param {*} condition - Condition at which triggers the callBack when it is satisfied
   * @param {() => void} [callBack] - callBack funciton used whe condition is satisfied
   * @param {(IWhenOptions | undefined)} [opts] - Optional parameters
   * @return {*}  {string} - The full name of the when reaction is returned to eventually dispose of
   */
  public addWhen(name: string, condition: any, callBack?: () => void, opts?: IWhenOptions | undefined): string {
    const whenName: string = this.setReaction(name + MobxUtils.WHEN_NAME);

    if (callBack === undefined) {
      const disposer: IReactionDisposer = when(
        (): boolean => condition(),
        (): void => {
          this.disposeReaction(whenName);
        },
        opts,
      );
      this.setDisposer(whenName, disposer);
    } else {
      const disposer: IReactionDisposer = when(
        (): boolean => condition(),
        (): void => {
          this.disposeReaction(whenName);
          callBack();
        },
        opts,
      );
      this.setDisposer(whenName, disposer);
    }

    return whenName;
  }

  /**
   *Add a reaction to the reaction map.
   *
   * @param {string} name - The name of the reaction
   * @param {*} dataFunction - Observable data used to listen for changes to trigger the callback
   * @param {(data: any, r: IReactionPublic) => void} callBack - Callback triggered once the Mobx observable has updated
   * @param {(IReactionOptions | undefined)} [opts] - Optional parameters
   * @return {*}  {string} - Returns the name of the newly created reaction
   */
  public addReaction(
    name: string,
    dataFunction: any,
    callBack: (data: any, r: IReactionPublic) => void,
    opts?: IReactionOptions<any, any> | undefined,
  ): string {
    const reactionName: string = this.setReaction(name + MobxUtils.REACTION_NAME);

    const disposer = reaction(
      dataFunction,
      (arg: any, r: IReactionPublic) => {
        this.updateData(reactionName, arg);
        callBack(arg, r);
      },
      opts,
    );

    this.setDisposer(reactionName, disposer);
    //console.log(`Mobx -- ${reactionName} -- Reaction observer set`);

    return reactionName;
  }

  /**
   *
   * Adds AutoRun and disposes of it
   *
   * @param {string} name  - Name of the AutoRun
   * @param {*} dataFunction - Observable data used to listen for changes
   * @param {(IAutorunOptions | undefined)} [opts] - Optional parameters
   * @return {*}  {string} - Returns the name of the newly created AutoRun
   */
  public addAutoRun(name: string, dataFunction: any, opts?: IAutorunOptions | undefined): string {
    const autoRunName: string = this.setReaction(name + MobxUtils.AUTORUN_NAME);

    const disposer: IReactionDisposer = autorun(dataFunction, opts);

    this.setDisposer(autoRunName, disposer);

    return autoRunName;
  }

  /**
   * Adds the reaction data and name into the reaction map
   *
   * @param {string} name - Name of the reaction
   * @return {*}  {string} - returns the full reaction name
   */
  public setReaction(name: string): string {
    const uniqueName = name + this._uniqueId++;

    const reactionPublicData: IReactionData = {
      disposer: null,
      promise: null,
      data: null,
    };

    this.reactions.set(uniqueName, reactionPublicData);

    return uniqueName;
  }

  /**
   * Updates the reaction data
   *
   * @param {string} name - name of the reaction data
   * @param {*} data - data object of the reaction
   */
  public updateData(name: string, data: any): void {
    const reactionData: IReactionData = this.getDefinedReactionData(name);
    reactionData.data = data;
  }

  /**
   * Sets the disposer of the reaction data
   *
   * @param {string} name - name of the reaction data
   * @param {IReactionDisposer} disposer - instance of the reaction disposer
   */
  public setDisposer(name: string, disposer: IReactionDisposer): void {
    const reactionData: IReactionData = this.getDefinedReactionData(name);
    reactionData.disposer = disposer;
  }

  /**
   *Retrieves the reaction data by name and sets its promis
   *
   * @param {string} name
   * @param {Promise<void>} promise
   */
  public setPromise(name: string, promise: Promise<void>): void {
    const reactionData: IReactionData = this.getDefinedReactionData(name);
    reactionData.promise = promise;
  }

  /**
   *
   * Dispose of all reactions within the reaction map
   *
   */
  public disposeReactions(): void {
    this.reactions.forEach((reactionData: IReactionData, name: string) => {
      if (reactionData.disposer !== undefined && reactionData.disposer !== null) {
        reactionData.disposer();
        this.reactions.delete(name);
      }
    });
  }

  /**
   *
   * Dispose of a reaction with a given name
   *
   * @param {string} name - Name of reaction
   */
  public disposeReaction(name: string): void {
    const reactionData: IReactionData | undefined = this.reactions.get(name);

    if (reactionData !== undefined && reactionData.disposer !== undefined && reactionData.disposer !== null) {
      reactionData.disposer();
      this.reactions.delete(name);
    }
  }

  /**
   *Within the console log, display all active reactions
   *
   */
  public showAllReactions(): void {
    //console.log("Mobx -- Showing All Reactions: ");

    this.reactions.forEach((reactionData: IReactionData, name: string) => {
      //console.log(`Mobx -- ${name}`);
    });
  }

  private getDefinedReactionData(name: string): IReactionData {
    const reactionData: IReactionData | undefined = this.reactions.get(name);

    if (reactionData === undefined || reactionData === null) {
      throw new Error(`Reaction -- ${name} -- is undefined`);
    }

    return reactionData;
  }
}
