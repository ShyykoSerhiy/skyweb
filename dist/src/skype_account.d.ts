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
    username: string;
    password: string;
    skypeToken: string;
    skypeTokenExpiresIn: number;
    messagesHost: string;
    registrationTokenParams: RegistrationTokenParams;
    selfInfo: SelfInfo;
}
export default SkypeAccount;
