import vueCookies from 'vue-cookies'
import axios from "axios"

function getAccessToken() {
	return vueCookies.get('accessToken')
}

function decodePayload(token) {
	
	if (token != undefined || token != null) {
		return JSON.parse(atob(token.split(".")[1]))
	} else {
		return undefined
	}
}

function validateSession(router) {
	let access_token = vueCookies.get('accessToken')
	// validate access token

	if (access_token == null || access_token == undefined || access_token == "undefined") {
    	router.push('/pages/login')
	}
}

function closeSession(router) {
	vueCookies.remove('accessToken')
	window.localStorage.clear()
	router.push('/pages/login')
}

export {getAccessToken, decodePayload, validateSession, closeSession}