function buildMetadata(sample) {
  var url = `/metadata/${sample}`;
  // @TODO: Complete the following function that builds the metadata panel
  // Use `d3.json` to fetch the metadata for a sample
  d3.json(url).then(function(response2){
      console.log(response2);
  
      var age = response2.AGE;  
      var bbt = response2.BBTYPE;
      var eth = response2.ETHNICITY;
      var gen = response2.GENDER;
      var loc = response2.LOCATION;  

      // Select the unordered list element by class name
      var list = d3.select(".summary");
      
      // remove any children from the list to
      list.html("");
      
      // append stats to the list
      list.append("li").text(`AGE:      ${age}`);
      list.append("li").text(`BBTYPE:   ${bbt}`);
      list.append("li").text(`ETHNICITY:${eth} `);
      list.append("li").text(`GENDER:   ${gen}`);
      list.append("li").text(`LOCATION: ${loc}`);

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    // BONUS: Build the Gauge Chart
    // buildGauge(data.WFREQ);
    });
  }

function buildCharts(sample) {

  // @TODO: Use `d3.json` to fetch the sample data for the plots
  var url = `/samples/${sample}`;
  d3.json(url).then(function(response){
      console.log(response);

      // @TODO: Build a Bubble Chart using the sample data
      var trace = {
        x: response.otu_ids,
        y: response.sample_values,
        text: response.otu_labels,
        mode: 'markers',
        marker:{
          size: response.sample_values,
          color: response.otu_ids
        }
      };    

      var layout = {
        title: "Belly Button Bubble Chart",
        xaxis: { title: "OTU ID" },
        yaxis: { title: "Sample Values" }
      };
    
    var bubbledata = [trace];
    Plotly.newPlot('bubble', bubbledata, layout);


    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).
    var responselist = [];
    for (i=0 ; i < response.sample_values.length; i++)
      responselist.push({'otu_ids': response.otu_ids[i], 
                          'sample_values':response.sample_values[i],
                          'otu_labels': response.otu_labels[i]
                        });
    console.log(responselist);  
  
    responselist.sort(function(a, b) {
        return (b.sample_values) - (a.sample_values);
    });
      
    responselist = responselist.slice(0, 10);
    console.log(responselist);

    // @TODO: Build a Pie Chart
    var piedata = [{
          values: responselist.map(row => row.sample_values),
          labels: responselist.map(row => row.otu_ids),
          hovertext: responselist.map(row => row.otu_labels),
          type: 'pie'
    }];

    var layout = {
      title: "Belly Button Pie Chart",
    };
    Plotly.newPlot('pie', piedata,layout);

  });
}


function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    // console.log(firstSample);
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
