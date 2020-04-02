import React, { useState, useEffect } from 'react';
import {
    Grid,
    Paper,
    Typography,
    Card,
    TextField,
    Button
} from '@material-ui/core';
import SelectableCardList from '../components/SelectedCard/SelectedCard.js'
import DashboardCard from '../components/DashboardCard';
import Map from '../components/Map';
import { useSelector } from "react-redux";
import CircularLoading from "../components/CircularLoading";
import languageJson from "../config/language";
import { Currency } from "../config/CurrencySymbol";


import PlacesAutocomplete, {
    geocodeByAddress,
    getLatLng,
} from 'react-places-autocomplete';
import * as firebase from 'firebase'


const Dashboard = () => {
    const [mylocation, setMylocation] = useState(null);
    const [locations, setLocations] = useState([]);
    const [dailygross, setDailygross] = useState(0);

    const [pickup_address, set_pu_Address] = useState("");
    const [dropoff_address, set_do_Address] = useState("");
    const [selectCompany, setSelectCompany] = useState("");

    const [pickup, setPickup] = useState("");
    const [dropoff, setDropoff] = useState("");
    const [formDetails, setFormDetails] = useState({
        pickup_lat: "",
        pickup_long: "",
        dropoff_lat: "",
        dropoff_long: "",
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
    });
    const [carTypeSelection, setCarTypeSelection] = useState(null);

    const [allcarTypes, setAllCarTypes] = useState([]);
    const [allCars, setAllCars] = useState([]);

    const [monthlygross, setMonthlygross] = useState(0);
    const [totalgross, setTotalgross] = useState(0);
    const [convenniencefees, setconvenience] = useState(0);

    const [todayConvenience, settodayconvenience] = useState(0);
    const [totconvenienceTrans, settotalconvenience] = useState(0);

    const usersdata = useSelector(state => state.usersdata);
    const bookingdata = useSelector(state => state.bookingdata);

    const handleChange_pickup = a => {
        setPickup(a);
    };
    const handleChange_dropoff = a => {
        setDropoff(a);
    };

    const handleSelect_pickup = a => {
        setPickup(a);
        console.log(a)
        mapping(a, 'pickup');
    };
    const handleSelect_dropoff = a => {
        setDropoff(a)
        mapping(a, 'dropoff');
    };

    const mapping = (a, type) => {
        geocodeByAddress(a)
            .then(results => getLatLng(results[0]))
            .then(latLng => {
                if (type == 'pickup') {
                    setFormDetails({
                        ...formDetails,
                        pickup_lat: latLng.lat,
                        pickup_long: latLng.lng
                    })
                }
                else if (type == 'dropoff') {
                    setFormDetails({
                        ...formDetails,
                        dropoff_lat: latLng.lat,
                        dropoff_long: latLng.lng
                    })
                }
            })
            .catch(error => console.error('Error', error));
    }
    const allCarsData = () => {
        const cars = firebase.database().ref('rates/car_type');
        cars.once('value', allCars => {
            if (allCars.val()) {
                let cars = allCars.val()
                let listCars = [];
                for (var key in cars) {
                    cars[key].minTime = ''
                    cars[key].available = true;
                    cars[key].active = false;
                    listCars.push(cars[key])
                }
                setAllCarTypes(listCars);
                setAllCars(listCars)
            }
        })
    }
    useEffect(() => {
        allCarsData();
    }, [])

    const onListChanged = (selected) => {
        setCarTypeSelection(selected);
      }

    useEffect(() => {
        if (mylocation == null) {
            navigator.geolocation.getCurrentPosition(
                position => setMylocation({
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                }),
                err => console.log(err)
            );
        }
    }, [mylocation]);

    useEffect(() => {
        if (usersdata.users) {
            const drivers = usersdata.users.filter(({ usertype }) => usertype === 'driver');
            let locs = [];
            for (let i = 0; i < drivers.length; i++) {
                if (drivers[i].approved && drivers[i].driverActiveStatus && drivers[i].location) {
                    locs.push({
                        id: i,
                        lat: drivers[i].location.lat,
                        lng: drivers[i].location.lng,
                        drivername: drivers[i].firstName + ' ' + drivers[i].lastName
                    });
                }
            }
            setLocations(locs);
        }
    }, [usersdata.users]);

    useEffect(() => {
        if (bookingdata.bookings) {
            let today = new Date();
            let tdTrans = 0;
            let mnTrans = 0;
            let totTrans = 0;
            let convenniencefees = 0;
            let totconvenienceTrans = 0;
            let todayConvenience = 0;
            for (let i = 0; i < bookingdata.bookings.length; i++) {
                const { trip_cost, discount_amount, tripdate, convenience_fees } = bookingdata.bookings[i];
                let tDate = new Date(tripdate);
                if (trip_cost >= 0 && discount_amount >= 0) {
                    if (tDate.getDate() === today.getDate() && tDate.getMonth() === today.getMonth()) {
                        tdTrans = tdTrans + trip_cost + discount_amount;
                    }
                    if (tDate.getMonth() === today.getMonth() && tDate.getFullYear() === today.getFullYear()) {
                        mnTrans = mnTrans + trip_cost + discount_amount;
                    }

                    totTrans = totTrans + trip_cost + discount_amount;
                } if (convenience_fees > 0) {

                    if (tDate.getMonth() === today.getMonth() && tDate.getFullYear() === today.getFullYear()) {
                        convenniencefees = convenniencefees + convenience_fees
                    }
                    if (tDate.getDate() === today.getDate() && tDate.getMonth() === today.getMonth()) {
                        todayConvenience = todayConvenience + convenience_fees;
                    }
                    totconvenienceTrans = totconvenienceTrans + convenience_fees;
                }
            }
            setDailygross(tdTrans.toFixed(2));
            setMonthlygross(mnTrans.toFixed(2));
            setTotalgross(totTrans.toFixed(2));
            setconvenience(convenniencefees.toFixed(2));
            settodayconvenience(todayConvenience.toFixed(2));
            settotalconvenience(totconvenienceTrans.toFixed(2));
        }
    }, [bookingdata.bookings]);

    return (
        bookingdata.loading || usersdata.loading ? <CircularLoading /> :
            <div>
                <Typography variant="h4" style={{ margin: "20px 0 0 15px" }}>{languageJson.dispatch_panel}</Typography>
                <Grid container direction="row" spacing={2}>
                    <Grid item xs={5}>
                        <Card style={{ padding: 15 }}>
                            <PlacesAutocomplete
                                value={pickup}
                                onChange={handleChange_pickup}
                                onSelect={handleSelect_pickup}
                            >
                                {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
                                    <div>
                                        <TextField id="outlined-search" label="Pick up address" type="search" variant="outlined" style={{ width: '100%', marginTop: 15 }}
                                            {...getInputProps({
                                                placeholder: 'Search Places ...',
                                                className: 'location-search-input',
                                            })}
                                        />
                                        <div className="autocomplete-dropdown-container">
                                            {loading && <div>Loading...</div>}
                                            {suggestions.map(suggestion => {
                                                const className = suggestion.active
                                                    ? 'suggestion-item--active'
                                                    : 'suggestion-item';
                                                // inline style for demonstration purpose
                                                const style = suggestion.active
                                                    ? { backgroundColor: '#fafafa', cursor: 'pointer' }
                                                    : { backgroundColor: '#ffffff', cursor: 'pointer' };
                                                return (
                                                    <div
                                                        {...getSuggestionItemProps(suggestion, {
                                                            className,
                                                            style,
                                                        })}
                                                    >
                                                        <span>{suggestion.description}</span>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}
                            </PlacesAutocomplete>
                            <PlacesAutocomplete
                                value={dropoff}
                                onChange={handleChange_dropoff}
                                onSelect={handleSelect_dropoff}
                            >
                                {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
                                    <div>
                                        <TextField id="outlined-search" label="Drop off address" type="search" variant="outlined" style={{ width: '100%', marginTop: 15 }}
                                            {...getInputProps({
                                                placeholder: 'Search Places ...',
                                                className: 'location-search-input',
                                            })}
                                        />
                                        <div className="autocomplete-dropdown-container">
                                            {loading && <div>Loading...</div>}
                                            {suggestions.map(suggestion => {
                                                const className = suggestion.active
                                                    ? 'suggestion-item--active'
                                                    : 'suggestion-item';
                                                // inline style for demonstration purpose
                                                const style = suggestion.active
                                                    ? { backgroundColor: '#fafafa', cursor: 'pointer' }
                                                    : { backgroundColor: '#ffffff', cursor: 'pointer' };
                                                return (
                                                    <div
                                                        {...getSuggestionItemProps(suggestion, {
                                                            className,
                                                            style,
                                                        })}
                                                    >
                                                        <span>{suggestion.description}</span>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}
                            </PlacesAutocomplete>
                            {/*TODO:
                                handle car type select card
                                call BookNow() function from FareScreen.js
                            */}
                            {/* <FormControl variant="outlined" className={classes.formControl}>
                                <InputLabel htmlFor="outlined-age-native-simple">Company</InputLabel>
                                <Select
                                    native
                                    value={selectCompany}
                                    onChange={handleChange}
                                    label="Age"
                                    inputProps={{
                                        name: 'age',
                                        id: 'outlined-age-native-simple',
                                    }}
                                >
                                    <option aria-label="None" value="" />
                                    <option value={10}>Ten</option>
                                    <option value={20}>Twenty</option>
                                    <option value={30}>Thirty</option>
                                </Select>
                            </FormControl> */}
                            <SelectableCardList
                                maxSelectable={1}
                                contents={allcarTypes}
                                onChange={onListChanged}
                            />
                            <Button variant="outlined" color="primary" onClick={() => console.log(allcarTypes)}>
                                Primary
                            </Button>

                        </Card>
                    </Grid>
                    <Grid item xs={7}>
                        {mylocation ?
                            <Paper style={{ marginTop: '25px' }}>
                                <Typography variant="h4" style={{ margin: "20px 0 0 15px" }}>{languageJson.real_time_driver_section_text}</Typography>
                                <Map mapcenter={mylocation} locations={locations}
                                    googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyA_7PeswJ4eBxwub_3vWuE94JHIZaEcvZQ&v=3.exp&libraries=geometry,drawing,places"
                                    loadingElement={<div style={{ height: `480px` }} />}
                                    containerElement={<div style={{ height: `480px` }} />}
                                    mapElement={<div style={{ height: `480px` }} />}
                                />
                            </Paper>
                            :
                            <Typography variant="h4" style={{ margin: "20px 0 0 15px", color: '#FF0000' }}>{languageJson.allow_location}</Typography>
                        }
                    </Grid>
                </Grid>

            </div>

    )
}

export default Dashboard;