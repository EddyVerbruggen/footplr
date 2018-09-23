import Vue from 'nativescript-vue'
import BackendService from './BackendService';
import firebase from 'nativescript-plugin-firebase';
import { backendService } from "../main";

export default class AuthService extends BackendService {

    async register(user) {
        const createdUser = await firebase.createUser({
            email: user.email,
            password: user.password
        });
        console.log("Created user: " + JSON.stringify(createdUser));
        return await firebase.firestore.add("players", {
            id: createdUser.uid
        });
    }

    async login(user) {
        const result = await firebase.login({
            type: firebase.LoginType.PASSWORD,
            passwordOptions: {
                email: user.email,
                password: user.password
            }
        })
        console.log("Logged in user: " + JSON.stringify(result));

        const snapshot = await firebase.firestore
            .collection("players")
            .where("id", "==", result.uid)
            .get();

        // there will be only 1 record actually
        snapshot.forEach(playerDoc => {
            result.player = playerDoc.data();
            result.player.id = playerDoc.id;
        });

        console.log("User: " + JSON.stringify(result));

        backendService.user = result;
        return result;
    }

    async updatePlayerDataInFirebase(playerData) {
        // lazy loading
        if (!this.playerRef) {
            this.playerRef = firebase.firestore.collection("players").doc(backendService.user.player.id)
        }
        return this.playerRef.update(playerData);
    }

    async resetPassword(email) {
        const result = await firebase.resetPassword({
            email: email
        })
        return JSON.stringify(result);
    }

    async logout() {
        backendService.user = null;
        return firebase.logout();
    }
}