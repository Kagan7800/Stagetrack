ReactDOM.render(

    <MainContextProvider>
        <SessionContextProvider>
            <App/>
        </SessionContextProvider>
    </MainContextProvider>, 

    document.querySelector('#root'));

//connecting to firebase
var firebaseConfig = {
    apiKey: "AIzaSyB40sDAY13tt2Ont-SdjDrn5y_qMy2YvpQ",
    authDomain: "gigtrack-afa44.firebaseapp.com",
    databaseURL: "https://gigtrack-afa44.firebaseio.com",
    projectId: "gigtrack-afa44",
    storageBucket: "gigtrack-afa44.appspot.com",
    messagingSenderId: "479247284217",
    appId: "1:479247284217:web:e0916361443f3ea377af28",
    measurementId: "G-3FSGGMZR8T"
};

// var video = videojs('videojs');

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
var db = firebase.firestore();

// Create a root reference
var storageRef = firebase.storage().ref();

// sign in providers
var google_provider = new firebase.auth.GoogleAuthProvider();
var facebook_provider = new firebase.auth.FacebookAuthProvider();

class ListenableVariable {
    constructor(val) {
        this.valueInternal = val;
    }

    valueListener = () => {
        
    }
    set value(val) {
        if (val !== this.valueInternal) {
            this.valueInternal = val;
            this.valueListener(val);
        }        
    }
    get value() {
        return this.valueInternal;
    }
    registerListener = (listener) => {
        this.valueListener = listener;
    }

}

var playlist;
var ee;

var playlistAction = new ListenableVariable(undefined);
var playlistActionTrack = new ListenableVariable(undefined);

function askConfirmDeleteTrack(track) {
    document.getElementById('deleteTrackModalTitle').innerText = track.name;
    $('#deleteTrackModal').modal();
    document.getElementById('btn-confirmDeleteTrack').onclick = () => { deleteTrack(track) }
}

function playlistDeleteTrackHandler(track) {
    // order of the following statements is important. playlist action track should be changed first, then action will change
    // which is getting listened to in context. hence, when action is detected, track is already available to perfom this aciton on
    playlistActionTrack.value = track;
    playlistAction.value = 'DELETE';
}
