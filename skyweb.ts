import login = require('./login');
import poll = require('./poll');
import SkypeAccount = require('./skype_account');
import messages = require('./message');

class Skyweb {
    public messagesCallback:(messages:Array<any>)=>void;
    public skypeAccount;
    
    login(username, password):Promise<{}> {
        var me = this;
        this.skypeAccount = new SkypeAccount(username, password);
        
        
        return login.doLogin(this.skypeAccount).then((skypeAccount:SkypeAccount) => {
            poll.pollAll(skypeAccount, (messages:Array<any>)=> {
                if (me.messagesCallback){
                    me.messagesCallback(messages);
                }
            });
            return skypeAccount;
        });
    }
    
    sendMessage(conversationId:string, message:string){
        messages.sendMessage(this.skypeAccount, conversationId, message);
    }
}

export = Skyweb;
