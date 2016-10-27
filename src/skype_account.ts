import * as  Consts from "./consts";

export interface RegistrationTokenParams {
    raw: string;
    registrationToken:string;
    expires: number;
    endpointId: string;
}

export interface SelfInfo {
    displayname: string;
    firstname: string;
    lastname: string;
    namespace: string;
    username: string
}

export class SkypeAccount {
    private _username:string;
    private _password:string;
    private _skypeToken:string;
    private _skypeTokenExpiresIn:number;

    private _messagesHost:string;

    private _registrationTokenParams:RegistrationTokenParams;
    private _selfInfo:SelfInfo;

    constructor(username:string, password:string) {
        this.username = username;
        this.password = password;

        this.messagesHost = Consts.SKYPEWEB_DEFAULT_MESSAGES_HOST;
    }

    set username(username:string) {
        this._username = username;
    }

    get username() {
        return this._username;
    }

    set password(password:string) {
        this._password = password;
    }

    get password() {
        return this._password;
    }

    set skypeToken(skypeToken:string) {
        this._skypeToken = skypeToken;
    }

    get skypeToken() {
        return this._skypeToken;
    }

    set skypeTokenExpiresIn(skypeTokenExpiresIn:number) {
        this._skypeTokenExpiresIn = skypeTokenExpiresIn;
    }

    get skypeTokenExpiresIn() {
        return this._skypeTokenExpiresIn;
    }

    set messagesHost(messagesHost:string) {
        this._messagesHost = messagesHost;
    }

    get messagesHost():string {
        return this._messagesHost;
    }

    set registrationTokenParams(registrationTokenParams:RegistrationTokenParams) {
        this._registrationTokenParams = registrationTokenParams;
    }

    get registrationTokenParams() {
        return this._registrationTokenParams;
    }

    set selfInfo(selfInfo:SelfInfo) {
        this._selfInfo = selfInfo;
    }

    get selfInfo() {
        return this._selfInfo;
    }
}

export default SkypeAccount;
