function buildMetadata(sample) {

    // @TODO: Complete the following function that builds the metadata panel

    // Use `d3.json` to fetch the metadata for a sample
    var metadata_url = `/metadata/${sample}`;

    d3.json(metadata_url).then(function(metaData, error){
        if(error) return console.log("err: " + error);

        // Use d3 to select the panel with id of `#sample-metadata`
        var metadata_elmnt = d3.select("#sample-metadata");

        // Use `.html("") to clear any existing metadata
        metadata_elmnt.html("");

        // Use `Object.entries` to add each key and value pair to the panel
        // Hint: Inside the loop, you will need to use d3 to append new
        // tags for each key-value in the metadata.
        Object.entries(metaData).forEach(function(kv_pair) {
            var listItem = metadata_elmnt.append("li");
            listItem.text(`${kv_pair[0]}: ${kv_pair[1]}`);
        });

        // BONUS: Build the Gauge Chart
        // buildGauge(wFreq);
    });


}

function buildCharts(sample) {

    // @TODO: Use `d3.json` to fetch the sample data for the plots
    var sampleURL = `/samples/${sample}`
    d3.json(sampleURL).then(function(response, error){
        if (error) return console.log(error);

        var otuIDs = response.otu_ids;
        var sampleValues = response.sample_values
        var otuDescriptions = response.otu_labels;
        // @TODO: Build a Bubble Chart using the sample data
        var trace = {
            x: otuIDs,
            y: sampleValues,
            mode: 'markers',
            type: 'scatter',
            marker: {
                size: sampleValues,
                color: otuIDs,
                colorscale: "Rainbow"
            },
            text: otuDescriptions,
          };
        var data = [trace]
        Plotly.newPlot("bubble", data)

        // @TODO: Build a Pie Chart
        // HINT: You will need to use slice() to grab the top 10 sample_values,
        // otu_ids, and labels (10 each).
        var labels = otuIDs.slice(0, 10);
        var values = sampleValues.slice(0, 10);
        var hoverText = otuDescriptions.slice(0, 10);

        var trace = {
            values: values,
            labels: labels,
            type: "pie",
            hovertext: hoverText,
            hoverinfo: "hovertext"
        };
        var data = [trace]
        var layout = {
            margin: { t: 0, l: 0 }
        };

        Plotly.newPlot("pie", data, layout);

    });
}

function init() {
    // Grab a reference to the dropdown select element
    var selector = d3.select("#selDataset");

    // Use the list of sample names to populate the select options
    d3.json("/names").then(function(sampleNames, error) {
        sampleNames.forEach(function(sample) {
            selector
                .append("option")
                .text(sample)
                .property("value", sample);
        });

        // Use the first sample from the list to build the initial plots
        const firstSample = sampleNames[0];
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
