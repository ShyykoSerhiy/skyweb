export declare class EventEmitter {
    private _eventListeners;
    constructor();
    on(eventName: string, listener: (eventName: string, content: any) => void): void;
    un(eventName: string, listener: (eventName: string, content: any) => void): void;
    fire(eventName: string, content: any): void;
}
export declare class Utils {
    static getCurrentTime(): number;
    static getTimezone(): string;
    static getMac256Hash(challenge: any, appId: any, key: any): string;
}
export default Utils;
