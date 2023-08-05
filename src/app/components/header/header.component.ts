import { Component, OnInit } from '@angular/core';
import { AppInitService } from '@app/app-initializer.service';
import { ApiService } from '@app/modules/auth/utilities/services/api.service';
import { GlobalFunctionService } from '@app/shared';
import { LocaleService } from '@app/shared/services/locale.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {


  isLogin: boolean = false;
  currentUser: any = {};
  userName: string;
  shortInfo = [];

  constructor(
    public gfService: GlobalFunctionService,
    public locale: LocaleService,
    private authApiService: ApiService,
    private appInit: AppInitService,
  ) {
    this.currentUser = this.gfService.sessionUser;
    if (this.currentUser && this.currentUser.profile) {
      // if (this.currentUser.profile.company && this.currentUser.profile.company.name) {
      //   this.shortInfo.push(
      //     {
      //       value: this.currentUser.profile.company.name
      //     }
      //   );
      // }
      // if (this.currentUser.profile.department && this.currentUser.profile.department.name) {
      //   this.shortInfo.push(
      //     {
      //       value: this.currentUser.profile.department.name
      //     }
      //   );
      // }
      // if (this.currentUser.profile.city && this.currentUser.profile.city.name) {
      //   this.shortInfo.push(
      //     {
      //       value: this.currentUser.profile.city.name
      //     }
      //   );
      // }
      // if (this.currentUser.profile.location && this.currentUser.profile.location.name) {
      //   this.shortInfo.push(
      //     {
      //       value: this.currentUser.profile.location.name
      //     }
      //   );
      // }
      this.userName = `${this.currentUser.profile.firstName}${(this.currentUser.profile.lastName) ? ' ' + this.currentUser.profile.lastName : ''}`;
    }
  }

  ngOnInit(): void {
    this.isLogin = this.gfService.isLogin;
    this.gfService.globalBS$.subscribe(resp => {
      if (resp && resp.type === 'IS_LOGIN') {
        this.isLogin = resp.isLogin;
      }
    });
  }

  ngAfterViewChecked() {
    this.currentUser = this.gfService.sessionUser;
    if (this.currentUser && this.currentUser.profile) {
      // if (this.shortInfo.length === 0) {
      //   if (this.currentUser.profile.company && this.currentUser.profile.company.name) {
      //     this.shortInfo.push(
      //       {
      //         value: this.currentUser.profile.company.name
      //       }
      //     );
      //   }
      //   if (this.currentUser.profile.department && this.currentUser.profile.department.name) {
      //     this.shortInfo.push(
      //       {
      //         value: this.currentUser.profile.department.name
      //       }
      //     );
      //   }
      //   if (this.currentUser.profile.city && this.currentUser.profile.city.name) {
      //     this.shortInfo.push(
      //       {
      //         value: this.currentUser.profile.city.name
      //       }
      //     );
      //   }
      //   if (this.currentUser.profile.location && this.currentUser.profile.location.name) {
      //     this.shortInfo.push(
      //       {
      //         value: this.currentUser.profile.location.name
      //       }
      //     );
      //   }
      // }
      this.userName = `${this.currentUser.profile.firstName}${(this.currentUser.profile.lastName) ? ' ' + this.currentUser.profile.lastName : ''}`;
    }
  }

  logout() {
    // this.closeTemplate = true;
    this.gfService.globalBS$.next(
      {
        type: 'PAGE_LOADER',
        loader: true
      }
    );
    const header = {};
    const apiData = {};
    const token = this.gfService.getCookie('token');
    this.gfService.deleteCookie('token');
    this.gfService.sessionUser = null;
    this.appInit.sessionUser = null;
    this.gfService.globalBS$.next({
      type: 'MODULE_NAME',
      name: null
    });
    this.gfService.globalBS$.next({
      type: 'IS_LOGIN',
      isLogin: false
    });
    this.gfService.isLogin$.next(false);

    // this.gfService.lastParentMenu = [];
    // this.gfService.blockHttpCall = false;
    this.authApiService.logout(apiData, header, token).subscribe(
      (response) => {
      },
      (error) => { }
    )
      .add(() => {
        this.gfService.routeNavigation('/auth/login');
        this.gfService.globalBS$.next(
          {
            type: 'PAGE_LOADER',
            loader: false
          }
        );
        // this.gfService.blockHttpCall = true;
      });
  }

  routeHome() {
    if (navigator.onLine) {
      this.gfService.routeNavigation('/home');
    }
  }

}
