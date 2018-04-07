import { Injectable } from '@angular/core';
import { Http, URLSearchParams } from '@angular/http';
import 'rxjs/add/operator/map';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class WikiService {

  s$: Subject<string> = new Subject<string>();

  constructor(private http: Http) { }

  getRecommended(url: string) {
    //192.168.1.12:3000/https://he.wikipedia.org/w/index.php?title=%D7%A7%D7%98%D7%92%D7%95%D7%A8%D7%99%D7%94:%D7%A2%D7%A8%D7%9B%D7%99%D7%9D_%D7%9E%D7%95%D7%9E%D7%9C%D7%A6%D7%99%D7%9D&from=ד
    //192.168.1.12:3000/
    //alert("before");
    return this.makeRequest(url);
  }
    

  getReposForOrg(org: string) {
    return this.makeRequest(`orgs/${org}/repos`);
  }

  getRepoForOrg(org: string, repo: string) {
    return this.makeRequest(`repos/${org}/${repo}`);
  }

  private makeRequest(url: string) {
  
    return this.http.get(url)
      .map((res) => res.text());
  }

  
}
