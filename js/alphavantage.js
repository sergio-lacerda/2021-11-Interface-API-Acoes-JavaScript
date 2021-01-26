/*+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
	Parâmetros para as requisições à API
+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++*/	

// Sua chave para acesso à API
var apiKey = 'IG38WIHOGQ07E0CL';
	
// Ticker da ação cujos dados quer consultar
var symbol = 'ITSA4.SA';	

/*+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
	URLs para as requisições à API AlphaVantage
+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++*/	

// URL para solicitar dados de cotação diária de uma ação
var urlDaily = 
	`https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${symbol}&interval=5min&apikey=${apiKey}`;


/*+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
	Funções para obtenção e tratamento dos dados da API
	Valores para o parâmetro "series":
		+ TIME_SERIES_DAILY: Cotação diária de uma ação
+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++*/	

// Função para requisitar os ddos da API
async function requestData( url, series ) { 

	const options = {
		method: 'GET',
		mode: 'cors',
		cache: 'default'
	};
	
	await fetch( url, options )
		.then( response => { response.json() 
			.then ( data => showData(data, series) )
		})
		.catch ( e => erro=e.message )
} 



/*+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
	Funções para exibição dos dados da API
+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++*/	

// Função para identificar o tipo de exibição e redirecionar
function showData(data, series) {
	switch (series) {
		case 'TIME_SERIES_DAILY':
			showDaily(data, series);
			break;
	}
}


//	Funções para exibição dos dados de cotação diária
function showDaily(data, series) {
	
	let aux = data['Time Series (Daily)'];
	
	for ( const field in aux ) {		
		console.log(
			' Data: ' + field + 
			' Abertura: ' + aux[field]['1. open'] + 
			' Fechamento: ' + aux[field]['4. close']
		);
	}	
}



requestData(urlDaily, 'TIME_SERIES_DAILY');


//showData(dados);

//document.getElementById('content').innerHTML = dados;






