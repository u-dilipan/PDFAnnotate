import { Component, PipeTransform, Pipe} from '@angular/core';
import { DomSanitizer,SafeResourceUrl } from "@angular/platform-browser";
import { HttpClient } from '@angular/common/http';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {

  title = 'pageAnnotateFE';
  private pdfURL: SafeResourceUrl;
  private ifgranted: boolean = false;
  private tbgranted: boolean = false;
  submitted = false;
  tableData=[];
  resNData = [];
  resData = [];
  resData1 = [];
  outJson = {};

  constructor(private http:HttpClient, private sanitizer: DomSanitizer) { }
  

  onSubmit () { this.submitted = true; this.sendOutput()}
  ngOnInit () {
    
    window.addEventListener("beforeunload", function (e) {
      var confirmationMessage = "\o/";
    console.log("cond");
      e.returnValue = confirmationMessage; 
      return confirmationMessage;            
    });
      
  }

  onFileSelected(e: any):void {
    let formdata = new FormData();
    formdata.append('file',e.target.files[0]);
    this.http.post('http://127.0.0.1:4000/upload/',formdata).subscribe((val) => {
      console.log(val);
      //setInterval(() => { this.sendData(); }, 5000);
      this.sendData();
    });
  }
  sendData(){
    let i = 0;
    this.http.get('http://127.0.0.1:4000/',{responseType: 'json'}).subscribe(
        data => {
          this.tableData=[]
          Object.keys(data).forEach(key => {
            this.resNData[i] = key; 
            if(key == 'pdf_path'){
              this.pdfURL = this.sanitizer.bypassSecurityTrustResourceUrl(data[key]);
              this.ifgranted = true;
          }
            else{
              this.tableData.push({entityName: key, entity: data[key]});
              this.tbgranted = true;
              this.resData[i++] = data[key][0];
            }
          });
        },
        (err: HttpErrorResponse) => {
          console.log (err.message);
        }
      );
  }
  sendOutput(){
    let i = 0;
    for( let rd of this.resNData){
      if(this.resData[i] == 'other')
        this.resData[i] = this.resData1[i];
      this.outJson[rd] = this.resData[i++];
    }

    this.http.post('http://127.0.0.1:4000/get_json/',this.outJson).subscribe((val) => {
      console.log(val);
    },
    (err: HttpErrorResponse) => {
      console.log (err.message);
    });
  }
}