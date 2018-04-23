import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const _03e7e774 = () => import('..\\pages\\user.vue' /* webpackChunkName: "pages_user" */).then(m => m.default || m)
const _54730d7c = () => import('..\\pages\\user\\index.vue' /* webpackChunkName: "pages_user_index" */).then(m => m.default || m)
const _731e3ee4 = () => import('..\\pages\\user\\_id.vue' /* webpackChunkName: "pages_user__id" */).then(m => m.default || m)
const _6a2c51a0 = () => import('..\\pages\\about\\index.vue' /* webpackChunkName: "pages_about_index" */).then(m => m.default || m)
const _523a3974 = () => import('..\\pages\\news\\index.vue' /* webpackChunkName: "pages_news_index" */).then(m => m.default || m)
const _239fee48 = () => import('..\\pages\\news\\_id.vue' /* webpackChunkName: "pages_news__id" */).then(m => m.default || m)
const _fc917932 = () => import('..\\pages\\index.vue' /* webpackChunkName: "pages_index" */).then(m => m.default || m)



if (process.client) {
  window.history.scrollRestoration = 'manual'
}
const scrollBehavior = function (to, from, savedPosition) {
  // if the returned position is falsy or an empty object,
  // will retain current scroll position.
  let position = false

  // if no children detected
  if (to.matched.length < 2) {
    // scroll to the top of the page
    position = { x: 0, y: 0 }
  } else if (to.matched.some((r) => r.components.default.options.scrollToTop)) {
    // if one of the children has scrollToTop option set to true
    position = { x: 0, y: 0 }
  }

  // savedPosition is only available for popstate navigations (back button)
  if (savedPosition) {
    position = savedPosition
  }

  return new Promise(resolve => {
    // wait for the out transition to complete (if necessary)
    window.$nuxt.$once('triggerScroll', () => {
      // coords will be used if no selector is provided,
      // or if the selector didn't match any element.
      if (to.hash) {
        let hash = to.hash
        // CSS.escape() is not supported with IE and Edge.
        if (typeof window.CSS !== 'undefined' && typeof window.CSS.escape !== 'undefined') {
          hash = '#' + window.CSS.escape(hash.substr(1))
        }
        try {
          if (document.querySelector(hash)) {
            // scroll to anchor by returning the selector
            position = { selector: hash }
          }
        } catch (e) {
          console.warn('Failed to save scroll position. Please add CSS.escape() polyfill (https://github.com/mathiasbynens/CSS.escape).')
        }
      }
      resolve(position)
    })
  })
}


export function createRouter () {
  return new Router({
    mode: 'history',
    base: '/',
    linkActiveClass: 'nuxt-link-active',
    linkExactActiveClass: 'nuxt-link-exact-active',
    scrollBehavior,
    routes: [
		{
			path: "/user",
			component: _03e7e774,
			children: [
				{
					path: "",
					component: _54730d7c,
					name: "user"
				},
				{
					path: ":id",
					component: _731e3ee4,
					name: "user-id"
				}
			]
		},
		{
			path: "/about",
			component: _6a2c51a0,
			name: "about"
		},
		{
			path: "/news",
			component: _523a3974,
			name: "news"
		},
		{
			path: "/news/:id",
			component: _239fee48,
			name: "news-id"
		},
		{
			path: "/",
			component: _fc917932,
			name: "index"
		}
    ],
    
    
    fallback: false
  })
}
