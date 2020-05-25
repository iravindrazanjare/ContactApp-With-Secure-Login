import { Component, OnInit,Directive, ElementRef, HostListener, Input, ContentChild  } from '@angular/core';
import {ContactService} from '../contact.service';
import {Contact} from '../contacts';  
import { isNgTemplate } from '@angular/compiler';

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.css'],
  providers: [ContactService]
})
export class ContactsComponent implements OnInit {
  SuccessMsg:string
  contacts: Contact[];
  contact: Contact;
  user_name:string;
  first_name: string;
  last_name: string;
  phone:string;
  _id: string;
  activeIndex: any;
  currentUser: string
  constructor(private contactService: ContactService) { }

  private headers = new Headers({ 'Content-Type' : 'application/json'});
  isShowDiv = false;
  isSShowDiv = true;

  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;

  }
  alphabetsOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if ((charCode < 97 || charCode > 122) && (charCode < 65 || charCode > 90)) {
      return false;
    }
    return true;

  }

  edit(obj,index){
    console.log(obj)
    this.first_name = obj.first_name;
    this.last_name = obj.last_name;
    this.phone = obj.phone ;
    this._id = obj._id;
    this.contact=obj;
    this.activeIndex = obj._id;
    this.isShowDiv = !this.isShowDiv;
    this.isSShowDiv = !this.isSShowDiv;
  }
  
  addContact()
  {
    const newContact ={
      _id : this._id,
      user_name : this.currentUser,
      first_name : this.first_name,
      last_name : this.last_name,
      phone : this.phone
    }
   
    if(this.activeIndex == undefined){
  
    this.contactService.addContact(newContact).subscribe(contact => {
      this.contacts.push(contact); 
    });
    this.contactService.getContacts(this.currentUser).subscribe(contacts => this.contacts = contacts);
    this.SuccessMsg = "Contact Added Successfully";
  }else{
    
    this.contactService.updateData(newContact).subscribe(data => {
        this.getData(this.currentUser)
       })
       this.SuccessMsg = "Contact Updated Successfully";
       this.resetData();
    }
  }
  resetData() {
    throw new Error("Method not implemented.");
  }
  deleteContact(id:any) {
    var contacts = this.contacts;
    this.contactService.deleteContact(id).subscribe(data => {
      if(data.n == 1){
        for(var i = 0;i<contacts.length;i++){
          if(contacts[i]._id == id){
              contacts.slice(i,1);
          }
        }
      }
    });
    this.getData(this.currentUser);
  }

  ngOnInit() {
    
    this.currentUser = localStorage.getItem('currentUser');
    this.getData(this.currentUser);
  }

  getData(currentUser){
    this.contactService.getContacts(this.currentUser).subscribe(contacts => this.contacts = contacts);
  }
}