import {Injectable, Pipe, PipeTransform} from '@angular/core';
@Pipe({
	name: 'urldecode',
	pure: false
})

@Injectable()
export class UrlDecodePipe implements PipeTransform
{
	transform(value) {
      return value ? value.replace("&#039", "'").replace("&quot;","'"):value;
	}
}
