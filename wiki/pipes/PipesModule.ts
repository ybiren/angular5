import {NgModule} from '@angular/core';
import {UrlDecodePipe} from './urldecode.pipe';

@NgModule({
	declarations: [
      UrlDecodePipe
	],
	imports     : [],
	exports     : [
      UrlDecodePipe
	],
	
	providers      : [],
	bootstrap      : [],
	entryComponents: []
	
})

export class PipesModule
{
}
