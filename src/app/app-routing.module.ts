import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthenticationGuard } from './shared/guards/authentication.guard';
import { TemporaryComponent } from './temporary/temporary.component';

const routes: Routes = [
	{ path: '', redirectTo: 'vendor', pathMatch: 'full' },
	{
		path: 'temp',
		component: TemporaryComponent,
		canActivate: []
	},
	// {
	// 	path: 'home',
	// 	loadChildren: () => import('./modules/home/home.module').then((m) => m.HomeModule),
	// 	canActivate: [AuthenticationGuard],
	// 	data: {
	// 		moduleName: 'Home'
	// 	}
	// },
	// {
	// 	path: 'list',
	// 	loadChildren: () => import('./modules/term-list/term-list.module').then((m) => m.TermListModule),
	// 	canActivate: [AuthenticationGuard],
	// 	data: {
	// 		moduleName: 'Master'
	// 	}
	// },
	// {
	// 	path: 'auth',
	// 	loadChildren: () => import('./modules/auth/auth.module').then((m) => m.AuthModule),
	// 	canActivateChild: [AuthenticationGuard],
	// 	data: {
	// 		moduleName: 'Auth'
	// 	}
	// },
	// {
	// 	path: 'vendor',
	// 	loadChildren: () => import('./modules/vendor/vendor.module').then((m) => m.VendorModule),
	// 	canActivate: [AuthenticationGuard],
	// 	data: {
	// 		moduleName: 'Vendor'
	// 	}
	// },
	// {
	// 	path: 'customer',
	// 	loadChildren: () => import('./modules/customer/customer.module').then((m) => m.CustomerModule),
	// 	canActivate: [AuthenticationGuard],
	// 	data: {
	// 		moduleName: 'Customer'
	// 	}
	// },
	// {
	// 	path: 'product-category',
	// 	loadChildren: () => import('./modules/product-category/product-category.module').then((m) => m.ProductCategoryModule),
	// 	canActivate: [AuthenticationGuard],
	// 	data: {
	// 		moduleName: 'ProductCategory'
	// 	}
	// },
	// {
	// 	path: 'products',
	// 	loadChildren: () => import('./modules/products/products.module').then((m) => m.ProductsModule),
	// 	canActivate: [AuthenticationGuard],
	// 	data: {
	// 		moduleName: 'Products'
	// 	}
	// },
	// {
	// 	path: 'variant',
	// 	loadChildren: () => import('./modules/variant/variant.module').then((m) => m.VariantModule),
	// 	canActivate: [AuthenticationGuard],
	// 	data: {
	// 		moduleName: 'Variant'
	// 	}
	// },
	// {
	// 	path: 'attributes',
	// 	loadChildren: () => import('./modules/attributes-management/attributes-management.module').then((m) => m.AttributesManagementModule),
	// 	canActivate: [AuthenticationGuard],
	// 	data: {
	// 		moduleName: 'AttributesManagement'
	// 	}
	// },
];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule]
})
export class AppRoutingModule { }
