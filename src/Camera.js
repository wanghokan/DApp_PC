import React, { Component } from "react";
import Photo from 'react-html5-camera-photo';
import 'react-html5-camera-photo/build/css/index.css';

class Camera extends Component {

    handleTakePhoto (dataUri) {
        // Do stuff with the photo...
        const reader = new window.FileReader()
        console.log(typeof dataUri)
        console.log('takePhoto');
        
        
    }
    handleTakePhotoAnimationDone (dataUri) {
        // Do stuff with the photo...
        console.log('takePhoto');
    }
    handleCameraError (error) {
        console.log('handleCameraError', error);
    }
     
    handleCameraStart (stream) {
        console.log('handleCameraStart');
    }
     
    handleCameraStop () {
        console.log('handleCameraStop');
    }

    render() {
        return(
            <div>
                <Photo onTakePhoto = { (dataUri) => { this.handleTakePhoto(dataUri); } }
                       onTakePhotoAnimationDone = { (dataUri) => { this.handleTakePhotoAnimationDone(dataUri); } }
                       onCameraError = { (error) => { this.handleCameraError(error); } }
                       idealResolution = {{width: 640, height: 480}}
                       imageCompression = {0.97}
                       isMaxResolution = {true}
                       isImageMirror = {false}
                       isSilentMode = {false}
                       isDisplayStartCameraError = {true}
                       isFullscreen = {false}
                       sizeFactor = {1}
                       onCameraStart = { (stream) => { this.handleCameraStart(stream); } }
                       onCameraStop = { () => { this.handleCameraStop(); } }
                />
            </div>
        );
    }
}

export default Camera;