const __pluginConfig =  {
  "name": "windy-plugin-upper-winds",
  "version": "0.0.24",
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
  "private": true,
  "built": 1781103561865,
  "builtReadable": "2026-06-10T14:59:21.865Z",
  "screenshot": "screenshot.jpg"
};

// transformCode: import bcast from '@windy/broadcast';
const bcast = W.broadcast;

// transformCode: import { map } from '@windy/map';
const { map } = W.map;

// transformCode: import { isMobile } from '@windy/rootScope';
const { isMobile } = W.rootScope;

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

/** @returns {Promise<void>} */
function tick() {
	schedule_update();
	return resolved_promise;
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
    version: '0.0.24',
    title: 'Upper winds'};

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
    _hours = [];
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
    neighbourTimestamp(direction) {
        return this._hours[this._forecastColumn + direction];
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
            this._hours = weatherData.data.data.hours;
            this.findNearestColumn(this._hours);
            this._forecastDate = this._hours[this._forecastColumn];
            this._model = weatherData.data.header.model;
            this.updateWeatherStats(weatherData.data);
            this._errorhandler = false;
            const timediff = this._timestamp - this._initTime;
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
        this._flightLevels = this.stratify(this._rawdata);
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

/* src/plugin.svelte generated by Svelte v4.2.20 */

function add_css(target) {
	append_styles(target, "svelte-1t4ddl", ".weather-stats.svelte-1t4ddl.svelte-1t4ddl{padding:0 5px 5px;background-color:#f8f8f8;text-align:center;max-height:45vh;overflow:auto}.weather-stats.svelte-1t4ddl table.svelte-1t4ddl{width:100%;table-layout:fixed;border-collapse:separate;border-spacing:0}.weather-stats.svelte-1t4ddl th.svelte-1t4ddl,.weather-stats.svelte-1t4ddl td.svelte-1t4ddl{width:14.28%}.weather-stats.svelte-1t4ddl th.svelte-1t4ddl{position:sticky;top:0;color:black;background-color:#e5e5e5}.weather-stats.svelte-1t4ddl th .unit.svelte-1t4ddl{font-weight:normal}.weather-stats.svelte-1t4ddl td.svelte-1t4ddl{text-align:right}.weather-stats.svelte-1t4ddl .green-text.svelte-1t4ddl{color:#026f00}.weather-stats.svelte-1t4ddl .red-text.svelte-1t4ddl{color:#c42f2f}.weather-stats.svelte-1t4ddl .blue-text.svelte-1t4ddl{color:blue}select.svelte-1t4ddl.svelte-1t4ddl,input.svelte-1t4ddl.svelte-1t4ddl{background-color:#6b6b6b;border:none;padding:6px 8px;margin:0;min-height:32px;width:90px;color:#ffe3a1;border-radius:3px}.mb-3.svelte-1t4ddl.svelte-1t4ddl{margin-bottom:10px}.info-block.svelte-1t4ddl.svelte-1t4ddl{margin:8px 0;line-height:1.5}.info-block.svelte-1t4ddl div.svelte-1t4ddl{margin-bottom:4px}.info-block.svelte-1t4ddl .time-row.svelte-1t4ddl{display:flex;align-items:center;gap:6px}.info-block.svelte-1t4ddl .time-row button.svelte-1t4ddl{background-color:#6b6b6b;color:#ffe3a1;border:none;border-radius:3px;min-width:40px;min-height:30px;font-size:1.2em;line-height:1}.position-sentinel.svelte-1t4ddl.svelte-1t4ddl{height:1px}.half-position.svelte-1t4ddl .bottom-controls.svelte-1t4ddl{display:none}.mobile-bottom-space.svelte-1t4ddl .plugin__title.svelte-1t4ddl{display:none}.mobile-bottom-space.svelte-1t4ddl .table-heading.svelte-1t4ddl{display:none}.mobile-bottom-space.svelte-1t4ddl .weather-stats.svelte-1t4ddl{max-height:28vh}.overlay-warning.svelte-1t4ddl.svelte-1t4ddl{background-color:#ffd700;color:#333;padding:8px;border-radius:3px;margin-bottom:8px;font-size:0.85em}");
}

function get_each_context(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[54] = list[i];
	return child_ctx;
}

function get_each_context_1(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[57] = list[i];
	return child_ctx;
}

function get_each_context_2(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[60] = list[i].heightAGL;
	child_ctx[61] = list[i].height;
	child_ctx[62] = list[i].windDir;
	child_ctx[63] = list[i].windSp;
	child_ctx[64] = list[i].pressure;
	child_ctx[65] = list[i].temperature;
	child_ctx[66] = list[i].humidityWater;
	child_ctx[67] = list[i].dewPointt;
	return child_ctx;
}

// (17:4) {#if overlayWarning}
function create_if_block_3(ctx) {
	let div;
	let t;

	return {
		c() {
			div = element("div");
			t = text(/*overlayWarning*/ ctx[16]);
			attr(div, "class", "overlay-warning svelte-1t4ddl");
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

// (28:4) {:else}
function create_else_block(ctx) {
	let div4;
	let div0;
	let strong0;
	let t1;
	let t2;
	let t3;
	let div1;
	let strong1;
	let t5;
	let t6;
	let t7;
	let strong2;
	let t9;
	let t10;
	let t11;
	let div2;
	let strong3;
	let t13;
	let button0;
	let t15;
	let span0;
	let t16;
	let t17;
	let button1;
	let t19;
	let div3;
	let strong4;
	let t20;
	let t21;
	let t22;
	let t23;
	let t24;
	let t25;
	let t26;
	let t27_value = /*settings*/ ctx[1].referenceLevel + "";
	let t27;
	let t28;
	let t29;
	let t30;
	let t31;
	let t32;
	let t33;
	let t34;
	let t35;
	let div5;
	let t38;
	let div6;
	let table;
	let thead;
	let tr;
	let th0;
	let t39;
	let br0;
	let span1;
	let t40;
	let t41;
	let t42_value = /*settings*/ ctx[1].referenceLevel + "";
	let t42;
	let t43;
	let th1;
	let t46;
	let th2;
	let t47;
	let br2;
	let span3;
	let t48;
	let t49;
	let th3;
	let t52;
	let th4;
	let t53;
	let br4;
	let span5;
	let t54;
	let t55;
	let th5;
	let t56;
	let br5;
	let span6;
	let t57;
	let t58;
	let th6;
	let t61;
	let tbody;
	let t62;
	let div14;
	let hr1;
	let t63;
	let div9;
	let h41;
	let t65;
	let div7;
	let label0;
	let t67;
	let select0;
	let option0;
	let t69;
	let span8;
	let t70;
	let t71;
	let div8;
	let label1;
	let t73;
	let select1;
	let option1;
	let t75;
	let hr2;
	let t76;
	let div13;
	let h42;
	let t78;
	let div10;
	let label2;
	let t80;
	let input0;
	let t81;
	let span9;
	let t82;
	let t83;
	let t84_value = /*settings*/ ctx[1].referenceLevel + "";
	let t84;
	let t85;
	let div11;
	let label3;
	let t87;
	let input1;
	let t88;
	let span10;
	let t89;
	let t90;
	let t91_value = /*settings*/ ctx[1].referenceLevel + "";
	let t91;
	let t92;
	let div12;
	let strong8;
	let t93;
	let t94;
	let t95;
	let t96;
	let t97;
	let t98;
	let mounted;
	let dispose;
	let each_value_2 = ensure_array_like(/*flightLevels*/ ctx[0]);
	let each_blocks_2 = [];

	for (let i = 0; i < each_value_2.length; i += 1) {
		each_blocks_2[i] = create_each_block_2(get_each_context_2(ctx, each_value_2, i));
	}

	let each_value_1 = ensure_array_like(/*incrementquestions*/ ctx[22]);
	let each_blocks_1 = [];

	for (let i = 0; i < each_value_1.length; i += 1) {
		each_blocks_1[i] = create_each_block_1(get_each_context_1(ctx, each_value_1, i));
	}

	let each_value = ensure_array_like(/*referencelevelquestions*/ ctx[23]);
	let each_blocks = [];

	for (let i = 0; i < each_value.length; i += 1) {
		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
	}

	return {
		c() {
			div4 = element("div");
			div0 = element("div");
			strong0 = element("strong");
			strong0.textContent = "Location:";
			t1 = space();
			t2 = text(/*clickLocation*/ ctx[5]);
			t3 = space();
			div1 = element("div");
			strong1 = element("strong");
			strong1.textContent = "Model:";
			t5 = space();
			t6 = text(/*forecastModel*/ ctx[7]);
			t7 = text(" · ");
			strong2 = element("strong");
			strong2.textContent = "Elevation:";
			t9 = space();
			t10 = text(/*elevation*/ ctx[8]);
			t11 = space();
			div2 = element("div");
			strong3 = element("strong");
			strong3.textContent = "Forecast time:";
			t13 = space();
			button0 = element("button");
			button0.textContent = "‹";
			t15 = space();
			span0 = element("span");
			t16 = text(/*forecastDateString*/ ctx[6]);
			t17 = space();
			button1 = element("button");
			button1.textContent = "›";
			t19 = space();
			div3 = element("div");
			strong4 = element("strong");
			t20 = text("Mean wind ");
			t21 = text(/*lowerAltitudeInput*/ ctx[2]);
			t22 = text("–");
			t23 = text(/*upperAltitudeInput*/ ctx[3]);
			t24 = space();
			t25 = text(/*altitudeUnit*/ ctx[14]);
			t26 = space();
			t27 = text(t27_value);
			t28 = text(":");
			t29 = space();
			t30 = text(/*meanWindDirection*/ ctx[9]);
			t31 = text("° ");
			t32 = text(/*meanWindSpeed*/ ctx[10]);
			t33 = space();
			t34 = text(/*windUnit*/ ctx[13]);
			t35 = space();
			div5 = element("div");
			div5.innerHTML = `<hr/> <h4><strong>Upper winds, temperature and humidity</strong></h4>`;
			t38 = space();
			div6 = element("div");
			table = element("table");
			thead = element("thead");
			tr = element("tr");
			th0 = element("th");
			t39 = text("h");
			br0 = element("br");
			span1 = element("span");
			t40 = text(/*altitudeUnit*/ ctx[14]);
			t41 = space();
			t42 = text(t42_value);
			t43 = space();
			th1 = element("th");
			th1.innerHTML = `Dir<br/><span class="unit svelte-1t4ddl">°</span>`;
			t46 = space();
			th2 = element("th");
			t47 = text("Speed");
			br2 = element("br");
			span3 = element("span");
			t48 = text(/*windUnit*/ ctx[13]);
			t49 = space();
			th3 = element("th");
			th3.innerHTML = `p<br/><span class="unit svelte-1t4ddl">hPa</span>`;
			t52 = space();
			th4 = element("th");
			t53 = text("T");
			br4 = element("br");
			span5 = element("span");
			t54 = text(/*temperatureUnit*/ ctx[11]);
			t55 = space();
			th5 = element("th");
			t56 = text("Td");
			br5 = element("br");
			span6 = element("span");
			t57 = text(/*temperatureUnit*/ ctx[11]);
			t58 = space();
			th6 = element("th");
			th6.innerHTML = `RHw<br/><span class="unit svelte-1t4ddl">%</span>`;
			t61 = space();
			tbody = element("tbody");

			for (let i = 0; i < each_blocks_2.length; i += 1) {
				each_blocks_2[i].c();
			}

			t62 = space();
			div14 = element("div");
			hr1 = element("hr");
			t63 = space();
			div9 = element("div");
			h41 = element("h4");
			h41.innerHTML = `<strong>Settings:</strong>`;
			t65 = space();
			div7 = element("div");
			label0 = element("label");
			label0.textContent = "Choose interpolation step:";
			t67 = space();
			select0 = element("select");
			option0 = element("option");
			option0.textContent = "-- Select Increment --";

			for (let i = 0; i < each_blocks_1.length; i += 1) {
				each_blocks_1[i].c();
			}

			t69 = space();
			span8 = element("span");
			t70 = text(/*altitudeUnit*/ ctx[14]);
			t71 = space();
			div8 = element("div");
			label1 = element("label");
			label1.textContent = "Choose reference level for altitude:";
			t73 = space();
			select1 = element("select");
			option1 = element("option");
			option1.textContent = "-- Select Reference --";

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].c();
			}

			t75 = space();
			hr2 = element("hr");
			t76 = space();
			div13 = element("div");
			h42 = element("h4");
			h42.innerHTML = `<strong>Calculate mean wind between:</strong>`;
			t78 = space();
			div10 = element("div");
			label2 = element("label");
			label2.textContent = "Lower altitude:";
			t80 = space();
			input0 = element("input");
			t81 = space();
			span9 = element("span");
			t82 = text(/*altitudeUnit*/ ctx[14]);
			t83 = space();
			t84 = text(t84_value);
			t85 = space();
			div11 = element("div");
			label3 = element("label");
			label3.textContent = "Upper altitude:";
			t87 = space();
			input1 = element("input");
			t88 = space();
			span10 = element("span");
			t89 = text(/*altitudeUnit*/ ctx[14]);
			t90 = space();
			t91 = text(t91_value);
			t92 = space();
			div12 = element("div");
			strong8 = element("strong");
			t93 = text("Mean wind: ");
			t94 = text(/*meanWindDirection*/ ctx[9]);
			t95 = text("° ");
			t96 = text(/*meanWindSpeed*/ ctx[10]);
			t97 = space();
			t98 = text(/*windUnit*/ ctx[13]);
			attr(div0, "class", "svelte-1t4ddl");
			attr(div1, "class", "svelte-1t4ddl");
			attr(button0, "aria-label", "Previous forecast step");
			attr(button0, "class", "svelte-1t4ddl");
			attr(button1, "aria-label", "Next forecast step");
			attr(button1, "class", "svelte-1t4ddl");
			attr(div2, "class", "time-row svelte-1t4ddl");
			attr(div3, "class", "svelte-1t4ddl");
			attr(div4, "class", "info-block svelte-1t4ddl");
			attr(div5, "class", "table-heading svelte-1t4ddl");
			attr(span1, "class", "unit svelte-1t4ddl");
			attr(th0, "class", "svelte-1t4ddl");
			attr(th1, "class", "svelte-1t4ddl");
			attr(span3, "class", "unit svelte-1t4ddl");
			attr(th2, "class", "svelte-1t4ddl");
			attr(th3, "class", "svelte-1t4ddl");
			attr(span5, "class", "unit svelte-1t4ddl");
			attr(th4, "class", "svelte-1t4ddl");
			attr(span6, "class", "unit svelte-1t4ddl");
			attr(th5, "class", "svelte-1t4ddl");
			attr(th6, "class", "svelte-1t4ddl");
			attr(table, "class", "svelte-1t4ddl");
			attr(div6, "class", "weather-stats svelte-1t4ddl");
			attr(label0, "for", "increment-select");
			attr(label0, "class", "form-label");
			option0.__value = "";
			set_input_value(option0, option0.__value);
			option0.disabled = true;
			attr(select0, "id", "increment-select");
			attr(select0, "class", "svelte-1t4ddl");
			if (/*settings*/ ctx[1].increment === void 0) add_render_callback(() => /*select0_change_handler*/ ctx[32].call(select0));
			attr(span8, "class", "form-label");
			attr(div7, "class", "mb-3 svelte-1t4ddl");
			attr(label1, "for", "reference-select");
			attr(label1, "class", "form-label");
			option1.__value = "";
			set_input_value(option1, option1.__value);
			option1.disabled = true;
			attr(select1, "id", "reference-select");
			attr(select1, "class", "svelte-1t4ddl");
			if (/*settings*/ ctx[1].referenceLevel === void 0) add_render_callback(() => /*select1_change_handler*/ ctx[33].call(select1));
			attr(div8, "class", "mb-3 svelte-1t4ddl");
			attr(label2, "for", "lower-altitude");
			attr(label2, "class", "form-label");
			attr(input0, "id", "lower-altitude");
			attr(input0, "type", "text");
			attr(input0, "inputmode", "numeric");
			attr(input0, "class", "svelte-1t4ddl");
			attr(span9, "class", "form-label");
			attr(div10, "class", "mb-3 svelte-1t4ddl");
			attr(label3, "for", "upper-altitude");
			attr(label3, "class", "form-label");
			attr(input1, "id", "upper-altitude");
			attr(input1, "type", "text");
			attr(input1, "inputmode", "numeric");
			attr(input1, "class", "svelte-1t4ddl");
			attr(span10, "class", "form-label");
			attr(div11, "class", "mb-3 svelte-1t4ddl");
			attr(div12, "class", "mb-3 svelte-1t4ddl");
			attr(div14, "class", "bottom-controls svelte-1t4ddl");
		},
		m(target, anchor) {
			insert(target, div4, anchor);
			append(div4, div0);
			append(div0, strong0);
			append(div0, t1);
			append(div0, t2);
			append(div4, t3);
			append(div4, div1);
			append(div1, strong1);
			append(div1, t5);
			append(div1, t6);
			append(div1, t7);
			append(div1, strong2);
			append(div1, t9);
			append(div1, t10);
			append(div4, t11);
			append(div4, div2);
			append(div2, strong3);
			append(div2, t13);
			append(div2, button0);
			append(div2, t15);
			append(div2, span0);
			append(span0, t16);
			append(div2, t17);
			append(div2, button1);
			append(div4, t19);
			append(div4, div3);
			append(div3, strong4);
			append(strong4, t20);
			append(strong4, t21);
			append(strong4, t22);
			append(strong4, t23);
			append(strong4, t24);
			append(strong4, t25);
			append(strong4, t26);
			append(strong4, t27);
			append(strong4, t28);
			append(div3, t29);
			append(div3, t30);
			append(div3, t31);
			append(div3, t32);
			append(div3, t33);
			append(div3, t34);
			insert(target, t35, anchor);
			insert(target, div5, anchor);
			insert(target, t38, anchor);
			insert(target, div6, anchor);
			append(div6, table);
			append(table, thead);
			append(thead, tr);
			append(tr, th0);
			append(th0, t39);
			append(th0, br0);
			append(th0, span1);
			append(span1, t40);
			append(span1, t41);
			append(span1, t42);
			append(tr, t43);
			append(tr, th1);
			append(tr, t46);
			append(tr, th2);
			append(th2, t47);
			append(th2, br2);
			append(th2, span3);
			append(span3, t48);
			append(tr, t49);
			append(tr, th3);
			append(tr, t52);
			append(tr, th4);
			append(th4, t53);
			append(th4, br4);
			append(th4, span5);
			append(span5, t54);
			append(tr, t55);
			append(tr, th5);
			append(th5, t56);
			append(th5, br5);
			append(th5, span6);
			append(span6, t57);
			append(tr, t58);
			append(tr, th6);
			append(table, t61);
			append(table, tbody);

			for (let i = 0; i < each_blocks_2.length; i += 1) {
				if (each_blocks_2[i]) {
					each_blocks_2[i].m(tbody, null);
				}
			}

			/*div6_binding*/ ctx[31](div6);
			insert(target, t62, anchor);
			insert(target, div14, anchor);
			append(div14, hr1);
			append(div14, t63);
			append(div14, div9);
			append(div9, h41);
			append(div9, t65);
			append(div9, div7);
			append(div7, label0);
			append(div7, t67);
			append(div7, select0);
			append(select0, option0);

			for (let i = 0; i < each_blocks_1.length; i += 1) {
				if (each_blocks_1[i]) {
					each_blocks_1[i].m(select0, null);
				}
			}

			select_option(select0, /*settings*/ ctx[1].increment, true);
			append(div7, t69);
			append(div7, span8);
			append(span8, t70);
			append(div9, t71);
			append(div9, div8);
			append(div8, label1);
			append(div8, t73);
			append(div8, select1);
			append(select1, option1);

			for (let i = 0; i < each_blocks.length; i += 1) {
				if (each_blocks[i]) {
					each_blocks[i].m(select1, null);
				}
			}

			select_option(select1, /*settings*/ ctx[1].referenceLevel, true);
			append(div14, t75);
			append(div14, hr2);
			append(div14, t76);
			append(div14, div13);
			append(div13, h42);
			append(div13, t78);
			append(div13, div10);
			append(div10, label2);
			append(div10, t80);
			append(div10, input0);
			set_input_value(input0, /*lowerAltitudeInput*/ ctx[2]);
			append(div10, t81);
			append(div10, span9);
			append(span9, t82);
			append(span9, t83);
			append(span9, t84);
			append(div13, t85);
			append(div13, div11);
			append(div11, label3);
			append(div11, t87);
			append(div11, input1);
			set_input_value(input1, /*upperAltitudeInput*/ ctx[3]);
			append(div11, t88);
			append(div11, span10);
			append(span10, t89);
			append(span10, t90);
			append(span10, t91);
			append(div13, t92);
			append(div13, div12);
			append(div12, strong8);
			append(strong8, t93);
			append(strong8, t94);
			append(strong8, t95);
			append(strong8, t96);
			append(strong8, t97);
			append(strong8, t98);

			if (!mounted) {
				dispose = [
					listen(button0, "click", /*click_handler_1*/ ctx[29]),
					listen(button1, "click", /*click_handler_2*/ ctx[30]),
					listen(select0, "change", /*select0_change_handler*/ ctx[32]),
					listen(select1, "change", /*select1_change_handler*/ ctx[33]),
					listen(input0, "input", /*input0_input_handler*/ ctx[34]),
					listen(input1, "input", /*input1_input_handler*/ ctx[35])
				];

				mounted = true;
			}
		},
		p(ctx, dirty) {
			if (dirty[0] & /*clickLocation*/ 32) set_data(t2, /*clickLocation*/ ctx[5]);
			if (dirty[0] & /*forecastModel*/ 128) set_data(t6, /*forecastModel*/ ctx[7]);
			if (dirty[0] & /*elevation*/ 256) set_data(t10, /*elevation*/ ctx[8]);
			if (dirty[0] & /*forecastDateString*/ 64) set_data(t16, /*forecastDateString*/ ctx[6]);
			if (dirty[0] & /*lowerAltitudeInput*/ 4) set_data(t21, /*lowerAltitudeInput*/ ctx[2]);
			if (dirty[0] & /*upperAltitudeInput*/ 8) set_data(t23, /*upperAltitudeInput*/ ctx[3]);
			if (dirty[0] & /*altitudeUnit*/ 16384) set_data(t25, /*altitudeUnit*/ ctx[14]);
			if (dirty[0] & /*settings*/ 2 && t27_value !== (t27_value = /*settings*/ ctx[1].referenceLevel + "")) set_data(t27, t27_value);
			if (dirty[0] & /*meanWindDirection*/ 512) set_data(t30, /*meanWindDirection*/ ctx[9]);
			if (dirty[0] & /*meanWindSpeed*/ 1024) set_data(t32, /*meanWindSpeed*/ ctx[10]);
			if (dirty[0] & /*windUnit*/ 8192) set_data(t34, /*windUnit*/ ctx[13]);
			if (dirty[0] & /*altitudeUnit*/ 16384) set_data(t40, /*altitudeUnit*/ ctx[14]);
			if (dirty[0] & /*settings*/ 2 && t42_value !== (t42_value = /*settings*/ ctx[1].referenceLevel + "")) set_data(t42, t42_value);
			if (dirty[0] & /*windUnit*/ 8192) set_data(t48, /*windUnit*/ ctx[13]);
			if (dirty[0] & /*temperatureUnit*/ 2048) set_data(t54, /*temperatureUnit*/ ctx[11]);
			if (dirty[0] & /*temperatureUnit*/ 2048) set_data(t57, /*temperatureUnit*/ ctx[11]);

			if (dirty[0] & /*flightLevels, freezingLevelAt, settings*/ 4099) {
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

			if (dirty[0] & /*incrementquestions*/ 4194304) {
				each_value_1 = ensure_array_like(/*incrementquestions*/ ctx[22]);
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

			if (dirty[0] & /*settings, incrementquestions*/ 4194306) {
				select_option(select0, /*settings*/ ctx[1].increment);
			}

			if (dirty[0] & /*altitudeUnit*/ 16384) set_data(t70, /*altitudeUnit*/ ctx[14]);

			if (dirty[0] & /*referencelevelquestions*/ 8388608) {
				each_value = ensure_array_like(/*referencelevelquestions*/ ctx[23]);
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

			if (dirty[0] & /*settings, incrementquestions*/ 4194306) {
				select_option(select1, /*settings*/ ctx[1].referenceLevel);
			}

			if (dirty[0] & /*lowerAltitudeInput*/ 4 && input0.value !== /*lowerAltitudeInput*/ ctx[2]) {
				set_input_value(input0, /*lowerAltitudeInput*/ ctx[2]);
			}

			if (dirty[0] & /*altitudeUnit*/ 16384) set_data(t82, /*altitudeUnit*/ ctx[14]);
			if (dirty[0] & /*settings*/ 2 && t84_value !== (t84_value = /*settings*/ ctx[1].referenceLevel + "")) set_data(t84, t84_value);

			if (dirty[0] & /*upperAltitudeInput*/ 8 && input1.value !== /*upperAltitudeInput*/ ctx[3]) {
				set_input_value(input1, /*upperAltitudeInput*/ ctx[3]);
			}

			if (dirty[0] & /*altitudeUnit*/ 16384) set_data(t89, /*altitudeUnit*/ ctx[14]);
			if (dirty[0] & /*settings*/ 2 && t91_value !== (t91_value = /*settings*/ ctx[1].referenceLevel + "")) set_data(t91, t91_value);
			if (dirty[0] & /*meanWindDirection*/ 512) set_data(t94, /*meanWindDirection*/ ctx[9]);
			if (dirty[0] & /*meanWindSpeed*/ 1024) set_data(t96, /*meanWindSpeed*/ ctx[10]);
			if (dirty[0] & /*windUnit*/ 8192) set_data(t98, /*windUnit*/ ctx[13]);
		},
		d(detaching) {
			if (detaching) {
				detach(div4);
				detach(t35);
				detach(div5);
				detach(t38);
				detach(div6);
				detach(t62);
				detach(div14);
			}

			destroy_each(each_blocks_2, detaching);
			/*div6_binding*/ ctx[31](null);
			destroy_each(each_blocks_1, detaching);
			destroy_each(each_blocks, detaching);
			mounted = false;
			run_all(dispose);
		}
	};
}

// (26:33) 
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
			t1 = text(/*forecastDateString*/ ctx[6]);
		},
		m(target, anchor) {
			insert(target, h4, anchor);
			append(h4, strong);
			append(strong, t0);
			append(strong, t1);
		},
		p(ctx, dirty) {
			if (dirty[0] & /*forecastDateString*/ 64) set_data(t1, /*forecastDateString*/ ctx[6]);
		},
		d(detaching) {
			if (detaching) {
				detach(h4);
			}
		}
	};
}

// (20:4) {#if !ready}
function create_if_block(ctx) {
	let h4;
	let t1;
	let p;

	return {
		c() {
			h4 = element("h4");
			h4.innerHTML = `<strong>Tap or click on the map to generate an upper wind table.</strong>`;
			t1 = space();
			p = element("p");
			p.textContent = "On mobile, slide this panel down to see the map, or long-press the map and choose\n            \"Upper winds\".";
		},
		m(target, anchor) {
			insert(target, h4, anchor);
			insert(target, t1, anchor);
			insert(target, p, anchor);
		},
		p: noop,
		d(detaching) {
			if (detaching) {
				detach(h4);
				detach(t1);
				detach(p);
			}
		}
	};
}

// (74:28) {:else}
function create_else_block_1(ctx) {
	let td;
	let t_value = /*height*/ ctx[61] + "";
	let t;

	return {
		c() {
			td = element("td");
			t = text(t_value);
			attr(td, "class", "svelte-1t4ddl");
		},
		m(target, anchor) {
			insert(target, td, anchor);
			append(td, t);
		},
		p(ctx, dirty) {
			if (dirty[0] & /*flightLevels*/ 1 && t_value !== (t_value = /*height*/ ctx[61] + "")) set_data(t, t_value);
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
	let t_value = /*heightAGL*/ ctx[60] + "";
	let t;

	return {
		c() {
			td = element("td");
			t = text(t_value);
			attr(td, "class", "svelte-1t4ddl");
		},
		m(target, anchor) {
			insert(target, td, anchor);
			append(td, t);
		},
		p(ctx, dirty) {
			if (dirty[0] & /*flightLevels*/ 1 && t_value !== (t_value = /*heightAGL*/ ctx[60] + "")) set_data(t, t_value);
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
	let t1_value = /*windDir*/ ctx[62] + "";
	let t1;
	let t2;
	let td1;
	let t3_value = /*windSp*/ ctx[63] + "";
	let t3;
	let t4;
	let td2;
	let t5_value = /*pressure*/ ctx[64] + "";
	let t5;
	let t6;
	let td3;
	let t7_value = /*temperature*/ ctx[65] + "";
	let t7;
	let t8;
	let td4;
	let t9_value = /*dewPointt*/ ctx[67] + "";
	let t9;
	let t10;
	let td5;
	let t11_value = /*humidityWater*/ ctx[66] + "";
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
			attr(td0, "class", "svelte-1t4ddl");
			attr(td1, "class", "svelte-1t4ddl");
			attr(td2, "class", "svelte-1t4ddl");
			attr(td3, "class", "svelte-1t4ddl");
			attr(td4, "class", "svelte-1t4ddl");
			attr(td5, "class", "svelte-1t4ddl");
			attr(tr, "class", "svelte-1t4ddl");
			toggle_class(tr, "green-text", /*temperature*/ ctx[65] > /*freezingLevelAt*/ ctx[12] - 0.5 && /*temperature*/ ctx[65] < /*freezingLevelAt*/ ctx[12] + 0.5);
			toggle_class(tr, "blue-text", /*temperature*/ ctx[65] <= /*freezingLevelAt*/ ctx[12] - 0.5);
			toggle_class(tr, "red-text", /*temperature*/ ctx[65] >= /*freezingLevelAt*/ ctx[12] + 0.5);
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

			if (dirty[0] & /*flightLevels*/ 1 && t1_value !== (t1_value = /*windDir*/ ctx[62] + "")) set_data(t1, t1_value);
			if (dirty[0] & /*flightLevels*/ 1 && t3_value !== (t3_value = /*windSp*/ ctx[63] + "")) set_data(t3, t3_value);
			if (dirty[0] & /*flightLevels*/ 1 && t5_value !== (t5_value = /*pressure*/ ctx[64] + "")) set_data(t5, t5_value);
			if (dirty[0] & /*flightLevels*/ 1 && t7_value !== (t7_value = /*temperature*/ ctx[65] + "")) set_data(t7, t7_value);
			if (dirty[0] & /*flightLevels*/ 1 && t9_value !== (t9_value = /*dewPointt*/ ctx[67] + "")) set_data(t9, t9_value);
			if (dirty[0] & /*flightLevels*/ 1 && t11_value !== (t11_value = /*humidityWater*/ ctx[66] + "")) set_data(t11, t11_value);

			if (dirty[0] & /*flightLevels, freezingLevelAt*/ 4097) {
				toggle_class(tr, "green-text", /*temperature*/ ctx[65] > /*freezingLevelAt*/ ctx[12] - 0.5 && /*temperature*/ ctx[65] < /*freezingLevelAt*/ ctx[12] + 0.5);
			}

			if (dirty[0] & /*flightLevels, freezingLevelAt*/ 4097) {
				toggle_class(tr, "blue-text", /*temperature*/ ctx[65] <= /*freezingLevelAt*/ ctx[12] - 0.5);
			}

			if (dirty[0] & /*flightLevels, freezingLevelAt*/ 4097) {
				toggle_class(tr, "red-text", /*temperature*/ ctx[65] >= /*freezingLevelAt*/ ctx[12] + 0.5);
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

// (98:20) {#each incrementquestions as incrementquestion}
function create_each_block_1(ctx) {
	let option;
	let t_value = /*incrementquestion*/ ctx[57].text + "";
	let t;

	return {
		c() {
			option = element("option");
			t = text(t_value);
			option.__value = /*incrementquestion*/ ctx[57].text;
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

// (110:20) {#each referencelevelquestions as referencelevelquestion}
function create_each_block(ctx) {
	let option;
	let t_value = /*referencelevelquestion*/ ctx[54].text + "";
	let t;

	return {
		c() {
			option = element("option");
			t = text(t_value);
			option.__value = /*referencelevelquestion*/ ctx[54].text;
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
	let div2;
	let t3;
	let t4;
	let span;
	let t7;
	let t8;
	let t9;
	let hr;
	let mounted;
	let dispose;
	let if_block0 = /*overlayWarning*/ ctx[16] && create_if_block_3(ctx);

	function select_block_type(ctx, dirty) {
		if (!/*ready*/ ctx[4]) return create_if_block;
		if (/*errorHandlerOutput*/ ctx[15]) return create_if_block_1;
		return create_else_block;
	}

	let current_block_type = select_block_type(ctx);
	let if_block1 = current_block_type(ctx);

	return {
		c() {
			div0 = element("div");
			div0.textContent = `${/*title*/ ctx[20]}`;
			t1 = space();
			section = element("section");
			div1 = element("div");
			t2 = space();
			div2 = element("div");
			t3 = text(/*title*/ ctx[20]);
			t4 = space();
			span = element("span");
			span.textContent = `v${/*version*/ ctx[21]}`;
			t7 = space();
			if (if_block0) if_block0.c();
			t8 = space();
			if_block1.c();
			t9 = space();
			hr = element("hr");
			attr(div0, "class", "plugin__mobile-header");
			attr(div1, "class", "position-sentinel svelte-1t4ddl");
			set_style(span, "font-size", "0.5em");
			attr(div2, "class", "plugin__title plugin__title--chevron-back svelte-1t4ddl");
			attr(section, "class", "plugin__content svelte-1t4ddl");
			toggle_class(section, "mobile-bottom-space", isMobile);
			toggle_class(section, "half-position", /*halfPosition*/ ctx[17]);
		},
		m(target, anchor) {
			insert(target, div0, anchor);
			insert(target, t1, anchor);
			insert(target, section, anchor);
			append(section, div1);
			/*div1_binding*/ ctx[27](div1);
			append(section, t2);
			append(section, div2);
			append(div2, t3);
			append(div2, t4);
			append(div2, span);
			append(section, t7);
			if (if_block0) if_block0.m(section, null);
			append(section, t8);
			if_block1.m(section, null);
			append(section, t9);
			append(section, hr);

			if (!mounted) {
				dispose = listen(div2, "click", /*click_handler*/ ctx[28]);
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
					if_block0.m(section, t8);
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
					if_block1.m(section, t9);
				}
			}

			if (dirty[0] & /*halfPosition*/ 131072) {
				toggle_class(section, "half-position", /*halfPosition*/ ctx[17]);
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

			/*div1_binding*/ ctx[27](null);
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
			$$invalidate(12, freezingLevelAt = 0);
		} else if (temperatureUnit === '°F') {
			$$invalidate(12, freezingLevelAt = 32);
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
	let pluginOpenedHandler = null;
	let paramsChangedHandler = null;
	let pluginClosedHandler = null;
	let singleclickHandler = null;
	let halfPosition = false;
	let sentinelEl;
	let tableEl;
	let positionObserver = null;
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
					if (destroyed) return;
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

	const onopen = _params => {
		destroyed = false;

		if (_params && _params.lat !== undefined) {
			position = { lat: _params.lat, lon: _params.lon };
		}
	};

	function stepTime(direction) {
		const t = upperwind.neighbourTimestamp(direction);

		if (t !== undefined) {
			windyStore.set('timestamp', t);
		}
	}

	async function showPosition() {
		if (position === undefined) return;
		const warning = Utility.checkOverlay();
		if (warning) $$invalidate(16, overlayWarning = warning);
		upperwind.setTime(windyStore.get('timestamp'));
		popup.setLatLng([position.lat, position.lon]).setContent('Loading....').addTo(activeLayer).openOn(map);
		makePopupDraggable();
		await upperwind.handleEvent(position);
		assignAnalysis(upperwind);
		popup.setContent(clickLocation);
	}

	function panToVisiblePart(lat, lon) {
		const latlng = new L.LatLng(lat, lon);

		if (!isMobile || !sentinelEl) {
			map.panTo(latlng);
			return;
		}

		const mapRect = map.getContainer().getBoundingClientRect();
		const panelTop = sentinelEl.getBoundingClientRect().top;
		const visibleHeight = Math.max(panelTop - mapRect.top, 100);
		const offsetY = mapRect.height / 2 - visibleHeight / 2;
		const centerPoint = map.project(latlng, map.getZoom()).add([0, offsetY]);
		map.panTo(map.unproject(centerPoint, map.getZoom()));
	}

	async function scrollTableToBottom() {
		await tick();

		if (tableEl) {
			$$invalidate(19, tableEl.scrollTop = tableEl.scrollHeight, tableEl);
		}
	}

	onMount(() => {
		destroyed = false;

		if (isMobile && sentinelEl) {
			positionObserver = new IntersectionObserver(([entry]) => {
					$$invalidate(17, halfPosition = !entry.isIntersecting);
				},
			{ rootMargin: '0px 0px -70% 0px' });

			positionObserver.observe(sentinelEl);
		}

		singleclickHandler = async ev => {
			if (destroyed) return;
			position = { lat: ev.lat, lon: ev.lon };
			await showPosition();
			panToVisiblePart(ev.lat, ev.lon);
		};

		singleclick.on('windy-plugin-upper-winds', singleclickHandler);

		pluginOpenedHandler = async () => {
			if (destroyed || position === undefined) return;
			await showPosition();
			panToVisiblePart(position.lat, position.lon);
		};

		bcast.on('pluginOpened', pluginOpenedHandler);

		paramsChangedHandler = async () => {
			if (destroyed || position === undefined) return;
			const warning = Utility.checkOverlay();
			if (warning) $$invalidate(16, overlayWarning = warning);
			upperwind.setTime(windyStore.get('timestamp'));
			popup.setContent('Loading....');
			await upperwind.handleEvent(position);
			assignAnalysis(upperwind);
			popup.setContent(clickLocation);
		};

		bcast.on('paramsChanged', paramsChangedHandler);

		pluginClosedHandler = () => {
			removePopup();
		};

		bcast.on('pluginClosed', pluginClosedHandler);
	});

	function removePopup() {
		if (map.hasLayer(popup)) {
			popup.remove();
		}
	}

	onDestroy(() => {
		destroyed = true;
		removePopup();

		if (draggablePopup) {
			draggablePopup.disable();
			draggablePopup.off('dragend');
		}

		if (paramsChangedHandler) bcast.off('paramsChanged', paramsChangedHandler);
		if (pluginOpenedHandler) bcast.off('pluginOpened', pluginOpenedHandler);
		if (pluginClosedHandler) bcast.off('pluginClosed', pluginClosedHandler);
		if (singleclickHandler) singleclick.off('windy-plugin-upper-winds', singleclickHandler);
		if (positionObserver) positionObserver.disconnect();

		if (map.hasLayer(activeLayer)) {
			activeLayer.remove();
		}
	});

	function assignAnalysis(upperwind) {
		$$invalidate(11, temperatureUnit = Utility.findOutTemperatureUnit(0));
		$$invalidate(14, altitudeUnit = Utility.findOutAltitudeUnit(1000));
		$$invalidate(13, windUnit = Utility.findOutWindUnit(10));
		$$invalidate(12, freezingLevelAt = freezingLevel());
		$$invalidate(5, clickLocation = upperwind.clickLocation);
		$$invalidate(0, flightLevels = upperwind.flightLevels);
		forecastDate = new Date(windyStore.get('timestamp'));
		let year = forecastDate.getFullYear();
		let month = forecastDate.getMonth() + 1;
		let day = forecastDate.getDate();
		let hours = forecastDate.getHours();
		$$invalidate(6, forecastDateString = year + '-' + month + '-' + day + ' ' + hours + ':00 loc ');
		$$invalidate(7, forecastModel = upperwind.model);
		$$invalidate(8, elevation = (upperwind.elevation * 3.28084).toFixed(0) + ' ft/ ' + upperwind.elevation + ' m');
		$$invalidate(4, ready = true);
		scrollTableToBottom();
	}

	function div1_binding($$value) {
		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
			sentinelEl = $$value;
			$$invalidate(18, sentinelEl);
		});
	}

	const click_handler = () => bcast.emit('rqstOpen', 'menu');
	const click_handler_1 = () => stepTime(-1);
	const click_handler_2 = () => stepTime(1);

	function div6_binding($$value) {
		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
			tableEl = $$value;
			$$invalidate(19, tableEl);
		});
	}

	function select0_change_handler() {
		settings.increment = select_value(this);
		$$invalidate(1, settings);
		$$invalidate(22, incrementquestions);
	}

	function select1_change_handler() {
		settings.referenceLevel = select_value(this);
		$$invalidate(1, settings);
		$$invalidate(22, incrementquestions);
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
		if ($$self.$$.dirty[0] & /*lowerAltitudeInput, upperAltitudeInput, upperwind, flightLevels, settings*/ 67108879) {
			{
				$$invalidate(26, upperwind._lowerLevel = lowerAltitudeInput, upperwind);
				$$invalidate(26, upperwind._upperLevel = upperAltitudeInput, upperwind);
				$$invalidate(15, errorHandlerOutput = upperwind._errorhandler);
				const heightAGLArray = flightLevels.map(row => row.heightAGL);
				const heightMSLArray = flightLevels.map(row => row.height);
				const wind_uArray = flightLevels.map(row => row.wind_u);
				const wind_vArray = flightLevels.map(row => row.wind_v);

				if (settings.referenceLevel == 'AGL') {
					$$invalidate(9, meanWindDirection = Utility.Mittelwind(heightAGLArray, wind_uArray, wind_vArray, Number(upperwind._lowerLevel), Number(upperwind._upperLevel))[0]);
					$$invalidate(10, meanWindSpeed = Utility.Mittelwind(heightAGLArray, wind_uArray, wind_vArray, Number(upperwind._lowerLevel), Number(upperwind._upperLevel))[1]);
				} else if (settings.referenceLevel == 'AMSL') {
					$$invalidate(9, meanWindDirection = Utility.Mittelwind(heightMSLArray, wind_uArray, wind_vArray, Number(upperwind._lowerLevel), Number(upperwind._upperLevel))[0]);
					$$invalidate(10, meanWindSpeed = Utility.Mittelwind(heightMSLArray, wind_uArray, wind_vArray, Number(upperwind._lowerLevel), Number(upperwind._upperLevel))[1]);
				}

				$$invalidate(26, upperwind._step = Number(settings.increment), upperwind);
				$$invalidate(26, upperwind._reference = settings.referenceLevel, upperwind);
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
		errorHandlerOutput,
		overlayWarning,
		halfPosition,
		sentinelEl,
		tableEl,
		title,
		version,
		incrementquestions,
		referencelevelquestions,
		stepTime,
		onopen,
		upperwind,
		div1_binding,
		click_handler,
		click_handler_1,
		click_handler_2,
		div6_binding,
		select0_change_handler,
		select1_change_handler,
		input0_input_handler,
		input1_input_handler
	];
}

class Plugin extends SvelteComponent {
	constructor(options) {
		super();
		init(this, options, instance, create_fragment, safe_not_equal, { onopen: 25 }, add_css, [-1, -1, -1]);
	}

	get onopen() {
		return this.$$.ctx[25];
	}
}


// transformCode: Export statement was modified
export { __pluginConfig, Plugin as default };
//# sourceMappingURL=plugin.js.map
