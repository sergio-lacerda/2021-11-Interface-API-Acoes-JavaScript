/*+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
	Validação do formulário de pesquisa de ações
+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++*/	

// Ticker da ação cujos dados quer consultar
var symbol = 'PETR4.SA';

function validar(){		
	var aux = document.getElementById('txtSymbol').value;
	symbol = aux;
	
	if (aux === undefined || aux ==null || aux.length<5) {
		document.getElementById('error').style.display = 'block';
		document.getElementById('error').innerHTML = 'Código de ação inválido!';
		document.getElementById('txtSymbol').focus();		
	}
	else {
		document.getElementById('error').style.display = 'none';
		lineChartData = [ ['',0,0] ];
		symbol = aux;
		urlDaily = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${symbol}&interval=5min&apikey=${apiKey}`;		
		// Solicitando os dados para a API
		requestData(urlDaily);				
	}	
}


/*+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
	Programação do uso da API AlphaVantage
+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++*/	

// Sua chave para acesso à API
var apiKey = 'SUA_CHAVE_API';

// URL para solicitar dados de cotação diária de uma ação
var urlDaily = 
	`https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${symbol}&interval=5min&apikey=${apiKey}`;

// Variáveis globais para receber os dados utilizados pelos gráficos
var barChartData;
var lineChartData = [ [,,] ];

// Função para requisitar os ddos da API
async function requestData( url ) { 

	const options = {
		method: 'GET',
		mode: 'cors',
		cache: 'default'
	};
	
	await fetch( url, options )
		.then( response => { response.json() 
			.then ( data => showData(data) )
		})
		.catch ( e => showError(e.message) )
} 

// Função para informar possíveis erros
function showError(msg) {	
	document.getElementById('error').style.display = 'block';
	document.getElementById('error').innerHTML = 'Erro: ' + msg;
	document.getElementById('txtSymbol').focus();		
}

//	Função para exibição dos dados 
function showData(data) {
	
	let aux = data['Time Series (Daily)'];
	let rowsCount = 0;		
	let maxima = 0;
	let minima = 99999999;
	let media = 0;
	
	document.getElementById('series-table').tBodies[0].innerHTML = '';
		
	for ( const field in aux ) {	
		let auxDate = new Date(field);
		let day = ( (auxDate.getDate()+1) <10) ? ('0'+ (auxDate.getDate()+1) ) : (auxDate.getDate() + 1);
		let month = ( (auxDate.getMonth()+1) <10) ? ('0'+ (auxDate.getMonth()+1) ) : (auxDate.getMonth()+1);
		let year = auxDate.getFullYear();		
		let formatDate =  day + '/' + month + '/' + year;	
		
		let openValue = parseFloat(aux[field]['1. open']).toFixed(2);
		let closeValue = parseFloat(aux[field]['4. close']).toFixed(2);		
		
		// Adicionando os últimos 4 registros na tabela da página index
		if ( rowsCount < 5 ) {
			addTableContent(formatDate, openValue, closeValue);			
		}			
		
		if (maxima < parseFloat(aux[field]['4. close'])) {
			maxima = parseFloat(aux[field]['4. close']);
		}
		
		if (minima > parseFloat(aux[field]['4. close'])) {
			minima = parseFloat(aux[field]['4. close']);			
		}
		
		media += parseFloat(aux[field]['4. close']);		
		
		lineChartData[rowsCount] = [formatDate, 
			parseFloat(aux[field]['1. open']), 
			parseFloat(aux[field]['4. close'])
		];
		
		//lineChartData.push(auxValues );
		rowsCount++;
	} // for	
	
	media = media / rowsCount;
	
	if (minima == 99999999) { minima = 0; }
	
	// Informando valores para o gráfico de colunas
	barChartData = [ ['', maxima, media, minima] ];		
	google.charts.load('current', {packages: ['corechart', 'bar']});		
	google.charts.setOnLoadCallback(drawMultSeries);
	
	// Informando valores para o gráfico de linhas		
	google.charts.load('current', {packages: ['corechart', 'line']});		
	google.charts.setOnLoadCallback(drawCurveTypes);	
}

//	Função para adicionar dados à tabela da página index.html
function addTableContent(date, open, close){
	var myTable = document.getElementById('series-table').tBodies[0];	
	myTable.innerHTML = myTable.innerHTML + `<tr><td>${date}</td><td>${open}</td><td>${close}</td></tr>`;
}


/*+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
	Gráficos Google Charts para os valores recebidos via API
+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++*/	

// Gráfico de colunas para valores de referência
function drawMultSeries() {
    var data = new google.visualization.DataTable();
    data.addColumn('string', 'Preço');
	data.addColumn('number', 'Máxima');
    data.addColumn('number', 'Média');
    data.addColumn('number', 'Mínima');

    data.addRows(barChartData);

    var options = {
        title: 'Referências de preço do ativo',
        hAxis: {
          title: 'Referência',
        },
        vAxis: {
          title: 'Valores'
        }
    };

    var chart = new google.visualization.ColumnChart( document.getElementById('chart-column') );
    chart.draw(data, options);
}


// Gráfico de linha para série diária de valores
function drawCurveTypes() {
    var data = new google.visualization.DataTable();
    data.addColumn('string', 'Data');
    data.addColumn('number', 'Abertura');
    data.addColumn('number', 'Fechamento');

    data.addRows(lineChartData);

    var options = {
		title: 'Série diária de preço do ativo',  
        hAxis: {
          title: 'Data'
        },
        vAxis: {
          title: 'Valores'
        },
        series: {
          1: {curveType: 'function'}
        }
    };

    var chart = new google.visualization.LineChart(document.getElementById('chart-line'));
    chart.draw(data, options);
}
	
