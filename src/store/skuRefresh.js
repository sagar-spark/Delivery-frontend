import vueCookies from 'vue-cookies'
import axios from "axios"

function getSKURefreshStatus() {
	return vueCookies.get('skuRefresh')
}

function setSKURefreshStatus() {
	vueCookies.set('skuRefresh', 'y', '3h')
}

export {getSKURefreshStatus, setSKURefreshStatus}