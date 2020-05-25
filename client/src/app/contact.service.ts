import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { Contact } from './contacts';
import { Observable, throwError } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
@Injectable()
export class ContactService {

  constructor(private http: HttpClient) { }
  Contact = [];
  
  getContacts(currentUser): Observable<Contact[]> {
    return this.http.get<Contact[]>('http://localhost:3000/api/contacts/'+currentUser)
  }

  addContact(newContact: Contact): Observable<any> {
    let httpHeaders = new HttpHeaders({
        'Content-Type': 'application/json'
    });
    console.log('ID in service '+newContact.user_name)
    return this.http.post<Contact>('http://localhost:3000/api/contact',newContact, {
        headers: httpHeaders,
        observe: 'response'
    }
    ).pipe(
        map(res => res.status),
        catchError(this.handleError)
    );
}
    //add contact method
    //addContact(newContact){
     // var headers = new HttpHeaders();
     // headers.append('Content-Type', 'appilcation/json');
     // return this.http.post('http://localhost:3000/api/contact', newContact, {headers:headers}).pipe(map((res: any) => {
      //  return <Contact[]>res.json()
    //})
    //);
    //}

   // deleteContact(id){
     // return this.http.delete('http://localhost:3000/api/contact/'+id).pipe(map((res: any) => {
       // return <Contact[]>res.json()}));
   // }

    //Delete article	
  deleteContact(_id): Observable<any> {
      console.log('Record delete for ID :'+_id)
      return this.http.delete<any>('http://localhost:3000/api/contact/'+_id).pipe(
          tap(status => console.log("status: " + status)),
          catchError(this.handleError)
      );
  }

  updateData(info): Observable<any>{
    
    return this.http.put('http://localhost:3000/api/contact/'+info._id,info).pipe(
      tap(status => console.log("status: " + status)),
      catchError(this.handleError)
  )
  }

    private handleError(error: any) {
      console.error(error);
      return throwError(error);
  }
}
