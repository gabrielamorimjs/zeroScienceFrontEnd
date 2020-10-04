import React, { Component , useState} from 'react'
import ReactGlobe from 'react-globe';
import "./mundo.scss"
//import defaultmarkers from "./markers.js"

function markerTooltipRenderer(marker) {
  return `Nome do satélite: ${marker.city}. (Sua Altitude: ${marker.value})`;
}

const options = {
  markerTooltipRenderer
};

let defaultmarkers = [];

function App() {
  const [markers, setMarkers] = useState([]);
  const [event, setEvent] = useState(null);
  const [details, setDetails] = useState(null);
  function onClickMarker(marker, markerObject, event) {
    setEvent({
      type: "CLICK",
      marker,
      markerObjectID: markerObject.uuid,
      pointerEventPosition: { x: event.clientX, y: event.clientY }
    });
    setDetails(markerTooltipRenderer(marker));
  }
  function onDefocus(previousFocus) {
    setEvent({
      type: "DEFOCUS",
      previousFocus
    });
    setDetails(null);
  }

  return (
    <div>
      {details && (
        <div
          style={{
            background: "white",
            position: "absolute",
            fontSize: 20,
            bottom: 0,
            right: 0,
            padding: 12
          }}
        >
          <p>{details}</p>
          <p>
            EVENT: type={event.type}, position={JSON.stringify(event.pointerEventPosition)})
          </p>
        </div>
      )}
      <ReactGlobe
        height="100vh"
        markers = {defaultmarkers}
        options={options}
        width="100vw"
        onClickMarker={onClickMarker}
        onDefocus={onDefocus}
      />
    </div>
  );
}

export default class mundo extends Component {  
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
    };
  }

  componentDidMount() {
    fetch("https://107227b604b2.ngrok.io/getSatellitesNear")
      .then(res => res.json())
      .then(
        (result) => {
          console.log(defaultmarkers)
          for (let index = 0; index < Object.keys(result).length; index++) {
            var array = result[index]['above']
            console.log("Conjunto de SAT: ", array)
            for (let jndex = 0; jndex < array.length; jndex++) {
              var sat_point = array[jndex];
              console.log(array[jndex])
              defaultmarkers.push({id: sat_point["satid"], city: sat_point["satname"], color: 'blue' ,coordinates: [sat_point["satlat"], sat_point["satlng"]], value: 70})
            }
          }
          console.log(defaultmarkers)
          this.setState({
            isLoaded: true,
          });
        },
        // Note: it's important to handle errors here
        // instead of a catch() block so that we don't swallow
        // exceptions from actual bugs in components.
        (error) => {
          this.setState({
            isLoaded: true,
            error
          });
        }
      )
    }

  render() {
    const loaded = this.state.isLoaded
    let app;
    if(loaded){
      app = <App/>
    }
    else{
      app = ""
    }
    return app;
  }
}