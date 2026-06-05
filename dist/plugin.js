const __pluginConfig =  {
  "name": "windy-plugin-upper-winds",
  "version": "0.0.21",
  "icon": "🪂",
  "title": "Upper winds",
  "description": "Show upper winds, temperature and humidity at a given position",
  "author": "Wetterheidi",
  "repository": "https://github.com/wetterheidi/windy-plugin-upper-winds.git",
  "desktopUI": "rhpane",
  "mobileUI": "fullscreen",
  "routerPath": "/mff-winds",
  "desktopWidth": 500,
  "listenToSingleclick": true,
  "addToContextmenu": true,
  "private": false,
  "built": 1780689935582,
  "builtReadable": "2026-06-05T20:05:35.582Z",
  "screenshot": "screenshot.jpg"
};

// transformCode: import bcast from '@windy/broadcast';
const bcast = W.broadcast;

// transformCode: import { map } from '@windy/map';
const { map } = W.map;

// transformCode: import { singleclick } from '@windy/singleclick';
const { singleclick } = W.singleclick;

// transformCode: import windyStore from '@windy/store';
const windyStore = W.store;

// transformCode: import reverseName from '@windy/reverseName';
const reverseName = W.reverseName;

// transformCode: import windyFetch from '@windy/fetch';
const windyFetch = W.fetch;

// transformCode: import metrics from '@windy/metrics';
const metrics = W.metrics;


/** @returns {void} */
function noop() {}

function run(fn) {
	return fn();
}

function blank_object() {
	return Object.create(null);
}

/**
 * @param {Function[]} fns
 * @returns {void}
 */
function run_all(fns) {
	fns.forEach(run);
}

/**
 * @param {any} thing
 * @returns {thing is Function}
 */
function is_function(thing) {
	return typeof thing === 'function';
}

/** @returns {boolean} */
function safe_not_equal(a, b) {
	return a != a ? b == b : a !== b || (a && typeof a === 'object') || typeof a === 'function';
}

/** @returns {boolean} */
function is_empty(obj) {
	return Object.keys(obj).length === 0;
}

/**
 * @param {Node} target
 * @param {Node} node
 * @returns {void}
 */
function append(target, node) {
	target.appendChild(node);
}

/**
 * @param {Node} target
 * @param {string} style_sheet_id
 * @param {string} styles
 * @returns {void}
 */
function append_styles(target, style_sheet_id, styles) {
	const append_styles_to = get_root_for_style(target);
	if (!append_styles_to.getElementById(style_sheet_id)) {
		const style = element('style');
		style.id = style_sheet_id;
		style.textContent = styles;
		append_stylesheet(append_styles_to, style);
	}
}

/**
 * @param {Node} node
 * @returns {ShadowRoot | Document}
 */
function get_root_for_style(node) {
	if (!node) return document;
	const root = node.getRootNode ? node.getRootNode() : node.ownerDocument;
	if (root && /** @type {ShadowRoot} */ (root).host) {
		return /** @type {ShadowRoot} */ (root);
	}
	return node.ownerDocument;
}

/**
 * @param {ShadowRoot | Document} node
 * @param {HTMLStyleElement} style
 * @returns {CSSStyleSheet}
 */
function append_stylesheet(node, style) {
	append(/** @type {Document} */ (node).head || node, style);
	return style.sheet;
}

/**
 * @param {Node} target
 * @param {Node} node
 * @param {Node} [anchor]
 * @returns {void}
 */
function insert(target, node, anchor) {
	target.insertBefore(node, anchor || null);
}

/**
 * @param {Node} node
 * @returns {void}
 */
function detach(node) {
	if (node.parentNode) {
		node.parentNode.removeChild(node);
	}
}

/**
 * @returns {void} */
function destroy_each(iterations, detaching) {
	for (let i = 0; i < iterations.length; i += 1) {
		if (iterations[i]) iterations[i].d(detaching);
	}
}

/**
 * @template {keyof HTMLElementTagNameMap} K
 * @param {K} name
 * @returns {HTMLElementTagNameMap[K]}
 */
function element(name) {
	return document.createElement(name);
}

/**
 * @param {string} data
 * @returns {Text}
 */
function text(data) {
	return document.createTextNode(data);
}

/**
 * @returns {Text} */
function space() {
	return text(' ');
}

/**
 * @param {EventTarget} node
 * @param {string} event
 * @param {EventListenerOrEventListenerObject} handler
 * @param {boolean | AddEventListenerOptions | EventListenerOptions} [options]
 * @returns {() => void}
 */
function listen(node, event, handler, options) {
	node.addEventListener(event, handler, options);
	return () => node.removeEventListener(event, handler, options);
}

/**
 * @param {Element} node
 * @param {string} attribute
 * @param {string} [value]
 * @returns {void}
 */
function attr(node, attribute, value) {
	if (value == null) node.removeAttribute(attribute);
	else if (node.getAttribute(attribute) !== value) node.setAttribute(attribute, value);
}

/**
 * @param {Element} element
 * @returns {ChildNode[]}
 */
function children(element) {
	return Array.from(element.childNodes);
}

/**
 * @param {Text} text
 * @param {unknown} data
 * @returns {void}
 */
function set_data(text, data) {
	data = '' + data;
	if (text.data === data) return;
	text.data = /** @type {string} */ (data);
}

/**
 * @returns {void} */
function set_input_value(input, value) {
	input.value = value == null ? '' : value;
}

/**
 * @returns {void} */
function set_style(node, key, value, important) {
	{
		node.style.setProperty(key, value, '');
	}
}

/**
 * @returns {void} */
function select_option(select, value, mounting) {
	for (let i = 0; i < select.options.length; i += 1) {
		const option = select.options[i];
		if (option.__value === value) {
			option.selected = true;
			return;
		}
	}
	if (!mounting || value !== undefined) {
		select.selectedIndex = -1; // no option should be selected
	}
}

function select_value(select) {
	const selected_option = select.querySelector(':checked');
	return selected_option && selected_option.__value;
}

/**
 * @returns {void} */
function toggle_class(element, name, toggle) {
	// The `!!` is required because an `undefined` flag means flipping the current state.
	element.classList.toggle(name, !!toggle);
}

/**
 * @typedef {Node & {
 * 	claim_order?: number;
 * 	hydrate_init?: true;
 * 	actual_end_child?: NodeEx;
 * 	childNodes: NodeListOf<NodeEx>;
 * }} NodeEx
 */

/** @typedef {ChildNode & NodeEx} ChildNodeEx */

/** @typedef {NodeEx & { claim_order: number }} NodeEx2 */

/**
 * @typedef {ChildNodeEx[] & {
 * 	claim_info?: {
 * 		last_index: number;
 * 		total_claimed: number;
 * 	};
 * }} ChildNodeArray
 */

let current_component;

/** @returns {void} */
function set_current_component(component) {
	current_component = component;
}

function get_current_component() {
	if (!current_component) throw new Error('Function called outside component initialization');
	return current_component;
}

/**
 * The `onMount` function schedules a callback to run as soon as the component has been mounted to the DOM.
 * It must be called during the component's initialisation (but doesn't need to live *inside* the component;
 * it can be called from an external module).
 *
 * If a function is returned _synchronously_ from `onMount`, it will be called when the component is unmounted.
 *
 * `onMount` does not run inside a [server-side component](https://svelte.dev/docs#run-time-server-side-component-api).
 *
 * https://svelte.dev/docs/svelte#onmount
 * @template T
 * @param {() => import('./private.js').NotFunction<T> | Promise<import('./private.js').NotFunction<T>> | (() => any)} fn
 * @returns {void}
 */
function onMount(fn) {
	get_current_component().$$.on_mount.push(fn);
}

/**
 * Schedules a callback to run immediately before the component is unmounted.
 *
 * Out of `onMount`, `beforeUpdate`, `afterUpdate` and `onDestroy`, this is the
 * only one that runs inside a server-side component.
 *
 * https://svelte.dev/docs/svelte#ondestroy
 * @param {() => any} fn
 * @returns {void}
 */
function onDestroy(fn) {
	get_current_component().$$.on_destroy.push(fn);
}

const dirty_components = [];
const binding_callbacks = [];

let render_callbacks = [];

const flush_callbacks = [];

const resolved_promise = /* @__PURE__ */ Promise.resolve();

let update_scheduled = false;

/** @returns {void} */
function schedule_update() {
	if (!update_scheduled) {
		update_scheduled = true;
		resolved_promise.then(flush);
	}
}

/** @returns {void} */
function add_render_callback(fn) {
	render_callbacks.push(fn);
}

// flush() calls callbacks in this order:
// 1. All beforeUpdate callbacks, in order: parents before children
// 2. All bind:this callbacks, in reverse order: children before parents.
// 3. All afterUpdate callbacks, in order: parents before children. EXCEPT
//    for afterUpdates called during the initial onMount, which are called in
//    reverse order: children before parents.
// Since callbacks might update component values, which could trigger another
// call to flush(), the following steps guard against this:
// 1. During beforeUpdate, any updated components will be added to the
//    dirty_components array and will cause a reentrant call to flush(). Because
//    the flush index is kept outside the function, the reentrant call will pick
//    up where the earlier call left off and go through all dirty components. The
//    current_component value is saved and restored so that the reentrant call will
//    not interfere with the "parent" flush() call.
// 2. bind:this callbacks cannot trigger new flush() calls.
// 3. During afterUpdate, any updated components will NOT have their afterUpdate
//    callback called a second time; the seen_callbacks set, outside the flush()
//    function, guarantees this behavior.
const seen_callbacks = new Set();

let flushidx = 0; // Do *not* move this inside the flush() function

