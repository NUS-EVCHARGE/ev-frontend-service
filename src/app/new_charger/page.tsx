"use client";

import { precisionDecimal } from "./precisionDecimals";
import { Component } from "react";
import React from "react";
import { useState } from "react";
import axios from "axios";

export default function ChargerForm() {
    const [address, setAddress] = useState('');
    const [coordinates, setCoordinates] = useState({ lat: null, lng: null });

    const handleAddressChange = (e) => {
        setAddress(e.target.value);
    };
    
    const handleGetCoordinates = async () => {
        try {
          const response = await axios.get(
            `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
              address
            )}&key=YOUR_GOOGLE_MAPS_API_KEY`
          );
    
          const { results } = response.data;
          if (results.length > 0) {
            const { lat, lng } = results[0].geometry.location;
            setCoordinates({ lat, lng });
          } else {
            alert('No location found for the entered address.');
          }
        } catch (error) {
          console.error('Error fetching data:', error);
        }
    };

    const labelStyles = {
        color: 'black', // Change label text color
      };
      const formStyles = {
        backgroundColor: '#f0f0f0', // Change the background color
        padding: '20px',
        borderRadius: '5px',
        width: '300px',
        margin: '0 auto',
        boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.2)', // Add a box shadow
      };
      const inputStyles = {
        border: '1px solid #ccc', // Change input border
        borderRadius: '3px',
        padding: '5px',
        width: '100%',
      };
      const buttonStyle = {
        backgroundColor: 'grey', // Background color
        color: 'white', // Text color
        padding: '10px 20px', // Padding
        borderRadius: '2px', // Border radius
        border: 'none', // Remove border
        cursor: 'pointer', // Cursor on hover
      };

      var charger_id = "";
      var rates_id = "";

    return (
        <div>
            <form style={formStyles}>
                <label style={labelStyles}>
                    Charger Id: 
                    <input type="text" placeholder="Charger Id" value={charger_id}/>
                </label>
                <label style={labelStyles}>
                    Rates Id: 
                    <input type="text" placeholder="Rates Id" value={rates_id}/>
                </label>
            <label style={labelStyles}>
                Address: 
                <input
                    type="text"
                    placeholder="Enter address"
                    value={address}
                    onChange={handleAddressChange}
                />
            </label>
            
            <button style={buttonStyle} onClick={handleGetCoordinates}>Get Coordinates</button>
            <div style={labelStyles}>
                Latitude: {coordinates.lat}, Longitude: {coordinates.lng}
            </div>
            </form>
        </div>
    )
}
// export default ChargerForm;

// class ChargerForm {
//     // constructor(props) {
//     //     super(props);
//     //     this.state = {value: ''};
    
//     //     this.handleChange = this.handleChange.bind(this);
//     //     this.handleSubmit = this.handleSubmit.bind(this);
//     //   }
//     //   handleChange(event) {
//     //     this.setState({value: event.target.value});
//     //   }
    
//     //   handleSubmit(event) {
//     //     alert('A name was submitted: ' + this.state.value);
//     //     event.preventDefault();
//     //   }

//       render() {
//         return (
//             <form onSubmit={this.handleSubmit}>
//                 <label>
//                     Name:
//                     <input type="text" name="name" />
//                 </label>
//                 <input type="submit" value="Submit" />
//             </form>
//         )
//       }
// }
// // function newCharger() {
// //     return (
// //         <div>
// //             <h1>Charger</h1>
// //             <form onSubmit={this.handleSubmit}>
// //                 <label>
// //                     Name:
// //                     <input type="text" name="name" />
// //                 </label>
// //                 <input type="submit" value="Submit" />
// //             </form>
            
// //         </div>
// //     )
// // }
// export default newCharger;
