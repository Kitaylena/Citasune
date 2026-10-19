/**
 * @type {import('../uv').UltravioletCtor}
 */
const Ultraviolet = self.Ultraviolet;

/**
 * @type {import('../uv').UVClientCtor}
 */
const UVClient = self.UVClient;

/**
 * @type {import('../uv').UVConfig}
 */
const CS$h74cYJkK3qzdbn35 = self.CS$h74cYJkK3qzdbn35;

/**
 * @type {string}
 */
const __uv$cookies = self.__uv$cookies;

if (typeof __uv$cookies !== "string")
	throw new TypeError("Unable to load global UV data");

if (!self.CS$DZYCQAecbdkuxwJu) __uvHook(self);

self.__uvHook = __uvHook;

/**
 *
 * @param {typeof globalThis} window
 * @returns
 */
function __uvHook(window) {
	if ("CS$DZYCQAecbdkuxwJu" in window && window.CS$DZYCQAecbdkuxwJu instanceof Ultraviolet) return false;

	if (window.document && !!window.window) {
		window.document
			.querySelectorAll("script[__uv-script]")
			.forEach((node) => node.remove());
	}

	const worker = !window.window;
	const master = "CS$DZYCQAecbdkuxwJu";
	const methodPrefix = "__uv$";
	const CS$DZYCQAecbdkuxwJu = new Ultraviolet(CS$h74cYJkK3qzdbn35);

	/*if (typeof config.construct === 'function') {
        config.construct(CS$DZYCQAecbdkuxwJu, worker ? 'worker' : 'window');
    }*/
	let bareClient;
	if (!worker) {
		// websockets
		bareClient = new Ultraviolet.BareClient();
	} else {
		bareClient = new Ultraviolet.BareClient(
			new Promise((resolve) => {
				addEventListener("message", ({ data }) => {
					if (typeof data !== "object") return;
					if ("__uv$type" in data && data.__uv$type === "baremuxinit") {
						resolve(data.port);
					}
				});
			})
		);
	}

	const client = new UVClient(window, bareClient, worker);
	const {
		HTMLMediaElement,
		HTMLScriptElement,
		HTMLAudioElement,
		HTMLVideoElement,
		HTMLInputElement,
		HTMLEmbedElement,
		HTMLTrackElement,
		HTMLAnchorElement,
		HTMLIFrameElement,
		HTMLAreaElement,
		HTMLLinkElement,
		HTMLBaseElement,
		HTMLFormElement,
		HTMLImageElement,
		HTMLSourceElement,
	} = window;

	client.nativeMethods.defineProperty(window, "CS$DZYCQAecbdkuxwJu", {
		value: CS$DZYCQAecbdkuxwJu,
		enumerable: false,
	});

	CS$DZYCQAecbdkuxwJu.meta.origin = location.origin;
	CS$DZYCQAecbdkuxwJu.location = client.location.emulate(
		(href) => {
			if (href === "about:srcdoc") return new URL(href);
			if (href.startsWith("blob:")) href = href.slice("blob:".length);
			return new URL(CS$DZYCQAecbdkuxwJu.sourceUrl(href));
		},
		(href) => {
			return CS$DZYCQAecbdkuxwJu.rewriteUrl(href);
		}
	);

	let cookieStr = __uv$cookies;

	CS$DZYCQAecbdkuxwJu.meta.url = CS$DZYCQAecbdkuxwJu.location;
	CS$DZYCQAecbdkuxwJu.domain = CS$DZYCQAecbdkuxwJu.meta.url.host;
	CS$DZYCQAecbdkuxwJu.blobUrls = new window.Map();
	CS$DZYCQAecbdkuxwJu.referrer = "";
	CS$DZYCQAecbdkuxwJu.cookies = [];
	CS$DZYCQAecbdkuxwJu.localStorageObj = {};
	CS$DZYCQAecbdkuxwJu.sessionStorageObj = {};

	if (CS$DZYCQAecbdkuxwJu.location.href === "about:srcdoc") {
		CS$DZYCQAecbdkuxwJu.meta = window.parent.CS$DZYCQAecbdkuxwJu.meta;
	}

	if (window.EventTarget) {
		CS$DZYCQAecbdkuxwJu.addEventListener = window.EventTarget.prototype.addEventListener;
		CS$DZYCQAecbdkuxwJu.removeListener = window.EventTarget.prototype.removeListener;
		CS$DZYCQAecbdkuxwJu.dispatchEvent = window.EventTarget.prototype.dispatchEvent;
	}

	// Storage wrappers
	client.nativeMethods.defineProperty(
		client.storage.storeProto,
		"__uv$storageObj",
		{
			get() {
				if (this === client.storage.sessionStorage)
					return CS$DZYCQAecbdkuxwJu.sessionStorageObj;
				if (this === client.storage.localStorage) return CS$DZYCQAecbdkuxwJu.localStorageObj;
			},
			enumerable: false,
		}
	);

	if (window.localStorage) {
		for (const key in window.localStorage) {
			if (key.startsWith(methodPrefix + CS$DZYCQAecbdkuxwJu.location.origin + "@")) {
				CS$DZYCQAecbdkuxwJu.localStorageObj[
					key.slice((methodPrefix + CS$DZYCQAecbdkuxwJu.location.origin + "@").length)
				] = window.localStorage.getItem(key);
			}
		}

		CS$DZYCQAecbdkuxwJu.lsWrap = client.storage.emulate(
			client.storage.localStorage,
			CS$DZYCQAecbdkuxwJu.localStorageObj
		);
	}

	if (window.sessionStorage) {
		for (const key in window.sessionStorage) {
			if (key.startsWith(methodPrefix + CS$DZYCQAecbdkuxwJu.location.origin + "@")) {
				CS$DZYCQAecbdkuxwJu.sessionStorageObj[
					key.slice((methodPrefix + CS$DZYCQAecbdkuxwJu.location.origin + "@").length)
				] = window.sessionStorage.getItem(key);
			}
		}

		CS$DZYCQAecbdkuxwJu.ssWrap = client.storage.emulate(
			client.storage.sessionStorage,
			CS$DZYCQAecbdkuxwJu.sessionStorageObj
		);
	}

	let rawBase = window.document
		? client.node.baseURI.get.call(window.document)
		: window.location.href;
	let base = CS$DZYCQAecbdkuxwJu.sourceUrl(rawBase);

	client.nativeMethods.defineProperty(CS$DZYCQAecbdkuxwJu.meta, "base", {
		get() {
			if (!window.document) return CS$DZYCQAecbdkuxwJu.meta.url.href;

			if (client.node.baseURI.get.call(window.document) !== rawBase) {
				rawBase = client.node.baseURI.get.call(window.document);
				base = CS$DZYCQAecbdkuxwJu.sourceUrl(rawBase);
			}

			return base;
		},
	});

	CS$DZYCQAecbdkuxwJu.methods = {
		setSource: methodPrefix + "setSource",
		source: methodPrefix + "source",
		location: methodPrefix + "location",
		function: methodPrefix + "function",
		string: methodPrefix + "string",
		eval: methodPrefix + "eval",
		parent: methodPrefix + "parent",
		top: methodPrefix + "top",
	};

	CS$DZYCQAecbdkuxwJu.filterKeys = [
		master,
		CS$DZYCQAecbdkuxwJu.methods.setSource,
		CS$DZYCQAecbdkuxwJu.methods.source,
		CS$DZYCQAecbdkuxwJu.methods.location,
		CS$DZYCQAecbdkuxwJu.methods.function,
		CS$DZYCQAecbdkuxwJu.methods.string,
		CS$DZYCQAecbdkuxwJu.methods.eval,
		CS$DZYCQAecbdkuxwJu.methods.parent,
		CS$DZYCQAecbdkuxwJu.methods.top,
		methodPrefix + "protocol",
		methodPrefix + "storageObj",
		methodPrefix + "url",
		methodPrefix + "modifiedStyle",
		methodPrefix + "config",
		methodPrefix + "dispatched",
		"Ultraviolet",
		"__uvHook",
	];

	client.on("wrap", (target, wrapped) => {
		client.nativeMethods.defineProperty(
			wrapped,
			"name",
			client.nativeMethods.getOwnPropertyDescriptor(target, "name")
		);
		client.nativeMethods.defineProperty(
			wrapped,
			"length",
			client.nativeMethods.getOwnPropertyDescriptor(target, "length")
		);

		client.nativeMethods.defineProperty(wrapped, CS$DZYCQAecbdkuxwJu.methods.string, {
			enumerable: false,
			value: client.nativeMethods.fnToString.call(target),
		});

		client.nativeMethods.defineProperty(wrapped, CS$DZYCQAecbdkuxwJu.methods.function, {
			enumerable: false,
			value: target,
		});
	});

	client.fetch.on("request", (event) => {
		event.data.input = CS$DZYCQAecbdkuxwJu.rewriteUrl(event.data.input);
	});

	client.fetch.on("requestUrl", (event) => {
		event.data.value = CS$DZYCQAecbdkuxwJu.sourceUrl(event.data.value);
	});

	client.fetch.on("responseUrl", (event) => {
		event.data.value = CS$DZYCQAecbdkuxwJu.sourceUrl(event.data.value);
	});

	// XMLHttpRequest
	client.xhr.on("open", (event) => {
		event.data.input = CS$DZYCQAecbdkuxwJu.rewriteUrl(event.data.input);
	});

	client.xhr.on("responseUrl", (event) => {
		event.data.value = CS$DZYCQAecbdkuxwJu.sourceUrl(event.data.value);
	});

	// Workers
	client.workers.on("worker", (event) => {
		event.data.url = CS$DZYCQAecbdkuxwJu.rewriteUrl(event.data.url);
	});

	client.workers.on("addModule", (event) => {
		event.data.url = CS$DZYCQAecbdkuxwJu.rewriteUrl(event.data.url);
	});

	client.workers.on("importScripts", (event) => {
		for (const i in event.data.scripts) {
			event.data.scripts[i] = CS$DZYCQAecbdkuxwJu.rewriteUrl(event.data.scripts[i]);
		}
	});

	client.workers.on("postMessage", (event) => {
		let to = event.data.origin;

		event.data.origin = "*";
		event.data.message = {
			__data: event.data.message,
			__origin: CS$DZYCQAecbdkuxwJu.meta.url.origin,
			__to: to,
		};
	});

	// Navigator
	client.navigator.on("sendBeacon", (event) => {
		event.data.url = CS$DZYCQAecbdkuxwJu.rewriteUrl(event.data.url);
	});

	// Cookies
	client.document.on("getCookie", (event) => {
		event.data.value = cookieStr;
	});

	client.document.on("setCookie", (event) => {
		CS$DZYCQAecbdkuxwJu.cookie.db().then((db) => {
			CS$DZYCQAecbdkuxwJu.cookie.setCookies(event.data.value, db, CS$DZYCQAecbdkuxwJu.meta);

			CS$DZYCQAecbdkuxwJu.cookie.getCookies(db).then((cookies) => {
				cookieStr = CS$DZYCQAecbdkuxwJu.cookie.serialize(cookies, CS$DZYCQAecbdkuxwJu.meta, true);
			});
		});

		const cookie = CS$DZYCQAecbdkuxwJu.cookie.setCookie(event.data.value)[0];

		if (!cookie.path) cookie.path = "/";
		if (!cookie.domain) cookie.domain = CS$DZYCQAecbdkuxwJu.meta.url.hostname;

		if (CS$DZYCQAecbdkuxwJu.cookie.validateCookie(cookie, CS$DZYCQAecbdkuxwJu.meta, true)) {
			if (cookieStr.length) cookieStr += "; ";
			cookieStr += `${cookie.name}=${cookie.value}`;
		}

		event.respondWith(event.data.value);
	});

	// HTML
	client.element.on("setInnerHTML", (event) => {
		switch (event.that.tagName) {
			case "SCRIPT":
				event.data.value = CS$DZYCQAecbdkuxwJu.js.rewrite(event.data.value);
				break;
			case "STYLE":
				event.data.value = CS$DZYCQAecbdkuxwJu.rewriteCSS(event.data.value);
				break;
			default:
				event.data.value = CS$DZYCQAecbdkuxwJu.rewriteHtml(event.data.value);
		}
	});

	client.element.on("getInnerHTML", (event) => {
		switch (event.that.tagName) {
			case "SCRIPT":
				event.data.value = CS$DZYCQAecbdkuxwJu.js.source(event.data.value);
				break;
			default:
				event.data.value = CS$DZYCQAecbdkuxwJu.sourceHtml(event.data.value);
		}
	});

	client.element.on("setOuterHTML", (event) => {
		event.data.value = CS$DZYCQAecbdkuxwJu.rewriteHtml(event.data.value, {
			document: event.that.tagName === "HTML",
		});
	});

	client.element.on("getOuterHTML", (event) => {
		switch (event.that.tagName) {
			case "HEAD":
				event.data.value = CS$DZYCQAecbdkuxwJu
					.sourceHtml(
						event.data.value.replace(
							/<head(.*)>(.*)<\/head>/s,
							"<op-head$1>$2</op-head>"
						)
					)
					.replace(/<op-head(.*)>(.*)<\/op-head>/s, "<head$1>$2</head>");
				break;
			case "BODY":
				event.data.value = CS$DZYCQAecbdkuxwJu
					.sourceHtml(
						event.data.value.replace(
							/<body(.*)>(.*)<\/body>/s,
							"<op-body$1>$2</op-body>"
						)
					)
					.replace(/<op-body(.*)>(.*)<\/op-body>/s, "<body$1>$2</body>");
				break;
			default:
				event.data.value = CS$DZYCQAecbdkuxwJu.sourceHtml(event.data.value, {
					document: event.that.tagName === "HTML",
				});
				break;
		}

		//event.data.value = CS$DZYCQAecbdkuxwJu.sourceHtml(event.data.value, { document: event.that.tagName === 'HTML' });
	});

	client.document.on("write", (event) => {
		if (!event.data.html.length) return false;
		event.data.html = [CS$DZYCQAecbdkuxwJu.rewriteHtml(event.data.html.join(""))];
	});

	client.document.on("writeln", (event) => {
		if (!event.data.html.length) return false;
		event.data.html = [CS$DZYCQAecbdkuxwJu.rewriteHtml(event.data.html.join(""))];
	});

	client.element.on("insertAdjacentHTML", (event) => {
		event.data.html = CS$DZYCQAecbdkuxwJu.rewriteHtml(event.data.html);
	});

	// EventSource

	client.eventSource.on("construct", (event) => {
		event.data.url = CS$DZYCQAecbdkuxwJu.rewriteUrl(event.data.url);
	});

	client.eventSource.on("url", (event) => {
		event.data.url = CS$DZYCQAecbdkuxwJu.rewriteUrl(event.data.url);
	});

	// IDB
	client.idb.on("idbFactoryOpen", (event) => {
		// Don't modify the Ultraviolet cookie database
		if (event.data.name === "__op") return;
		event.data.name = `${CS$DZYCQAecbdkuxwJu.meta.url.origin}@${event.data.name}`;
	});

	client.idb.on("idbFactoryName", (event) => {
		event.data.value = event.data.value.slice(
			CS$DZYCQAecbdkuxwJu.meta.url.origin.length + 1 /*the @*/
		);
	});

	// History
	client.history.on("replaceState", (event) => {
		if (event.data.url)
			event.data.url = CS$DZYCQAecbdkuxwJu.rewriteUrl(
				event.data.url,
				"CS$DZYCQAecbdkuxwJu" in event.that ? event.that.CS$DZYCQAecbdkuxwJu.meta : CS$DZYCQAecbdkuxwJu.meta
			);
	});
	client.history.on("pushState", (event) => {
		if (event.data.url)
			event.data.url = CS$DZYCQAecbdkuxwJu.rewriteUrl(
				event.data.url,
				"CS$DZYCQAecbdkuxwJu" in event.that ? event.that.CS$DZYCQAecbdkuxwJu.meta : CS$DZYCQAecbdkuxwJu.meta
			);
	});

	// Element get set attribute methods
	client.element.on("getAttribute", (event) => {
		if (
			client.element.hasAttribute.call(
				event.that,
				CS$DZYCQAecbdkuxwJu.attributePrefix + "-attr-" + event.data.name
			)
		) {
			event.respondWith(
				event.target.call(
					event.that,
					CS$DZYCQAecbdkuxwJu.attributePrefix + "-attr-" + event.data.name
				)
			);
		}
	});

	// Message
	client.message.on("postMessage", (event) => {
		let to = event.data.origin;
		let call = CS$DZYCQAecbdkuxwJu.call;

		if (event.that) {
			call = event.that.__uv$source.call;
		}

		event.data.origin = "*";
		event.data.message = {
			__data: event.data.message,
			__origin: (event.that || event.target).__uv$source.location.origin,
			__to: to,
		};

		event.respondWith(
			worker
				? call(
						event.target,
						[event.data.message, event.data.transfer],
						event.that
					)
				: call(
						event.target,
						[event.data.message, event.data.origin, event.data.transfer],
						event.that
					)
		);
	});

	client.message.on("data", (event) => {
		const { value: data } = event.data;
		if (typeof data === "object" && "__data" in data && "__origin" in data) {
			event.respondWith(data.__data);
		}
	});

	client.message.on("origin", (event) => {
		const data = client.message.messageData.get.call(event.that);
		if (typeof data === "object" && data.__data && data.__origin) {
			event.respondWith(data.__origin);
		}
	});

	client.overrideDescriptor(window, "origin", {
		get: () => {
			return CS$DZYCQAecbdkuxwJu.location.origin;
		},
	});

	client.node.on("baseURI", (event) => {
		if (event.data.value.startsWith(window.location.origin))
			event.data.value = CS$DZYCQAecbdkuxwJu.sourceUrl(event.data.value);
	});

	client.element.on("setAttribute", (event) => {
		if (
			event.that instanceof HTMLMediaElement &&
			event.data.name === "src" &&
			event.data.value.startsWith("blob:")
		) {
			event.target.call(
				event.that,
				CS$DZYCQAecbdkuxwJu.attributePrefix + "-attr-" + event.data.name,
				event.data.value
			);
			event.data.value = CS$DZYCQAecbdkuxwJu.blobUrls.get(event.data.value);
			return;
		}

		if (CS$DZYCQAecbdkuxwJu.attrs.isUrl(event.data.name)) {
			event.target.call(
				event.that,
				CS$DZYCQAecbdkuxwJu.attributePrefix + "-attr-" + event.data.name,
				event.data.value
			);
			event.data.value = CS$DZYCQAecbdkuxwJu.rewriteUrl(event.data.value);
		}

		if (CS$DZYCQAecbdkuxwJu.attrs.isStyle(event.data.name)) {
			event.target.call(
				event.that,
				CS$DZYCQAecbdkuxwJu.attributePrefix + "-attr-" + event.data.name,
				event.data.value
			);
			event.data.value = CS$DZYCQAecbdkuxwJu.rewriteCSS(event.data.value, {
				context: "declarationList",
			});
		}

		if (CS$DZYCQAecbdkuxwJu.attrs.isHtml(event.data.name)) {
			event.target.call(
				event.that,
				CS$DZYCQAecbdkuxwJu.attributePrefix + "-attr-" + event.data.name,
				event.data.value
			);
			event.data.value = CS$DZYCQAecbdkuxwJu.rewriteHtml(event.data.value, {
				...CS$DZYCQAecbdkuxwJu.meta,
				document: true,
				injectHead: CS$DZYCQAecbdkuxwJu.createHtmlInject(
					CS$DZYCQAecbdkuxwJu.handlerScript,
					CS$DZYCQAecbdkuxwJu.bundleScript,
					CS$DZYCQAecbdkuxwJu.clientScript,
					CS$DZYCQAecbdkuxwJu.configScript,
					cookieStr,
					window.location.href
				),
			});
		}

		if (CS$DZYCQAecbdkuxwJu.attrs.isSrcset(event.data.name)) {
			event.target.call(
				event.that,
				CS$DZYCQAecbdkuxwJu.attributePrefix + "-attr-" + event.data.name,
				event.data.value
			);
			event.data.value = CS$DZYCQAecbdkuxwJu.html.wrapSrcset(event.data.value.toString());
		}

		if (CS$DZYCQAecbdkuxwJu.attrs.isForbidden(event.data.name)) {
			event.data.name = CS$DZYCQAecbdkuxwJu.attributePrefix + "-attr-" + event.data.name;
		}
	});

	client.element.on("audio", (event) => {
		event.data.url = CS$DZYCQAecbdkuxwJu.rewriteUrl(event.data.url);
	});

	// Element Property Attributes
	client.element.hookProperty(
		[HTMLAnchorElement, HTMLAreaElement, HTMLLinkElement, HTMLBaseElement],
		"href",
		{
			get: (target, that) => {
				return CS$DZYCQAecbdkuxwJu.sourceUrl(target.call(that));
			},
			set: (target, that, [val]) => {
				client.element.setAttribute.call(
					that,
					CS$DZYCQAecbdkuxwJu.attributePrefix + "-attr-href",
					val
				);
				target.call(that, CS$DZYCQAecbdkuxwJu.rewriteUrl(val));
			},
		}
	);

	client.element.hookProperty(
		[
			HTMLScriptElement,
			HTMLAudioElement,
			HTMLVideoElement,
			HTMLMediaElement,
			HTMLImageElement,
			HTMLInputElement,
			HTMLEmbedElement,
			HTMLIFrameElement,
			HTMLTrackElement,
			HTMLSourceElement,
		],
		"src",
		{
			get: (target, that) => {
				return CS$DZYCQAecbdkuxwJu.sourceUrl(target.call(that));
			},
			set: (target, that, [val]) => {
				if (
					new String(val).toString().trim().startsWith("blob:") &&
					that instanceof HTMLMediaElement
				) {
					client.element.setAttribute.call(
						that,
						CS$DZYCQAecbdkuxwJu.attributePrefix + "-attr-src",
						val
					);
					return target.call(that, CS$DZYCQAecbdkuxwJu.blobUrls.get(val) || val);
				}

				client.element.setAttribute.call(
					that,
					CS$DZYCQAecbdkuxwJu.attributePrefix + "-attr-src",
					val
				);
				target.call(that, CS$DZYCQAecbdkuxwJu.rewriteUrl(val));
			},
		}
	);

	client.element.hookProperty([HTMLFormElement], "action", {
		get: (target, that) => {
			return CS$DZYCQAecbdkuxwJu.sourceUrl(target.call(that));
		},
		set: (target, that, [val]) => {
			client.element.setAttribute.call(
				that,
				CS$DZYCQAecbdkuxwJu.attributePrefix + "-attr-action",
				val
			);
			target.call(that, CS$DZYCQAecbdkuxwJu.rewriteUrl(val));
		},
	});

	client.element.hookProperty([HTMLImageElement], "srcset", {
		get: (target, that) => {
			return (
				client.element.getAttribute.call(
					that,
					CS$DZYCQAecbdkuxwJu.attributePrefix + "-attr-srcset"
				) || target.call(that)
			);
		},
		set: (target, that, [val]) => {
			client.element.setAttribute.call(
				that,
				CS$DZYCQAecbdkuxwJu.attributePrefix + "-attr-srcset",
				val
			);
			target.call(that, CS$DZYCQAecbdkuxwJu.html.wrapSrcset(val.toString()));
		},
	});

	client.element.hookProperty(HTMLScriptElement, "integrity", {
		get: (target, that) => {
			return client.element.getAttribute.call(
				that,
				CS$DZYCQAecbdkuxwJu.attributePrefix + "-attr-integrity"
			);
		},
		set: (target, that, [val]) => {
			client.element.setAttribute.call(
				that,
				CS$DZYCQAecbdkuxwJu.attributePrefix + "-attr-integrity",
				val
			);
		},
	});

	client.element.hookProperty(HTMLIFrameElement, "sandbox", {
		get: (target, that) => {
			return (
				client.element.getAttribute.call(
					that,
					CS$DZYCQAecbdkuxwJu.attributePrefix + "-attr-sandbox"
				) || target.call(that)
			);
		},
		set: (target, that, [val]) => {
			client.element.setAttribute.call(
				that,
				CS$DZYCQAecbdkuxwJu.attributePrefix + "-attr-sandbox",
				val
			);
		},
	});

	// HTMLIFrameElement may not be defined (workers)
	const contentWindowGet =
		HTMLIFrameElement &&
		Object.getOwnPropertyDescriptor(
			HTMLIFrameElement.prototype,
			"contentWindow"
		).get;

	function uvInject(that) {
		const win = contentWindowGet.call(that);

		if (!win.CS$DZYCQAecbdkuxwJu)
			try {
				__uvHook(win);
			} catch (e) {
				console.error("catastrophic failure");
				console.error(e);
			}
	}

	client.element.hookProperty(HTMLIFrameElement, "contentWindow", {
		get: (target, that) => {
			uvInject(that);
			return target.call(that);
		},
	});

	client.element.hookProperty(HTMLIFrameElement, "contentDocument", {
		get: (target, that) => {
			uvInject(that);
			return target.call(that);
		},
	});

	client.element.hookProperty(HTMLIFrameElement, "srcdoc", {
		get: (target, that) => {
			return (
				client.element.getAttribute.call(
					that,
					CS$DZYCQAecbdkuxwJu.attributePrefix + "-attr-srcdoc"
				) || target.call(that)
			);
		},
		set: (target, that, [val]) => {
			target.call(
				that,
				CS$DZYCQAecbdkuxwJu.rewriteHtml(val, {
					document: true,
					injectHead: CS$DZYCQAecbdkuxwJu.createHtmlInject(
						CS$DZYCQAecbdkuxwJu.handlerScript,
						CS$DZYCQAecbdkuxwJu.bundleScript,
						CS$DZYCQAecbdkuxwJu.clientScript,
						CS$DZYCQAecbdkuxwJu.configScript,
						cookieStr,
						window.location.href
					),
				})
			);
		},
	});

	client.node.on("getTextContent", (event) => {
		if (event.that.tagName === "SCRIPT") {
			event.data.value = CS$DZYCQAecbdkuxwJu.js.source(event.data.value);
		}
	});

	client.node.on("setTextContent", (event) => {
		if (event.that.tagName === "SCRIPT") {
			event.data.value = CS$DZYCQAecbdkuxwJu.js.rewrite(event.data.value);
		}
	});

	// Until proper rewriting is implemented for service workers.
	// Not sure atm how to implement it with the already built in service worker
	if ("serviceWorker" in window.navigator) {
		delete window.Navigator.prototype.serviceWorker;
	}

	// Document
	client.document.on("getDomain", (event) => {
		event.data.value = CS$DZYCQAecbdkuxwJu.domain;
	});
	client.document.on("setDomain", (event) => {
		if (
			!event.data.value
				.toString()
				.endsWith(CS$DZYCQAecbdkuxwJu.meta.url.hostname.split(".").slice(-2).join("."))
		)
			return event.respondWith("");
		event.respondWith((CS$DZYCQAecbdkuxwJu.domain = event.data.value));
	});

	client.document.on("url", (event) => {
		event.data.value = CS$DZYCQAecbdkuxwJu.location.href;
	});

	client.document.on("documentURI", (event) => {
		event.data.value = CS$DZYCQAecbdkuxwJu.location.href;
	});

	client.document.on("referrer", (event) => {
		event.data.value = CS$DZYCQAecbdkuxwJu.referrer || CS$DZYCQAecbdkuxwJu.sourceUrl(event.data.value);
	});

	client.document.on("parseFromString", (event) => {
		if (event.data.type !== "text/html") return false;
		event.data.string = CS$DZYCQAecbdkuxwJu.rewriteHtml(event.data.string, {
			...CS$DZYCQAecbdkuxwJu.meta,
			document: true,
		});
	});

	// Attribute (node.attributes)
	client.attribute.on("getValue", (event) => {
		if (
			client.element.hasAttribute.call(
				event.that.ownerElement,
				CS$DZYCQAecbdkuxwJu.attributePrefix + "-attr-" + event.data.name
			)
		) {
			event.data.value = client.element.getAttribute.call(
				event.that.ownerElement,
				CS$DZYCQAecbdkuxwJu.attributePrefix + "-attr-" + event.data.name
			);
		}
	});

	client.attribute.on("setValue", (event) => {
		if (CS$DZYCQAecbdkuxwJu.attrs.isUrl(event.data.name)) {
			client.element.setAttribute.call(
				event.that.ownerElement,
				CS$DZYCQAecbdkuxwJu.attributePrefix + "-attr-" + event.data.name,
				event.data.value
			);
			event.data.value = CS$DZYCQAecbdkuxwJu.rewriteUrl(event.data.value);
		}

		if (CS$DZYCQAecbdkuxwJu.attrs.isStyle(event.data.name)) {
			client.element.setAttribute.call(
				event.that.ownerElement,
				CS$DZYCQAecbdkuxwJu.attributePrefix + "-attr-" + event.data.name,
				event.data.value
			);
			event.data.value = CS$DZYCQAecbdkuxwJu.rewriteCSS(event.data.value, {
				context: "declarationList",
			});
		}

		if (CS$DZYCQAecbdkuxwJu.attrs.isHtml(event.data.name)) {
			client.element.setAttribute.call(
				event.that.ownerElement,
				CS$DZYCQAecbdkuxwJu.attributePrefix + "-attr-" + event.data.name,
				event.data.value
			);
			event.data.value = CS$DZYCQAecbdkuxwJu.rewriteHtml(event.data.value, {
				...CS$DZYCQAecbdkuxwJu.meta,
				document: true,
				injectHead: CS$DZYCQAecbdkuxwJu.createHtmlInject(
					CS$DZYCQAecbdkuxwJu.handlerScript,
					CS$DZYCQAecbdkuxwJu.bundleScript,
					CS$DZYCQAecbdkuxwJu.clientScript,
					CS$DZYCQAecbdkuxwJu.configScript,
					cookieStr,
					window.location.href
				),
			});
		}

		if (CS$DZYCQAecbdkuxwJu.attrs.isSrcset(event.data.name)) {
			client.element.setAttribute.call(
				event.that.ownerElement,
				CS$DZYCQAecbdkuxwJu.attributePrefix + "-attr-" + event.data.name,
				event.data.value
			);
			event.data.value = CS$DZYCQAecbdkuxwJu.html.wrapSrcset(event.data.value.toString());
		}
	});

	// URL
	client.url.on("createObjectURL", (event) => {
		let url = event.target.call(event.that, event.data.object);
		if (url.startsWith("blob:" + location.origin)) {
			let newUrl =
				"blob:" +
				(CS$DZYCQAecbdkuxwJu.meta.url.href !== "about:blank"
					? CS$DZYCQAecbdkuxwJu.meta.url.origin
					: window.parent.CS$DZYCQAecbdkuxwJu.meta.url.origin) +
				url.slice("blob:".length + location.origin.length);
			CS$DZYCQAecbdkuxwJu.blobUrls.set(newUrl, url);
			event.respondWith(newUrl);
		} else {
			event.respondWith(url);
		}
	});

	client.url.on("revokeObjectURL", (event) => {
		if (CS$DZYCQAecbdkuxwJu.blobUrls.has(event.data.url)) {
			const old = event.data.url;
			event.data.url = CS$DZYCQAecbdkuxwJu.blobUrls.get(event.data.url);
			CS$DZYCQAecbdkuxwJu.blobUrls.delete(old);
		}
	});

	client.storage.on("get", (event) => {
		event.data.name =
			methodPrefix + CS$DZYCQAecbdkuxwJu.meta.url.origin + "@" + event.data.name;
	});

	client.storage.on("set", (event) => {
		if (event.that.__uv$storageObj) {
			event.that.__uv$storageObj[event.data.name] = event.data.value;
		}
		event.data.name =
			methodPrefix + CS$DZYCQAecbdkuxwJu.meta.url.origin + "@" + event.data.name;
	});

	client.storage.on("delete", (event) => {
		if (event.that.__uv$storageObj) {
			delete event.that.__uv$storageObj[event.data.name];
		}
		event.data.name =
			methodPrefix + CS$DZYCQAecbdkuxwJu.meta.url.origin + "@" + event.data.name;
	});

	client.storage.on("getItem", (event) => {
		event.data.name =
			methodPrefix + CS$DZYCQAecbdkuxwJu.meta.url.origin + "@" + event.data.name;
	});

	client.storage.on("setItem", (event) => {
		if (event.that.__uv$storageObj) {
			event.that.__uv$storageObj[event.data.name] = event.data.value;
		}
		event.data.name =
			methodPrefix + CS$DZYCQAecbdkuxwJu.meta.url.origin + "@" + event.data.name;
	});

	client.storage.on("removeItem", (event) => {
		if (event.that.__uv$storageObj) {
			delete event.that.__uv$storageObj[event.data.name];
		}
		event.data.name =
			methodPrefix + CS$DZYCQAecbdkuxwJu.meta.url.origin + "@" + event.data.name;
	});

	client.storage.on("clear", (event) => {
		if (event.that.__uv$storageObj) {
			for (const key of client.nativeMethods.keys.call(
				null,
				event.that.__uv$storageObj
			)) {
				delete event.that.__uv$storageObj[key];
				client.storage.removeItem.call(
					event.that,
					methodPrefix + CS$DZYCQAecbdkuxwJu.meta.url.origin + "@" + key
				);
				event.respondWith();
			}
		}
	});

	client.storage.on("length", (event) => {
		if (event.that.__uv$storageObj) {
			event.respondWith(
				client.nativeMethods.keys.call(null, event.that.__uv$storageObj).length
			);
		}
	});

	client.storage.on("key", (event) => {
		if (event.that.__uv$storageObj) {
			event.respondWith(
				client.nativeMethods.keys.call(null, event.that.__uv$storageObj)[
					event.data.index
				] || null
			);
		}
	});

	client.function.on("function", (event) => {
		event.data.script = CS$DZYCQAecbdkuxwJu.rewriteJS(event.data.script);
	});

	client.function.on("toString", (event) => {
		if (CS$DZYCQAecbdkuxwJu.methods.string in event.that)
			event.respondWith(event.that[CS$DZYCQAecbdkuxwJu.methods.string]);
	});

	client.object.on("getOwnPropertyNames", (event) => {
		event.data.names = event.data.names.filter(
			(element) => !CS$DZYCQAecbdkuxwJu.filterKeys.includes(element)
		);
	});

	client.object.on("getOwnPropertyDescriptors", (event) => {
		for (const forbidden of CS$DZYCQAecbdkuxwJu.filterKeys) {
			delete event.data.descriptors[forbidden];
		}
	});

	client.style.on("setProperty", (event) => {
		if (client.style.dashedUrlProps.includes(event.data.property)) {
			event.data.value = CS$DZYCQAecbdkuxwJu.rewriteCSS(event.data.value, {
				context: "value",
				...CS$DZYCQAecbdkuxwJu.meta,
			});
		}
	});

	client.style.on("getPropertyValue", (event) => {
		if (client.style.dashedUrlProps.includes(event.data.property)) {
			event.respondWith(
				CS$DZYCQAecbdkuxwJu.sourceCSS(event.target.call(event.that, event.data.property), {
					context: "value",
					...CS$DZYCQAecbdkuxwJu.meta,
				})
			);
		}
	});

	if ("CSS2Properties" in window) {
		for (const key of client.style.urlProps) {
			client.overrideDescriptor(window.CSS2Properties.prototype, key, {
				get: (target, that) => {
					return CS$DZYCQAecbdkuxwJu.sourceCSS(target.call(that), {
						context: "value",
						...CS$DZYCQAecbdkuxwJu.meta,
					});
				},
				set: (target, that, val) => {
					target.call(
						that,
						CS$DZYCQAecbdkuxwJu.rewriteCSS(val, {
							context: "value",
							...CS$DZYCQAecbdkuxwJu.meta,
						})
					);
				},
			});
		}
	} else if ("HTMLElement" in window) {
		client.overrideDescriptor(window.HTMLElement.prototype, "style", {
			get: (target, that) => {
				const value = target.call(that);
				if (!value[methodPrefix + "modifiedStyle"]) {
					for (const key of client.style.urlProps) {
						client.nativeMethods.defineProperty(value, key, {
							enumerable: true,
							configurable: true,
							get() {
								const value =
									client.style.getPropertyValue.call(this, key) || "";
								return CS$DZYCQAecbdkuxwJu.sourceCSS(value, {
									context: "value",
									...CS$DZYCQAecbdkuxwJu.meta,
								});
							},
							set(val) {
								client.style.setProperty.call(
									this,
									client.style.propToDashed[key] || key,
									CS$DZYCQAecbdkuxwJu.rewriteCSS(val, {
										context: "value",
										...CS$DZYCQAecbdkuxwJu.meta,
									})
								);
							},
						});
						client.nativeMethods.defineProperty(
							value,
							methodPrefix + "modifiedStyle",
							{
								enumerable: false,
								value: true,
							}
						);
					}
				}
				return value;
			},
		});
	}

	client.style.on("setCssText", (event) => {
		event.data.value = CS$DZYCQAecbdkuxwJu.rewriteCSS(event.data.value, {
			context: "declarationList",
			...CS$DZYCQAecbdkuxwJu.meta,
		});
	});

	client.style.on("getCssText", (event) => {
		event.data.value = CS$DZYCQAecbdkuxwJu.sourceCSS(event.data.value, {
			context: "declarationList",
			...CS$DZYCQAecbdkuxwJu.meta,
		});
	});

	// Proper hash emulation.
	CS$DZYCQAecbdkuxwJu.addEventListener.call(window, "hashchange", (event) => {
		if (event.__uv$dispatched) return false;
		event.stopImmediatePropagation();
		const hash = window.location.hash;
		client.history.replaceState.call(window.history, "", "", event.oldURL);
		CS$DZYCQAecbdkuxwJu.location.hash = hash;
	});

	client.location.on("hashchange", (oldUrl, newUrl, ctx) => {
		if (ctx.HashChangeEvent && client.history.replaceState) {
			client.history.replaceState.call(
				window.history,
				"",
				"",
				CS$DZYCQAecbdkuxwJu.rewriteUrl(newUrl)
			);

			const event = new ctx.HashChangeEvent("hashchange", {
				newURL: newUrl,
				oldURL: oldUrl,
			});

			client.nativeMethods.defineProperty(event, methodPrefix + "dispatched", {
				value: true,
				enumerable: false,
			});

			CS$DZYCQAecbdkuxwJu.dispatchEvent.call(window, event);
		}
	});

	// Hooking functions & descriptors
	client.fetch.overrideRequest();
	client.fetch.overrideUrl();
	client.xhr.overrideOpen();
	client.xhr.overrideResponseUrl();
	client.element.overrideHtml();
	client.element.overrideAttribute();
	client.element.overrideInsertAdjacentHTML();
	client.element.overrideAudio();
	// client.element.overrideQuerySelector();
	client.node.overrideBaseURI();
	client.node.overrideTextContent();
	client.attribute.overrideNameValue();
	client.document.overrideDomain();
	client.document.overrideURL();
	client.document.overrideDocumentURI();
	client.document.overrideWrite();
	client.document.overrideReferrer();
	client.document.overrideParseFromString();
	client.storage.overrideMethods();
	client.storage.overrideLength();
	//client.document.overrideQuerySelector();
	client.object.overrideGetPropertyNames();
	client.object.overrideGetOwnPropertyDescriptors();
	client.idb.overrideName();
	client.idb.overrideOpen();
	client.history.overridePushState();
	client.history.overrideReplaceState();
	client.eventSource.overrideConstruct();
	client.eventSource.overrideUrl();
	client.websocket.overrideWebSocket(bareClient);
	client.url.overrideObjectURL();
	client.document.overrideCookie();
	client.message.overridePostMessage();
	client.message.overrideMessageOrigin();
	client.message.overrideMessageData();
	client.workers.overrideWorker();
	client.workers.overrideAddModule();
	client.workers.overrideImportScripts();
	client.workers.overridePostMessage();
	client.style.overrideSetGetProperty();
	client.style.overrideCssText();
	client.navigator.overrideSendBeacon();
	client.function.overrideFunction();
	client.function.overrideToString();
	client.location.overrideWorkerLocation((href) => {
		return new URL(CS$DZYCQAecbdkuxwJu.sourceUrl(href));
	});

	client.overrideDescriptor(window, "localStorage", {
		get: (target, that) => {
			return (that || window).CS$DZYCQAecbdkuxwJu.lsWrap;
		},
	});
	client.overrideDescriptor(window, "sessionStorage", {
		get: (target, that) => {
			return (that || window).CS$DZYCQAecbdkuxwJu.ssWrap;
		},
	});

	client.override(window, "open", (target, that, args) => {
		if (!args.length) return target.apply(that, args);
		let [url] = args;

		url = CS$DZYCQAecbdkuxwJu.rewriteUrl(url);

		return target.call(that, url);
	});

	CS$DZYCQAecbdkuxwJu.$wrap = function (name) {
		if (name === "location") return CS$DZYCQAecbdkuxwJu.methods.location;
		if (name === "eval") return CS$DZYCQAecbdkuxwJu.methods.eval;
		return name;
	};

	CS$DZYCQAecbdkuxwJu.$get = function (that) {
		if (that === window.location) return CS$DZYCQAecbdkuxwJu.location;
		if (that === window.eval) return CS$DZYCQAecbdkuxwJu.eval;
		if (that === window.parent) {
			return window.__uv$parent;
		}
		if (that === window.top) {
			return window.__uv$top;
		}
		return that;
	};

	CS$DZYCQAecbdkuxwJu.eval = client.wrap(window, "eval", (target, that, args) => {
		if (!args.length || typeof args[0] !== "string")
			return target.apply(that, args);
		let [script] = args;

		script = CS$DZYCQAecbdkuxwJu.rewriteJS(script);
		return target.call(that, script);
	});

	CS$DZYCQAecbdkuxwJu.call = function (target, args, that) {
		return that ? target.apply(that, args) : target(...args);
	};

	CS$DZYCQAecbdkuxwJu.call$ = function (obj, prop, args = []) {
		return obj[prop].apply(obj, args);
	};

	client.nativeMethods.defineProperty(window.Object.prototype, master, {
		get: () => {
			return CS$DZYCQAecbdkuxwJu;
		},
		enumerable: false,
	});

	client.nativeMethods.defineProperty(
		window.Object.prototype,
		CS$DZYCQAecbdkuxwJu.methods.setSource,
		{
			value: function (source) {
				if (!client.nativeMethods.isExtensible(this)) return this;

				client.nativeMethods.defineProperty(this, CS$DZYCQAecbdkuxwJu.methods.source, {
					value: source,
					writable: true,
					enumerable: false,
				});

				return this;
			},
			enumerable: false,
		}
	);

	client.nativeMethods.defineProperty(
		window.Object.prototype,
		CS$DZYCQAecbdkuxwJu.methods.source,
		{
			value: CS$DZYCQAecbdkuxwJu,
			writable: true,
			enumerable: false,
		}
	);

	client.nativeMethods.defineProperty(
		window.Object.prototype,
		CS$DZYCQAecbdkuxwJu.methods.location,
		{
			configurable: true,
			get() {
				return this === window.document || this === window
					? CS$DZYCQAecbdkuxwJu.location
					: this.location;
			},
			set(val) {
				if (this === window.document || this === window) {
					CS$DZYCQAecbdkuxwJu.location.href = val;
				} else {
					this.location = val;
				}
			},
		}
	);

	client.nativeMethods.defineProperty(
		window.Object.prototype,
		CS$DZYCQAecbdkuxwJu.methods.parent,
		{
			configurable: true,
			get() {
				const val = this.parent;

				if (this === window) {
					try {
						return "CS$DZYCQAecbdkuxwJu" in val ? val : this;
					} catch (e) {
						return this;
					}
				}
				return val;
			},
			set(val) {
				this.parent = val;
			},
		}
	);

	client.nativeMethods.defineProperty(
		window.Object.prototype,
		CS$DZYCQAecbdkuxwJu.methods.top,
		{
			configurable: true,
			get() {
				const val = this.top;

				if (this === window) {
					if (val === this.parent) return this[CS$DZYCQAecbdkuxwJu.methods.parent];
					try {
						if (!("CS$DZYCQAecbdkuxwJu" in val)) {
							let current = this;

							while (current.parent !== val) {
								current = current.parent;
							}

							return "CS$DZYCQAecbdkuxwJu" in current ? current : this;
						} else {
							return val;
						}
					} catch (e) {
						return this;
					}
				}
				return val;
			},
			set(val) {
				this.top = val;
			},
		}
	);

	client.nativeMethods.defineProperty(
		window.Object.prototype,
		CS$DZYCQAecbdkuxwJu.methods.eval,
		{
			configurable: true,
			get() {
				return this === window ? CS$DZYCQAecbdkuxwJu.eval : this.eval;
			},
			set(val) {
				this.eval = val;
			},
		}
	);
}