/** @returns {void} */
function flush() {
	// Do not reenter flush while dirty components are updated, as this can
	// result in an infinite loop. Instead, let the inner flush handle it.
	// Reentrancy is ok afterwards for bindings etc.
	if (flushidx !== 0) {
		return;
	}
	const saved_component = current_component;
	do {
		// first, call beforeUpdate functions
		// and update components
		try {
			while (flushidx < dirty_components.length) {
				const component = dirty_components[flushidx];
				flushidx++;
				set_current_component(component);
				update(component.$$);
			}
		} catch (e) {
			// reset dirty state to not end up in a deadlocked state and then rethrow
			dirty_components.length = 0;
			flushidx = 0;
			throw e;
		}
		set_current_component(null);
		dirty_components.length = 0;
		flushidx = 0;
		while (binding_callbacks.length) binding_callbacks.pop()();
		// then, once components are updated, call
		// afterUpdate functions. This may cause
		// subsequent updates...
		for (let i = 0; i < render_callbacks.length; i += 1) {
			const callback = render_callbacks[i];
			if (!seen_callbacks.has(callback)) {
				// ...so guard against infinite loops
				seen_callbacks.add(callback);
				callback();
			}
		}
		render_callbacks.length = 0;
	} while (dirty_components.length);
	while (flush_callbacks.length) {
		flush_callbacks.pop()();
	}
	update_scheduled = false;
	seen_callbacks.clear();
	set_current_component(saved_component);
}

/** @returns {void} */
function update($$) {
	if ($$.fragment !== null) {
		$$.update();
		run_all($$.before_update);
		const dirty = $$.dirty;
		$$.dirty = [-1];
		$$.fragment && $$.fragment.p($$.ctx, dirty);
		$$.after_update.forEach(add_render_callback);
	}
}

/**
 * Useful for example to execute remaining `afterUpdate` callbacks before executing `destroy`.
 * @param {Function[]} fns
 * @returns {void}
 */
function flush_render_callbacks(fns) {
	const filtered = [];
	const targets = [];
	render_callbacks.forEach((c) => (fns.indexOf(c) === -1 ? filtered.push(c) : targets.push(c)));
	targets.forEach((c) => c());
	render_callbacks = filtered;
}

const outroing = new Set();

/**
 * @param {import('./private.js').Fragment} block
 * @param {0 | 1} [local]
 * @returns {void}
 */
function transition_in(block, local) {
	if (block && block.i) {
		outroing.delete(block);
		block.i(local);
	}
}

/** @typedef {1} INTRO */
/** @typedef {0} OUTRO */
/** @typedef {{ direction: 'in' | 'out' | 'both' }} TransitionOptions */
/** @typedef {(node: Element, params: any, options: TransitionOptions) => import('../transition/public.js').TransitionConfig} TransitionFn */

/**
 * @typedef {Object} Outro
 * @property {number} r
 * @property {Function[]} c
 * @property {Object} p
 */

/**
 * @typedef {Object} PendingProgram
 * @property {number} start
 * @property {INTRO|OUTRO} b
 * @property {Outro} [group]
 */

/**
 * @typedef {Object} Program
 * @property {number} a
 * @property {INTRO|OUTRO} b
 * @property {1|-1} d
 * @property {number} duration
 * @property {number} start
 * @property {number} end
 * @property {Outro} [group]
 */

// general each functions:

function ensure_array_like(array_like_or_iterator) {
	return array_like_or_iterator?.length !== undefined
		? array_like_or_iterator
		: Array.from(array_like_or_iterator);
}

/** @returns {void} */
function mount_component(component, target, anchor) {
	const { fragment, after_update } = component.$$;
	fragment && fragment.m(target, anchor);
	// onMount happens before the initial afterUpdate
	add_render_callback(() => {
		const new_on_destroy = component.$$.on_mount.map(run).filter(is_function);
		// if the component was destroyed immediately
		// it will update the `$$.on_destroy` reference to `null`.
		// the destructured on_destroy may still reference to the old array
		if (component.$$.on_destroy) {
			component.$$.on_destroy.push(...new_on_destroy);
		} else {
			// Edge case - component was destroyed immediately,
			// most likely as a result of a binding initialising
			run_all(new_on_destroy);
		}
		component.$$.on_mount = [];
	});
	after_update.forEach(add_render_callback);
}

/** @returns {void} */
function destroy_component(component, detaching) {
	const $$ = component.$$;
	if ($$.fragment !== null) {
		flush_render_callbacks($$.after_update);
		run_all($$.on_destroy);
		$$.fragment && $$.fragment.d(detaching);
		// TODO null out other refs, including component.$$ (but need to
		// preserve final state?)
		$$.on_destroy = $$.fragment = null;
		$$.ctx = [];
	}
}

/** @returns {void} */
function make_dirty(component, i) {
	if (component.$$.dirty[0] === -1) {
		dirty_components.push(component);
		schedule_update();
		component.$$.dirty.fill(0);
	}
	component.$$.dirty[(i / 31) | 0] |= 1 << i % 31;
}

// TODO: Document the other params
/**
 * @param {SvelteComponent} component
 * @param {import('./public.js').ComponentConstructorOptions} options
 *
 * @param {import('./utils.js')['not_equal']} not_equal Used to compare props and state values.
 * @param {(target: Element | ShadowRoot) => void} [append_styles] Function that appends styles to the DOM when the component is first initialised.
 * This will be the `add_css` function from the compiled component.
 *
 * @returns {void}
 */
function init(
	component,
	options,
	instance,
	create_fragment,
	not_equal,
	props,
	append_styles = null,
	dirty = [-1]
) {
	const parent_component = current_component;
	set_current_component(component);
	/** @type {import('./private.js').T$$} */
	const $$ = (component.$$ = {
		fragment: null,
		ctx: [],
		// state
		props,
		update: noop,
		not_equal,
		bound: blank_object(),
		// lifecycle
		on_mount: [],
		on_destroy: [],
		on_disconnect: [],
		before_update: [],
		after_update: [],
		context: new Map(options.context || (parent_component ? parent_component.$$.context : [])),
		// everything else
		callbacks: blank_object(),
		dirty,
		skip_bound: false,
		root: options.target || parent_component.$$.root
	});
	append_styles && append_styles($$.root);
	let ready = false;
	$$.ctx = instance
		? instance(component, options.props || {}, (i, ret, ...rest) => {
				const value = rest.length ? rest[0] : ret;
				if ($$.ctx && not_equal($$.ctx[i], ($$.ctx[i] = value))) {
					if (!$$.skip_bound && $$.bound[i]) $$.bound[i](value);
					if (ready) make_dirty(component, i);
				}
				return ret;
		  })
		: [];
	$$.update();
	ready = true;
	run_all($$.before_update);
	// `false` as a special case of no DOM component
	$$.fragment = create_fragment ? create_fragment($$.ctx) : false;
	if (options.target) {
		if (options.hydrate) {
			// TODO: what is the correct type here?
			// @ts-expect-error
			const nodes = children(options.target);
			$$.fragment && $$.fragment.l(nodes);
			nodes.forEach(detach);
		} else {
			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			$$.fragment && $$.fragment.c();
		}
		if (options.intro) transition_in(component.$$.fragment);
		mount_component(component, options.target, options.anchor);
		flush();
	}
	set_current_component(parent_component);
}

/**
 * Base class for Svelte components. Used when dev=false.
 *
 * @template {Record<string, any>} [Props=any]
 * @template {Record<string, any>} [Events=any]
 */
class SvelteComponent {
	/**
	 * ### PRIVATE API
	 *
	 * Do not use, may change at any time
	 *
	 * @type {any}
	 */
	$$ = undefined;
	/**
	 * ### PRIVATE API
	 *
	 * Do not use, may change at any time
	 *
	 * @type {any}
	 */
	$$set = undefined;

	/** @returns {void} */
	$destroy() {
		destroy_component(this, 1);
		this.$destroy = noop;
	}

	/**
	 * @template {Extract<keyof Events, string>} K
	 * @param {K} type
	 * @param {((e: Events[K]) => void) | null | undefined} callback
	 * @returns {() => void}
	 */
	$on(type, callback) {
		if (!is_function(callback)) {
			return noop;
		}
		const callbacks = this.$$.callbacks[type] || (this.$$.callbacks[type] = []);
		callbacks.push(callback);
		return () => {
			const index = callbacks.indexOf(callback);
			if (index !== -1) callbacks.splice(index, 1);
		};
	}

	/**
	 * @param {Partial<Props>} props
	 * @returns {void}
	 */
	$set(props) {
		if (this.$$set && !is_empty(props)) {
			this.$$.skip_bound = true;
			this.$$set(props);
			this.$$.skip_bound = false;
		}
	}
}

/**
 * @typedef {Object} CustomElementPropDefinition
 * @property {string} [attribute]
 * @property {boolean} [reflect]
 * @property {'String'|'Boolean'|'Number'|'Array'|'Object'} [type]
 */

// generated during release, do not modify

const PUBLIC_VERSION = '4';

if (typeof window !== 'undefined')
	// @ts-ignore
	(window.__svelte || (window.__svelte = { v: new Set() })).v.add(PUBLIC_VERSION);

const config = {
    name: 'windy-plugin-upper-winds',
    version: '0.0.21',
    icon: '🪂',
    title: 'Upper winds',
    description: 'Show upper winds, temperature and humidity at a given position',
    author: 'Wetterheidi',
    repository: 'https://github.com/wetterheidi/windy-plugin-upper-winds.git',
    desktopUI: 'rhpane',
    mobileUI: 'fullscreen',
    routerPath: '/mff-winds',
    desktopWidth: 500,
    listenToSingleclick: true,
    addToContextmenu: true,
    private: false
};

