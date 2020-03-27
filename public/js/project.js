fetch("/api/scans")
  .then(response => response.json())
  .then(data => {
    console.log(data)
    data.forEach(scan => {
      scan.t = scan.timeStamp
      scan.y = scan.a11yScore
    });
    console.log(data)

    const dataObj = {
      datasets: [{ 
        data: data, 
        backgroundColor: 'red',
        fill: false,
        label: "VAC Find Benefits and Services"
      }]
    }
    
    const optionsObj = {
      scales: {
        xAxes: [{
          type: 'time',
          time: {
            unit: 'week'
          }
        }], 
        yAxes: [{
          scaleLabel: {
            display: true, 
            labelString: "A11y Score"
          },
          ticks: {
            min: 0,
            max: 100
          }
        }]
      }
    }
    
    const chartObj = {
      type: "line",
      data: dataObj,
      options: optionsObj
    }
    
    new Chart('line-chart', chartObj);
  }) 