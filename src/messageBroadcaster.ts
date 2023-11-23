import axios from 'axios';

export class MessageBroadcaster{

    public path : string;
    private hosts : string[];

    constructor(path:string) {
        this.path = path;
        this.hosts = [];

    }


    public async  sendToHost(host: string,payload:Object): Promise<any> {

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

    public async sendAll(payload:Object){
       const promises =  this.hosts.map(async (host) => await this.sendToHost(host,payload));

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