class Utility {
    static linearInterpolation(y1, y2, ratio) {
        return Math.round(y1 + (y2 - y1) * ratio);
    }
    static gaussianInterpolation(y1, y2, h1, h2, hp) {
        let w1 = 0;
        let w2 = 0;
        w1 = 1 / Math.abs(h1 - hp);
        w2 = 1 / Math.abs(h2 - hp);
        const yp = (w1 * y1 + w2 * y2) / (w1 + w2);
        return yp;
    }
    static locationDetails(locationObject) {
        const { name, region, lat, lon, nameValid } = locationObject;
        const nameRegion = nameValid ? name === region ? name : `${name} : ${region}` : '';
        const formattedLat = lat.toFixed(2);
        const formattedLon = lon.toFixed(2);
        return `${nameRegion} (${formattedLat}, ${formattedLon})`;
    }
    static windSpeed(uComponent, vComponent) {
        let ff = 0;
        ff = metrics.wind.convertNumber(Math.sqrt(uComponent ** 2 + vComponent ** 2));
        return ff;
    }
    static windDirection(uComponent, vComponent) {
        let ddd = 0;
        let ff = 0;
        ff = Math.sqrt(uComponent ** 2 + vComponent ** 2);
        if (vComponent >= 0 && uComponent > 0) {
            ddd = 90 - Math.acos(uComponent / ff) * 180 / Math.PI;
        } else if (vComponent >= 0 && uComponent < 0) {
            ddd = 90 - Math.acos(uComponent / ff) * 180 / Math.PI + 360;
        } else if (vComponent < 0) {
            ddd = 90 + Math.acos(uComponent / ff) * 180 / Math.PI;
        }
        ddd = (ddd + 180) % 360;
        ddd = Math.round(ddd / 10) * 10;
        if (ddd == 0) {
            ddd = 360;
        }
        return ddd;
    }
    static async getElevation(lat, lon) {
        const response = await fetch(`https://api.open-elevation.com/api/v1/lookup?locations=${lat},${lon}`);
        const data = await response.json();
        return data.results[0].elevation;
    }
    static calculatePressure(p, h) {
        let qnh = 0;
        const a = 287.05 * (0.0065 / 9.80665);
        const b = 0.0065 * (Math.pow(1013.25, a) / 288.15);
        qnh = Math.round(Math.pow(Math.pow(p, a) + b * (h / 3.28084), 1 / a));
        return qnh;
    }
    static findOutTemperatureUnit(temperature) {
        let unitTemperature = '';
        const temperatureString = metrics.temp.convertValue(temperature);
        if (temperatureString.match('°C')) {
            unitTemperature = '°C';
        } else if (temperatureString.match('°F')) {
            unitTemperature = '°F';
        }
        return unitTemperature;
    }
    static findOutWindUnit(wind) {
        let unitWind = '';
        const windString = metrics.wind.convertValue(wind);
        if (windString.match('kt')) {
            unitWind = 'kt';
        } else if (windString.match('bft')) {
            unitWind = 'bft';
        } else if (windString.match('m/s')) {
            unitWind = 'm/s';
        } else if (windString.match('km/h')) {
            unitWind = 'km/h';
        } else if (windString.match('mph')) {
            unitWind = 'mph';
        }
        return unitWind;
    }
    static findOutAltitudeUnit(altitude) {
        let unitALtitude = '';
        const altitudeString = metrics.altitude.convertValue(altitude);
        if (altitudeString.match('m')) {
            unitALtitude = 'm';
        } else if (altitudeString.match('ft')) {
            unitALtitude = 'ft';
        }
        return unitALtitude;
    }
    static LIP(xVector, yVector, xValue) {
        let Dimension = 0;
        let m = 0;
        let n = 0;
        let i = 0;
        let reversed = false;
        if (xVector[1] > xVector[0]) {
            yVector.reverse();
            xVector.reverse();
            reversed = true;
        }
        Dimension = xVector.length - 1;
        try {
            if (xValue > xVector[0] || xValue < xVector[Dimension]) {
                if (xValue > xVector[0]) {
                    m = (yVector[1] - yVector[0]) / (xVector[1] - xVector[0]);
                    n = yVector[1] - m * xVector[1];
                } else {
                    m = (yVector[Dimension] - yVector[Dimension - 1]) / (xVector[Dimension] - xVector[Dimension - 1]);
                    n = yVector[Dimension] - m * xVector[Dimension];
                }
                return m * xValue + n;
            } else {
                for(i = 1; i <= Dimension; i++){
                    if (xValue >= xVector[i]) {
                        break;
                    }
                }
                m = (yVector[i] - yVector[i - 1]) / (xVector[i] - xVector[i - 1]);
                n = yVector[i] - m * xVector[i];
                return m * xValue + n;
            }
        } catch (error) {
            return "interpolation error";
        } finally{
            if (reversed) {
                yVector.reverse();
                xVector.reverse();
            }
        }
    }
    static Mittelwind(Höhe, xKomponente, yKomponente, Untergrenze, Obergrenze) {
        const dddff = new Array(4);
        let h, x, y;
        const hSchicht = [
            Obergrenze
        ];
        const xObergrenze = Number(Utility.LIP(Höhe, xKomponente, Obergrenze));
        const yObergrenze = Number(Utility.LIP(Höhe, yKomponente, Obergrenze));
        const xUntergrenze = Number(Utility.LIP(Höhe, xKomponente, Untergrenze));
        const yUntergrenze = Number(Utility.LIP(Höhe, yKomponente, Untergrenze));
        const xSchicht = [
            xObergrenze
        ];
        const ySchicht = [
            yObergrenze
        ];
        for(let i = 0; i < Höhe.length; i++){
            if (Höhe[i] < Obergrenze && Höhe[i] > Untergrenze) {
                h = Höhe[i];
                x = xKomponente[i];
                y = yKomponente[i];
                hSchicht.push(h);
                xSchicht.push(x);
                ySchicht.push(y);
            }
        }
        hSchicht.push(Untergrenze);
        xSchicht.push(xUntergrenze);
        ySchicht.push(yUntergrenze);
        let xTrapez = 0;
        let yTrapez = 0;
        for(let i = 0; i < hSchicht.length - 1; i++){
            xTrapez += 0.5 * (xSchicht[i] + xSchicht[i + 1]) * (hSchicht[i] - hSchicht[i + 1]);
            yTrapez += 0.5 * (ySchicht[i] + ySchicht[i + 1]) * (hSchicht[i] - hSchicht[i + 1]);
        }
        const xMittel = xTrapez / (hSchicht[0] - hSchicht[hSchicht.length - 1]);
        const yMittel = yTrapez / (hSchicht[0] - hSchicht[hSchicht.length - 1]);
        dddff[2] = xMittel;
        dddff[3] = yMittel;
        dddff[1] = Utility.windSpeed(xMittel, yMittel);
        dddff[0] = Utility.windDirection(xMittel, yMittel);
        return dddff;
    }
    static checkOverlay() {
        const overlay = windyStore.get('overlay');
        if (overlay == 'satellite' || overlay == 'radar' || overlay == 'radarPlus') {
            windyStore.set('overlay', 'wind');
            return `Overlay was set to wind (${overlay} is not a forecast model overlay).`;
        }
        return null;
    }
    static arraysAreEqual(arr1, arr2) {
        if (arr1.length !== arr2.length) {
            return false;
        }
        for(let i = 0; i < arr1.length; i++){
            if (arr1[i] !== arr2[i]) {
                return false;
            }
        }
        return true;
    }
    static arraysContainSameElements(arr1, arr2) {
        if (arr1.length !== arr2.length) {
            return false;
        }
        const sortedArr1 = arr1.slice().sort();
        const sortedArr2 = arr2.slice().sort();
        return Utility.arraysAreEqual(sortedArr1, sortedArr2);
    }
    static difference(arr1, arr2) {
        return arr1.filter((item)=>!arr2.includes(item));
    }
}

