import React from "react";
import { View, Text, TextInput, ImageBackground, Pressable, TouchableOpacity, StatusBar ,StyleSheet } from 'react-native';
import Svg, { Defs, Path, G, Use } from "react-native-svg";

export default class Start extends React.Component {
    constructor(props) {
        super(props);
        this.state = {name: '', bgColor: '', sysColor: ''};
    }

    colors = {
        color1: '#090C08',
        color2: '#474056',
        color3: '#8A95A5',
        color4: '#B9C6AE'
    }

    sysColors = {
        color1: '#d7d7d7',
        color2: '#272727'
    }

    render() {
        return (
            <View style={styles.container}>
                { Platform.OS === 'android' ? <StatusBar barStyle='light-content'/> : <StatusBar barStyle='dark-content' /> }
                <ImageBackground source={require('../assets/BackgroundImage.png')} resizeMode='cover' style={styles.background}>
                    <Text style={styles.title}>Chat App</Text>
                    <View style={styles.box}>
                        <View style={styles.inputContainer}>
                            <View style={styles.svgContainer}>
                                <Svg width={20} height={19}>
                                    <Defs>
                                        <Path
                                            d="M12 13.253c3.24 0 9.6 1.577 9.6 4.852v2.426H2.4v-2.426c0-3.275 6.36-4.852 9.6-4.852Zm8.64 6.318v-1.466c0-2.014-4.663-3.892-8.64-3.892-3.977 0-8.64 1.878-8.64 3.892v1.466h17.28ZM12 11.36c-2.376 0-4.32-1.917-4.32-4.26S9.624 2.84 12 2.84c2.376 0 4.32 1.917 4.32 4.26s-1.944 4.26-4.32 4.26Zm0-.96c1.849 0 3.36-1.49 3.36-3.3 0-1.81-1.511-3.3-3.36-3.3S8.64 5.29 8.64 7.1c0 1.81 1.511 3.3 3.36 3.3Z"
                                            id="a"
                                        />
                                    </Defs>
                                    <G transform="translate(-2 -2)" fill="none" fillRule="evenodd">
                                        <Path d="M0 0h24v23.667H0z" />
                                        <Use fill="#757083" fillRule="nonzero" xlinkHref="#a" />
                                    </G>
                                </Svg>
                            </View>
                            <TextInput
                                style={styles.textInput}
                                onChangeText={(name) => this.setState({ name })}
                                value={this.state.name}
                                placeholder="Your Name"
                            />
                        </View>
                        <View style={styles.colorSelector}>
                            <Text style={styles.colorText}>Choose Background Color:</Text>
                            <View style={styles.colorsContainer}>
                                <TouchableOpacity style={styles.color1} onPress={() => this.setState({bgColor: this.colors.color1, sysColor: this.sysColors.color1})}></TouchableOpacity>
                                <TouchableOpacity style={styles.color2} onPress={() => this.setState({bgColor: this.colors.color2, sysColor: this.sysColors.color1})}></TouchableOpacity>
                                <TouchableOpacity style={styles.color3} onPress={() => this.setState({bgColor: this.colors.color3, sysColor: this.sysColors.color2})}></TouchableOpacity>
                                <TouchableOpacity style={styles.color4} onPress={() => this.setState({bgColor: this.colors.color4, sysColor: this.sysColors.color2})}></TouchableOpacity>
                            </View>
                        </View>
                        <Pressable
                            style={styles.chatButton}
                            onPress={() => this.props.navigation.navigate('Chat', { name: this.state.name, bgColor: this.state.bgColor, sysColor: this.state.sysColor })}
                            >
                            <Text style={{color: 'white'}}>Start Chatting</Text>
                        </Pressable>
                    </View>
                </ImageBackground>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    background: {
        flex: 1,
        width:'100%',
        justifyContent: 'space-evenly',
        alignItems: 'center'
    },
    title: {
        fontSize: 45,
        fontWeight: '600',
        color: '#fff',
    },
    box: {
        backgroundColor:'white',
        width: '88%',
        height: '44%',
        alignItems: 'center',
        justifyContent: 'space-around',
    },
    inputContainer: {
        flexDirection: 'row',
        width: '88%'
    },
    svgContainer: {
        position: 'absolute',
        zIndex: 4,
        left: 10,
        top: 15
    },
    textInput: {
        flex: 1,
        height: 50,
        width: '88%',
        borderColor: 'gray',
        borderWidth: 1,
        zIndex: 2,
        paddingLeft: 40,
        fontSize: 16,
        fontWeight: '300',
        color: '#757083',
    },
    colorSelector: {
        width: '88%'
    },
    colorText: {
        fontSize: 16,
        fontWeight:'300',
        color:'#757083',
        paddingBottom: 10
    },
    colorsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around'
    },
    color1: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#090C08'
    },
    color2: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#474056'
    },
    color3: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#8A95A5'
    },
    color4: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#B9C6AE'
    },
    chatButton: {
        width: '88%',
        height: '20%',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#757083'
    }

})