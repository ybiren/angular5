import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import CustomValidators from '../forms/CustomValidators';
import { WikiService } from '../github/shared/wiki.service';
import { endianness } from 'os';
import { setTimeout } from 'timers';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';


@Component({
  selector: 'wiki',
  templateUrl: './wiki.component.html',
  styleUrls: ['./wiki-component.css']
})
export class WikiComponent {

  strArr: Array<string>;
  dirtyArr: Array<Number>;
  recommendedArr: Array<{ title: string, href: string, txt: string }>;
  rightAns: Number = -1;
  userAns: Number = -1; 

  NumAns:Number = 4;

  txtModal: string;

  constructor(public wikiSrv: WikiService) {
    this.wikiSrv.s$.subscribe(val => this.txtModal = val);
    this.buildExam();  
  }



  private buildExam() {

    this.recommendedArr = [];
    this.wikiSrv.getRecommended("//192.168.1.12:3001/https://he.wikipedia.org/w/index.php?title=%D7%A7%D7%98%D7%92%D7%95%D7%A8%D7%99%D7%94:%D7%A2%D7%A8%D7%9B%D7%99%D7%9D_%D7%9E%D7%95%D7%9E%D7%9C%D7%A6%D7%99%D7%9D&from=ה")
      .subscribe(repoDetails => {
        this.strArr = this.splitMulti(repoDetails, ["<li>", "</li>"]);
        this.shuffleArray(this.strArr);

        this.dirtyArr = [];
        this.buildNextQuestion();
        
      });

  }


  private buildNextQuestion() {

    this.recommendedArr = [];
    this.userAns = -1;
    for (var i = this.strArr.length - 1; this.recommendedArr.length < this.NumAns && i > 0; i--) {
      if (this.strArr[i].length > 1 && this.strArr[i].length < 1000 && this.dirtyArr.indexOf(i) === -1) {
        var domAttrib = this.GetDomAttribute(this.strArr[i]);
        if (typeof (domAttrib["title"]) !== "undefined" && domAttrib["title"].search(/[a - zA - Z]/) === -1 && typeof (domAttrib["href"]) !== "undefined") {
          var title = domAttrib["title"].replace('\r', '').replace('\n', '');
          var href = "https://he.wikipedia.org" + domAttrib["href"];
          this.recommendedArr.push({ title: title, href: href, txt: "KKKK" });
          this.dirtyArr.push(i);
        }
      }
    }
    this.setQuestAndAns();

  }

  private checkAnswer(index) {
    this.userAns = index;
    setTimeout(this.buildNextQuestion.bind(this),1500);
  }
  
  private getWrongAnswer(index):boolean {
    return this.userAns == index && this.userAns != this.rightAns;
  }

  private getRightAnswer(index): boolean {
    return this.userAns == index && this.userAns == this.rightAns;
  }

  private setQuestAndAns() {

    for (let i = 0; i < this.recommendedArr.length; i++) {
      this.wikiSrv.getRecommended("//192.168.1.12:3001/" + this.recommendedArr[i].href)
        .subscribe(urlStr => { this.getAnsFromUrlStr(urlStr,i); });
    }
  }

  private getAnsFromUrlStr(urlStr:string,ansInd:number) {

    let keyWords = [" היא ", " הוא ", " הם ", " הן ", " היה ", " היתה ", " היו "];
    let minInd = -1;
    let minTxt = "";
    for (let j = 0; j < keyWords.length; j++) {
      let ind = urlStr.indexOf(keyWords[j]);
      if (ind != -1 && (minInd == -1 || ind < minInd)) {
        minInd = ind;
        minTxt = urlStr.split(keyWords[j])[1];
      }
    }
    
    let sentence = "";
    let startWord = false;
    let endSentence = false;
    let wordArr = [];
    let word = "";
    for (let k = 0; k < minTxt.length && !endSentence; k++) {
      if (minTxt[k].search(/[\u0590-\u05FF]/) != -1) {
        if (startWord == false)
          startWord = true;
        word += minTxt[k];
      }
      else if (sentence.length > 50 && (minTxt[k].indexOf(".") != -1 || minTxt[k].indexOf(",") != -1)) {
        endSentence = true;
      }
      else {

        if (startWord == true && wordArr.indexOf(word)===-1)
          sentence += word + " ";
        startWord = false;
        wordArr.push(word);
        word = "";
      }
  
    }
    this.recommendedArr[ansInd].txt = sentence;
    this.rightAns = 0;
  }


  private splitMulti(str: string, tokens: Array<string>): Array<string> {
    var tempChar = tokens[0]; // We can use the first token as a temporary join character
    for (var i = 0; i < tokens.length; i++) {
      str = str.split(tokens[i]).join(tempChar);
    }
    var str1 = str.split(tempChar);
    return str1;
  }

  private GetDomAttribute(val: string): {}
  {

    var regex = new
      RegExp('[\\s\\r\\t\\n]*([a-z0-9\\-_]+)[\\s\\r\\t\\n]*=[\\s\\r\\t\\n]*([\'"])((?:\\\\\\2|(?!\\2).)*)\\2', 'ig');
    var attributes = {};
    var match: any;
    while ((match = regex.exec(val))) {
      attributes[match[1]] = match[3];
    }
    return attributes;
  };

  private shuffleArray(array) {
    for (var numTimes = 0; numTimes < 50; numTimes++) {
      for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
      }
    }

 }

  checkedChanged(val: boolean) {
    alert("SSSS");
    alert(val);
  }

}
