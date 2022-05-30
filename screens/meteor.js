import axios from 'axios'
import * as React from 'react';
import { View, Text, Alert, FlatList, ImageBackground, Dimensions, Image } from 'react-native';

export default class Meteor extends React.Component {
    constructor() {
        super();
        this.state = {
            meteors: {}
        }
    }
    renderItem = ({ item }) => {
        let meteor = item
        let bg_image, speed, size
        if (meteor.threat_score <= 30) {
            bg_image = require('../assets/meteor_bg1.png')
            speed = require('../assets/meteor_speed3.gif')
            size = 100
        } else if (meteor.threat_score <= 75) {
            bg_image = require('../assets/meteor_bg2.png')
            speed = require('../assets/meteor_speed2.gif')
            size = 150
        } else {
            bg_image = require('../assets/meteor_bg3.png')
            speed = require('../assets/meteor_speed1.gif')
            size = 200
        } return (
            <View>
                <ImageBackground source={bg_image} style={{ flex: 1, resizeMode: 'cover', width: Dimensions.get('window').width, height: Dimensions.get('window').height }}>
                    <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}>
                        <Image source={speed} style={{ width: size, height: size }}>

                        </Image>
                    </View>
                    <View>
                        <Text>
                            {item.name}
                        </Text>
                        <Text>
                            Close to Earth-{item.close_approach_data[0].close_approach_date}
                        </Text>
                        <Text>
                            Minimum Diameter-{item.estimated_diameter.kilometers.estimated_diameter_min}
                        </Text>
                        <Text>
                            Maximum Diameter-{item.estimated_diameter.kilometers.estimated_diameter_max}
                        </Text>
                        <Text>
                            Velocity-{item.close_approach_data[0].relative_velocity.kilometers_per_second}
                        </Text>
                        <Text>
                            Missing Earth By-{item.close_approach_data[0].miss_distance.kilometers}
                        </Text>
                    </View>
                </ImageBackground>
            </View>
        )

    }
    componentDidMount() {
        this.getMeteors()
    }
    getMeteors = () => {
        axios
            .get('https://api.nasa.gov/neo/rest/v1/feed?api_key=QdazAZeTogM6xJ3d2oFX0XagwyDjemaREgEIKjoL')
            .then(response => {
                this.setState({
                    meteors: response.data.near_earth_objects
                })
                //console.log(this.state.meteors)
            })
            .catch(error => {
                Alert.alert(error.message)
            })
    }
    render() {
        if (Object.keys(this.state.meteors).length === 0) {
            return (
                <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                    <Text style={{ fontSize: 20 }}>{"Loading...."}</Text>
                </View>
            )
        }
        else {
            let meteor_arr = Object.keys(this.state.meteors)
                .map(meteor_date => { return this.state.meteors[meteor_date] })
            // console.log(meteor_arr)
            let meteors = [].concat.apply([], meteor_arr);
            //console.log(meteors)
            meteors.forEach(function (element) {
                let diameter = (element.estimated_diameter.kilometers.estimated_diameter_min + element.estimated_diameter.kilometers.estimated_diameter_max) / 2;
                let threatScore = (diameter / element.close_approach_data[0].miss_distance.kilometers) * 1000000000;
                element.threat_score = threatScore
            }
            )
            meteors.sort(function (a, b) {
                return b.threat_score - a.threat_score;
            })
            meteors = meteors.slice(0, 5)
            console.log(meteors)
            return (

                <View>
                    <FlatList data={meteors}
                        horizontal={true}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={this.renderItem}>

                    </FlatList>
                </View>
            )
        }
    }
}