export interface RegistrationTokenParams {
    raw: string;
    registrationToken: string;
    expires: number;
    endpointId: string;
}
export interface SelfInfo {
    displayname: string;
    firstname: string;
    lastname: string;
    namespace: string;
    username: string;
}
export declare class SkypeAccount {
    private _username;
    private _password;
    private _skypeToken;
    private _skypeTokenExpiresIn;
    private _messagesHost;
    private _registrationTokenParams;
    private _selfInfo;
    constructor(username: string, password: string);
    set username(username: string);
    get username(): string;
    set password(password: string);
    get password(): string;
    set skypeToken(skypeToken: string);
    get skypeToken(): string;
    set skypeTokenExpiresIn(skypeTokenExpiresIn: number);
    get skypeTokenExpiresIn(): number;
    set messagesHost(messagesHost: string);
    get messagesHost(): string;
    set registrationTokenParams(registrationTokenParams: RegistrationTokenParams);
    get registrationTokenParams(): RegistrationTokenParams;
    set selfInfo(selfInfo: SelfInfo);
    get selfInfo(): SelfInfo;
}
export default SkypeAccount;
