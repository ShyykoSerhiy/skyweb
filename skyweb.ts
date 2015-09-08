import login = require('./login');
import poll = require('./poll');
import SkypeAccount = require('./skype_account');
import messages = require('./message');
import ContactsService = require('./contacts_service');

class Skyweb {
    public messagesCallback:(messages:Array<any>)=>void;
    public skypeAccount: SkypeAccount;
    public contactsService: ContactsService;
    
    login(username, password):Promise<{}> {
        var me = this;
        this.skypeAccount = new SkypeAccount(username, password);
        this.contactsService = new ContactsService();
        
        return login.doLogin(this.skypeAccount).then((skypeAccount:SkypeAccount)=>{
            return new Promise(this.contactsService.loadContacts.bind(this.contactsService, skypeAccount));
        }).then((skypeAccount:SkypeAccount) => {
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
