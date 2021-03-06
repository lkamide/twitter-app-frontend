import React, { Component } from 'react';
import { LineChart } from "@carbon/charts-react";
import "@carbon/charts/styles.css";
import './style.css'
function Chart() {
  return class extends Component {
    constructor(props) {


      super(props);

      
      // console.log("props --- from charts")
      // console.log("props --- from charts")
      // console.log(props)
      // console.log("props --- from charts")
      // console.log("props --- from charts")
      // console.log("props --- from charts")
      this.state = {
        // data : props.counts,
        data: props.counts,
        options : {
          // "title": "Line (time series)",
          "axes": {
            "bottom": {
              "title": "Last 7 days",
              "mapsTo": "date",
              "scaleType": "time"
            },
            "left": {
              "mapsTo": "value",
              // "title": "Conversion rate",
              "scaleType": "linear"
            }
          },
          "curve": "curveMonotoneX",
          "data": {
            "loading": props.counts.length > 0  ? false : true
          },
          "color": {
            "scale": {
              "user": "#1DA1F2"
            }
            
          },
          "height": "400px"
        }
      }

    }

    

  
 
    render() {
      return 	<>
       <LineChart 
          className="chart"
          key={this.state.data}
          data={this.state.data}
          options={this.state.options}>
        </LineChart>
    </>
    }
  }
}

export default Chart();