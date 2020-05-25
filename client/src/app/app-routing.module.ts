import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ContactsComponent} from './contacts/contacts.component';
import { RegisterComponent} from './register/register.component';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './auth.guard';
const routes: Routes = [{ path: '',
redirectTo: '/login',
pathMatch: 'full'
},
{
path: 'register',
component: RegisterComponent,
  canActivate: [AuthGuard]
},
{
path: 'api/contacts',
component: ContactsComponent,
canActivate: [AuthGuard]
},
{
path: 'login',
component: LoginComponent,

}];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
