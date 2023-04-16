
const colors = require('colors');
const EventEmitter = require('events');
const emitter = new EventEmitter();
emitter.setMaxListeners(0);
const axios = require('axios');
const throttledQueue = require('throttled-queue');
const throttle = throttledQueue(1, 1000);
const {v4: uuidv4} =require('uuid');
const CVIDs = function cvid(tm){
	let id = '';
	let caracteres = "ABCDEFGHIJKMNOPQRSTUVWXYZ1234567890";
	for(let i = 0; i< tm; i++){
		id += caracteres.charAt(Math.floor(Math.random() * caracteres.length));
	}
	return id;
}
const nPages = 10;
let page = ["","11","21","31","41","51","61","71","81","91","101","111","121","131","141","151","161","171","181","191","201"];
let forms = ["","PERE","PERE1","PERE2","PERE3","PERE4"];
const lista = fs.readFileSync('./dorks.txt',{encoding: 'utf-8'}).split('\n');
let regex = /(http|https):\/\/(\w+:{0,1}\w*)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%!\-\/]))?/;
function validaURL(link){
	if(regex.test(link)){
		console.log( `${link}`.green);
	}
}
function sleep(ms){
	return new Promise( resolve => {
		setTimeout(()=>{resolve('')},ms);
	})
}

async function bing(dork){      
        	let cvid = CVIDs(32);
            let url = `https://www.bing.com/search?q=${dork}&form=QBLH&sp=-1&ghc=1&lq=0&pq=${dork}&sc=10-9&qs=n&sk=&cvid=${cvid}&ghsh=0&ghacc=0&ghpl=`;
			try{
				throttle(async ()=>{
					for(let i = 0 ; i < nPages; i++){
						let FORM = forms[0];
						if(i > 0 && i < 5){
							FORM = forms[i];
						}else if(i  == 5){
							FORM = forms[5];
						}else{
							FORM = forms[4];
						}
						let A = `https://www.bing.com/search?q=${dork}&form=QBLH&sp=-1&ghc=1&lq=0&pq=${dork}&sc=10-9&qs=n&sk=&cvid=${cvid}&ghsh=0&ghacc=0&ghpl=`;
						let B = `https://www.bing.com/search?q=${dork}&sp=-1&ghc=1&lq=0&pq=${dork}&sc=10-9&qs=n&sk=&cvid=${cvid}&ghsh=0&ghacc=0&ghpl=&first=${page[i]}&FORM=${FORM}`;
						if(i > 0){
							url = B;
						}
						
						await sleep(2000)
						const bing = axios(url)
						.then(function(response){
							
							let body = response.data;
							let bodyParse = body.split('<a href="');
							for(link of bodyParse){

								link = link.split('"')[0];
								validaURL(link)
							}
						});
						
				    }
									
				})

			}catch(err){
				console.log(err)
			}	
}
async function search(){
	for(dork of lista){
		bing(dork);
		await sleep(2000)
	}
}
search();
