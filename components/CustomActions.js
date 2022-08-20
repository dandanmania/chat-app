import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { connectActionSheet } from '@expo/react-native-action-sheet';
import * as Permissions from 'expo-permissions';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import firebase from 'firebase';


class CustomActions extends React.Component {
    // Send Image
    pickImage = async () => {
        const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
        try {
        if(status === 'granted') {
          let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
          }).catch(error => console.log(error));
    
          if(!result.cancelled) {
            const imageUrl = await this.uploadImageFetch(result.uri);
            this.props.onSend({ image: imageUrl });
          }
        }
        } catch (error) {
            console.log(error.message);
        }
      }

      takePhoto = async () => {
        const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL, Permissions.CAMERA);
    
        if(status === 'granted') {
          let result = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
          }).catch(error => console.log(error));
    
          if(!result.cancelled) {
            const imageUrl = await this.uploadImageFetch(result.uri);
            this.props.onSend({ image: imageUrl });
          }
        }
      }

      getLocation = async () => {
        try {
        const { status } = await Permissions.askAsync(Permissions.LOCATION);
    
        if(status === 'granted') {
          let result = await Location.getCurrentPositionAsync({}).catch((error) => console.log(error));
          if (result) {
            this.props.onSend({
                location: {
                    longitude: result.coords.longitude,
                    latitude: result.coords.latitude,
                }
            })
          }
        }
        } catch(error) {
            console.log(error.message);
        }
    }

    uploadImageFetch = async (uri) => {
        const blob = await new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.onload = function() {
                resolve(xhr.response);
            };
            xhr.onerror = function (e) {
                console.log(e)
                reject(new TypeError('Network request failed'));
            };
            xhr.responseType = 'blob';
            xhr.open('GET', uri, true);
            xhr.send(null);
        });

        const imageNameBefore = uri.split('/');
        const imageName = imageNameBefore[imageNameBefore.length - 1];

        const ref = firebase.storage().ref().child(`images/${imageName}`);

        const snapshot = await ref.put(blob);

        blob.close();

        return await snapshot.ref.getDownloadURL();
    }


    onActionPress = () => {
        const options = ['Choose From Library', 'Take Picture', 'Send Location', 'Cancel'];
        const cancelButtonIndex = options.length - 1;
        this.props.showActionSheetWithOptions(
            {
                options,
                cancelButtonIndex,
            },
            async (buttonIndex) => {
                switch (buttonIndex) {
                    case 0:
                        console.log('User wants to pick an image');
                        return this.pickImage();
                    case 1:
                        console.log('User wants to take a photo');
                        return this.takePhoto();
                    case 2:
                        console.log('User wants to get their location');
                        return this.getLocation();
                }
            }
        );
    };
        
    render() {
        return(
            <TouchableOpacity
                style={[styles.container]}
                onPress={this.onActionPress}
                accessible={true}
                accessibilityLabel='More Options'
                accessibilityHint='Choose an Image, Take a Photo, or Send Your geolocation'
                accessibilityRole='button'
                >
                <View style={[styles.wrapper, this.props.wrapperStyle]}>
                    <Text style={[styles.iconText, this.props.iconTextStyle]}>+</Text>
                </View>
            </TouchableOpacity>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        width: 26,
        height: 26,
        marginLeft: 10,
        marginBottom: 10,
    },
    wrapper: {
        borderRadius: 13,
        borderColor: '#b2b2b2',
        borderWidth: 2,
        flex: 1,
    },
    iconText: {
        color: '#b2b2b2',
        fontWeight: 'bold',
        fontSize: 16,
        backgroundColor: 'transparent',
        textAlign: 'center',
    }
})

const ConnectedCustomActions = connectActionSheet(CustomActions);

export default ConnectedCustomActions;