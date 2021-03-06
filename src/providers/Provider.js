import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { fsquareGetDataSimple } from '../helpers';
// make a new context
export const Context = React.createContext();

// create a provider component
// this is where the data actually lives
export default class Provider extends Component {
  static propTypes = {
    children: PropTypes.object.isRequired,
  };

  // TODO: Add error handling for the functions (specifically the api calls)

  state = {
    venues: [],
    markers: [],
    query: '',
    // run function to close all infoWindows
    // change clicked marker's isOpen state to true to display infoWindow
    // get the venue details from the foursquare api using the venue id
    // update the markers state with the state of the clicked marker
    openInfoWindow: m => {
      const { markers, closeInfoWindows, fsquareGetVenueDetails } = this.state;
      closeInfoWindows();
      m.isOpen = true;
      fsquareGetVenueDetails(m.id, m);
      this.setState({ markers: [...markers], m });
    },
    // make a copy of the markers current state
    // set isOpen state to false to close all infoWindows
    // update the markers state with the copy
    closeInfoWindows: () => {
      const { markers } = this.state;
      const updatedMarkers = markers.map(M => {
        M.isOpen = false;
        return M;
      });
      this.setState({ markers: [...markers], updatedMarkers });
    },
    // returns the full details about the specific venue clicked
    fsquareGetVenueDetails: (VENUE_ID, m) => {
      const { venues } = this.state;
      const venue = venues.find(v => v.id === m.id);
      fsquareGetDataSimple(`${VENUE_ID}`).then(res => {
        const updatedVenue = Object.assign(venue, res.data.response.venue);
        this.setState({ venues: [...venues], updatedVenue });
      });
    },
    // select a venue in the venue list
    // map through the markers and find the marker that matches the venue id
    // pass the selected marker to the infowindow function to link the actions
    selectVenueListItem: venue => {
      const { markers, openInfoWindow } = this.state;
      const marker = markers.find(m => m.id === venue.id);
      openInfoWindow(marker);
    },
    // filter the venue list based on a user query
    // remove whitespace from the user input
    // filter the venue list by matching the name to the query
    // return the filtered venues and pass down as props to list
    filterVenueList: () => {
      const { query, venues } = this.state;
      if (query.trim() !== '') {
        const filteredVenues = venues.filter(v =>
          v.name.toLowerCase().includes(query.toLowerCase())
        );
        return filteredVenues;
      }
      return venues;
    },
    // general update state function
    updateState: state => this.setState(state),
  };

  // returns a context provider
  // lives at the top level of the app
  // passes down state to anything this provider is wrapped in
  render() {
    const { children } = this.props;
    return (
      <Context.Provider value={{ ...this.state }}>{children}</Context.Provider>
    );
  }
}