class UpperWind {
    _rawdata = [];
    _flightLevels = [];
    _clickLocation = '';
    _forecastDate = 0;
    _model = '';
    _forecastColumn = 0;
    _timestamp = Date.now();
    _elevation = 0;
    _initTime = 0;
    _step = 0;
    _reference = 'AGL';
    _lowerLevel = '0';
    _upperLevel = '3000';
    _errorhandler = false;
    raw_data_old = [];
    setTime(t) {
        this._timestamp = t;
    }
    get getTime() {
        return this._timestamp;
    }
    get lowerLevel() {
        return this._lowerLevel;
    }
    get upperLevel() {
        return this._upperLevel;
    }
    get elevation() {
        return this._elevation;
    }
    get step() {
        return this._step;
    }
    get flightLevels() {
        return this._flightLevels;
    }
    get clickLocation() {
        return this._clickLocation;
    }
    get forecastDate() {
        const date = new Date(this._forecastDate);
        return date.toString();
    }
    get errorhandler() {
        return this._errorhandler;
    }
    get model() {
        return this._model;
    }
    get reference() {
        return this._reference;
    }
    restratify() {
        if (this._rawdata.length) {
            this._flightLevels = this.stratify(this._rawdata);
            return this._flightLevels;
        }
        return undefined;
    }
    async handleEvent(ev) {
        try {
            const product = await windyStore.get('product');
            const locationObject = await reverseName.get({
                lat: ev.lat,
                lon: ev.lon
            });
            this._clickLocation = Utility.locationDetails(locationObject);
            const weatherData = await this.fetchData(ev.lat, ev.lon, product);
            this.findNearestColumn(weatherData.data.data.hours);
            this._forecastDate = weatherData.data.data.hours[this._forecastColumn];
            this._model = weatherData.data.header.model;
            this.updateWeatherStats(weatherData.data);
            this._errorhandler = false;
            const timediff = this._timestamp - this._initTime;
            console.log('*****************Timestamp' + timediff + 'Modell: ' + this._model);
            if (this._model == "ICON-GLOBAL" && timediff > 482400000) {
                this._errorhandler = true;
            } else if (this._model == "ECMWF-HRES" && timediff > 462000000) {
                this._errorhandler = true;
            } else if (this._model == "NOAA-GFS" && timediff > 345000000) {
                this._errorhandler = true;
            }
        } catch (error) {
            console.error('* * * An error occurred:', error);
            this._errorhandler = true;
        }
    }
    findNearestColumn(epoch) {
        let closestIndex = -1;
        let closestDiff = Infinity;
        for(let i = 0; i < epoch.length; i++){
            const diff = Math.abs(epoch[i] - this.getTime);
            if (diff < closestDiff) {
                closestDiff = diff;
                closestIndex = i;
            }
        }
        this._forecastColumn = closestIndex;
    }
    fetchData(lat, lon, product) {
        return windyFetch.getMeteogramForecastData(product, {
            lat,
            lon,
            step: 1
        });
    }
    updateWeatherStats = (weatherData)=>{
        this._rawdata = [];
        this._elevation = weatherData.header.elevation;
        this._initTime = weatherData.header.updateTs;
        for(const key in weatherData.data){
            if (key.startsWith('gh-')) {
                const suffix = key.split('gh-')[1];
                const tempKey = `temp-${suffix}`;
                const humidityKey = `rh-${suffix}`;
                const dewpointKey = `dewpoint-${suffix}`;
                const wind_uKey = `wind_u-${suffix}`;
                const wind_vKey = `wind_v-${suffix}`;
                const human = '';
                const pressure = +suffix.slice(0, -1);
                const heightInMeters = +weatherData.data[key][this._forecastColumn];
                const height = +metrics.altitude.convertNumber(weatherData.data[key][this._forecastColumn], 2);
                const heightAGL = +metrics.altitude.convertNumber((heightInMeters - this.elevation).toFixed(0), 2);
                const wind_u = +weatherData.data[wind_uKey][this._forecastColumn].toFixed(0);
                const wind_v = +weatherData.data[wind_vKey][this._forecastColumn].toFixed(0);
                const windDir = +Utility.windDirection(wind_u, wind_v).toFixed(0);
                const windSp = +Utility.windSpeed(wind_u, wind_v).toFixed(0);
                const temperature = +metrics.temp.convertNumber(weatherData.data[tempKey][this._forecastColumn]).toFixed(0);
                const humidityWater = +weatherData.data[humidityKey][this._forecastColumn].toFixed(0);
                const dewPointt = +metrics.temp.convertNumber(weatherData.data[dewpointKey][this._forecastColumn]).toFixed(0);
                this._rawdata.push({
                    pressure,
                    height,
                    heightAGL,
                    temperature,
                    humidityWater,
                    wind_u,
                    wind_v,
                    windDir,
                    windSp,
                    dewPointt,
                    human
                });
            }
        }
        this._rawdata.sort((a, b)=>b.height - a.height);
        console.log('Processed Layers Data:', this._rawdata);
        this._flightLevels = this.stratify(this._rawdata);
        console.log('Stratified Data:', this.flightLevels);
    };
    stratify(data) {
        const result = [];
        let startHeight = 0;
        let endHeight = 0;
        let mInFtFactor = 1;
        if (Utility.findOutAltitudeUnit(1000) == 'ft') {
            mInFtFactor = 3.28084;
        } else if (Utility.findOutAltitudeUnit(1000) == 'm') {
            mInFtFactor = 1;
        }
        if (this.reference == 'AGL') {
            startHeight = Math.floor((data[0].height - this.elevation * mInFtFactor) / this.step) * this.step + this.elevation * mInFtFactor;
            endHeight = Math.ceil((data[data.length - 1].height + this.elevation * mInFtFactor) / (this.step / 2)) * (this.step / 2) - this.step / 2;
            if (endHeight < 0) {
                endHeight = 0;
            }
        } else if (this.reference == 'AMSL') {
            startHeight = Math.floor(data[0].height / this.step) * this.step;
            endHeight = Math.ceil((data[data.length - 1].height + this.elevation * mInFtFactor) / this.step) * this.step;
            if (endHeight < 0) {
                endHeight = 0;
            }
        }
        if (isNaN(data[data.length - 1].pressure)) {
            data[data.length - 1].pressure = Utility.calculatePressure(data[data.length - 2].pressure, data[data.length - 2].height);
        } else if (isNaN(data[data.length - 2].pressure)) {
            data[data.length - 2].pressure = Utility.calculatePressure(data[data.length - 3].pressure, data[data.length - 3].height);
        }
        let previousHuman = '';
        for(let height = startHeight; height >= endHeight; height -= this.step){
            const upperBoundIndex = data.findIndex((d)=>d.height <= height);
            if (upperBoundIndex === -1) {
                result.push({
                    ...data[data.length - 1],
                    height
                });
            } else if (upperBoundIndex === 0 || data[upperBoundIndex].height === height) {
                result.push({
                    ...data[upperBoundIndex],
                    height
                });
            } else {
                const upper = data[upperBoundIndex];
                const lower = data[upperBoundIndex - 1];
                const currentLayer = this.interpolate(lower, upper, height, previousHuman);
                previousHuman = currentLayer.human;
                result.push(currentLayer);
            }
        }
        return result;
    }
    interpolate(lower, upper, targetHeight, previousHuman) {
        const ratio = (targetHeight - upper.height) / (lower.height - upper.height);
        const pressure = Utility.linearInterpolation(upper.pressure, lower.pressure, ratio);
        const humidityWater = Utility.linearInterpolation(upper.humidityWater, lower.humidityWater, ratio);
        const heightAGL = Math.round(Utility.linearInterpolation(upper.heightAGL, lower.heightAGL, ratio) / 10) * 10;
        const temperature = Utility.linearInterpolation(upper.temperature, lower.temperature, ratio);
        const dewPointt = Utility.linearInterpolation(upper.dewPointt, lower.dewPointt, ratio);
        const wind_u = Utility.gaussianInterpolation(upper.wind_u, lower.wind_u, upper.height, lower.height, targetHeight);
        const wind_v = Utility.gaussianInterpolation(upper.wind_v, lower.wind_v, upper.height, lower.height, targetHeight);
        const windDir = Math.round(Utility.windDirection(wind_u, wind_v));
        const windSp = Math.round(Utility.windSpeed(wind_u, wind_v));
        const interpolated = {
            height: targetHeight,
            heightAGL: heightAGL,
            pressure: pressure,
            temperature: temperature,
            humidityWater: humidityWater,
            wind_u: wind_u,
            wind_v: wind_v,
            windDir: windDir,
            windSp: windSp,
            dewPointt: dewPointt,
            human: previousHuman
        };
        return interpolated;
    }
}

/* src/plugin.svelte generated by Svelte v4.2.18 */

function add_css(target) {
	append_styles(target, "svelte-1piaxjs", ".weather-stats.svelte-1piaxjs.svelte-1piaxjs{display:flex;flex-direction:column;padding:10px;background-color:#f8f8f8;text-align:center;max-height:520px;overflow:auto}.weather-stats.svelte-1piaxjs th.svelte-1piaxjs{color:black;background-color:#e5e5e5}.weather-stats.svelte-1piaxjs td.svelte-1piaxjs{text-align:right;width:14.28%}.weather-stats.svelte-1piaxjs table.svelte-1piaxjs{width:100%}.weather-stats.svelte-1piaxjs .green-text.svelte-1piaxjs{color:#026f00}.weather-stats.svelte-1piaxjs .red-text.svelte-1piaxjs{color:#c42f2f}.weather-stats.svelte-1piaxjs .blue-text.svelte-1piaxjs{color:blue}select.svelte-1piaxjs.svelte-1piaxjs{background-color:#6b6b6b;border:none;padding:0 1em 0 0;margin:0;width:80px;color:#ffe3a1;border-radius:3px}input.svelte-1piaxjs.svelte-1piaxjs{background-color:#6b6b6b;border:none;padding:0 1em 0 0;margin:0;width:80px;color:#ffe3a1;border-radius:3px}.overlay-warning.svelte-1piaxjs.svelte-1piaxjs{background-color:#ffd700;color:#333;padding:8px;border-radius:3px;margin-bottom:8px;font-size:0.85em}");
}

function get_each_context(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[20] = list[i];
	return child_ctx;
}

function get_each_context_1(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[44] = list[i];
	return child_ctx;
}

function get_each_context_2(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[47] = list[i].heightAGL;
	child_ctx[48] = list[i].height;
	child_ctx[49] = list[i].windDir;
	child_ctx[50] = list[i].windSp;
	child_ctx[51] = list[i].pressure;
	child_ctx[52] = list[i].temperature;
	child_ctx[53] = list[i].humidityWater;
	child_ctx[54] = list[i].dewPointt;
	return child_ctx;
}

// (12:4) {#if overlayWarning}
function create_if_block_3(ctx) {
	let div;
	let t;

	return {
		c() {
			div = element("div");
			t = text(/*overlayWarning*/ ctx[16]);
			attr(div, "class", "overlay-warning svelte-1piaxjs");
		},
		m(target, anchor) {
			insert(target, div, anchor);
			append(div, t);
		},
		p(ctx, dirty) {
			if (dirty[0] & /*overlayWarning*/ 65536) set_data(t, /*overlayWarning*/ ctx[16]);
		},
		d(detaching) {
			if (detaching) {
				detach(div);
			}
		}
	};
}

