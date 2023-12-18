import { Component } from '@angular/core';
import { ngxCsv } from 'ngx-csv/ngx-csv';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent 
{
  public doc1: any[] = [];
  public doc2: any[] = [];
  public carte: any[] = [];
  public tickets: any[] = [];
  public good = false;
  public logs: any[] = [];

  constructor(){}
  ngOnInit()
  {}

  public changeListener(event:any){
    const target: DataTransfer = <DataTransfer>(event.target);
    if (target.files.length !== 1) {
      throw new Error('Cannot use multiple files');
    }
    const reader: FileReader = new FileReader();
    reader.readAsBinaryString(target.files[0]);
    reader.onload = (e: any) => {
      /* create workbook */
      const binarystr: string = e.target.result;
      const wb: XLSX.WorkBook = XLSX.read(binarystr, { type: 'binary' });

      /* selected the first sheet */
      const wsname: string = wb.SheetNames[0];
      const ws: XLSX.WorkSheet = wb.Sheets[wsname];

      /* save data */
      const data = XLSX.utils.sheet_to_json(ws); // to get 2d array pass 2nd parameter as object {header: 1}
      this.doc1 = data;
      this.doc1 = this.doc1.filter((t:any)=>t.Rattachement!=undefined);
      console.log("doc1",this.doc1); // Data will be logged in array format containing objects
    };
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
            if(i>0&&tmp[i]!="")this.doc2.push(tmp[i].split(";"));
           }
        }
        console.log("doc2",this.doc2);
       }
      }
  }

  public write()
  {
    this.logs = [];
    for(let i=0;i<this.doc2.length;i++)
    {
      let personne : 
      {matricule:any,employeenumber:any,nom:any,prenom:any,rattachement:any,tr:any,carticket:any,legalentity:any,departement:any,mail:any,contractstart:any,birthdate:any,jo:any,ntr:any,jtr:any,atr:any} = 
      {matricule:"",employeenumber:"",nom:"",prenom:"",rattachement:"",tr:"",carticket:"",legalentity:"",departement:"",mail:"",contractstart:"",birthdate:"",jo:"",ntr:"",jtr:"",atr:""};

      let tmp = this.doc2[i];
      //console.log(tmp[3],tmp[4]);
      if(tmp[3]&&tmp[4])
      {
        personne.legalentity = tmp[0];
        personne.departement = tmp[1];
        personne.nom = tmp[3];
        personne.prenom = tmp[4];
        personne.mail = tmp[7];
        personne.contractstart = tmp[8];
        personne.birthdate = tmp[10];
        personne.jo = tmp[12];
        personne.ntr = tmp[13];
        personne.jtr = tmp[14];
        personne.atr = tmp[15];

        let ok = false;
  
        for(let j=0;j<this.doc1.length&&!ok;j++)
        {
          let tmp = this.doc1[j];
          if(tmp)
          {
            let show = false;
            if(false&&tmp["SALARIÉS"].includes("Youling")&&personne.prenom=="Youling")show = true;
            let nom1 = tmp["SALARIÉS"]
            .replace(/\s*/gi,"").replace(/ */gi,"").replace(/-/gi,"").replace(/î/gi,"i").replace(/é/gi,"e").replace(/ü/gi,"u").replace(/è/gi,"e").replace(/ë/gi,"e").replace(/Mickael/gi,"Michael").toLowerCase();
            let nom2 = (personne.nom + personne.prenom)
            .replace(/\s*/gi,"").replace(/ */gi,"").replace(/-/gi,"").replace(/î/gi,"i").replace(/é/gi,"e").replace(/ü/gi,"u").replace(/è/gi,"e").replace(/ë/gi,"e").replace(/Mickael/gi,"Michael").toLowerCase();
            let nom3 = (personne.prenom + personne.nom)
            .replace(/\s*/gi,"").replace(/ */gi,"").replace(/-/gi,"").replace(/î/gi,"i").replace(/é/gi,"e").replace(/ü/gi,"u").replace(/è/gi,"e").replace(/ë/gi,"e").replace(/Mickael/gi,"Michael").toLowerCase();
            if(show)console.log(nom1,nom2,nom3);
            if(nom1 == nom2 || nom1 == nom3 || (nom1=="venninyouling"&&nom2=="venninwuyouling"))
            {
              ok = true;
              personne.matricule = tmp["Matricule"];
              personne.rattachement = tmp["Rattachement"];
              personne.carticket = tmp["1 Carte/Tickets"];
              personne.tr = tmp["TR"];
            }
          }
        }

        if(!ok){this.logs.push(personne);}
      }	
  
      //console.log(personne);
      if(personne.carticket && personne.carticket.toLowerCase() == "carte")
      {
        if(personne.tr && personne.tr.toLowerCase()=="oui")
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
      }
      else
      {
        if(personne.tr && personne.tr.toLowerCase()=="oui")
        {
          this.tickets.push({
            MATRICULE:personne.matricule,
            NOM:personne.nom,
            PRENOM:personne.prenom,
            NOMBREDETITRES:personne.ntr
          });
        }
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
