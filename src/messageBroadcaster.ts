import axios from 'axios';

export class MessageBroadcaster{

    public path : string;
    private hosts : string[];

    constructor(path:string) {
        this.path = path;
        this.hosts = [];

    }


    public async  sendToHost(host: string): Promise<any> {

        let payload = {
            "event": "message_sent",
            "from" : "taha",
            "to":"joe doe"
        };

        await axios.post(
            host+this.path,
            payload,
            {
                headers: {
                  'Content-Type': 'application/json',
                  Accept: 'application/json',
                },
              },
            ).then().catch();
    }

    public async sendAll(){
       const promises = this.hosts.map(host => this.sendToHost(host));

       Promise.all(promises)
        .then(results => {

        })
        .catch(error => {
            
        });
            
    
    }

    public setHosts(hosts:string[]){
        this.hosts = hosts;
    }


    public getHosts(){
        return this.hosts;
    }

    public addHost(host :string){
        this.hosts.push(host);
    }


}