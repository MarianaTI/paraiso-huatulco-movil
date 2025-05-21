/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./public/service-worker.js":
/*!**********************************!*\
  !*** ./public/service-worker.js ***!
  \**********************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval(__webpack_require__.ts("importScripts(\"https://storage.googleapis.com/workbox-cdn/releases/6.5.4/workbox-sw.js\");\n// Precaching\nworkbox.precaching.precacheAndRoute([]);\nself.addEventListener('install', (event)=>{\n    // console.log('[SW] Instalado');\n    self.skipWaiting();\n});\nself.addEventListener('activate', (event)=>{\n    // console.log('[SW] Activado');\n    return self.clients.claim();\n});\n// Manejo del evento de sincronización de fondo\nself.addEventListener('sync', (event)=>{\n    if (event.tag === 'sync-bookings') {\n        // console.log('[SW] Evento de sincronización recibido');\n        event.waitUntil(sendOfflineBookingsToServer());\n    }\n});\n// Manejo de mensaje manual desde la app\nself.addEventListener('message', (event)=>{\n    if (event.data && event.data.action === 'force-sync-bookings') {\n        // console.log('[SW] 🔄 Forzando sincronización manual');\n        event.waitUntil(sendOfflineBookingsToServer());\n    }\n});\n// Función para enviar reservas offline\nconst sendOfflineBookingsToServer = async ()=>{\n    // console.log('[SW] Enviando reservas offline al servidor...');\n    const db = await getOfflineDB();\n    const tx = db.transaction('reservas', 'readonly');\n    const store = tx.objectStore('reservas');\n    const getAllRequest = store.getAll();\n    getAllRequest.onsuccess = async ()=>{\n        const all = getAllRequest.result;\n        // console.log(`[SW] ${all.length} reservas encontradas`);\n        for (const reserva of all){\n            try {\n                const formData = new FormData();\n                for(const key in reserva){\n                    if (reserva[key] !== undefined && reserva[key] !== null) {\n                        formData.append(key, reserva[key]);\n                    }\n                }\n                const res = await fetch('https://portaldemo.paraisohuatulco.com/rents/booking', {\n                    method: 'POST',\n                    body: formData\n                });\n                if (res.ok) {\n                    // 🔁 Crear NUEVA transacción para eliminar\n                    const deleteTx = db.transaction('reservas', 'readwrite');\n                    const deleteStore = deleteTx.objectStore('reservas');\n                    deleteStore.delete(reserva.id);\n                    // console.log(`[SW] ✅ Reserva enviada y eliminada: ${reserva.id}`);\n                    // Notificación \n                    self.registration.showNotification(\"Reserva enviada\", {\n                        body: \"Tu reserva offline fue enviada correctamente.\",\n                        icon: \"/icon512_rounded.png\"\n                    });\n                } else {\n                    console.warn('[SW] ⚠️ Error del servidor al reenviar reserva');\n                }\n            } catch (error) {\n                console.error('[SW] ❌ Error de red:', error);\n            }\n        }\n    };\n    getAllRequest.onerror = ()=>{\n        console.error('[SW] ❌ Error al leer reservas de IndexedDB');\n    };\n};\n// IndexedDB setup\nconst getOfflineDB = async ()=>{\n    return await new Promise((resolve, reject)=>{\n        const request = indexedDB.open('offline-db', 1);\n        request.onupgradeneeded = (event)=>{\n            const db = event.target.result;\n            if (!db.objectStoreNames.contains('reservas')) {\n                db.createObjectStore('reservas', {\n                    keyPath: 'id',\n                    autoIncrement: true\n                });\n            }\n        };\n        request.onsuccess = ()=>resolve(request.result);\n        request.onerror = ()=>reject(request.error);\n    });\n};\n\n\n;\n    // Wrapped in an IIFE to avoid polluting the global scope\n    ;\n    (function () {\n        var _a, _b;\n        // Legacy CSS implementations will `eval` browser code in a Node.js context\n        // to extract CSS. For backwards compatibility, we need to check we're in a\n        // browser context before continuing.\n        if (typeof self !== 'undefined' &&\n            // AMP / No-JS mode does not inject these helpers:\n            '$RefreshHelpers$' in self) {\n            // @ts-ignore __webpack_module__ is global\n            var currentExports = module.exports;\n            // @ts-ignore __webpack_module__ is global\n            var prevSignature = (_b = (_a = module.hot.data) === null || _a === void 0 ? void 0 : _a.prevSignature) !== null && _b !== void 0 ? _b : null;\n            // This cannot happen in MainTemplate because the exports mismatch between\n            // templating and execution.\n            self.$RefreshHelpers$.registerExportsForReactRefresh(currentExports, module.id);\n            // A module can be accepted automatically based on its exports, e.g. when\n            // it is a Refresh Boundary.\n            if (self.$RefreshHelpers$.isReactRefreshBoundary(currentExports)) {\n                // Save the previous exports signature on update so we can compare the boundary\n                // signatures. We avoid saving exports themselves since it causes memory leaks (https://github.com/vercel/next.js/pull/53797)\n                module.hot.dispose(function (data) {\n                    data.prevSignature =\n                        self.$RefreshHelpers$.getRefreshBoundarySignature(currentExports);\n                });\n                // Unconditionally accept an update to this module, we'll check if it's\n                // still a Refresh Boundary later.\n                // @ts-ignore importMeta is replaced in the loader\n                /* unsupported import.meta.webpackHot */ undefined.accept();\n                // This field is set when the previous version of this module was a\n                // Refresh Boundary, letting us know we need to check for invalidation or\n                // enqueue an update.\n                if (prevSignature !== null) {\n                    // A boundary can become ineligible if its exports are incompatible\n                    // with the previous exports.\n                    //\n                    // For example, if you add/remove/change exports, we'll want to\n                    // re-execute the importing modules, and force those components to\n                    // re-render. Similarly, if you convert a class component to a\n                    // function, we want to invalidate the boundary.\n                    if (self.$RefreshHelpers$.shouldInvalidateReactRefreshBoundary(prevSignature, self.$RefreshHelpers$.getRefreshBoundarySignature(currentExports))) {\n                        module.hot.invalidate();\n                    }\n                    else {\n                        self.$RefreshHelpers$.scheduleUpdate();\n                    }\n                }\n            }\n            else {\n                // Since we just executed the code for the module, it's possible that the\n                // new exports made it ineligible for being a boundary.\n                // We only care about the case when we were _previously_ a boundary,\n                // because we already accepted this update (accidental side effect).\n                var isNoLongerABoundary = prevSignature !== null;\n                if (isNoLongerABoundary) {\n                    module.hot.invalidate();\n                }\n            }\n        }\n    })();\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QyxTQUFTO29CQUNUQyxlQUFlO2dCQUNqQjtZQUNGO1FBQ0Y7UUFDQVQsUUFBUTVCLFNBQVMsR0FBRyxJQUFNMEIsUUFBUUUsUUFBUTFCLE1BQU07UUFDaEQwQixRQUFRSixPQUFPLEdBQUcsSUFBTUcsT0FBT0MsUUFBUUwsS0FBSztJQUM5QztBQUNGIiwic291cmNlcyI6WyJDOlxcU29sdWNpb25lc0lEXFxQcm95ZWN0b1xccGFyYWlzby1odWF0dWxjby1tb3ZpbFxccGFyYWlzby1odWF0dWxjby1tb3ZpbFxccHVibGljXFxzZXJ2aWNlLXdvcmtlci5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnRTY3JpcHRzKFxyXG4gIFwiaHR0cHM6Ly9zdG9yYWdlLmdvb2dsZWFwaXMuY29tL3dvcmtib3gtY2RuL3JlbGVhc2VzLzYuNS40L3dvcmtib3gtc3cuanNcIlxyXG4pO1xyXG5cclxuLy8gUHJlY2FjaGluZ1xyXG53b3JrYm94LnByZWNhY2hpbmcucHJlY2FjaGVBbmRSb3V0ZShzZWxmLl9fV0JfTUFOSUZFU1QpO1xyXG5cclxuc2VsZi5hZGRFdmVudExpc3RlbmVyKCdpbnN0YWxsJywgKGV2ZW50KSA9PiB7XHJcbiAgLy8gY29uc29sZS5sb2coJ1tTV10gSW5zdGFsYWRvJyk7XHJcbiAgc2VsZi5za2lwV2FpdGluZygpO1xyXG59KTtcclxuXHJcbnNlbGYuYWRkRXZlbnRMaXN0ZW5lcignYWN0aXZhdGUnLCAoZXZlbnQpID0+IHtcclxuICAvLyBjb25zb2xlLmxvZygnW1NXXSBBY3RpdmFkbycpO1xyXG4gIHJldHVybiBzZWxmLmNsaWVudHMuY2xhaW0oKTtcclxufSk7XHJcblxyXG4vLyBNYW5lam8gZGVsIGV2ZW50byBkZSBzaW5jcm9uaXphY2nDs24gZGUgZm9uZG9cclxuc2VsZi5hZGRFdmVudExpc3RlbmVyKCdzeW5jJywgKGV2ZW50KSA9PiB7XHJcbiAgaWYgKGV2ZW50LnRhZyA9PT0gJ3N5bmMtYm9va2luZ3MnKSB7XHJcbiAgICAvLyBjb25zb2xlLmxvZygnW1NXXSBFdmVudG8gZGUgc2luY3Jvbml6YWNpw7NuIHJlY2liaWRvJyk7XHJcbiAgICBldmVudC53YWl0VW50aWwoc2VuZE9mZmxpbmVCb29raW5nc1RvU2VydmVyKCkpO1xyXG4gIH1cclxufSk7XHJcblxyXG4vLyBNYW5lam8gZGUgbWVuc2FqZSBtYW51YWwgZGVzZGUgbGEgYXBwXHJcbnNlbGYuYWRkRXZlbnRMaXN0ZW5lcignbWVzc2FnZScsIChldmVudCkgPT4ge1xyXG4gIGlmIChldmVudC5kYXRhICYmIGV2ZW50LmRhdGEuYWN0aW9uID09PSAnZm9yY2Utc3luYy1ib29raW5ncycpIHtcclxuICAgIC8vIGNvbnNvbGUubG9nKCdbU1ddIPCflIQgRm9yemFuZG8gc2luY3Jvbml6YWNpw7NuIG1hbnVhbCcpO1xyXG4gICAgZXZlbnQud2FpdFVudGlsKHNlbmRPZmZsaW5lQm9va2luZ3NUb1NlcnZlcigpKTtcclxuICB9XHJcbn0pO1xyXG5cclxuLy8gRnVuY2nDs24gcGFyYSBlbnZpYXIgcmVzZXJ2YXMgb2ZmbGluZVxyXG5jb25zdCBzZW5kT2ZmbGluZUJvb2tpbmdzVG9TZXJ2ZXIgPSBhc3luYyAoKSA9PiB7XHJcbiAgLy8gY29uc29sZS5sb2coJ1tTV10gRW52aWFuZG8gcmVzZXJ2YXMgb2ZmbGluZSBhbCBzZXJ2aWRvci4uLicpO1xyXG4gIGNvbnN0IGRiID0gYXdhaXQgZ2V0T2ZmbGluZURCKCk7XHJcbiAgY29uc3QgdHggPSBkYi50cmFuc2FjdGlvbigncmVzZXJ2YXMnLCAncmVhZG9ubHknKTtcclxuICBjb25zdCBzdG9yZSA9IHR4Lm9iamVjdFN0b3JlKCdyZXNlcnZhcycpO1xyXG4gIGNvbnN0IGdldEFsbFJlcXVlc3QgPSBzdG9yZS5nZXRBbGwoKTtcclxuXHJcbiAgZ2V0QWxsUmVxdWVzdC5vbnN1Y2Nlc3MgPSBhc3luYyAoKSA9PiB7XHJcbiAgICBjb25zdCBhbGwgPSBnZXRBbGxSZXF1ZXN0LnJlc3VsdDtcclxuICAgIC8vIGNvbnNvbGUubG9nKGBbU1ddICR7YWxsLmxlbmd0aH0gcmVzZXJ2YXMgZW5jb250cmFkYXNgKTtcclxuXHJcbiAgICBmb3IgKGNvbnN0IHJlc2VydmEgb2YgYWxsKSB7XHJcbiAgICAgIHRyeSB7XHJcbiAgICAgICAgY29uc3QgZm9ybURhdGEgPSBuZXcgRm9ybURhdGEoKTtcclxuICAgICAgICBmb3IgKGNvbnN0IGtleSBpbiByZXNlcnZhKSB7XHJcbiAgICAgICAgICBpZiAocmVzZXJ2YVtrZXldICE9PSB1bmRlZmluZWQgJiYgcmVzZXJ2YVtrZXldICE9PSBudWxsKSB7XHJcbiAgICAgICAgICAgIGZvcm1EYXRhLmFwcGVuZChrZXksIHJlc2VydmFba2V5XSk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zdCByZXMgPSBhd2FpdCBmZXRjaCgnaHR0cHM6Ly9wb3J0YWxkZW1vLnBhcmFpc29odWF0dWxjby5jb20vcmVudHMvYm9va2luZycsIHtcclxuICAgICAgICAgIG1ldGhvZDogJ1BPU1QnLFxyXG4gICAgICAgICAgYm9keTogZm9ybURhdGEsXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGlmIChyZXMub2spIHtcclxuICAgICAgICAgIC8vIPCflIEgQ3JlYXIgTlVFVkEgdHJhbnNhY2Npw7NuIHBhcmEgZWxpbWluYXJcclxuICAgICAgICAgIGNvbnN0IGRlbGV0ZVR4ID0gZGIudHJhbnNhY3Rpb24oJ3Jlc2VydmFzJywgJ3JlYWR3cml0ZScpO1xyXG4gICAgICAgICAgY29uc3QgZGVsZXRlU3RvcmUgPSBkZWxldGVUeC5vYmplY3RTdG9yZSgncmVzZXJ2YXMnKTtcclxuICAgICAgICAgIGRlbGV0ZVN0b3JlLmRlbGV0ZShyZXNlcnZhLmlkKTtcclxuICAgICAgICAgIC8vIGNvbnNvbGUubG9nKGBbU1ddIOKchSBSZXNlcnZhIGVudmlhZGEgeSBlbGltaW5hZGE6ICR7cmVzZXJ2YS5pZH1gKTtcclxuXHJcbiAgICAgICAgICAvLyBOb3RpZmljYWNpw7NuIFxyXG4gICAgICAgICAgc2VsZi5yZWdpc3RyYXRpb24uc2hvd05vdGlmaWNhdGlvbihcIlJlc2VydmEgZW52aWFkYVwiLCB7XHJcbiAgICAgICAgICAgIGJvZHk6IFwiVHUgcmVzZXJ2YSBvZmZsaW5lIGZ1ZSBlbnZpYWRhIGNvcnJlY3RhbWVudGUuXCIsXHJcbiAgICAgICAgICAgIGljb246IFwiL2ljb241MTJfcm91bmRlZC5wbmdcIiwgXHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgY29uc29sZS53YXJuKCdbU1ddIOKaoO+4jyBFcnJvciBkZWwgc2Vydmlkb3IgYWwgcmVlbnZpYXIgcmVzZXJ2YScpO1xyXG4gICAgICAgIH1cclxuICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgICBjb25zb2xlLmVycm9yKCdbU1ddIOKdjCBFcnJvciBkZSByZWQ6JywgZXJyb3IpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfTtcclxuXHJcbiAgZ2V0QWxsUmVxdWVzdC5vbmVycm9yID0gKCkgPT4ge1xyXG4gICAgY29uc29sZS5lcnJvcignW1NXXSDinYwgRXJyb3IgYWwgbGVlciByZXNlcnZhcyBkZSBJbmRleGVkREInKTtcclxuICB9O1xyXG59O1xyXG5cclxuXHJcbi8vIEluZGV4ZWREQiBzZXR1cFxyXG5jb25zdCBnZXRPZmZsaW5lREIgPSBhc3luYyAoKSA9PiB7XHJcbiAgcmV0dXJuIGF3YWl0IG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuICAgIGNvbnN0IHJlcXVlc3QgPSBpbmRleGVkREIub3Blbignb2ZmbGluZS1kYicsIDEpO1xyXG4gICAgcmVxdWVzdC5vbnVwZ3JhZGVuZWVkZWQgPSAoZXZlbnQpID0+IHtcclxuICAgICAgY29uc3QgZGIgPSBldmVudC50YXJnZXQucmVzdWx0O1xyXG4gICAgICBpZiAoIWRiLm9iamVjdFN0b3JlTmFtZXMuY29udGFpbnMoJ3Jlc2VydmFzJykpIHtcclxuICAgICAgICBkYi5jcmVhdGVPYmplY3RTdG9yZSgncmVzZXJ2YXMnLCB7XHJcbiAgICAgICAgICBrZXlQYXRoOiAnaWQnLFxyXG4gICAgICAgICAgYXV0b0luY3JlbWVudDogdHJ1ZSxcclxuICAgICAgICB9KTtcclxuICAgICAgfVxyXG4gICAgfTtcclxuICAgIHJlcXVlc3Qub25zdWNjZXNzID0gKCkgPT4gcmVzb2x2ZShyZXF1ZXN0LnJlc3VsdCk7XHJcbiAgICByZXF1ZXN0Lm9uZXJyb3IgPSAoKSA9PiByZWplY3QocmVxdWVzdC5lcnJvcik7XHJcbiAgfSk7XHJcbn07XHJcbiJdLCJuYW1lcyI6WyJpbXBvcnRTY3JpcHRzIiwid29ya2JveCIsInByZWNhY2hpbmciLCJwcmVjYWNoZUFuZFJvdXRlIiwic2VsZiIsIl9fV0JfTUFOSUZFU1QiLCJhZGRFdmVudExpc3RlbmVyIiwiZXZlbnQiLCJza2lwV2FpdGluZyIsImNsaWVudHMiLCJjbGFpbSIsInRhZyIsIndhaXRVbnRpbCIsInNlbmRPZmZsaW5lQm9va2luZ3NUb1NlcnZlciIsImRhdGEiLCJhY3Rpb24iLCJkYiIsImdldE9mZmxpbmVEQiIsInR4IiwidHJhbnNhY3Rpb24iLCJzdG9yZSIsIm9iamVjdFN0b3JlIiwiZ2V0QWxsUmVxdWVzdCIsImdldEFsbCIsIm9uc3VjY2VzcyIsImFsbCIsInJlc3VsdCIsInJlc2VydmEiLCJmb3JtRGF0YSIsIkZvcm1EYXRhIiwia2V5IiwidW5kZWZpbmVkIiwiYXBwZW5kIiwicmVzIiwiZmV0Y2giLCJtZXRob2QiLCJib2R5Iiwib2siLCJkZWxldGVUeCIsImRlbGV0ZVN0b3JlIiwiZGVsZXRlIiwiaWQiLCJyZWdpc3RyYXRpb24iLCJzaG93Tm90aWZpY2F0aW9uIiwiaWNvbiIsImNvbnNvbGUiLCJ3YXJuIiwiZXJyb3IiLCJvbmVycm9yIiwiUHJvbWlzZSIsInJlc29sdmUiLCJyZWplY3QiLCJyZXF1ZXN0IiwiaW5kZXhlZERCIiwib3BlbiIsIm9udXBncmFkZW5lZWRlZCIsInRhcmdldCIsIm9iamVjdFN0b3JlTmFtZXMiLCJjb250YWlucyIsImNyZWF0ZU9iamVjdFN0b3JlIiwia2V5UGF0aCIsImF1dG9JbmNyZW1lbnQiXSwiaWdub3JlTGlzdCI6W10sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///./public/service-worker.js\n"));

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			if (cachedModule.error !== undefined) throw cachedModule.error;
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			id: moduleId,
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		var threw = true;
/******/ 		try {
/******/ 			__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 			threw = false;
/******/ 		} finally {
/******/ 			if(threw) delete __webpack_module_cache__[moduleId];
/******/ 		}
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/trusted types policy */
/******/ 	(() => {
/******/ 		var policy;
/******/ 		__webpack_require__.tt = () => {
/******/ 			// Create Trusted Type policy if Trusted Types are available and the policy doesn't exist yet.
/******/ 			if (policy === undefined) {
/******/ 				policy = {
/******/ 					createScript: (script) => (script)
/******/ 				};
/******/ 				if (typeof trustedTypes !== "undefined" && trustedTypes.createPolicy) {
/******/ 					policy = trustedTypes.createPolicy("nextjs#bundler", policy);
/******/ 				}
/******/ 			}
/******/ 			return policy;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/trusted types script */
/******/ 	(() => {
/******/ 		__webpack_require__.ts = (script) => (__webpack_require__.tt().createScript(script));
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/react refresh */
/******/ 	(() => {
/******/ 		if (__webpack_require__.i) {
/******/ 		__webpack_require__.i.push((options) => {
/******/ 			const originalFactory = options.factory;
/******/ 			options.factory = (moduleObject, moduleExports, webpackRequire) => {
/******/ 				const hasRefresh = typeof self !== "undefined" && !!self.$RefreshInterceptModuleExecution$;
/******/ 				const cleanup = hasRefresh ? self.$RefreshInterceptModuleExecution$(moduleObject.id) : () => {};
/******/ 				try {
/******/ 					originalFactory.call(this, moduleObject, moduleExports, webpackRequire);
/******/ 				} finally {
/******/ 					cleanup();
/******/ 				}
/******/ 			}
/******/ 		})
/******/ 		}
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/compat */
/******/ 	
/******/ 	
/******/ 	// noop fns to prevent runtime errors during initialization
/******/ 	if (typeof self !== "undefined") {
/******/ 		self.$RefreshReg$ = function () {};
/******/ 		self.$RefreshSig$ = function () {
/******/ 			return function (type) {
/******/ 				return type;
/******/ 			};
/******/ 		};
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval-source-map devtool is used.
/******/ 	var __webpack_exports__ = __webpack_require__("./public/service-worker.js");
/******/ 	
/******/ })()
;