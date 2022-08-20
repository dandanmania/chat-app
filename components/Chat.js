import React from "react";
import { View, Platform, Keyboard, KeyboardAvoidingView, TouchableWithoutFeedback, StatusBar } from "react-native";
import { GiftedChat, Bubble, Day, SystemMessage, InputToolbar } from 'react-native-gifted-chat';
import ConnectedCustomActions from './CustomActions';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import MapView from "react-native-maps";
import { ActionSheetProvider } from '@expo/react-native-action-sheet';

const firebase = require('firebase');
require('firebase/firestore');

export default class Chat extends React.Component {
    constructor() {
        super();
        this.state = {
            messages: [],
            uid: '',
            user: {
                _id: '',
                name: '',
            },
            image: null,
            location: null,
            isConnected: false
        }

        const firebaseConfig = {
            apiKey: "AIzaSyB-9OTwVESjGVkKVcv69QABXbI3wToP0Yk",
            authDomain: "chat-app-d726b.firebaseapp.com",
            projectId: "chat-app-d726b",
            storageBucket: "chat-app-d726b.appspot.com",
            messagingSenderId: "132258126482",
            appId: "1:132258126482:web:e8163e7734bd0e930da44b"
        };

        if (!firebase.apps.length) {
            firebase.initializeApp(firebaseConfig)
        }
        
        this.referenceMessageList = firebase.firestore().collection('messages');
    }

    componentDidMount() {
        // Check online connection
        NetInfo.fetch().then((connection) => {
            if (connection.isConnected) {
                console.log('online');
                this.setState({isConnected: true})
                this.referenceMessageList = firebase.firestore().collection('messages');
            
                
                // Anonymous Authentication
                this.authUnsubscribe = firebase.auth().onAuthStateChanged((user) => {
                    if (!user) {
                        firebase.auth().signInAnonymously();
                    }
        
                    this.setState({
                        uid: user.uid,
                        messages: [],
                        user: {
                            _id: user.uid,
                            name: name,
                        }
                    })
    
                    this.unsubscribe = this.referenceMessageList
                    .orderBy('createdAt', 'desc')
                    .onSnapshot(this.onCollectionUpdate);

                    // Save User State after sign in (for Offline)
                    this.saveUser();
                })
            } else {
                console.log('offline');
                // Get User and Messages Offline
                this.getUser();
                this.getMessages();
            }
        });

        // Set topbar to display name from Start Screen
        let name = this.props.route.params.name;
        this.props.navigation.setOptions({ title: name });
    }

    // Stop listening for changes
    componentWillUnmount() {
        if(this.state.isConnected) {
            this.authUnsubscribe();
            this.unsubscribe();
        }
    }

    // getMessages function
    async getMessages() {
        let messages = '';
        try {
            messages = await AsyncStorage.getItem('messages') || [];
            this.setState({
                messages: JSON.parse(messages)
            });
        } catch(error) {
            console.log(error.message);
        }
    };

    onCollectionUpdate = (querySnapshot) => {
        const messages = [];
        // go through each document
        querySnapshot.forEach((doc) => {
            // get the QueryDocumentSnapshot's data
            let data = doc.data();
            messages.push({
                _id: data._id,
                text: data.text,
                createdAt: data.createdAt.toDate(),
                user: {
                    _id: data.user._id,
                    name: data.user.name
                },
                image: data.image,
                location: data.location
            });
        });
        this.setState({
            messages,
        });
    }


    // Add message to state and then to firestore
    addMessage(message) {
        this.referenceMessageList.add({
            uid: this.state.uid,
            _id: message._id,
            text: message.text || '',
            createdAt: message.createdAt,
            user: message.user,
            image: message.image || null,
            location: message.location || null,
        })
    }

    async saveMessages() {
        try {
            await AsyncStorage.setItem('messages', JSON.stringify(this.state.messages));
        } catch(error) {
            console.log(error.message);
        }
    }

    // Save User (for Offline)
    async saveUser() {
        try {
            await AsyncStorage.setItem('user', JSON.stringify(this.state.user));
        } catch(error) {
            console.log(error.message);
        }
    }

    // Get User (for Offline)
    async getUser() {
        let user = { _id: '', name: '' };
        try {
            user = await AsyncStorage.getItem('user') || { _id: '', name: '' };
            this.setState({
                user: JSON.parse(user)
            })
        } catch(error) {
            console.log(error.message);
        }

    }

    async deleteMessages() {
        try {
            await AsyncStorage.removeItem('messages');
            this.setState({
                messages: []
            })
        } catch(error) {
            console.log(error.message);
        }
    }

    onSend(messages = []) {
        this.setState(previousState => ({
            messages: GiftedChat.append(previousState.messages, messages),
        }),
            () => {
                this.addMessage(this.state.messages[0])
                this.saveMessages();
            }
        )
    }


    // Gifted Chat Styling
    renderDay(props) {
        return (
            <Day
                {...props}
                textStyle={{color: this.props.route.params.sysColor}}
            />
        )
    }

    renderSystemMessage(props) {
        return (
            <SystemMessage
                {...props}
                textStyle={{color: this.props.route.params.sysColor}}
            />
        )
    }

    renderBubble(props) {
        return (
            <Bubble 
                {...props}
                wrapperStyle={{
                    right: {
                        backgroundColor: '#26365F'
                    }
                }}
            />
        )
    }

    renderInputToolbar(props) {
        if (this.state.isConnected == false) {
        } else {
            return(
                <InputToolbar
                {...props}
                />
            )
        }
    }

    renderCustomActions = (props) => {
        return <ConnectedCustomActions {...props} />;
    }

    renderCustomView = (props) => {
        const { currentMessage } = props;
        if (currentMessage.location) {
            return (
                <MapView 
                    style={{ width: 150, height: 100, borderRadius: 13, margin: 3}}
                    region={{
                        latitude: currentMessage.location.latitude,
                        longitude: currentMessage.location.longitude,
                        latitudeDelta: 0.0922,
                        longitudeDelta: 0.0421,
                    }}
                />
            )
        }
        return null;
    }

    render() {
        let { bgColor, name } = this.props.route.params;
        return (
            <ActionSheetProvider>
            <TouchableWithoutFeedback
                onPress={Keyboard.dismiss}
                accessible={true}
                accessibilityLabel='More Options'
                accessibilityHint='Choose an Image, Take a Photo, or Send Your geolocation'
                accessibilityRole='button'
                >
                <View style={{flex: 1, backgroundColor: bgColor, ...Platform.select({ios: {marginBottom: 40}})}}>
                    { Platform.OS === 'android' ? <StatusBar barStyle='light-content'/> : <StatusBar barStyle='dark-content' /> }
                    <GiftedChat 
                        wrapInSafeArea={false}
                        bottomOffset={40}
                        renderBubble={this.renderBubble.bind(this)}
                        renderDay={this.renderDay.bind(this)}
                        renderSystemMessage={this.renderSystemMessage.bind(this)}
                        renderInputToolbar={this.renderInputToolbar.bind(this)}
                        renderActions={this.renderCustomActions}
                        renderCustomView={this.renderCustomView.bind(this)}
                        messages = {this.state.messages}
                        onSend={(messages) => this.onSend(messages)}
                        user={{
                            _id: this.state.user._id,
                            name: name,
                        }}
                    />
                    { Platform.OS === 'android' ? <KeyboardAvoidingView behavior="height" /> : null }
                </View>
            </TouchableWithoutFeedback>
            </ActionSheetProvider>
        )
    }
}