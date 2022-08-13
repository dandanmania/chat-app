import React from "react";
import { Text, View, Platform, Keyboard, KeyboardAvoidingView, TouchableWithoutFeedback } from "react-native";
import { GiftedChat, Bubble, Day, SystemMessage } from 'react-native-gifted-chat';

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
            }
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
        // Set topbar to display name from Start Screen
        let name = this.props.route.params.name;
        this.props.navigation.setOptions({ title: name });

        // Anonymous Authentication
        this.referenceMessageList = firebase.firestore().collection('messages');
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
        })
    }

    // Stop listening for changes
    componentWillUnmount() {
        this.authUnsubscribe();
    }

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
            text: message.text,
            createdAt: message.createdAt,
            user: message.user,
        })
    }

    onSend(messages = []) {
        this.setState(previousState => ({
            messages: GiftedChat.append(previousState.messages, messages),
        }),
            () => {
                this.addMessage(this.state.messages[0])
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

    render() {
        let { bgColor, name } = this.props.route.params;
        return (
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={{flex: 1, backgroundColor: bgColor}}>
                    <GiftedChat 
                        renderBubble={this.renderBubble.bind(this)}
                        renderDay={this.renderDay.bind(this)}
                        renderSystemMessage={this.renderSystemMessage.bind(this)}
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
        )
    }
}