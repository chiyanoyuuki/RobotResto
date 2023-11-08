import { Component } from '@angular/core';
import { ngxCsv } from 'ngx-csv/ngx-csv';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent 
{
  public doc1: string[] = [];
  public doc2: string[] = [];
  public carte: any[] = [];
  public tickets: any[] = [];
  public good = false;

  constructor(){}
  ngOnInit()
  {}

  public changeListener(event:any){
    this.doc1 = [];
    let files = event.target.files
    if(files && files.length > 0) {
       let file : File | null = files.item(0); 
       if(file)
       {
        let reader: FileReader = new FileReader();
        reader.readAsText(file);
        reader.onload = (e) => {
           let csv: string = reader.result as string;
           let tmp = csv.split("\n");
           for(let i=0;i<tmp.length;i++)
           {
            if(i>0&&tmp[i]!="")this.doc1.push(tmp[i]);
           }
        }
       }
      }
  }

  public changeListener2(event:any){
    this.doc2 = [];
    let files = event.target.files
    if(files && files.length > 0) {
       let file : File | null = files.item(0); 
       if(file)
       {
        let reader: FileReader = new FileReader();
        reader.readAsText(file);
        reader.onload = (e) => {
           let csv: string = reader.result as string;
           let tmp = csv.split("\n");
           for(let i=0;i<tmp.length;i++)
           {
            if(i>0&&tmp[i]!="")this.doc2.push(tmp[i]);
           }
        }
       }
      }
  }

  public write()
  {
    for(let i=0;i<this.doc1.length;i++)
    {
      let personne : 
      {matricule:any,employeenumber:any,nom:any,prenom:any,rattachement:any,tr:any,carticket:any,legalentity:any,departement:any,mail:any,contractstart:any,birthdate:any,jo:any,ntr:any,jtr:any,atr:any} = 
      {matricule:"",employeenumber:"",nom:"",prenom:"",rattachement:"",tr:"",carticket:"",legalentity:"",departement:"",mail:"",contractstart:"",birthdate:"",jo:"",ntr:"",jtr:"",atr:""};
  
      let tmp = this.doc1[i].split(";");
      personne.matricule = tmp[0];
      personne.employeenumber = tmp[1];
      personne.nom = tmp[2].substring(0,tmp[2].indexOf(" "));
      personne.prenom = tmp[2].substring(tmp[2].indexOf(" ")+1);
      personne.rattachement = tmp[4];
      personne.tr = tmp[6];
      personne.carticket = tmp[7];

      for(let i=0;i<this.doc2.length;i++)
      {
        let tmp = this.doc2[i].split(";");
        if(personne.nom==tmp[3]&&personne.prenom==tmp[4])
        {
          personne.legalentity = tmp[0];
          personne.departement = tmp[1];
          personne.mail = tmp[7];
          personne.contractstart = tmp[8];
          personne.birthdate = tmp[10];
          personne.jo = tmp[12];
          personne.ntr = tmp[13];
          personne.jtr = tmp[14];
          personne.atr = tmp[15];
        }
      }	

      console.log(personne);

      if(personne.carticket.startsWith("Carte"))
      {
        this.carte.push({
          MATRICULE:personne.matricule,
          NOM:personne.nom,
          PRENOM:personne.prenom,
          DATEDENAISSANCE:personne.birthdate,
          EMAIL:"",
          ADRESSE1:"",
          CODEPOSTAL:"",
          VILLE:"",
          PAYS:"",
          NOMBREDETITRES:personne.ntr
        });
      }
      else
      {
        this.tickets.push({
          MATRICULE:personne.matricule,
          NOM:personne.nom,
          PRENOM:personne.prenom,
          NOMBREDETITRES:personne.ntr
        });
      }
    }	
    this.good = true;
  }

  downloadCSVCarte()
  {
    console.log(this.carte);
    var options = {
      title: 'Import TR Carte',
      fieldSeparator: ";",
      quoteStrings: '"',
      decimalseparator: ".",
      showLabels: false,
      nbDownload: false,
      showTitle: false,
      useBom: false,
      headers:["MATRICULE","NOM","PRENOM","DATEDENAISSANCE","EMAIL","ADRESSE1","CODEPOSTAL","VILLE","PAYS","NOMBRE DE TITRES"]
    };
    new ngxCsv(this.carte, "Import TR Carte", options);
  }

  downloadCSVTickets()
  {
    var options = {
      title: 'Import TR Tickets',
      fieldSeparator: ";",
      quoteStrings: '"',
      decimalseparator: ".",
      showLabels: false,
      nbDownload: false,
      showTitle: false,
      useBom: false,
      headers:["MATRICULE","NOM","PRENOM","NOMBRE DE TITRES"]
    };
      new ngxCsv(this.tickets, "Import TR Tickets", options);
  }

}