// (19:4) {:else}
function create_else_block(ctx) {
	let h40;
	let strong0;
	let br0;
	let t1;
	let t2;
	let t3;
	let h41;
	let strong1;
	let br1;
	let t5;
	let t6;
	let t7;
	let h42;
	let strong2;
	let br2;
	let t9;
	let t10;
	let t11;
	let h43;
	let strong3;
	let t13;
	let t14;
	let t15;
	let hr0;
	let t16;
	let h44;
	let t18;
	let div0;
	let table0;
	let thead;
	let tr0;
	let t32;
	let tr1;
	let th7;
	let t33;
	let t34;
	let br3;
	let t35_value = /*settings*/ ctx[1].referenceLevel + "";
	let t35;
	let t36;
	let th8;
	let t38;
	let th9;
	let t39;
	let t40;
	let th10;
	let t42;
	let th11;
	let t43;
	let t44;
	let th12;
	let t45;
	let t46;
	let th13;
	let t48;
	let div1;
	let table1;
	let tbody;
	let t49;
	let hr1;
	let t50;
	let div4;
	let h46;
	let strong5;
	let br4;
	let t52;
	let h45;
	let div2;
	let label0;
	let t54;
	let select0;
	let option0;
	let t56;
	let label1;
	let t57;
	let t58;
	let div3;
	let label2;
	let t60;
	let select1;
	let option1;
	let t62;
	let hr2;
	let t63;
	let div8;
	let h48;
	let strong6;
	let br5;
	let t65;
	let h47;
	let div5;
	let label3;
	let t67;
	let input0;
	let t68;
	let label4;
	let t69;
	let t70;
	let t71_value = /*settings*/ ctx[1].referenceLevel + "";
	let t71;
	let t72;
	let div6;
	let label5;
	let t74;
	let input1;
	let t75;
	let label6;
	let t76;
	let t77;
	let t78_value = /*settings*/ ctx[1].referenceLevel + "";
	let t78;
	let t79;
	let div7;
	let strong7;
	let t80;
	let t81;
	let t82;
	let t83;
	let t84;
	let t85;
	let mounted;
	let dispose;
	let each_value_2 = ensure_array_like(/*flightLevels*/ ctx[0]);
	let each_blocks_2 = [];

	for (let i = 0; i < each_value_2.length; i += 1) {
		each_blocks_2[i] = create_each_block_2(get_each_context_2(ctx, each_value_2, i));
	}

	let each_value_1 = ensure_array_like(/*incrementquestions*/ ctx[19]);
	let each_blocks_1 = [];

	for (let i = 0; i < each_value_1.length; i += 1) {
		each_blocks_1[i] = create_each_block_1(get_each_context_1(ctx, each_value_1, i));
	}

	let each_value = ensure_array_like(/*referencelevelquestions*/ ctx[20]);
	let each_blocks = [];

	for (let i = 0; i < each_value.length; i += 1) {
		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
	}

	return {
		c() {
			h40 = element("h4");
			strong0 = element("strong");
			strong0.textContent = "Location: ";
			br0 = element("br");
			t1 = space();
			t2 = text(/*clickLocation*/ ctx[6]);
			t3 = space();
			h41 = element("h4");
			strong1 = element("strong");
			strong1.textContent = "Forecast time: ";
			br1 = element("br");
			t5 = space();
			t6 = text(/*forecastDateString*/ ctx[7]);
			t7 = space();
			h42 = element("h4");
			strong2 = element("strong");
			strong2.textContent = "Forecast model: ";
			br2 = element("br");
			t9 = space();
			t10 = text(/*forecastModel*/ ctx[8]);
			t11 = space();
			h43 = element("h4");
			strong3 = element("strong");
			strong3.textContent = "Elevation:";
			t13 = space();
			t14 = text(/*elevation*/ ctx[9]);
			t15 = space();
			hr0 = element("hr");
			t16 = space();
			h44 = element("h4");
			h44.innerHTML = `<strong>Upper winds, temperature and humidity</strong>`;
			t18 = space();
			div0 = element("div");
			table0 = element("table");
			thead = element("thead");
			tr0 = element("tr");
			tr0.innerHTML = `<th class="svelte-1piaxjs">h</th> <th class="svelte-1piaxjs">Dir</th> <th class="svelte-1piaxjs">Speed</th> <th class="svelte-1piaxjs">p</th> <th class="svelte-1piaxjs">T</th> <th class="svelte-1piaxjs">Td</th> <th class="svelte-1piaxjs">RHw</th>`;
			t32 = space();
			tr1 = element("tr");
			th7 = element("th");
			t33 = text(/*altitudeUnit*/ ctx[15]);
			t34 = space();
			br3 = element("br");
			t35 = text(t35_value);
			t36 = space();
			th8 = element("th");
			th8.textContent = "°";
			t38 = space();
			th9 = element("th");
			t39 = text(/*windUnit*/ ctx[14]);
			t40 = space();
			th10 = element("th");
			th10.textContent = "hPa";
			t42 = space();
			th11 = element("th");
			t43 = text(/*temperatureUnit*/ ctx[12]);
			t44 = space();
			th12 = element("th");
			t45 = text(/*temperatureUnit*/ ctx[12]);
			t46 = space();
			th13 = element("th");
			th13.textContent = "%";
			t48 = space();
			div1 = element("div");
			table1 = element("table");
			tbody = element("tbody");

			for (let i = 0; i < each_blocks_2.length; i += 1) {
				each_blocks_2[i].c();
			}

			t49 = space();
			hr1 = element("hr");
			t50 = space();
			div4 = element("div");
			h46 = element("h4");
			strong5 = element("strong");
			strong5.textContent = "Settings: ";
			br4 = element("br");
			t52 = space();
			h45 = element("h4");
			div2 = element("div");
			label0 = element("label");
			label0.textContent = "Choose interpolation step:";
			t54 = space();
			select0 = element("select");
			option0 = element("option");
			option0.textContent = "-- Select Increment --";

			for (let i = 0; i < each_blocks_1.length; i += 1) {
				each_blocks_1[i].c();
			}

			t56 = space();
			label1 = element("label");
			t57 = text(/*altitudeUnit*/ ctx[15]);
			t58 = space();
			div3 = element("div");
			label2 = element("label");
			label2.textContent = "Choose reference level for altitude:";
			t60 = space();
			select1 = element("select");
			option1 = element("option");
			option1.textContent = "-- Select Reference --";

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].c();
			}

			t62 = space();
			hr2 = element("hr");
			t63 = space();
			div8 = element("div");
			h48 = element("h4");
			strong6 = element("strong");
			strong6.textContent = "Calculate mean wind between: ";
			br5 = element("br");
			t65 = space();
			h47 = element("h4");
			div5 = element("div");
			label3 = element("label");
			label3.textContent = "Lower altitude:";
			t67 = space();
			input0 = element("input");
			t68 = space();
			label4 = element("label");
			t69 = text(/*altitudeUnit*/ ctx[15]);
			t70 = space();
			t71 = text(t71_value);
			t72 = space();
			div6 = element("div");
			label5 = element("label");
			label5.textContent = "Upper altitude:";
			t74 = space();
			input1 = element("input");
			t75 = space();
			label6 = element("label");
			t76 = text(/*altitudeUnit*/ ctx[15]);
			t77 = space();
			t78 = text(t78_value);
			t79 = space();
			div7 = element("div");
			strong7 = element("strong");
			t80 = text("Mean wind: ");
			t81 = text(/*meanWindDirection*/ ctx[10]);
			t82 = text("° ");
			t83 = text(/*meanWindSpeed*/ ctx[11]);
			t84 = space();
			t85 = text(/*windUnit*/ ctx[14]);
			attr(th7, "class", "svelte-1piaxjs");
			attr(th8, "class", "svelte-1piaxjs");
			attr(th9, "class", "svelte-1piaxjs");
			attr(th10, "class", "svelte-1piaxjs");
			attr(th11, "class", "svelte-1piaxjs");
			attr(th12, "class", "svelte-1piaxjs");
			attr(th13, "class", "svelte-1piaxjs");
			attr(table0, "class", "svelte-1piaxjs");
			attr(div0, "class", "weather-stats svelte-1piaxjs");
			attr(tbody, "class", "scroll");
			attr(table1, "class", "svelte-1piaxjs");
			attr(div1, "class", "weather-stats svelte-1piaxjs");
			attr(label0, "for", "");
			attr(label0, "class", "form-label");
			option0.__value = "";
			set_input_value(option0, option0.__value);
			option0.disabled = true;
			attr(select0, "class", "from-select svelte-1piaxjs");
			if (/*settings*/ ctx[1].increment === void 0) add_render_callback(() => /*select0_change_handler*/ ctx[24].call(select0));
			attr(label1, "for", "");
			attr(label1, "class", "form-label");
			attr(div2, "class", "mb-3");
			attr(label2, "for", "");
			attr(label2, "class", "form-label");
			option1.__value = "";
			set_input_value(option1, option1.__value);
			option1.disabled = true;
			attr(select1, "class", "from-select svelte-1piaxjs");
			if (/*settings*/ ctx[1].referenceLevel === void 0) add_render_callback(() => /*select1_change_handler*/ ctx[25].call(select1));
			attr(div3, "class", "mb-3");
			attr(label3, "for", "");
			attr(label3, "class", "form-label");
			attr(input0, "type", "text");
			attr(input0, "class", "svelte-1piaxjs");
			attr(label4, "for", "");
			attr(label4, "class", "form-label");
			attr(div5, "class", "mb-3");
			attr(label5, "for", "");
			attr(label5, "class", "form-label");
			attr(input1, "type", "text");
			attr(input1, "class", "svelte-1piaxjs");
			attr(label6, "for", "");
			attr(label6, "class", "form-label");
			attr(div6, "class", "mb-3");
			attr(div7, "class", "mb-3");
		},
		m(target, anchor) {
			insert(target, h40, anchor);
			append(h40, strong0);
			append(h40, br0);
			append(h40, t1);
			append(h40, t2);
			insert(target, t3, anchor);
			insert(target, h41, anchor);
			append(h41, strong1);
			append(h41, br1);
			append(h41, t5);
			append(h41, t6);
			insert(target, t7, anchor);
			insert(target, h42, anchor);
			append(h42, strong2);
			append(h42, br2);
			append(h42, t9);
			append(h42, t10);
			insert(target, t11, anchor);
			insert(target, h43, anchor);
			append(h43, strong3);
			append(h43, t13);
			append(h43, t14);
			insert(target, t15, anchor);
			insert(target, hr0, anchor);
			insert(target, t16, anchor);
			insert(target, h44, anchor);
			insert(target, t18, anchor);
			insert(target, div0, anchor);
			append(div0, table0);
			append(table0, thead);
			append(thead, tr0);
			append(thead, t32);
			append(thead, tr1);
			append(tr1, th7);
			append(th7, t33);
			append(th7, t34);
			append(th7, br3);
			append(th7, t35);
			append(tr1, t36);
			append(tr1, th8);
			append(tr1, t38);
			append(tr1, th9);
			append(th9, t39);
			append(tr1, t40);
			append(tr1, th10);
			append(tr1, t42);
			append(tr1, th11);
			append(th11, t43);
			append(tr1, t44);
			append(tr1, th12);
			append(th12, t45);
			append(tr1, t46);
			append(tr1, th13);
			insert(target, t48, anchor);
			insert(target, div1, anchor);
			append(div1, table1);
			append(table1, tbody);

			for (let i = 0; i < each_blocks_2.length; i += 1) {
				if (each_blocks_2[i]) {
					each_blocks_2[i].m(tbody, null);
				}
			}

			insert(target, t49, anchor);
			insert(target, hr1, anchor);
			insert(target, t50, anchor);
			insert(target, div4, anchor);
			append(div4, h46);
			append(h46, strong5);
			append(h46, br4);
			append(h46, t52);
			append(h46, h45);
			append(h45, div2);
			append(div2, label0);
			append(div2, t54);
			append(div2, select0);
			append(select0, option0);

			for (let i = 0; i < each_blocks_1.length; i += 1) {
				if (each_blocks_1[i]) {
					each_blocks_1[i].m(select0, null);
				}
			}

			select_option(select0, /*settings*/ ctx[1].increment, true);
			append(div2, t56);
			append(div2, label1);
			append(label1, t57);
			append(h45, t58);
			append(h45, div3);
			append(div3, label2);
			append(div3, t60);
			append(div3, select1);
			append(select1, option1);

			for (let i = 0; i < each_blocks.length; i += 1) {
				if (each_blocks[i]) {
					each_blocks[i].m(select1, null);
				}
			}

			select_option(select1, /*settings*/ ctx[1].referenceLevel, true);
			insert(target, t62, anchor);
			insert(target, hr2, anchor);
			insert(target, t63, anchor);
			insert(target, div8, anchor);
			append(div8, h48);
			append(h48, strong6);
			append(h48, br5);
			append(h48, t65);
			append(h48, h47);
			append(h47, div5);
			append(div5, label3);
			append(div5, t67);
			append(div5, input0);
			set_input_value(input0, /*lowerAltitudeInput*/ ctx[2]);
			append(div5, t68);
			append(div5, label4);
			append(label4, t69);
			append(label4, t70);
			append(label4, t71);
			append(h47, t72);
			append(h47, div6);
			append(div6, label5);
			append(div6, t74);
			append(div6, input1);
			set_input_value(input1, /*upperAltitudeInput*/ ctx[3]);
			append(div6, t75);
			append(div6, label6);
			append(label6, t76);
			append(label6, t77);
			append(label6, t78);
			append(h48, t79);
			append(h48, div7);
			append(div7, strong7);
			append(strong7, t80);
			append(strong7, t81);
			append(strong7, t82);
			append(strong7, t83);
			append(strong7, t84);
			append(strong7, t85);

			if (!mounted) {
				dispose = [
					listen(select0, "change", /*select0_change_handler*/ ctx[24]),
					listen(select1, "change", /*select1_change_handler*/ ctx[25]),
					listen(input0, "input", /*input0_input_handler*/ ctx[26]),
					listen(input1, "input", /*input1_input_handler*/ ctx[27])
				];

				mounted = true;
			}
		},
		p(ctx, dirty) {
			if (dirty[0] & /*clickLocation*/ 64) set_data(t2, /*clickLocation*/ ctx[6]);
			if (dirty[0] & /*forecastDateString*/ 128) set_data(t6, /*forecastDateString*/ ctx[7]);
			if (dirty[0] & /*forecastModel*/ 256) set_data(t10, /*forecastModel*/ ctx[8]);
			if (dirty[0] & /*elevation*/ 512) set_data(t14, /*elevation*/ ctx[9]);
			if (dirty[0] & /*altitudeUnit*/ 32768) set_data(t33, /*altitudeUnit*/ ctx[15]);
			if (dirty[0] & /*settings*/ 2 && t35_value !== (t35_value = /*settings*/ ctx[1].referenceLevel + "")) set_data(t35, t35_value);
			if (dirty[0] & /*windUnit*/ 16384) set_data(t39, /*windUnit*/ ctx[14]);
			if (dirty[0] & /*temperatureUnit*/ 4096) set_data(t43, /*temperatureUnit*/ ctx[12]);
			if (dirty[0] & /*temperatureUnit*/ 4096) set_data(t45, /*temperatureUnit*/ ctx[12]);

			if (dirty[0] & /*flightLevels, freezingLevelAt, settings*/ 8195) {
				each_value_2 = ensure_array_like(/*flightLevels*/ ctx[0]);
				let i;

				for (i = 0; i < each_value_2.length; i += 1) {
					const child_ctx = get_each_context_2(ctx, each_value_2, i);

					if (each_blocks_2[i]) {
						each_blocks_2[i].p(child_ctx, dirty);
					} else {
						each_blocks_2[i] = create_each_block_2(child_ctx);
						each_blocks_2[i].c();
						each_blocks_2[i].m(tbody, null);
					}
				}

				for (; i < each_blocks_2.length; i += 1) {
					each_blocks_2[i].d(1);
				}

				each_blocks_2.length = each_value_2.length;
			}

			if (dirty[0] & /*incrementquestions*/ 524288) {
				each_value_1 = ensure_array_like(/*incrementquestions*/ ctx[19]);
				let i;

				for (i = 0; i < each_value_1.length; i += 1) {
					const child_ctx = get_each_context_1(ctx, each_value_1, i);

					if (each_blocks_1[i]) {
						each_blocks_1[i].p(child_ctx, dirty);
					} else {
						each_blocks_1[i] = create_each_block_1(child_ctx);
						each_blocks_1[i].c();
						each_blocks_1[i].m(select0, null);
					}
				}

				for (; i < each_blocks_1.length; i += 1) {
					each_blocks_1[i].d(1);
				}

				each_blocks_1.length = each_value_1.length;
			}

			if (dirty[0] & /*settings, incrementquestions*/ 524290) {
				select_option(select0, /*settings*/ ctx[1].increment);
			}

			if (dirty[0] & /*altitudeUnit*/ 32768) set_data(t57, /*altitudeUnit*/ ctx[15]);

			if (dirty[0] & /*referencelevelquestions*/ 1048576) {
				each_value = ensure_array_like(/*referencelevelquestions*/ ctx[20]);
				let i;

				for (i = 0; i < each_value.length; i += 1) {
					const child_ctx = get_each_context(ctx, each_value, i);

					if (each_blocks[i]) {
						each_blocks[i].p(child_ctx, dirty);
					} else {
						each_blocks[i] = create_each_block(child_ctx);
						each_blocks[i].c();
						each_blocks[i].m(select1, null);
					}
				}

				for (; i < each_blocks.length; i += 1) {
					each_blocks[i].d(1);
				}

				each_blocks.length = each_value.length;
			}

			if (dirty[0] & /*settings, incrementquestions*/ 524290) {
				select_option(select1, /*settings*/ ctx[1].referenceLevel);
			}

			if (dirty[0] & /*lowerAltitudeInput*/ 4 && input0.value !== /*lowerAltitudeInput*/ ctx[2]) {
				set_input_value(input0, /*lowerAltitudeInput*/ ctx[2]);
			}

			if (dirty[0] & /*altitudeUnit*/ 32768) set_data(t69, /*altitudeUnit*/ ctx[15]);
			if (dirty[0] & /*settings*/ 2 && t71_value !== (t71_value = /*settings*/ ctx[1].referenceLevel + "")) set_data(t71, t71_value);

			if (dirty[0] & /*upperAltitudeInput*/ 8 && input1.value !== /*upperAltitudeInput*/ ctx[3]) {
				set_input_value(input1, /*upperAltitudeInput*/ ctx[3]);
			}

			if (dirty[0] & /*altitudeUnit*/ 32768) set_data(t76, /*altitudeUnit*/ ctx[15]);
			if (dirty[0] & /*settings*/ 2 && t78_value !== (t78_value = /*settings*/ ctx[1].referenceLevel + "")) set_data(t78, t78_value);
			if (dirty[0] & /*meanWindDirection*/ 1024) set_data(t81, /*meanWindDirection*/ ctx[10]);
			if (dirty[0] & /*meanWindSpeed*/ 2048) set_data(t83, /*meanWindSpeed*/ ctx[11]);
			if (dirty[0] & /*windUnit*/ 16384) set_data(t85, /*windUnit*/ ctx[14]);
		},
		d(detaching) {
			if (detaching) {
				detach(h40);
				detach(t3);
				detach(h41);
				detach(t7);
				detach(h42);
				detach(t11);
				detach(h43);
				detach(t15);
				detach(hr0);
				detach(t16);
				detach(h44);
				detach(t18);
				detach(div0);
				detach(t48);
				detach(div1);
				detach(t49);
				detach(hr1);
				detach(t50);
				detach(div4);
				detach(t62);
				detach(hr2);
				detach(t63);
				detach(div8);
			}

			destroy_each(each_blocks_2, detaching);
			destroy_each(each_blocks_1, detaching);
			destroy_each(each_blocks, detaching);
			mounted = false;
			run_all(dispose);
		}
	};
}

