/*+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
	Gráfico de linha para série diária de valores
+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++*/	

google.charts.load('current', {packages: ['corechart', 'line']});
google.charts.setOnLoadCallback(drawCurveTypes);

var lineChartValues = [ ['2020-11-03', 23, 15], ['2020-11-04', 10, 5], ['2020-11-05', 0, 0] ];

function drawCurveTypes() {
      var data = new google.visualization.DataTable();
      data.addColumn('string', 'Data');
      data.addColumn('number', 'Abertura');
      data.addColumn('number', 'Fechamento');

      data.addRows(lineChartValues);

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
	

/*+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
	Gráfico de colunas para série diária de valores
+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++*/		

google.charts.load('current', {packages: ['corechart', 'bar']});
google.charts.setOnLoadCallback(drawMultSeries);

var columnChartValues = [ ['', 12.25, 11.98, 10.06] ];

function drawMultSeries() {
      var data = new google.visualization.DataTable();
      data.addColumn('string', 'Preço');
	  data.addColumn('number', 'Máxima');
      data.addColumn('number', 'Média');
      data.addColumn('number', 'Mínima');

      data.addRows(columnChartValues);

      var options = {
        title: 'Referências de preço do ativo',
        hAxis: {
          title: 'Referência',
        },
        vAxis: {
          title: 'Valores'
        }
      };

      var chart = new google.visualization.ColumnChart(
        document.getElementById('chart-column'));

      chart.draw(data, options);
    }









