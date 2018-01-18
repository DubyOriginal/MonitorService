google.load('visualization', '1', {packages: ['controls', 'charteditor']});
google.setOnLoadCallback(drawChart);

function drawChart() {
  var data = new google.visualization.DataTable();
  data.addColumn('date', 'X');
  data.addColumn('number', 'Y1');
  data.addColumn('number', 'Y2');

  for (var i = 0; i < 12; i++) {
    data.addRow([new Date(2016, i, 1), Math.floor(Math.random() * 200), Math.floor(Math.random() * 200)]);
  }

  var dash = new google.visualization.Dashboard(document.getElementById('dashboard_div'));

  var control = new google.visualization.ControlWrapper({
    controlType: 'ChartRangeFilter',
    containerId: 'control_div',
    options: {
      filterColumnIndex: 0,
      ui: {
        chartOptions: {
          height: 50,
          width: 1000,
          chartArea: {
            width: '80%'
          }
        },
        chartView: {
          columns: [0, 1]
        }
      }
    }
  });

  var chart = new google.visualization.ChartWrapper({
    chartType: 'LineChart',
    containerId: 'chart_div'
  });

  function setOptions(wrapper) {
    wrapper.setOption('width', 620);
    wrapper.setOption('chartArea.width', '80%');
  }

  setOptions(chart);

  dash.bind([control], [chart]);
  dash.draw(data);
  google.visualization.events.addListener(control, 'statechange', function () {
    var v = control.getState();
    document.getElementById('dbgchart').innerHTML = v.range.start + ' to ' + v.range.end;
    return 0;
  });
}