// (17:33) 
function create_if_block_1(ctx) {
	let h4;
	let strong;
	let t0;
	let t1;

	return {
		c() {
			h4 = element("h4");
			strong = element("strong");
			t0 = text("No forecast available for ");
			t1 = text(/*forecastDateString*/ ctx[7]);
		},
		m(target, anchor) {
			insert(target, h4, anchor);
			append(h4, strong);
			append(strong, t0);
			append(strong, t1);
		},
		p(ctx, dirty) {
			if (dirty[0] & /*forecastDateString*/ 128) set_data(t1, /*forecastDateString*/ ctx[7]);
		},
		d(detaching) {
			if (detaching) {
				detach(h4);
			}
		}
	};
}

// (15:4) {#if !ready}
function create_if_block(ctx) {
	let h4;

	return {
		c() {
			h4 = element("h4");
			h4.innerHTML = `<strong>Click on map to generate an upper wind table</strong>`;
		},
		m(target, anchor) {
			insert(target, h4, anchor);
		},
		p: noop,
		d(detaching) {
			if (detaching) {
				detach(h4);
			}
		}
	};
}

// (74:28) {:else}
function create_else_block_1(ctx) {
	let td;
	let t_value = /*height*/ ctx[48] + "";
	let t;

	return {
		c() {
			td = element("td");
			t = text(t_value);
			attr(td, "class", "svelte-1piaxjs");
		},
		m(target, anchor) {
			insert(target, td, anchor);
			append(td, t);
		},
		p(ctx, dirty) {
			if (dirty[0] & /*flightLevels*/ 1 && t_value !== (t_value = /*height*/ ctx[48] + "")) set_data(t, t_value);
		},
		d(detaching) {
			if (detaching) {
				detach(td);
			}
		}
	};
}

// (72:28) {#if settings.referenceLevel == 'AGL'}
function create_if_block_2(ctx) {
	let td;
	let t_value = /*heightAGL*/ ctx[47] + "";
	let t;

	return {
		c() {
			td = element("td");
			t = text(t_value);
			attr(td, "class", "svelte-1piaxjs");
		},
		m(target, anchor) {
			insert(target, td, anchor);
			append(td, t);
		},
		p(ctx, dirty) {
			if (dirty[0] & /*flightLevels*/ 1 && t_value !== (t_value = /*heightAGL*/ ctx[47] + "")) set_data(t, t_value);
		},
		d(detaching) {
			if (detaching) {
				detach(td);
			}
		}
	};
}

