import React from "react";
import { Text, View } from "react-native";

export default class Chat extends React.Component {
    componentDidMount() {
        let name = this.props.route.params.name;
        this.props.navigation.setOptions({ title: name });
    }
    render() {
        let { name, bgColor } = this.props.route.params;
        return (
            <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: bgColor}}>
                <Text style={{color: 'white'}}>Hello {name}!</Text>
            </View>
        )
    }
}