// (65:20) {#each flightLevels as { heightAGL, height, windDir, windSp, pressure, temperature, humidityWater, dewPointt }}
function create_each_block_2(ctx) {
	let tr;
	let t0;
	let td0;
	let t1_value = /*windDir*/ ctx[49] + "";
	let t1;
	let t2;
	let td1;
	let t3_value = /*windSp*/ ctx[50] + "";
	let t3;
	let t4;
	let td2;
	let t5_value = /*pressure*/ ctx[51] + "";
	let t5;
	let t6;
	let td3;
	let t7_value = /*temperature*/ ctx[52] + "";
	let t7;
	let t8;
	let td4;
	let t9_value = /*dewPointt*/ ctx[54] + "";
	let t9;
	let t10;
	let td5;
	let t11_value = /*humidityWater*/ ctx[53] + "";
	let t11;
	let t12;

	function select_block_type_1(ctx, dirty) {
		if (/*settings*/ ctx[1].referenceLevel == 'AGL') return create_if_block_2;
		return create_else_block_1;
	}

	let current_block_type = select_block_type_1(ctx);
	let if_block = current_block_type(ctx);

	return {
		c() {
			tr = element("tr");
			if_block.c();
			t0 = space();
			td0 = element("td");
			t1 = text(t1_value);
			t2 = space();
			td1 = element("td");
			t3 = text(t3_value);
			t4 = space();
			td2 = element("td");
			t5 = text(t5_value);
			t6 = space();
			td3 = element("td");
			t7 = text(t7_value);
			t8 = space();
			td4 = element("td");
			t9 = text(t9_value);
			t10 = space();
			td5 = element("td");
			t11 = text(t11_value);
			t12 = space();
			attr(td0, "class", "svelte-1piaxjs");
			attr(td1, "class", "svelte-1piaxjs");
			attr(td2, "class", "svelte-1piaxjs");
			attr(td3, "class", "svelte-1piaxjs");
			attr(td4, "class", "svelte-1piaxjs");
			attr(td5, "class", "svelte-1piaxjs");
			attr(tr, "class", "svelte-1piaxjs");
			toggle_class(tr, "green-text", /*temperature*/ ctx[52] > /*freezingLevelAt*/ ctx[13] - 0.5 && /*temperature*/ ctx[52] < /*freezingLevelAt*/ ctx[13] + 0.5);
			toggle_class(tr, "blue-text", /*temperature*/ ctx[52] <= /*freezingLevelAt*/ ctx[13] - 0.5);
			toggle_class(tr, "red-text", /*temperature*/ ctx[52] >= /*freezingLevelAt*/ ctx[13] + 0.5);
		},
		m(target, anchor) {
			insert(target, tr, anchor);
			if_block.m(tr, null);
			append(tr, t0);
			append(tr, td0);
			append(td0, t1);
			append(tr, t2);
			append(tr, td1);
			append(td1, t3);
			append(tr, t4);
			append(tr, td2);
			append(td2, t5);
			append(tr, t6);
			append(tr, td3);
			append(td3, t7);
			append(tr, t8);
			append(tr, td4);
			append(td4, t9);
			append(tr, t10);
			append(tr, td5);
			append(td5, t11);
			append(tr, t12);
		},
		p(ctx, dirty) {
			if (current_block_type === (current_block_type = select_block_type_1(ctx)) && if_block) {
				if_block.p(ctx, dirty);
			} else {
				if_block.d(1);
				if_block = current_block_type(ctx);

				if (if_block) {
					if_block.c();
					if_block.m(tr, t0);
				}
			}

			if (dirty[0] & /*flightLevels*/ 1 && t1_value !== (t1_value = /*windDir*/ ctx[49] + "")) set_data(t1, t1_value);
			if (dirty[0] & /*flightLevels*/ 1 && t3_value !== (t3_value = /*windSp*/ ctx[50] + "")) set_data(t3, t3_value);
			if (dirty[0] & /*flightLevels*/ 1 && t5_value !== (t5_value = /*pressure*/ ctx[51] + "")) set_data(t5, t5_value);
			if (dirty[0] & /*flightLevels*/ 1 && t7_value !== (t7_value = /*temperature*/ ctx[52] + "")) set_data(t7, t7_value);
			if (dirty[0] & /*flightLevels*/ 1 && t9_value !== (t9_value = /*dewPointt*/ ctx[54] + "")) set_data(t9, t9_value);
			if (dirty[0] & /*flightLevels*/ 1 && t11_value !== (t11_value = /*humidityWater*/ ctx[53] + "")) set_data(t11, t11_value);

			if (dirty[0] & /*flightLevels, freezingLevelAt*/ 8193) {
				toggle_class(tr, "green-text", /*temperature*/ ctx[52] > /*freezingLevelAt*/ ctx[13] - 0.5 && /*temperature*/ ctx[52] < /*freezingLevelAt*/ ctx[13] + 0.5);
			}

			if (dirty[0] & /*flightLevels, freezingLevelAt*/ 8193) {
				toggle_class(tr, "blue-text", /*temperature*/ ctx[52] <= /*freezingLevelAt*/ ctx[13] - 0.5);
			}

			if (dirty[0] & /*flightLevels, freezingLevelAt*/ 8193) {
				toggle_class(tr, "red-text", /*temperature*/ ctx[52] >= /*freezingLevelAt*/ ctx[13] + 0.5);
			}
		},
		d(detaching) {
			if (detaching) {
				detach(tr);
			}

			if_block.d();
		}
	};
}

// (97:28) {#each incrementquestions as incrementquestion}
function create_each_block_1(ctx) {
	let option;
	let t_value = /*incrementquestion*/ ctx[44].text + "";
	let t;

	return {
		c() {
			option = element("option");
			t = text(t_value);
			option.__value = /*incrementquestion*/ ctx[44].text;
			set_input_value(option, option.__value);
		},
		m(target, anchor) {
			insert(target, option, anchor);
			append(option, t);
		},
		p: noop,
		d(detaching) {
			if (detaching) {
				detach(option);
			}
		}
	};
}

// (111:28) {#each referencelevelquestions as referencelevelquestions}
function create_each_block(ctx) {
	let option;
	let t_value = /*referencelevelquestions*/ ctx[20].text + "";
	let t;

	return {
		c() {
			option = element("option");
			t = text(t_value);
			option.__value = /*referencelevelquestions*/ ctx[20].text;
			set_input_value(option, option.__value);
		},
		m(target, anchor) {
			insert(target, option, anchor);
			append(option, t);
		},
		p: noop,
		d(detaching) {
			if (detaching) {
				detach(option);
			}
		}
	};
}

function create_fragment(ctx) {
	let div0;
	let t1;
	let section;
	let div1;
	let t2;
	let t3;
	let span;
	let t6;
	let t7;
	let t8;
	let hr;
	let mounted;
	let dispose;
	let if_block0 = /*overlayWarning*/ ctx[16] && create_if_block_3(ctx);

	function select_block_type(ctx, dirty) {
		if (!/*ready*/ ctx[5]) return create_if_block;
		if (/*errorHandlerOutput*/ ctx[4]) return create_if_block_1;
		return create_else_block;
	}

	let current_block_type = select_block_type(ctx);
	let if_block1 = current_block_type(ctx);

	return {
		c() {
			div0 = element("div");
			div0.textContent = `${/*title*/ ctx[17]}`;
			t1 = space();
			section = element("section");
			div1 = element("div");
			t2 = text(/*title*/ ctx[17]);
			t3 = space();
			span = element("span");
			span.textContent = `v${/*version*/ ctx[18]}`;
			t6 = space();
			if (if_block0) if_block0.c();
			t7 = space();
			if_block1.c();
			t8 = space();
			hr = element("hr");
			attr(div0, "class", "plugin__mobile-header");
			set_style(span, "font-size", "0.5em");
			attr(div1, "class", "plugin__title plugin__title--chevron-back");
			attr(section, "class", "plugin__content");
		},
		m(target, anchor) {
			insert(target, div0, anchor);
			insert(target, t1, anchor);
			insert(target, section, anchor);
			append(section, div1);
			append(div1, t2);
			append(div1, t3);
			append(div1, span);
			append(section, t6);
			if (if_block0) if_block0.m(section, null);
			append(section, t7);
			if_block1.m(section, null);
			append(section, t8);
			append(section, hr);

			if (!mounted) {
				dispose = listen(div1, "click", /*click_handler*/ ctx[23]);
				mounted = true;
			}
		},
		p(ctx, dirty) {
			if (/*overlayWarning*/ ctx[16]) {
				if (if_block0) {
					if_block0.p(ctx, dirty);
				} else {
					if_block0 = create_if_block_3(ctx);
					if_block0.c();
					if_block0.m(section, t7);
				}
			} else if (if_block0) {
				if_block0.d(1);
				if_block0 = null;
			}

			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block1) {
				if_block1.p(ctx, dirty);
			} else {
				if_block1.d(1);
				if_block1 = current_block_type(ctx);

				if (if_block1) {
					if_block1.c();
					if_block1.m(section, t8);
				}
			}
		},
		i: noop,
		o: noop,
		d(detaching) {
			if (detaching) {
				detach(div0);
				detach(t1);
				detach(section);
			}

			if (if_block0) if_block0.d();
			if_block1.d();
			mounted = false;
			dispose();
		}
	};
}

function instance($$self, $$props, $$invalidate) {
	let ready = false;
	let flightLevels = [];
	let clickLocation = '';
	let forecastDate = '';
	let forecastDateString = '';
	let forecastModel = '';
	let elevation;
	let position = undefined;
	let meanWindDirection;
	let meanWindSpeed;
	let destroyed = false;
	const { title } = config;
	const { version } = config;
	const upperwind = new UpperWind();
	let temperatureUnit = Utility.findOutTemperatureUnit(273.15);
	let freezingLevelAt = 0;

	function freezingLevel() {
		if (temperatureUnit === '°C') {
			$$invalidate(13, freezingLevelAt = 0);
		} else if (temperatureUnit === '°F') {
			$$invalidate(13, freezingLevelAt = 32);
		}

		return freezingLevelAt;
	}

	freezingLevelAt = freezingLevel();
	let windUnit = Utility.findOutWindUnit(10);
	let altitudeUnit = Utility.findOutAltitudeUnit(100);
	let settings = { increment: '500', referenceLevel: 'AGL' };

	let incrementquestions = [
		{ text: '100' },
		{ text: '200' },
		{ text: '500' },
		{ text: '1000' },
		{ text: '2000' }
	];

	let referencelevelquestions = [{ text: 'AGL' }, { text: 'AMSL' }];
	let lowerAltitudeInput = '0';
	let upperAltitudeInput = '3000';
	let errorHandlerOutput = false;
	let overlayWarning = '';
	let openParamHandler = null;
	let pluginOpenedHandler = null;
	let paramsChangedHandler = null;
	let pluginClosedHandler = null;
	var activeLayer = L.featureGroup().addTo(map);

	var popup = L.popup({
		autoClose: false,
		closeOnClick: false,
		closeButton: false
	});

	let draggablePopup;

	async function makePopupDraggable() {
		try {
			if (!draggablePopup) {
				draggablePopup = new L.Draggable(popup._container, popup._wrapper);
				draggablePopup.enable();

				draggablePopup.on('dragend', async function () {
					const containerPoint = map.layerPointToContainerPoint(draggablePopup._newPos);
					const latlng = map.containerPointToLatLng(containerPoint);
					popup.setLatLng(latlng);
					position = { lat: latlng.lat, lon: latlng.lng };
					popup.setContent('Loading....');
					upperwind.setTime(windyStore.get('timestamp'));
					await upperwind.handleEvent(position);
					assignAnalysis(upperwind);
					popup.setContent(clickLocation);
				});
			}
		} catch(_e) {
			draggablePopup = null;
		}
	}

	activeLayer.clearLayers();

	const onopen = async _params => {
		if (!_params) {
			return;
		}

		destroyed = false;

		if (openParamHandler) {
			bcast.off('pluginOpened', openParamHandler);
		}

		openParamHandler = async () => {
			console.log('In onopen pluginOpened ');
			if (destroyed == true) return;
			const warning = Utility.checkOverlay();
			if (warning) $$invalidate(16, overlayWarning = warning);
			popup.setLatLng([_params.lat, _params.lon]).setContent('Loading....').addTo(activeLayer).openOn(map);
			makePopupDraggable();
			upperwind.setTime(windyStore.get('timestamp'));
			await upperwind.handleEvent(_params);
			assignAnalysis(upperwind);
			popup.setContent(clickLocation);
			map.setView(new L.LatLng(_params.lat, _params.lon), 11);
		};

		bcast.on('pluginOpened', openParamHandler);
	};

	onMount(() => {
		if (destroyed == true) return;

		singleclick.on('windy-plugin-upper-winds', async ev => {
			console.log('In onMount singleclick');

			if (destroyed == false) {
				const warning = Utility.checkOverlay();
				if (warning) $$invalidate(16, overlayWarning = warning);
			}

			position = { lat: ev.lat, lon: ev.lon };
			popup.setLatLng([position.lat, position.lon]).setContent('Loading....').addTo(activeLayer).openOn(map);
			makePopupDraggable();
			await upperwind.handleEvent(ev);
			assignAnalysis(upperwind);
			popup.setContent(clickLocation);
			map.setView(new L.LatLng(position.lat, position.lon), 11);
		});

		pluginOpenedHandler = async () => {
			if (position === undefined) return;
			upperwind.setTime(windyStore.get('timestamp'));
			popup.setLatLng([position.lat, position.lon]).setContent('Loading....').addTo(activeLayer).openOn(map);
			makePopupDraggable();
			await upperwind.handleEvent(position);
			assignAnalysis(upperwind);
			popup.setContent(clickLocation);
		};

		bcast.on('pluginOpened', pluginOpenedHandler);

		paramsChangedHandler = async () => {
			console.log('In onMount paramsChanged');

			if (destroyed == false) {
				const warning = Utility.checkOverlay();
				if (warning) $$invalidate(16, overlayWarning = warning);
			}

			if (position === undefined) return;
			upperwind.setTime(windyStore.get('timestamp'));
			popup.setContent('Loading....');
			await upperwind.handleEvent(position);
			assignAnalysis(upperwind);
			popup.setContent(clickLocation);
		};

		bcast.on('paramsChanged', paramsChangedHandler);

		pluginClosedHandler = () => {
			popup.closePopup();
		};

		bcast.on('pluginClosed', pluginClosedHandler);
	});

	onDestroy(() => {
		destroyed = true;
		popup.remove();

		if (draggablePopup) {
			draggablePopup.disable();
			draggablePopup.off('dragend');
		}

		if (paramsChangedHandler) bcast.off('paramsChanged', paramsChangedHandler);
		if (pluginOpenedHandler) bcast.off('pluginOpened', pluginOpenedHandler);
		if (pluginClosedHandler) bcast.off('pluginClosed', pluginClosedHandler);
		if (openParamHandler) bcast.off('pluginOpened', openParamHandler);
		singleclick.emit('windy-plugin-upper-winds', 'destroy');
		windyStore.off('timestamp', upperwind.setTime);
		windyStore.off('overlay', Utility.checkOverlay);
		windyStore.off('product', upperwind.handleEvent);
	});

	function assignAnalysis(upperwind) {
		$$invalidate(12, temperatureUnit = Utility.findOutTemperatureUnit(0));
		$$invalidate(15, altitudeUnit = Utility.findOutAltitudeUnit(1000));
		$$invalidate(14, windUnit = Utility.findOutWindUnit(10));
		$$invalidate(13, freezingLevelAt = freezingLevel());
		$$invalidate(6, clickLocation = upperwind.clickLocation);
		$$invalidate(0, flightLevels = upperwind.flightLevels);
		flightLevels.filter(level => level.temperature <= level.applemanTemp);
		forecastDate = new Date(windyStore.get('timestamp'));
		let year = forecastDate.getFullYear();
		let month = forecastDate.getMonth() + 1;
		let day = forecastDate.getDate();
		let hours = forecastDate.getHours();
		$$invalidate(7, forecastDateString = year + '-' + month + '-' + day + ' ' + hours + ':00 loc ');
		$$invalidate(8, forecastModel = upperwind.model);
		$$invalidate(9, elevation = (upperwind.elevation * 3.28084).toFixed(0) + ' ft/ ' + upperwind.elevation + ' m');
		$$invalidate(5, ready = true);
	}

	const click_handler = () => bcast.emit('rqstOpen', 'menu');

	function select0_change_handler() {
		settings.increment = select_value(this);
		$$invalidate(1, settings);
		$$invalidate(19, incrementquestions);
	}

	function select1_change_handler() {
		settings.referenceLevel = select_value(this);
		$$invalidate(1, settings);
		$$invalidate(19, incrementquestions);
	}

	function input0_input_handler() {
		lowerAltitudeInput = this.value;
		$$invalidate(2, lowerAltitudeInput);
	}

	function input1_input_handler() {
		upperAltitudeInput = this.value;
		$$invalidate(3, upperAltitudeInput);
	}

	$$self.$$.update = () => {
		if ($$self.$$.dirty[0] & /*lowerAltitudeInput, upperAltitudeInput, upperwind, errorHandlerOutput, flightLevels, settings*/ 4194335) {
			{
				$$invalidate(22, upperwind._lowerLevel = lowerAltitudeInput, upperwind);
				$$invalidate(22, upperwind._upperLevel = upperAltitudeInput, upperwind);
				$$invalidate(4, errorHandlerOutput = false);
				$$invalidate(4, errorHandlerOutput = upperwind._errorhandler);
				console.log('Errorhandler: ' + errorHandlerOutput);
				const heightAGLArray = flightLevels.map(row => row.heightAGL);
				const heightMSLArray = flightLevels.map(row => row.height);
				const wind_uArray = flightLevels.map(row => row.wind_u);
				const wind_vArray = flightLevels.map(row => row.wind_v);

				if (settings.referenceLevel == 'AGL') {
					$$invalidate(10, meanWindDirection = Utility.Mittelwind(heightAGLArray, wind_uArray, wind_vArray, Number(upperwind._lowerLevel), Number(upperwind._upperLevel))[0]);
					$$invalidate(11, meanWindSpeed = Utility.Mittelwind(heightAGLArray, wind_uArray, wind_vArray, Number(upperwind._lowerLevel), Number(upperwind._upperLevel))[1]);
				} else if (settings.referenceLevel == 'AMSL') {
					$$invalidate(10, meanWindDirection = Utility.Mittelwind(heightMSLArray, wind_uArray, wind_vArray, Number(upperwind._lowerLevel), Number(upperwind._upperLevel))[0]);
					$$invalidate(11, meanWindSpeed = Utility.Mittelwind(heightMSLArray, wind_uArray, wind_vArray, Number(upperwind._lowerLevel), Number(upperwind._upperLevel))[1]);
				}

				$$invalidate(22, upperwind._step = Number(settings.increment), upperwind);
				$$invalidate(22, upperwind._reference = settings.referenceLevel, upperwind);
				const fl = upperwind.restratify();

				if (fl) {
					$$invalidate(0, flightLevels = fl);
				}
			}
		}
	};

	return [
		flightLevels,
		settings,
		lowerAltitudeInput,
		upperAltitudeInput,
		errorHandlerOutput,
		ready,
		clickLocation,
		forecastDateString,
		forecastModel,
		elevation,
		meanWindDirection,
		meanWindSpeed,
		temperatureUnit,
		freezingLevelAt,
		windUnit,
		altitudeUnit,
		overlayWarning,
		title,
		version,
		incrementquestions,
		referencelevelquestions,
		onopen,
		upperwind,
		click_handler,
		select0_change_handler,
		select1_change_handler,
		input0_input_handler,
		input1_input_handler
	];
}

class Plugin extends SvelteComponent {
	constructor(options) {
		super();
		init(this, options, instance, create_fragment, safe_not_equal, { onopen: 21 }, add_css, [-1, -1]);
	}

	get onopen() {
		return this.$$.ctx[21];
	}
}


// transformCode: Export statement was modified
export { __pluginConfig, Plugin as default };
//# sourceMappingURL=plugin.js.map
